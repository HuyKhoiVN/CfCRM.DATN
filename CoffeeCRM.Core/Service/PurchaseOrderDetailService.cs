
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
            public class PurchaseOrderDetailService : IPurchaseOrderDetailService
            {
                IPurchaseOrderDetailRepository purchaseOrderDetailRepository;
                public PurchaseOrderDetailService(
                    IPurchaseOrderDetailRepository _purchaseOrderDetailRepository
                    )
                {
                    purchaseOrderDetailRepository = _purchaseOrderDetailRepository;
                }
                public async Task Add(PurchaseOrderDetail obj)
                {
                    obj.Active = true;
                    obj.CreatedTime = DateTime.Now;
                    await purchaseOrderDetailRepository.Add(obj);
                }
        
                public int Count()
                {
                    var result = purchaseOrderDetailRepository.Count();
                    return result;
                }
        
                public async Task Delete(PurchaseOrderDetail obj)
                {
                    obj.Active = false;
                    await purchaseOrderDetailRepository.Delete(obj);
                }
        
                public async Task<long> DeletePermanently(long? id)
                {
                    return await purchaseOrderDetailRepository.DeletePermanently(id);
                }
        
                public async Task<PurchaseOrderDetail> Detail(long? id)
                {
                    return await purchaseOrderDetailRepository.Detail(id);
                }
        
                public async Task<List<PurchaseOrderDetail>> List()
                {
                    return await purchaseOrderDetailRepository.List();
                }
        
                public async Task<List<PurchaseOrderDetail>> ListPaging(int pageIndex, int pageSize)
                {
                    return await purchaseOrderDetailRepository.ListPaging(pageIndex, pageSize);
                }
        
                public async Task<DTResult<PurchaseOrderDetail>> ListServerSide(PurchaseOrderDetailDTParameters parameters)
                {
                    return await purchaseOrderDetailRepository.ListServerSide(parameters);
                }
        
                //public async Task<List<PurchaseOrderDetail>> Search(string keyword)
                //{
                //    return await purchaseOrderDetailRepository.Search(keyword);
                //}
        
                public async Task Update(PurchaseOrderDetail obj)
                {
                    await purchaseOrderDetailRepository.Update(obj);
                }
            }
        }
    
    