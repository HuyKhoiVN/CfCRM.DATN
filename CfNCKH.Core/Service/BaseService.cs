using CfNCKH.Core.BaseCore;
using CfNCKH.Core.Repository;
using CfNCKH.Data.ModelDTO;
using CfNCKH.Data.Models;
using CfNCKH.Data.Utils;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Net;
using System.Reflection.Metadata;
using System.Text;
using System.Threading.Tasks;

namespace CfNCKH.Core.Service
{
    public class BaseService<T> : IBaseService<T> where T : class
    {
        private readonly IBaseRepository<T> _baseRepository;
        private readonly IUnitOfWork _unitOfWork;

        public BaseService(IBaseRepository<T> baseRepository, IUnitOfWork unitOfWork)
        {
            _baseRepository = baseRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<RestOutput<int>> CreateAsync(T entity)
        {
            var res = new RestOutput<int>();
            _baseRepository.Insert(entity);

            try
            {
                await _unitOfWork.SaveAsync();

                // Lấy ID của entity sau khi lưu thành công
                var id = GetId(entity);

                // Kiểm tra xem ID có hợp lệ không
                if (id > 0) // Giả sử ID hợp lệ là số nguyên dương
                {
                    res.Data = id;
                    res.Message = Constants.Message.SUCCESS;
                    res.StatusCode = (int)HttpStatusCode.OK;
                }
                else
                {
                    // Nếu ID không hợp lệ, coi như có lỗi
                    res.StatusCode = (int)HttpStatusCode.InternalServerError;
                    res.Message = "Entity was created, but ID was not generated.";
                }

                return res;
            }
            catch (Exception ex)
            {
                res.StatusCode = (int)HttpStatusCode.InternalServerError;
                res.Message = Constants.Message.ERROR;
                return res;
            }
        }

        public Task<RestOutput<int>> CreateRangeAsync(IEnumerable<T> entities)
        {
            throw new NotImplementedException();
        }

        public async Task<RestOutput<int>> DeleteAsync(int id)
        {
            var res = new RestOutput<int>();
            var entity = await GetByIdAsync(id);

            if (entity.Data != null && entity.Message == Constants.Message.SUCCESS)
            {
                _baseRepository.Delete(entity.Data);
            }
            else
            {
                res.Message = "Can't find entity";
                res.StatusCode = (int)HttpStatusCode.BadRequest;
                return res;
            }

            try
            {
                await _unitOfWork.SaveAsync();
                res.Data = id;
                res.Message = Constants.Message.SUCCESS;
                res.StatusCode = (int)HttpStatusCode.OK;
                return res;
            }
            catch (Exception ex)
            {
                res.Message = ex.Message;
                res.StatusCode= (int)HttpStatusCode.InternalServerError;
                return res;
            }

        }

        public async Task<List<T>> GetAllAsync()
        {
            var output = new List<T>();
            var data = await _baseRepository.SelectAll();

            output = data.ToList();
            return output;
        }

        public async Task<RestOutput<T>> GetByIdAsync(int id)
        {
            var output = new RestOutput<T>();

            var property = typeof(T).GetProperty("Id");
            if (property == null || property.PropertyType != typeof(int))
            {
                output.StatusCode = (int)HttpStatusCode.BadRequest;
                output.Message = $"Entity {typeof(T).Name} must have an integer Id property";
                return output;
            }

            // Dùng Expression để truy vấn trực tiếp
            var parameter = Expression.Parameter(typeof(T), "x");
            var propertyAccess = Expression.Property(parameter, property);
            var constant = Expression.Constant(id);
            var equals = Expression.Equal(propertyAccess, constant);
            var lambda = Expression.Lambda<Func<T, bool>>(equals, parameter);

            // Truy vấn dữ liệu
            var data = (await _baseRepository.Select(lambda)).FirstOrDefault();

            if (data == null)
            {
                output.StatusCode = (int)HttpStatusCode.NotFound;
                output.Message = "Not found";
                return output;
            }

            output.StatusCode = (int)HttpStatusCode.OK;
            output.Data = data;
            output.Message = Constants.Message.SUCCESS;

            return output;
        }

        public async Task<PagingOutput<T>> SelectAll(PagingRequestDTO model)
        {
            var output = new PagingOutput<T>();

            var query = await _baseRepository.SelectAll();

            var doc = query.ToList();
            output.Data = doc.Skip(model.PageSize * (model.PageIndex - 1)).Take(model.PageSize).ToList();
            output.TotalRecords = doc.Count;

            output.PageIndex = model.PageIndex;
            output.PageSize = model.PageSize;

            output.Message = Constants.Message.SUCCESS;
            output.StatusCode = (int)HttpStatusCode.OK;

            return output;
        }

        public Task<RestOutput<bool>> SoftDeleteAsync(int entityId)
        {
            throw new NotImplementedException();
        }

        public async Task<RestOutput<int>> UpdateAsync(T entity)
        {
            var res = new RestOutput<int>();
            var id = GetId(entity);

            if(!(id > 0))
            {
                res.Message = "Can't find entity";
                res.StatusCode = (int)HttpStatusCode.BadRequest;
                return res;
            }

            _baseRepository.Update(entity);
            try
            {
                await _unitOfWork.SaveAsync();
                res.Data = id;
                res.StatusCode = (int)HttpStatusCode.OK;
                res.Message = Constants.Message.SUCCESS;
                return res;

            }catch (Exception ex)
            {
                res.Message = ex.ToString();
                res.StatusCode = (int)HttpStatusCode.InternalServerError;
                return res;
            }
        }

        private int GetId(T entity)
        {
            if (entity.ContainsProperty("Id"))
            {
                var idProperty = entity.GetType().GetProperty("Id");
                var id = idProperty.GetValue(entity);
                if (idProperty.PropertyType == typeof(int) && id != null)
                {
                    return Convert.ToInt32(id.ToString());
                }
            }
            return 0;
        }

        public void SetDefaultValueUpdate(T entity)
        {
            if(entity.ContainsProperty("Id"))
            {
                var idProperty = entity.GetType().GetType().GetProperty("Id");
                var id = idProperty.GetValue(entity);
            }
        }
    }
}
