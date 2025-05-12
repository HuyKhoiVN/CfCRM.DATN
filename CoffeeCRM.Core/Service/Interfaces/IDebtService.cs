
using CoffeeCRM.Data.Model;
using CoffeeCRM.Core.Util;
using CoffeeCRM.Data;
using CoffeeCRM.Core.Util.Parameters;
using CoffeeCRM.Data.ViewModels;
using System.Threading.Tasks;
using CoffeeCRM.Data.DTO;

namespace CoffeeCRM.Core.Service
{
    public interface IDebtService : IBaseService<Debt>
    {
        Task<DTResult<DebtDto>> ListServerSide(DebtDTParameters parameters);
        Task RepaymentDebt(int id, int accountId);
    }
}
