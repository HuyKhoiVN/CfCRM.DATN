using AutoMapper;
using CfNCKH.Core.BaseCore;
using CfNCKH.Data.ModelDTO;
using CfNCKH.Data.Utils;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace CfNCKH.Core.Repository
{
    public abstract class BaseRepository<T> : IBaseRepository<T> where T : class
    {
        public readonly IUnitOfWork _unitOfWork;
        public readonly IMapper _mapper;

        public BaseRepository(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }
        /// <summary>
        /// Get all entity
        /// </summary>
        /// <returns></returns>
        public async Task<IQueryable<T>> SelectAll()
        {
            return await Task.FromResult(_unitOfWork.Select<T>().AsNoTracking());
        }
        /// <summary>
        /// Search entity by predicates
        /// </summary>
        /// <param name="predicate"></param>
        /// <returns></returns>
        public async Task<IQueryable<T>> Select(Expression<Func<T, bool>> predicate)
        {
            return await Task.FromResult(_unitOfWork.Select<T>().AsNoTracking().Where(predicate));
        }

        /// <summary>
        /// Update entity by mapping data tranfer object
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <typeparam name="TDto"></typeparam>
        /// <param name="dto"></param>
        public void UpdateMapping<T, TDto>(TDto dto) where T : class
        {
            _unitOfWork.Update<T, TDto>(dto);
        }

        /// <summary>
        /// Update entity
        /// </summary>
        /// <param name="entity"></param>
        public void Update(T entity)
        {
            _unitOfWork.Update<T>(entity);
        }

        /// <summary>
        /// Insert entity by mapping data tranfer object
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <typeparam name="TDto"></typeparam>
        /// <param name="dto"></param>
        public void InsertMapping<TDto>(TDto dto)
        {
            _unitOfWork.Insert<T, TDto>(dto);
        }

        /// <summary>
        /// Insert entity
        /// </summary>
        /// <param name="entity"></param>
        public void Insert(T entity)
        {
            _unitOfWork.Insert<T>(entity);
        }

        public void BulkUpdate(IEnumerable<T> entities)
        {
            _unitOfWork.BulkUpdateExtension(entities);
        }

        public void BulkMerge(IEnumerable<T> entities)
        {
            _unitOfWork.BulkMergeExtension(entities);
        }

        public async Task<IQueryable<TDto>> SelectMapping<TEntity, TDto>(Expression<Func<T, bool>> predicate) where TEntity : class
        {

            var configuration = new MapperConfiguration(cfg => cfg.CreateMap(typeof(TEntity), typeof(TDto)));
            var mapper = configuration.CreateMapper();
            var rs = _unitOfWork.Select<T>().AsNoTracking().Where(predicate);

            return await Task.FromResult(rs.Select(x => mapper.Map<T, TDto>(x)));
        }

        public async Task SaveChangeAsync()
        {
            await _unitOfWork.SaveAsync();
        }

        public void SaveChanges()
        {
            _unitOfWork.Save();
        }

        public void Delete(T entity)
        {
            _unitOfWork.Delete(entity);
        }

        public void BulkDelete(IEnumerable<T> entities)
        {
            _unitOfWork.BulkDeleteExtension(entities);
        }

        public async Task<PagingOutput<T>> Paging<T>(IQueryable<T> source, BaseRequestDto requestPayload)
        {
            return await Task.FromResult(source.Paging(requestPayload));
        }

        public void BulkInsert(IEnumerable<T> entities)
        {
            _unitOfWork.BulkInsertExtension(entities);
        }
    }

    public static class BaseRepositoryExtension
    {
        public static PagingOutput<T> Paging<T>(this IQueryable<T> source, BaseRequestDto requestPayload)
        {
            var rs = new PagingOutput<T>();
            var data = source.ToList();

            Type type = typeof(T);

            if (requestPayload.SearchProperty != null && requestPayload.SearchProperty.Any())
            {
                foreach (var item in requestPayload.SearchProperty)
                {
                    var propertyInfo = type.GetProperty(item.PropertyName);
                    if (propertyInfo != null)
                    {
                        var propertyType = propertyInfo.GetType();
                        if (!string.IsNullOrEmpty(item.Value))
                        {
                            switch (item.SearchType)
                            {
                                case "like":
                                    {
                                        data = data.Where(x => propertyInfo.GetValue(x, null) != null && propertyInfo.GetValue(x, null).ToString().ToLower().Contains((item.Value ?? "").Trim().ToLower())).ToList();
                                    }
                                    break;
                                case "equal":
                                    data = data.Where(x => propertyInfo.GetValue(x, null) != null && propertyInfo.GetValue(x, null).ToString().ToLower() == (item.Value ?? "").Trim().ToLower()).ToList();
                                    break;
                                default:
                                    data = data.Where(x => propertyInfo.GetValue(x, null) != null && propertyInfo.GetValue(x, null).ToString().ToLower() == (item.Value ?? "").Trim().ToLower()).ToList();
                                    break;
                            }
                        }
                    }
                }
            }

            if (requestPayload.SortProperty != null)
            {
                var sortProperty = typeof(T).GetProperty(requestPayload.SortProperty.PropertyName);
                if (sortProperty != null)
                {
                    var desc = requestPayload.SortProperty.SortType.ToLower() == "desc";
                    if (!desc)
                    {
                        data = data.OrderBy(x => sortProperty.GetValue(x, null)).ToList();
                    }
                    else
                    {
                        data = data.OrderByDescending(x => sortProperty.GetValue(x, null)).ToList();
                    }
                }

            }

            rs.TotalRecords = data.Count;
            if (((requestPayload.PageIndex) * requestPayload.PageSize) < data.Count)
            {
                rs.RecordFiltered = ((requestPayload.PageIndex) * requestPayload.PageSize);
            }
            else
            {
                rs.RecordFiltered = data.Count;
            }
            int skip = requestPayload.PageSize * (requestPayload.PageIndex - 1);
            data = data.Skip(skip).Take(requestPayload.PageSize).ToList();

            rs.Data = data;
            rs.PageSize = requestPayload.PageSize;
            rs.PageIndex = requestPayload.PageIndex;
            return rs;
        }
    }

    public static class LinqExtension
    {
        public static bool ContainsAny(this string haystack, params string[] needles)
        {
            foreach (string needle in needles)
            {
                if (haystack.Contains(needle))
                    return true;
            }

            return false;
        }

        public static bool EqualsAny(this string haystack, params string[] needles)
        {
            foreach (string needle in needles)
            {
                if (haystack == needle)
                    return true;
            }

            return false;
        }

        public static bool ContainsRemoveDiacritics(this string target, string filter)
        {
            var text = filter.Split("&").Select(x => x.ToLower().RemoveDiacritics());
            if (target.ToLower().RemoveDiacritics().ContainsAny(text.ToArray()))
            {
                return true;
            }

            return false;
        }

        static string RemoveDiacritics(this string text)
        {
            var normalizedString = text.Normalize(NormalizationForm.FormD);
            var stringBuilder = new StringBuilder();

            foreach (var c in normalizedString)
            {
                var unicodeCategory = CharUnicodeInfo.GetUnicodeCategory(c);
                if (unicodeCategory != UnicodeCategory.NonSpacingMark)
                {
                    stringBuilder.Append(c);
                }
            }

            return stringBuilder.ToString().Normalize(NormalizationForm.FormC);
        }
    }
}
