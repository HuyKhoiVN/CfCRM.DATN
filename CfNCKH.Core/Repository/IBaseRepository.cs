using CfNCKH.Core.BaseCore;
using CfNCKH.Data.ModelDTO;
using CfNCKH.Data.Utils;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace CfNCKH.Core.Repository
{
    public interface IBaseRepository<T> : IScoped
    {
        Task<IQueryable<T>> SelectAll();

        /// <summary>
        /// Search entity by predicates
        /// </summary>
        /// <param name="predicate"></param>
        /// <returns></returns>
        Task<IQueryable<T>> Select(Expression<Func<T, bool>> predicate);

        /// <summary>
        /// Update entity by mapping data tranfer object
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <typeparam name="TDto"></typeparam>
        /// <param name="dto"></param>
        public void UpdateMapping<T, TDto>(TDto dto) where T : class;
        /// <summary>
        /// Update entity
        /// </summary>
        /// <param name="entity"></param>
        public void Update(T entity);

        /// <summary>
        /// Insert entity by mapping data tranfer object
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <typeparam name="TDto"></typeparam>
        /// <param name="dto"></param>
        public void InsertMapping<TDto>(TDto dto);
        /// <summary>
        /// Insert entity
        /// </summary>
        /// <param name="entity"></param>
        public void Insert(T entity);

        public void BulkUpdate(IEnumerable<T> entities);

        public void BulkMerge(IEnumerable<T> entities);

        public void BulkInsert(IEnumerable<T> entities);


        Task<IQueryable<TDto>> SelectMapping<TEntity, TDto>(Expression<Func<T, bool>> predicate) where TEntity : class;

        Task SaveChangeAsync();

        public void SaveChanges();

        public void Delete(T entity);

        public void BulkDelete(IEnumerable<T> entities);

        Task<PagingOutput<T>> Paging<T>(IQueryable<T> source, BaseRequestDto requestPayload);


    }
}
