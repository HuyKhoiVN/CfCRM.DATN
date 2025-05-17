
using CoffeeCRM.Data.Model;
using CoffeeCRM.Core.Util;
using CoffeeCRM.Data;
using CoffeeCRM.Core.Util.Parameters;
using CoffeeCRM.Data.ViewModels;
using System.Threading.Tasks;
using CoffeeCRM.Data.DTO;
namespace CoffeeCRM.Core.Service
{
    public interface IStockTransactionDetailService : IBaseService<StockTransactionDetail>
    {
        Task<DTResult<StockTransactionDetail>> ListServerSide(StockTransactionDetailDTParameters parameters);
        Task<DTResult<StockTransactionDetailDto>> ListServerSideSummary(StockTransactionDetailDTParameters parameters);
        Task<List<StockTransactionDetailDto>> GetRecentStockTransactions(int number);
    }
}
