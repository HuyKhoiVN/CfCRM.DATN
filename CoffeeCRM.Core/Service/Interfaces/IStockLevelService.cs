
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
    }
}
