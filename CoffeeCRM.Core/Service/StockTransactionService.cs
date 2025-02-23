
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
            public class StockTransactionService : IStockTransactionService
            {
                IStockTransactionRepository stockTransactionRepository;
                public StockTransactionService(
                    IStockTransactionRepository _stockTransactionRepository
                    )
                {
                    stockTransactionRepository = _stockTransactionRepository;
                }
                public async Task Add(StockTransaction obj)
                {
                    obj.Active = true;
                    obj.CreatedTime = DateTime.Now;
                    await stockTransactionRepository.Add(obj);
                }
        
                public int Count()
                {
                    var result = stockTransactionRepository.Count();
                    return result;
                }
        
                public async Task Delete(StockTransaction obj)
                {
                    obj.Active = false;
                    await stockTransactionRepository.Delete(obj);
                }
        
                public async Task<long> DeletePermanently(long? id)
                {
                    return await stockTransactionRepository.DeletePermanently(id);
                }
        
                public async Task<StockTransaction> Detail(long? id)
                {
                    return await stockTransactionRepository.Detail(id);
                }
        
                public async Task<List<StockTransaction>> List()
                {
                    return await stockTransactionRepository.List();
                }
        
                public async Task<List<StockTransaction>> ListPaging(int pageIndex, int pageSize)
                {
                    return await stockTransactionRepository.ListPaging(pageIndex, pageSize);
                }
        
                public async Task<DTResult<StockTransaction>> ListServerSide(StockTransactionDTParameters parameters)
                {
                    return await stockTransactionRepository.ListServerSide(parameters);
                }
        
                //public async Task<List<StockTransaction>> Search(string keyword)
                //{
                //    return await stockTransactionRepository.Search(keyword);
                //}
        
                public async Task Update(StockTransaction obj)
                {
                    await stockTransactionRepository.Update(obj);
                }
            }
        }
    
    