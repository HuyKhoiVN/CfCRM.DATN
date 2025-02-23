
        using CoffeeCRM.Data.Model;
       using CoffeeCRM.Core.Util;
        using CoffeeCRM.Core.Util.Parameters;
        using CoffeeCRM.Data.ViewModels;
        using System.Threading.Tasks;
        
        namespace CoffeeCRM.Core.Service
        {
            public interface IWarehouseService : IBaseService<Warehouse>
            {
                Task<DTResult<Warehouse>> ListServerSide(WarehouseDTParameters parameters);
            }
        }
    