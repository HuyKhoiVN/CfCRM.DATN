using CoffeeCRM.Data.Model;
using CoffeeCRM.Core.Util;
using CoffeeCRM.Data;
using CoffeeCRM.Core.Util.Parameters;
using CoffeeCRM.Data.ViewModels;
using System.Threading.Tasks;
using CoffeeCRM.Data.DTO;
namespace CoffeeCRM.Core.Service
{
    public interface IStockTransactionService : IBaseService<StockTransaction>
    {
        Task<DTResult<StockTransaction>> ListServerSide(StockTransactionDTParameters parameters);
        Task<StockTransaction> AddNewTransaction(StockTransactionImportDto obj);
        Task<List<StockTransactionImportDto>> GetTransactionByWarehouse(int warehouseId);
        Task<StockTransaction> AddOrUpdateTransaction(StockTransactionImportDto obj);
        Task<StockTransaction> UpdateTransactionStatus(int transactionId, string newStatus, int userId, string note = null);
        Task<StockTransaction> CancelTransaction(int transactionId, string cancelReason, int canceledBy);
        Task<TransactionDetailViewModel> GetTransactionDetailForReview(int transactionId);
        Task<DTResult<StockTransactionImportDto>> ListServerSideByWarehouse(StockTransactionDTParameters parameters);
        Task<TransactionDetailViewModel> DetailForReview(int transactionId);
    }
}
