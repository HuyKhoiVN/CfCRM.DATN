
using CoffeeCRM.Data.Model;
using CoffeeCRM.Core.Repository;

using CoffeeCRM.Core.Util;
using CoffeeCRM.Data;
using CoffeeCRM.Core.Util.Parameters;
using CoffeeCRM.Data.ViewModels;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using CoffeeCRM.Data.DTO;

namespace CoffeeCRM.Core.Service
{
    public class SupplierService : ISupplierService
    {
        ISupplierRepository supplierRepository;
        public SupplierService(
            ISupplierRepository _supplierRepository
            )
        {
            supplierRepository = _supplierRepository;
        }
        public async Task Add(Supplier obj)
        {
            obj.Active = true;
            obj.CreatedTime = DateTime.Now;
            await supplierRepository.Add(obj);
        }

        public int Count()
        {
            var result = supplierRepository.Count();
            return result;
        }

        public async Task Delete(Supplier obj)
        {
            obj.Active = false;
            await supplierRepository.Delete(obj);
        }

        public async Task<long> DeletePermanently(long? id)
        {
            return await supplierRepository.DeletePermanently(id);
        }

        public async Task<Supplier> Detail(long? id)
        {
            return await supplierRepository.Detail(id);
        }

        public async Task<List<Supplier>> List()
        {
            return await supplierRepository.List();
        }

        public async Task<List<Supplier>> ListPaging(int pageIndex, int pageSize)
        {
            return await supplierRepository.ListPaging(pageIndex, pageSize);
        }

        public async Task<DTResult<SupplierDto>> ListServerSide(SupplierDTParameters parameters)
        {
            return await supplierRepository.ListServerSide(parameters);
        }

        //public async Task<List<Supplier>> Search(string keyword)
        //{
        //    return await supplierRepository.Search(keyword);
        //}

        public async Task Update(Supplier obj)
        {
            await supplierRepository.Update(obj);
        }
    }
}

