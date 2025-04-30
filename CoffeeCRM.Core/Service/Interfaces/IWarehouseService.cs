using CoffeeCRM.Data.Model;
using CoffeeCRM.Core.Util;using CoffeeCRM.Data;
using CoffeeCRM.Core.Util.Parameters;
using CoffeeCRM.Data.ViewModels;
using System.Threading.Tasks;
using CoffeeCRM.Data.DTO;
namespace CoffeeCRM.Core.Service
{
    public interface IWarehouseService : IBaseService<Warehouse>
    {
        Task<DTResult<WarehouseDto>> ListServerSide(WarehouseDTParameters parameters);
        Task<List<WarehouseDto>> ListDto();
        Task<WarehouseDto> DetailDto(int id);
    }
}
