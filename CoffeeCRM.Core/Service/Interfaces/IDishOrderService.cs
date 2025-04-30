using CoffeeCRM.Data.Model;
using CoffeeCRM.Core.Util;using CoffeeCRM.Data;
using CoffeeCRM.Core.Util.Parameters;
using CoffeeCRM.Data.ViewModels;
using System.Threading.Tasks;

namespace CoffeeCRM.Core.Service
{
    public interface IDishOrderService : IBaseService<DishOrder>
    {
        Task<DTResult<DishOrder>> ListServerSide(DishOrderDTParameters parameters);
        Task<List<DishOrderViewModel>> DishOrderDetailByTableId(int tableId);
        Task<bool> AddOrUpdateByVm(DishOrderViewModel model);
        Task<List<DishOrderViewModel>> ListDishOrderNotification();
        Task<List<DishOrderViewModel>> ListDishOrderInvoice(int tableId);
    }
}
