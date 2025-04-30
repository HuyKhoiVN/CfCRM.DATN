
        using CoffeeCRM.Data.Model;
        using CoffeeCRM.Core.Repository;
         
       using CoffeeCRM.Core.Util;using CoffeeCRM.Data;
        using CoffeeCRM.Core.Util.Parameters;
        using CoffeeCRM.Data.ViewModels;
        using System;
        using System.Collections.Generic;
        using System.Threading.Tasks;
        
        namespace CoffeeCRM.Core.Service
        {
            public class DishCategoryService : IDishCategoryService
            {
                IDishCategoryRepository dishCategoryRepository;
                public DishCategoryService(
                    IDishCategoryRepository _dishCategoryRepository
                    )
                {
                    dishCategoryRepository = _dishCategoryRepository;
                }
                public async Task Add(DishCategory obj)
                {
                    obj.Active = true;
                    obj.CreatedTime = DateTime.Now;
                    await dishCategoryRepository.Add(obj);
                }
        
                public int Count()
                {
                    var result = dishCategoryRepository.Count();
                    return result;
                }
        
                public async Task Delete(DishCategory obj)
                {
                    obj.Active = false;
                    await dishCategoryRepository.Delete(obj);
                }
        
                public async Task<long> DeletePermanently(long? id)
                {
                    return await dishCategoryRepository.DeletePermanently(id);
                }
        
                public async Task<DishCategory> Detail(long? id)
                {
                    return await dishCategoryRepository.Detail(id);
                }
        
                public async Task<List<DishCategory>> List()
                {
                    return await dishCategoryRepository.List();
                }
        
                public async Task<List<DishCategory>> ListPaging(int pageIndex, int pageSize)
                {
                    return await dishCategoryRepository.ListPaging(pageIndex, pageSize);
                }
        
                public async Task<DTResult<DishCategory>> ListServerSide(DishCategoryDTParameters parameters)
                {
                    return await dishCategoryRepository.ListServerSide(parameters);
                }
        
                //public async Task<List<DishCategory>> Search(string keyword)
                //{
                //    return await dishCategoryRepository.Search(keyword);
                //}
        
                public async Task Update(DishCategory obj)
                {
                    await dishCategoryRepository.Update(obj);
                }
            }
        }
    
    