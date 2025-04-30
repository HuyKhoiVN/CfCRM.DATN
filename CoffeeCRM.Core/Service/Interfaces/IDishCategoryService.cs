
        using CoffeeCRM.Data.Model;
       using CoffeeCRM.Core.Util;using CoffeeCRM.Data;
        using CoffeeCRM.Core.Util.Parameters;
        using CoffeeCRM.Data.ViewModels;
        using System.Threading.Tasks;
        
        namespace CoffeeCRM.Core.Service
        {
            public interface IDishCategoryService : IBaseService<DishCategory>
            {
                Task<DTResult<DishCategory>> ListServerSide(DishCategoryDTParameters parameters);
            }
        }
    