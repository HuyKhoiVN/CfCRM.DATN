
        using System.Collections.Generic;
        using System.Threading.Tasks;
        using CoffeeCRM.Data.ViewModels;

        namespace CoffeeCRM.Core.Service
        {
            public interface IBaseService<TModel> where TModel : class
            {
                Task<List<TModel>> List();
                //Task<List<TModel>> Search(string keyword);
                Task<List<TModel>> ListPaging(int pageIndex,int pageSize);
                Task<TModel> Detail(long? id);
                Task Add(TModel obj);
                Task Update(TModel obj);
                Task Delete(TModel obj);
                Task<long> DeletePermanently(long? id);
                int Count();
            }
        }
    