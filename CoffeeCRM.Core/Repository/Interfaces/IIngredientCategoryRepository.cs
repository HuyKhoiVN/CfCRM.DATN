
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
        public interface IIngredientCategoryRepository
        {
            Task <List< IngredientCategory>> List();

            //Task <List< IngredientCategory>> Search(string keyword);

            Task <List< IngredientCategory>> ListPaging(int pageIndex, int pageSize);

            Task <IngredientCategory> Detail(long ? postId);

            Task <IngredientCategory> Add(IngredientCategory IngredientCategory);

            Task Update(IngredientCategory IngredientCategory);

            Task Delete(IngredientCategory IngredientCategory);

            Task <long> DeletePermanently(long ? IngredientCategoryId);

            int Count();

            Task <DTResult<IngredientCategory>> ListServerSide(IngredientCategoryDTParameters parameters);
        }
    }
