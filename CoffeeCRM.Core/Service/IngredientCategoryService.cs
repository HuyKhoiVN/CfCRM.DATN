
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
            public class IngredientCategoryService : IIngredientCategoryService
            {
                IIngredientCategoryRepository ingredientCategoryRepository;
                public IngredientCategoryService(
                    IIngredientCategoryRepository _ingredientCategoryRepository
                    )
                {
                    ingredientCategoryRepository = _ingredientCategoryRepository;
                }
                public async Task Add(IngredientCategory obj)
                {
                    obj.Active = true;
                    obj.CreatedTime = DateTime.Now;
                    await ingredientCategoryRepository.Add(obj);
                }
        
                public int Count()
                {
                    var result = ingredientCategoryRepository.Count();
                    return result;
                }
        
                public async Task Delete(IngredientCategory obj)
                {
                    obj.Active = false;
                    await ingredientCategoryRepository.Delete(obj);
                }
        
                public async Task<long> DeletePermanently(long? id)
                {
                    return await ingredientCategoryRepository.DeletePermanently(id);
                }
        
                public async Task<IngredientCategory> Detail(long? id)
                {
                    return await ingredientCategoryRepository.Detail(id);
                }
        
                public async Task<List<IngredientCategory>> List()
                {
                    return await ingredientCategoryRepository.List();
                }
        
                public async Task<List<IngredientCategory>> ListPaging(int pageIndex, int pageSize)
                {
                    return await ingredientCategoryRepository.ListPaging(pageIndex, pageSize);
                }
        
                public async Task<DTResult<IngredientCategory>> ListServerSide(IngredientCategoryDTParameters parameters)
                {
                    return await ingredientCategoryRepository.ListServerSide(parameters);
                }
        
                //public async Task<List<IngredientCategory>> Search(string keyword)
                //{
                //    return await ingredientCategoryRepository.Search(keyword);
                //}
        
                public async Task Update(IngredientCategory obj)
                {
                    await ingredientCategoryRepository.Update(obj);
                }
            }
        }
    
    