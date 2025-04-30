
        using CoffeeCRM.Data.Model;
       using CoffeeCRM.Core.Util;using CoffeeCRM.Data;
        using CoffeeCRM.Core.Util.Parameters;
        using CoffeeCRM.Data.ViewModels;
        using System.Threading.Tasks;
        
        namespace CoffeeCRM.Core.Service
        {
            public interface ISupplierService : IBaseService<Supplier>
            {
                Task<DTResult<Supplier>> ListServerSide(SupplierDTParameters parameters);
            }
        }
    