
    using CoffeeCRM.Data.Model;
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using CoffeeCRM.Core.Util;
    using CoffeeCRM.Core.Util.Parameters;
    using CoffeeCRM.Data.ViewModels;
using CoffeeCRM.Data.DTO;


    namespace CoffeeCRM.Core.Repository
    {
        public interface IIngredientRepository
        {
            Task <List< Ingredient>> List();

            //Task <List< Ingredient>> Search(string keyword);

            Task <List< Ingredient>> ListPaging(int pageIndex, int pageSize);

            Task <Ingredient> Detail(long ? postId);

            Task <Ingredient> Add(Ingredient Ingredient);

            Task Update(Ingredient Ingredient);

            Task Delete(Ingredient Ingredient);

            Task <long> DeletePermanently(long ? IngredientId);

            int Count();

            Task <DTResult<IngredientDto>> ListServerSide(IngredientDTParameters parameters);
        }
    }
