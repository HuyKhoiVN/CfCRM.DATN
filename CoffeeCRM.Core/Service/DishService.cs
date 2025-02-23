
        using CoffeeCRM.Data.Model;
        using CoffeeCRM.Core.Repository;
         
       using CoffeeCRM.Core.Util;
        using CoffeeCRM.Core.Util.Parameters;
        using CoffeeCRM.Data.ViewModels;
        using System;
        using System.Collections.Generic;
        using System.Threading.Tasks;
        
        namespace CoffeeCRM.Core.Service
        {
            public class DishService : IDishService
            {
                IDishRepository dishRepository;
                public DishService(
                    IDishRepository _dishRepository
                    )
                {
                    dishRepository = _dishRepository;
                }
                public async Task Add(Dish obj)
                {
                    obj.Active = true;
                    obj.CreatedTime = DateTime.Now;
                    await dishRepository.Add(obj);
                }
        
                public int Count()
                {
                    var result = dishRepository.Count();
                    return result;
                }
        
                public async Task Delete(Dish obj)
                {
                    obj.Active = false;
                    await dishRepository.Delete(obj);
                }
        
                public async Task<long> DeletePermanently(long? id)
                {
                    return await dishRepository.DeletePermanently(id);
                }
        
                public async Task<Dish> Detail(long? id)
                {
                    return await dishRepository.Detail(id);
                }
        
                public async Task<List<Dish>> List()
                {
                    return await dishRepository.List();
                }
        
                public async Task<List<Dish>> ListPaging(int pageIndex, int pageSize)
                {
                    return await dishRepository.ListPaging(pageIndex, pageSize);
                }
        
                public async Task<DTResult<Dish>> ListServerSide(DishDTParameters parameters)
                {
                    return await dishRepository.ListServerSide(parameters);
                }
        
                //public async Task<List<Dish>> Search(string keyword)
                //{
                //    return await dishRepository.Search(keyword);
                //}
        
                public async Task Update(Dish obj)
                {
                    await dishRepository.Update(obj);
                }
            }
        }
    
    