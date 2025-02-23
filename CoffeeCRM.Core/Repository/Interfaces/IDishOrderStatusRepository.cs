
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
        public interface IDishOrderStatusRepository
        {
            Task <List< DishOrderStatus>> List();

            //Task <List< DishOrderStatus>> Search(string keyword);

            Task <List< DishOrderStatus>> ListPaging(int pageIndex, int pageSize);

            Task <DishOrderStatus> Detail(long ? postId);

            Task <DishOrderStatus> Add(DishOrderStatus DishOrderStatus);

            Task Update(DishOrderStatus DishOrderStatus);

            Task Delete(DishOrderStatus DishOrderStatus);

            Task <long> DeletePermanently(long ? DishOrderStatusId);

            int Count();

            Task <DTResult<DishOrderStatus>> ListServerSide(DishOrderStatusDTParameters parameters);
        }
    }
