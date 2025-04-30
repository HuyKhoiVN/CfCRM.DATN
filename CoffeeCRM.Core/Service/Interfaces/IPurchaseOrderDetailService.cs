
        using CoffeeCRM.Data.Model;
       using CoffeeCRM.Core.Util;using CoffeeCRM.Data;
        using CoffeeCRM.Core.Util.Parameters;
        using CoffeeCRM.Data.ViewModels;
        using System.Threading.Tasks;
        
        namespace CoffeeCRM.Core.Service
        {
            public interface IPurchaseOrderDetailService : IBaseService<PurchaseOrderDetail>
            {
                Task<DTResult<PurchaseOrderDetail>> ListServerSide(PurchaseOrderDetailDTParameters parameters);
            }
        }
    