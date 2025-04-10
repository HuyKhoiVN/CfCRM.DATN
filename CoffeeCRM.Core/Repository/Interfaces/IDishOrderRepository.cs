
using CoffeeCRM.Data.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CoffeeCRM.Core.Util;
using CoffeeCRM.Core.Util.Parameters;
using CoffeeCRM.Data.ViewModels;
using Microsoft.EntityFrameworkCore.Infrastructure;


namespace CoffeeCRM.Core.Repository
{
    public interface IDishOrderRepository
    {
        Task<List<DishOrder>> List();

        //Task <List< DishOrder>> Search(string keyword);

        Task<List<DishOrder>> ListPaging(int pageIndex, int pageSize);

        Task<DishOrder> Detail(long? postId);

        Task<DishOrder> Add(DishOrder DishOrder);

        Task<bool> Update(DishOrder DishOrder);

        Task Delete(DishOrder DishOrder);
        DatabaseFacade GetDatabase();
        Task<long> DeletePermanently(long? DishOrderId);
        Task<List<DishOrder>> ListUnPaid();
        Task<List<DishOrderViewModel>> DishOrderDetailByTableId(int tableId);
        Task<List<DishOrderViewModel>> DishOrderDetailList(int tableId);
        Task<List<DishOrderViewModel>> ListDishOrderNotification();
        Task<List<DishOrderViewModel>> ListDishOrderInvoice(int tableId);

        int Count();

        Task<DTResult<DishOrder>> ListServerSide(DishOrderDTParameters parameters);
    }
}
