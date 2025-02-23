
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
        public interface IDishOrderDetailRepository
        {
            Task <List< DishOrderDetail>> List();

            //Task <List< DishOrderDetail>> Search(string keyword);

            Task <List< DishOrderDetail>> ListPaging(int pageIndex, int pageSize);

            Task <DishOrderDetail> Detail(long ? postId);

            Task <DishOrderDetail> Add(DishOrderDetail DishOrderDetail);

            Task Update(DishOrderDetail DishOrderDetail);

            Task Delete(DishOrderDetail DishOrderDetail);

            Task <long> DeletePermanently(long ? DishOrderDetailId);

            int Count();

            Task <DTResult<DishOrderDetail>> ListServerSide(DishOrderDetailDTParameters parameters);
        }
    }
