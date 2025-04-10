using CoffeeCRM.Data.Model;
using CoffeeCRM.Core.Util;
using CoffeeCRM.Core.Util.Parameters;
using CoffeeCRM.Data.ViewModels;
using System.Threading.Tasks;
using CfCRM.View.Models.ViewModels;
namespace CoffeeCRM.Core.Service
{
    public interface IDishService : IBaseService<Dish>
    {
        Task<DTResult<Dish>> ListServerSide(DishDTParameters parameters);
        Task<List<Dish>> Search(Select2VM selectVM);
    }
}
