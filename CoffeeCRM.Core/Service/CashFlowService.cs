
        using CoffeeCRM.Data.Model;
        using CoffeeCRM.Core.Repository;
using CoffeeCRM.Core.Util;
using CoffeeCRM.Data;
        using CoffeeCRM.Core.Util.Parameters;
        using CoffeeCRM.Data.ViewModels;
        using System;
        using System.Collections.Generic;
        using System.Threading.Tasks;
using CoffeeCRM.Data.DTO;

namespace CoffeeCRM.Core.Service
{
            public class CashFlowService : ICashFlowService
            {
                ICashFlowRepository cashFlowRepository;
                public CashFlowService(
                    ICashFlowRepository _cashFlowRepository
                    )
                {
                    cashFlowRepository = _cashFlowRepository;
                }
                public async Task Add(CashFlow obj)
                {
                    obj.Active = true;
                    obj.CreatedTime = DateTime.Now;
                    await cashFlowRepository.Add(obj);
                }
        
                public int Count()
                {
                    var result = cashFlowRepository.Count();
                    return result;
                }
        
                public async Task Delete(CashFlow obj)
                {
                    obj.Active = false;
                    await cashFlowRepository.Delete(obj);
                }
        
                public async Task<long> DeletePermanently(long? id)
                {
                    return await cashFlowRepository.DeletePermanently(id);
                }
        
                public async Task<CashFlow> Detail(long? id)
                {
                    return await cashFlowRepository.Detail(id);
                }
        
                public async Task<List<CashFlow>> List()
                {
                    return await cashFlowRepository.List();
                }
        
                public async Task<List<CashFlow>> ListPaging(int pageIndex, int pageSize)
                {
                    return await cashFlowRepository.ListPaging(pageIndex, pageSize);
                }
        
                public async Task<DTResult<CashFlowBaseDto>> ListServerSide(CashFlowDTParameters parameters)
                {
                    return await cashFlowRepository.ListServerSide(parameters);
                }
        
                //public async Task<List<CashFlow>> Search(string keyword)
                //{
                //    return await cashFlowRepository.Search(keyword);
                //}
        
                public async Task Update(CashFlow obj)
                {
                    await cashFlowRepository.Update(obj);
                }
            }
        }
    
    