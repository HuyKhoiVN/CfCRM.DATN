
        using CoffeeCRM.Data.Model;
       using CoffeeCRM.Core.Util;
        using CoffeeCRM.Core.Util.Parameters;
        using CoffeeCRM.Data.ViewModels;
        using System.Threading.Tasks;
        
        namespace CoffeeCRM.Core.Service
        {
            public interface IIngredientCategoryService : IBaseService<IngredientCategory>
            {
                Task<DTResult<IngredientCategory>> ListServerSide(IngredientCategoryDTParameters parameters);
            }
        }
    