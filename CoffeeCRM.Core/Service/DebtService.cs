
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
            public class DebtService : IDebtService
            {
                IDebtRepository debtRepository;
                public DebtService(
                    IDebtRepository _debtRepository
                    )
                {
                    debtRepository = _debtRepository;
                }
                public async Task Add(Debt obj)
                {
                    obj.Active = true;
                    obj.CreatedTime = DateTime.Now;
                    await debtRepository.Add(obj);
                }
        
                public int Count()
                {
                    var result = debtRepository.Count();
                    return result;
                }
        
                public async Task Delete(Debt obj)
                {
                    obj.Active = false;
                    await debtRepository.Delete(obj);
                }
        
                public async Task<long> DeletePermanently(long? id)
                {
                    return await debtRepository.DeletePermanently(id);
                }
        
                public async Task<Debt> Detail(long? id)
                {
                    return await debtRepository.Detail(id);
                }
        
                public async Task<List<Debt>> List()
                {
                    return await debtRepository.List();
                }
        
                public async Task<List<Debt>> ListPaging(int pageIndex, int pageSize)
                {
                    return await debtRepository.ListPaging(pageIndex, pageSize);
                }
        
                public async Task<DTResult<Debt>> ListServerSide(DebtDTParameters parameters)
                {
                    return await debtRepository.ListServerSide(parameters);
                }
        
                //public async Task<List<Debt>> Search(string keyword)
                //{
                //    return await debtRepository.Search(keyword);
                //}
        
                public async Task Update(Debt obj)
                {
                    await debtRepository.Update(obj);
                }
            }
        }
    
    