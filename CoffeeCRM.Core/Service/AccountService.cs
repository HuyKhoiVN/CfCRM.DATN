
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
            public class AccountService : IAccountService
            {
                IAccountRepository accountRepository;
                public AccountService(
                    IAccountRepository _accountRepository
                    )
                {
                    accountRepository = _accountRepository;
                }
                public async Task Add(Account obj)
                {
                    obj.Active = true;
                    obj.CreatedTime = DateTime.Now;
                    await accountRepository.Add(obj);
                }
        
                public int Count()
                {
                    var result = accountRepository.Count();
                    return result;
                }
        
                public async Task Delete(Account obj)
                {
                    obj.Active = false;
                    await accountRepository.Delete(obj);
                }
        
                public async Task<long> DeletePermanently(long? id)
                {
                    return await accountRepository.DeletePermanently(id);
                }
        
                public async Task<Account> Detail(long? id)
                {
                    return await accountRepository.Detail(id);
                }
        
                public async Task<List<Account>> List()
                {
                    return await accountRepository.List();
                }
        
                public async Task<List<Account>> ListPaging(int pageIndex, int pageSize)
                {
                    return await accountRepository.ListPaging(pageIndex, pageSize);
                }
        
                public async Task<DTResult<Account>> ListServerSide(AccountDTParameters parameters)
                {
                    return await accountRepository.ListServerSide(parameters);
                }
        
                //public async Task<List<Account>> Search(string keyword)
                //{
                //    return await accountRepository.Search(keyword);
                //}
        
                public async Task Update(Account obj)
                {
                    await accountRepository.Update(obj);
                }
            }
        }
    
    