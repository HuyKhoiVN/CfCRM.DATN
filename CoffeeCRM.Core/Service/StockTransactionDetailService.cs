
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
            public class StockTransactionDetailService : IStockTransactionDetailService
            {
                IStockTransactionDetailRepository stockTransactionDetailRepository;
                public StockTransactionDetailService(
                    IStockTransactionDetailRepository _stockTransactionDetailRepository
                    )
                {
                    stockTransactionDetailRepository = _stockTransactionDetailRepository;
                }
                public async Task Add(StockTransactionDetail obj)
                {
                    obj.Active = true;
                    obj.CreatedTime = DateTime.Now;
                    await stockTransactionDetailRepository.Add(obj);
                }
        
                public int Count()
                {
                    var result = stockTransactionDetailRepository.Count();
                    return result;
                }
        
                public async Task Delete(StockTransactionDetail obj)
                {
                    obj.Active = false;
                    await stockTransactionDetailRepository.Delete(obj);
                }
        
                public async Task<long> DeletePermanently(long? id)
                {
                    return await stockTransactionDetailRepository.DeletePermanently(id);
                }
        
                public async Task<StockTransactionDetail> Detail(long? id)
                {
                    return await stockTransactionDetailRepository.Detail(id);
                }
        
                public async Task<List<StockTransactionDetail>> List()
                {
                    return await stockTransactionDetailRepository.List();
                }
        
                public async Task<List<StockTransactionDetail>> ListPaging(int pageIndex, int pageSize)
                {
                    return await stockTransactionDetailRepository.ListPaging(pageIndex, pageSize);
                }
        
                public async Task<DTResult<StockTransactionDetail>> ListServerSide(StockTransactionDetailDTParameters parameters)
                {
                    return await stockTransactionDetailRepository.ListServerSide(parameters);
                }
        
                //public async Task<List<StockTransactionDetail>> Search(string keyword)
                //{
                //    return await stockTransactionDetailRepository.Search(keyword);
                //}
        
                public async Task Update(StockTransactionDetail obj)
                {
                    await stockTransactionDetailRepository.Update(obj);
                }
            }
        }
    
    