using CoffeeCRM.Data.Model;
using CoffeeCRM.Core.Util;using CoffeeCRM.Data;
using CoffeeCRM.Core.Util.Parameters;
using CoffeeCRM.Data.ViewModels;
using System.Threading.Tasks;
using CfCRM.View.Models.ViewModels;
using CoffeeCRM.Data.DTO;
namespace CoffeeCRM.Core.Service
{
    public interface IDishService : IBaseService<Dish>
    {
        Task<DTResult<DishViewModel>> ListServerSide(DishDTParameters parameters);
        Task<List<Dish>> Search(Select2VM selectVM);
        Task<DishStaticDto> GetDishStatisticsAsync();
        Task AddOrUpdateDto(DishDto dto);
        Task<List<PopularDishModel>> GetTopPopularDishesAsync(int count, DateTime? startDate = null, DateTime? endDate = null);
        Task<DTResult<PopularDishModel>> ListPopularServerSide(DishDTParameters parameters);
    }
}
