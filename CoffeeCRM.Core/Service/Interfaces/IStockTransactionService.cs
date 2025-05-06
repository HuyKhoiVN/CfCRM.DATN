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
    }
}
