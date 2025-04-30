
using CoffeeCRM.Data.Model;
using CoffeeCRM.Core.Util;using CoffeeCRM.Data;
using CoffeeCRM.Core.Util.Parameters;
using CoffeeCRM.Data.ViewModels;
using System.Threading.Tasks;
using CoffeeCRM.Data.DTO;
namespace CoffeeCRM.Core.Service
{
    public interface ITableService : IBaseService<Table>
    {
        Task<DTResult<Table>> ListServerSide(TableDTParameters parameters);
        Task<List<TableDto>> ListDto();
    }
}
