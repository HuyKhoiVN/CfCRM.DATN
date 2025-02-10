using CfNCKH.Data.ModelDTO;
using CfNCKH.Data.Utils;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CfNCKH.Core.Service
{
    public interface IBaseService<T> : IScoped
    {
        Task<List<T>> GetAllAsync();
        Task<PagingOutput<T>> SelectAll(PagingRequestDTO model);
        Task<RestOutput<int>> CreateAsync(T entity);
        Task<RestOutput<T>> GetByIdAsync(int id);
        Task<RestOutput<int>> UpdateAsync(T entity);
        Task<RestOutput<int>> DeleteAsync(int id);
        Task<RestOutput<bool>> SoftDeleteAsync(int entityId);
        Task<RestOutput<int>> CreateRangeAsync(IEnumerable<T> entities);
    }
}
