
using CoffeeCRM.Data.Model;
using CoffeeCRM.Core.Util;using CoffeeCRM.Data;
using CoffeeCRM.Core.Util.Parameters;
using CoffeeCRM.Data.ViewModels;
using System.Threading.Tasks;
using CoffeeCRM.Data.DTO;
namespace CoffeeCRM.Core.Service
{
    public interface IStockLevelService : IBaseService<StockLevel>
    {
        Task<DTResult<StockLevelDto>> ListServerSide(StockLevelDTParameters parameters);
        Task<List<IngredientStockSummaryDto>> GetIngredientStockSummaryByWarehouseAsync(int warehouseId);
        Task<List<StockLevelDto>> GetStockLevelsByIngredientAsync(int warehouseId, int ingredientId);
        Task<StockLevelDetailDto> GetStockLevelDetailAsync(int stockLevelId);
        Task<bool> AdjustStockLevelQuantityAsync(AdjustStockLevelDto adjustDto, int accountId);
        Task<StockLevel> AddNewStock(StockLevel st);
    }
}
