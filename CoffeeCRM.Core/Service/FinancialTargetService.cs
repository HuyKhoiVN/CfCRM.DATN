
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
            public class FinancialTargetService : IFinancialTargetService
            {
                IFinancialTargetRepository financialTargetRepository;
                public FinancialTargetService(
                    IFinancialTargetRepository _financialTargetRepository
                    )
                {
                    financialTargetRepository = _financialTargetRepository;
                }
                public async Task Add(FinancialTarget obj)
                {
                    obj.Active = true;
                    obj.CreatedTime = DateTime.Now;
                    await financialTargetRepository.Add(obj);
                }
        
                public int Count()
                {
                    var result = financialTargetRepository.Count();
                    return result;
                }
        
                public async Task Delete(FinancialTarget obj)
                {
                    obj.Active = false;
                    await financialTargetRepository.Delete(obj);
                }
        
                public async Task<long> DeletePermanently(long? id)
                {
                    return await financialTargetRepository.DeletePermanently(id);
                }
        
                public async Task<FinancialTarget> Detail(long? id)
                {
                    return await financialTargetRepository.Detail(id);
                }
        
                public async Task<List<FinancialTarget>> List()
                {
                    return await financialTargetRepository.List();
                }
        
                public async Task<List<FinancialTarget>> ListPaging(int pageIndex, int pageSize)
                {
                    return await financialTargetRepository.ListPaging(pageIndex, pageSize);
                }
        
                public async Task<DTResult<FinancialTarget>> ListServerSide(FinancialTargetDTParameters parameters)
                {
                    return await financialTargetRepository.ListServerSide(parameters);
                }
        
                //public async Task<List<FinancialTarget>> Search(string keyword)
                //{
                //    return await financialTargetRepository.Search(keyword);
                //}
        
                public async Task Update(FinancialTarget obj)
                {
                    await financialTargetRepository.Update(obj);
                }
            }
        }
    
    