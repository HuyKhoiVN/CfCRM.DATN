using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CoffeeCRM.Data.Model;

namespace CoffeeCRM.Core.Repository.Interfaces
{
    public interface IDraftDetailRepository : IScoped
    {
        Task<List<StockTransactionDraftDetail>> List();

        //Task <List< StockTransactionDraftDetail>> Search(string keyword);

        Task<List<StockTransactionDraftDetail>> ListPaging(int pageIndex, int pageSize);

        Task<StockTransactionDraftDetail> Detail(long? postId);

        Task<StockTransactionDraftDetail> Add(StockTransactionDraftDetail stockTransactionDraftDetail);

        Task Update(StockTransactionDraftDetail stockTransactionDraftDetail);

        Task Delete(StockTransactionDraftDetail stockTransactionDraftDetail);

        Task<long> DeletePermanently(long? stockTransactionDraftDetail);
        Task DeleteByTransactionId(int transactionId);
        Task<List<StockTransactionDraftDetail>> GetByTransactionId(int transactionId);

        int Count();
    }
}
