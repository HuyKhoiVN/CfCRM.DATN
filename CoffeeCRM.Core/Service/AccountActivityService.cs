
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
            public class AccountActivityService : IAccountActivityService
            {
                IAccountActivityRepository accountActivityRepository;
                public AccountActivityService(
                    IAccountActivityRepository _accountActivityRepository
                    )
                {
                    accountActivityRepository = _accountActivityRepository;
                }
                public async Task Add(AccountActivity obj)
                {
                    obj.Active = true;
                    obj.CreatedTime = DateTime.Now;
                    await accountActivityRepository.Add(obj);
                }
        
                public int Count()
                {
                    var result = accountActivityRepository.Count();
                    return result;
                }
        
                public async Task Delete(AccountActivity obj)
                {
                    obj.Active = false;
                    await accountActivityRepository.Delete(obj);
                }
        
                public async Task<long> DeletePermanently(long? id)
                {
                    return await accountActivityRepository.DeletePermanently(id);
                }
        
                public async Task<AccountActivity> Detail(long? id)
                {
                    return await accountActivityRepository.Detail(id);
                }
        
                public async Task<List<AccountActivity>> List()
                {
                    return await accountActivityRepository.List();
                }
        
                public async Task<List<AccountActivity>> ListPaging(int pageIndex, int pageSize)
                {
                    return await accountActivityRepository.ListPaging(pageIndex, pageSize);
                }
        
                public async Task<DTResult<AccountActivity>> ListServerSide(AccountActivityDTParameters parameters)
                {
                    return await accountActivityRepository.ListServerSide(parameters);
                }
        
                //public async Task<List<AccountActivity>> Search(string keyword)
                //{
                //    return await accountActivityRepository.Search(keyword);
                //}
        
                public async Task Update(AccountActivity obj)
                {
                    await accountActivityRepository.Update(obj);
                }
            }
        }
    
    