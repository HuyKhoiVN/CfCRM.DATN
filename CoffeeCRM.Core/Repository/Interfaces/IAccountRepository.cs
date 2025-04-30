
using CoffeeCRM.Data.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CoffeeCRM.Core.Util;using CoffeeCRM.Data;
using CoffeeCRM.Core.Util.Parameters;
using CoffeeCRM.Data.ViewModels;
using CoffeeCRM.Data.DTO;


namespace CoffeeCRM.Core.Repository
{
    public interface IAccountRepository
    {
        Task<List<Account>> List();

        //Task <List< Account>> Search(string keyword);
        Task<Account> GetByUsername(string username);
        Task<List<Account>> GetByRoleId(int roleId);

        Task<List<Account>> ListPaging(int pageIndex, int pageSize);

        Task<Account> Detail(long? postId);

        Task<Account> Add(Account Account);

        Task Update(Account Account);

        Task Delete(Account Account);

        Task<long> DeletePermanently(long? AccountId);

        int Count();
        Task<DTResult<AccountDto>> ListServerSide(AccountDTParameters parameters);
        Task<Account> Login(LoginDto obj);
    }
}
