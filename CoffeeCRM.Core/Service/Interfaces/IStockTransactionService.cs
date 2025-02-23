
        using CoffeeCRM.Data.Model;
       using CoffeeCRM.Core.Util;
        using CoffeeCRM.Core.Util.Parameters;
        using CoffeeCRM.Data.ViewModels;
        using System.Threading.Tasks;
        
        namespace CoffeeCRM.Core.Service
        {
            public interface IStockTransactionService : IBaseService<StockTransaction>
            {
                Task<DTResult<StockTransaction>> ListServerSide(StockTransactionDTParameters parameters);
            }
        }
    