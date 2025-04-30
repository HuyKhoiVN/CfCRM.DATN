
using CoffeeCRM.Data.Model;
using CoffeeCRM.Core.Util;using CoffeeCRM.Data;
using CoffeeCRM.Core.Util.Parameters;
using CoffeeCRM.Data.ViewModels;
using System.Threading.Tasks;
using CoffeeCRM.Data.DTO;
namespace CoffeeCRM.Core.Service
{
    public interface IIngredientCategoryService : IBaseService<IngredientCategory>
    {
        Task<DTResult<IngredientCategory>> ListServerSide(IngredientCategoryDTParameters parameters);
        Task<List<IngredientCategoryDto>> GetIngredientCategoryTreeAsync();
        Task<IngredientCategory> AddOrUpdate(IngredientCategoryDto dto);
    }
}
