
        using CoffeeCRM.Data.Model;
        using CoffeeCRM.Core.Repository;
         
       using CoffeeCRM.Core.Util;
        using CoffeeCRM.Core.Util.Parameters;
        using CoffeeCRM.Data.ViewModels;
        using System;
        using System.Collections.Generic;
        using System.Threading.Tasks;
        
        namespace CoffeeCRM.Core.Service
        {
            public class InventoryAuditService : IInventoryAuditService
            {
                IInventoryAuditRepository inventoryAuditRepository;
                public InventoryAuditService(
                    IInventoryAuditRepository _inventoryAuditRepository
                    )
                {
                    inventoryAuditRepository = _inventoryAuditRepository;
                }
                public async Task Add(InventoryAudit obj)
                {
                    obj.Active = true;
                    obj.CreatedTime = DateTime.Now;
                    await inventoryAuditRepository.Add(obj);
                }
        
                public int Count()
                {
                    var result = inventoryAuditRepository.Count();
                    return result;
                }
        
                public async Task Delete(InventoryAudit obj)
                {
                    obj.Active = false;
                    await inventoryAuditRepository.Delete(obj);
                }
        
                public async Task<long> DeletePermanently(long? id)
                {
                    return await inventoryAuditRepository.DeletePermanently(id);
                }
        
                public async Task<InventoryAudit> Detail(long? id)
                {
                    return await inventoryAuditRepository.Detail(id);
                }
        
                public async Task<List<InventoryAudit>> List()
                {
                    return await inventoryAuditRepository.List();
                }
        
                public async Task<List<InventoryAudit>> ListPaging(int pageIndex, int pageSize)
                {
                    return await inventoryAuditRepository.ListPaging(pageIndex, pageSize);
                }
        
                public async Task<DTResult<InventoryAudit>> ListServerSide(InventoryAuditDTParameters parameters)
                {
                    return await inventoryAuditRepository.ListServerSide(parameters);
                }
        
                //public async Task<List<InventoryAudit>> Search(string keyword)
                //{
                //    return await inventoryAuditRepository.Search(keyword);
                //}
        
                public async Task Update(InventoryAudit obj)
                {
                    await inventoryAuditRepository.Update(obj);
                }
            }
        }
    
    