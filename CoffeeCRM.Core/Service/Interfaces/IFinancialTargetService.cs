
        using CoffeeCRM.Data.Model;
       using CoffeeCRM.Core.Util;using CoffeeCRM.Data;
        using CoffeeCRM.Core.Util.Parameters;
        using CoffeeCRM.Data.ViewModels;
        using System.Threading.Tasks;
        
        namespace CoffeeCRM.Core.Service
        {
            public interface IFinancialTargetService : IBaseService<FinancialTarget>
            {
                Task<DTResult<FinancialTarget>> ListServerSide(FinancialTargetDTParameters parameters);
            }
        }
    