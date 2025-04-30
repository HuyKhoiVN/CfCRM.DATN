
        using CoffeeCRM.Data.Model;
        using CoffeeCRM.Core.Repository;
         
       using CoffeeCRM.Core.Util;using CoffeeCRM.Data;
        using CoffeeCRM.Core.Util.Parameters;
        using CoffeeCRM.Data.ViewModels;
        using System;
        using System.Collections.Generic;
        using System.Threading.Tasks;
        
        namespace CoffeeCRM.Core.Service
        {
            public class InventoryDiscrepancyService : IInventoryDiscrepancyService
            {
                IInventoryDiscrepancyRepository inventoryDiscrepancyRepository;
                public InventoryDiscrepancyService(
                    IInventoryDiscrepancyRepository _inventoryDiscrepancyRepository
                    )
                {
                    inventoryDiscrepancyRepository = _inventoryDiscrepancyRepository;
                }
                public async Task Add(InventoryDiscrepancy obj)
                {
                    obj.Active = true;
                    obj.CreatedTime = DateTime.Now;
                    await inventoryDiscrepancyRepository.Add(obj);
                }
        
                public int Count()
                {
                    var result = inventoryDiscrepancyRepository.Count();
                    return result;
                }
        
                public async Task Delete(InventoryDiscrepancy obj)
                {
                    obj.Active = false;
                    await inventoryDiscrepancyRepository.Delete(obj);
                }
        
                public async Task<long> DeletePermanently(long? id)
                {
                    return await inventoryDiscrepancyRepository.DeletePermanently(id);
                }
        
                public async Task<InventoryDiscrepancy> Detail(long? id)
                {
                    return await inventoryDiscrepancyRepository.Detail(id);
                }
        
                public async Task<List<InventoryDiscrepancy>> List()
                {
                    return await inventoryDiscrepancyRepository.List();
                }
        
                public async Task<List<InventoryDiscrepancy>> ListPaging(int pageIndex, int pageSize)
                {
                    return await inventoryDiscrepancyRepository.ListPaging(pageIndex, pageSize);
                }
        
                public async Task<DTResult<InventoryDiscrepancy>> ListServerSide(InventoryDiscrepancyDTParameters parameters)
                {
                    return await inventoryDiscrepancyRepository.ListServerSide(parameters);
                }
        
                //public async Task<List<InventoryDiscrepancy>> Search(string keyword)
                //{
                //    return await inventoryDiscrepancyRepository.Search(keyword);
                //}
        
                public async Task Update(InventoryDiscrepancy obj)
                {
                    await inventoryDiscrepancyRepository.Update(obj);
                }
            }
        }
    
    