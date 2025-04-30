using CoffeeCRM.Data.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CoffeeCRM.Core.Util;using CoffeeCRM.Data;
using CoffeeCRM.Core.Util.Parameters;
using CoffeeCRM.Data.ViewModels;


namespace CoffeeCRM.Core.Repository
{
    public interface IDishOrderDetailRepository
    {
        Task<List<DishOrderDetail>> List();

        //Task <List< DishOrderDetail>> Search(string keyword);

        Task<List<DishOrderDetail>> ListPaging(int pageIndex, int pageSize);

        Task<DishOrderDetail> Detail(long? postId);

        Task<DishOrderDetail> Add(DishOrderDetail DishOrderDetail);

        Task<bool> Update(DishOrderDetail obj);

        Task Delete(DishOrderDetail DishOrderDetail);

        Task<long> DeletePermanently(long? DishOrderDetailId);
        Task<List<DishOrderDetailViewModel>> ListByOrderId(int id);
        Task<List<DishOrderDetailViewModel>> ListDishOrderInvoice(int tableId);
        int Count();

        Task<DTResult<DishOrderDetail>> ListServerSide(DishOrderDetailDTParameters parameters);
    }
}
