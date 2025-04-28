
using CoffeeCRM.Data.Model;
using CoffeeCRM.Core.Repository;

using CoffeeCRM.Core.Util;
using CoffeeCRM.Core.Util.Parameters;
using CoffeeCRM.Data.ViewModels;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using CoffeeCRM.Data.DTO;
namespace CoffeeCRM.Core.Service
{
    public class IngredientService : IIngredientService
    {
        IIngredientRepository ingredientRepository;
        public IngredientService(
            IIngredientRepository _ingredientRepository
            )
        {
            ingredientRepository = _ingredientRepository;
        }
        public async Task Add(Ingredient obj)
        {
            obj.Active = true;
            obj.CreatedTime = DateTime.Now;
            await ingredientRepository.Add(obj);
        }

        public int Count()
        {
            var result = ingredientRepository.Count();
            return result;
        }

        public async Task Delete(Ingredient obj)
        {
            obj.Active = false;
            await ingredientRepository.Delete(obj);
        }

        public async Task<long> DeletePermanently(long? id)
        {
            return await ingredientRepository.DeletePermanently(id);
        }

        public async Task<Ingredient> Detail(long? id)
        {
            return await ingredientRepository.Detail(id);
        }

        public async Task<List<Ingredient>> List()
        {
            return await ingredientRepository.List();
        }

        public async Task<List<Ingredient>> ListPaging(int pageIndex, int pageSize)
        {
            return await ingredientRepository.ListPaging(pageIndex, pageSize);
        }

        public async Task<DTResult<IngredientDto>> ListServerSide(IngredientDTParameters parameters)
        {
            return await ingredientRepository.ListServerSide(parameters);
        }

        //public async Task<List<Ingredient>> Search(string keyword)
        //{
        //    return await ingredientRepository.Search(keyword);
        //}

        public async Task Update(Ingredient obj)
        {
            await ingredientRepository.Update(obj);
        }
    }
}

