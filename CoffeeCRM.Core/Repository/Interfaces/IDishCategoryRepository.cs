
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
        public interface IDishCategoryRepository
        {
            Task <List< DishCategory>> List();

            //Task <List< DishCategory>> Search(string keyword);

            Task <List< DishCategory>> ListPaging(int pageIndex, int pageSize);

            Task <DishCategory> Detail(long ? postId);

            Task <DishCategory> Add(DishCategory DishCategory);

            Task Update(DishCategory DishCategory);

            Task Delete(DishCategory DishCategory);

            Task <long> DeletePermanently(long ? DishCategoryId);

            int Count();

            Task <DTResult<DishCategory>> ListServerSide(DishCategoryDTParameters parameters);
        }
    }
