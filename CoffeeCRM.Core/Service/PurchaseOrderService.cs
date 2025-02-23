
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
            public class PurchaseOrderService : IPurchaseOrderService
            {
                IPurchaseOrderRepository purchaseOrderRepository;
                public PurchaseOrderService(
                    IPurchaseOrderRepository _purchaseOrderRepository
                    )
                {
                    purchaseOrderRepository = _purchaseOrderRepository;
                }
                public async Task Add(PurchaseOrder obj)
                {
                    obj.Active = true;
                    obj.CreatedTime = DateTime.Now;
                    await purchaseOrderRepository.Add(obj);
                }
        
                public int Count()
                {
                    var result = purchaseOrderRepository.Count();
                    return result;
                }
        
                public async Task Delete(PurchaseOrder obj)
                {
                    obj.Active = false;
                    await purchaseOrderRepository.Delete(obj);
                }
        
                public async Task<long> DeletePermanently(long? id)
                {
                    return await purchaseOrderRepository.DeletePermanently(id);
                }
        
                public async Task<PurchaseOrder> Detail(long? id)
                {
                    return await purchaseOrderRepository.Detail(id);
                }
        
                public async Task<List<PurchaseOrder>> List()
                {
                    return await purchaseOrderRepository.List();
                }
        
                public async Task<List<PurchaseOrder>> ListPaging(int pageIndex, int pageSize)
                {
                    return await purchaseOrderRepository.ListPaging(pageIndex, pageSize);
                }
        
                public async Task<DTResult<PurchaseOrder>> ListServerSide(PurchaseOrderDTParameters parameters)
                {
                    return await purchaseOrderRepository.ListServerSide(parameters);
                }
        
                //public async Task<List<PurchaseOrder>> Search(string keyword)
                //{
                //    return await purchaseOrderRepository.Search(keyword);
                //}
        
                public async Task Update(PurchaseOrder obj)
                {
                    await purchaseOrderRepository.Update(obj);
                }
            }
        }
    
    