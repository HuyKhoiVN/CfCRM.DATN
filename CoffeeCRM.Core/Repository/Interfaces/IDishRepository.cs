
using CoffeeCRM.Data.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CoffeeCRM.Core.Util;
using CoffeeCRM.Core.Util.Parameters;
using CoffeeCRM.Data.ViewModels;
using CfCRM.View.Models.ViewModels;


namespace CoffeeCRM.Core.Repository
{
    public interface IDishRepository
    {
        Task<List<Dish>> List();

        Task<List<Dish>> Search(Select2VM selectVM);

        Task<List<Dish>> ListPaging(int pageIndex, int pageSize);

        Task<Dish> Detail(long? postId);

        Task<Dish> Add(Dish Dish);

        Task Update(Dish Dish);

        Task Delete(Dish Dish);

        Task<long> DeletePermanently(long? DishId);
        Task<Dish> GetDishByCode(string dishCode);
        int Count();

        Task<DTResult<DishViewModel>> ListServerSide(DishDTParameters parameters);
    }
}
