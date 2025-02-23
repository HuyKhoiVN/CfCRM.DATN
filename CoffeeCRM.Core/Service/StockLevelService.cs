
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
            public class StockLevelService : IStockLevelService
            {
                IStockLevelRepository stockLevelRepository;
                public StockLevelService(
                    IStockLevelRepository _stockLevelRepository
                    )
                {
                    stockLevelRepository = _stockLevelRepository;
                }
                public async Task Add(StockLevel obj)
                {
                    obj.Active = true;
                    obj.CreatedTime = DateTime.Now;
                    await stockLevelRepository.Add(obj);
                }
        
                public int Count()
                {
                    var result = stockLevelRepository.Count();
                    return result;
                }
        
                public async Task Delete(StockLevel obj)
                {
                    obj.Active = false;
                    await stockLevelRepository.Delete(obj);
                }
        
                public async Task<long> DeletePermanently(long? id)
                {
                    return await stockLevelRepository.DeletePermanently(id);
                }
        
                public async Task<StockLevel> Detail(long? id)
                {
                    return await stockLevelRepository.Detail(id);
                }
        
                public async Task<List<StockLevel>> List()
                {
                    return await stockLevelRepository.List();
                }
        
                public async Task<List<StockLevel>> ListPaging(int pageIndex, int pageSize)
                {
                    return await stockLevelRepository.ListPaging(pageIndex, pageSize);
                }
        
                public async Task<DTResult<StockLevel>> ListServerSide(StockLevelDTParameters parameters)
                {
                    return await stockLevelRepository.ListServerSide(parameters);
                }
        
                //public async Task<List<StockLevel>> Search(string keyword)
                //{
                //    return await stockLevelRepository.Search(keyword);
                //}
        
                public async Task Update(StockLevel obj)
                {
                    await stockLevelRepository.Update(obj);
                }
            }
        }
    
    