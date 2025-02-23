
    using CoffeeCRM.Data.Model;
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using CoffeeCRM.Core.Util;
    using CoffeeCRM.Core.Util.Parameters;
    using CoffeeCRM.Data.ViewModels;


    namespace CoffeeCRM.Core.Repository
    {
        public interface IDishOrderRepository
        {
            Task <List< DishOrder>> List();

            //Task <List< DishOrder>> Search(string keyword);

            Task <List< DishOrder>> ListPaging(int pageIndex, int pageSize);

            Task <DishOrder> Detail(long ? postId);

            Task <DishOrder> Add(DishOrder DishOrder);

            Task Update(DishOrder DishOrder);

            Task Delete(DishOrder DishOrder);

            Task <long> DeletePermanently(long ? DishOrderId);

            int Count();

            Task <DTResult<DishOrder>> ListServerSide(DishOrderDTParameters parameters);
        }
    }
