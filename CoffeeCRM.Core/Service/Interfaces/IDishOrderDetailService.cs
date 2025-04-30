using CoffeeCRM.Data.Model;
using CoffeeCRM.Core.Util;using CoffeeCRM.Data;
using CoffeeCRM.Core.Util.Parameters;
using CoffeeCRM.Data.ViewModels;
using System.Threading.Tasks;

namespace CoffeeCRM.Core.Service
{
    public interface IDishOrderDetailService : IBaseService<DishOrderDetail>
    {
        Task<DTResult<DishOrderDetail>> ListServerSide(DishOrderDetailDTParameters parameters);
        Task<List<DishOrderDetailViewModel>> ListDishOrderInvoice(int tableId);
        Task<List<DishOrderDetailViewModel>> ListByOrderId(int id);
    }
}
