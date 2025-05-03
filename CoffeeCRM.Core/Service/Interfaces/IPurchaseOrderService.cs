using CoffeeCRM.Data.Model;
using CoffeeCRM.Core.Util;
using CoffeeCRM.Data;
using CoffeeCRM.Core.Util.Parameters;
using CoffeeCRM.Data.ViewModels;
using System.Threading.Tasks;
using CoffeeCRM.Data.DTO;
namespace CoffeeCRM.Core.Service
{
    public interface IPurchaseOrderService : IBaseService<PurchaseOrder>
    {
        Task<DTResult<PurchaseOrderDto>> ListServerSide(PurchaseOrderDTParameters parameters);
        Task<PurchaseOrderDto> AddOrUpdate(PurchaseOrderDto dto);
        Task<PurchaseOrderDto> UpdateStatus(PurchaseOrderDto dto);
        Task<PurchaseOrderDto> DetailDto(int id);
    }
}
