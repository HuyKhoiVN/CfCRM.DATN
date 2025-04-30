using CoffeeCRM.Data.Model;
using CoffeeCRM.Core.Util;using CoffeeCRM.Data;
using CoffeeCRM.Core.Util.Parameters;
using CoffeeCRM.Data.ViewModels;
using System.Threading.Tasks;
using CoffeeCRM.Data.DTO;
using CoffeeCRM.Data.Constants;

namespace CoffeeCRM.Core.Service
{
    public interface IAccountService : IBaseService<Account>
    {
        Task<DTResult<AccountDto>> ListServerSide(AccountDTParameters parameters);
        Task<CoffeeManagementResponse> Login(LoginDto model);
        Task AddOrUpdate(AccountCreateDto dto);
        Task AddDto(AccountCreateDto dto);
    }
}
