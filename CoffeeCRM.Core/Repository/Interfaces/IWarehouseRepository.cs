
using CoffeeCRM.Data.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CoffeeCRM.Core.Util;
using CoffeeCRM.Core.Util.Parameters;
using CoffeeCRM.Data.ViewModels;
using CoffeeCRM.Data.DTO;


namespace CoffeeCRM.Core.Repository
{
    public interface IWarehouseRepository
    {
        Task<List<WarehouseDto>> ListDto();
        Task<WarehouseDto> DetailDto(int id);
        Task<List<Warehouse>> List();

        //Task <List< Warehouse>> Search(string keyword);

        Task<List<Warehouse>> ListPaging(int pageIndex, int pageSize);

        Task<Warehouse> Detail(long? postId);

        Task<Warehouse> Add(Warehouse Warehouse);

        Task Update(Warehouse Warehouse);

        Task Delete(Warehouse Warehouse);

        Task<long> DeletePermanently(long? WarehouseId);

        int Count();

        Task<DTResult<WarehouseDto>> ListServerSide(WarehouseDTParameters parameters);
    }
}
