
using CoffeeCRM.Data.Model;
using CoffeeCRM.Core.Repository;

using CoffeeCRM.Core.Util;
using CoffeeCRM.Core.Util.Parameters;
using CoffeeCRM.Data.ViewModels;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using CoffeeCRM.Data.DTO;

namespace CoffeeCRM.Core.Service
{
    public class WarehouseService : IWarehouseService
    {
        IWarehouseRepository warehouseRepository;
        public WarehouseService(
            IWarehouseRepository _warehouseRepository
            )
        {
            warehouseRepository = _warehouseRepository;
        }
        public async Task Add(Warehouse obj)
        {
            obj.Active = true;
            obj.CreatedTime = DateTime.Now;
            await warehouseRepository.Add(obj);
        }

        public int Count()
        {
            var result = warehouseRepository.Count();
            return result;
        }

        public async Task Delete(Warehouse obj)
        {
            obj.Active = false;
            await warehouseRepository.Delete(obj);
        }

        public async Task<long> DeletePermanently(long? id)
        {
            return await warehouseRepository.DeletePermanently(id);
        }

        public async Task<Warehouse> Detail(long? id)
        {
            return await warehouseRepository.Detail(id);
        }

        public async Task<List<Warehouse>> List()
        {
            return await warehouseRepository.List();
        }
        public async Task<WarehouseDto> DetailDto(int id)
        {
            return await warehouseRepository.DetailDto(id);
        }

        public async Task<List<WarehouseDto>> ListDto()
        {
            return await warehouseRepository.ListDto();
        }

        public async Task<List<Warehouse>> ListPaging(int pageIndex, int pageSize)
        {
            return await warehouseRepository.ListPaging(pageIndex, pageSize);
        }

        public async Task<DTResult<WarehouseDto>> ListServerSide(WarehouseDTParameters parameters)
        {
            return await warehouseRepository.ListServerSide(parameters);
        }

        //public async Task<List<Warehouse>> Search(string keyword)
        //{
        //    return await warehouseRepository.Search(keyword);
        //}

        public async Task Update(Warehouse obj)
        {
            await warehouseRepository.Update(obj);
        }
    }
}

