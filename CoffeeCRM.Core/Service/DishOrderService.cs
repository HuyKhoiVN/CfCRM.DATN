
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
            public class DishOrderService : IDishOrderService
            {
                IDishOrderRepository dishOrderRepository;
                public DishOrderService(
                    IDishOrderRepository _dishOrderRepository
                    )
                {
                    dishOrderRepository = _dishOrderRepository;
                }
                public async Task Add(DishOrder obj)
                {
                    obj.Active = true;
                    obj.CreatedTime = DateTime.Now;
                    await dishOrderRepository.Add(obj);
                }
        
                public int Count()
                {
                    var result = dishOrderRepository.Count();
                    return result;
                }
        
                public async Task Delete(DishOrder obj)
                {
                    obj.Active = false;
                    await dishOrderRepository.Delete(obj);
                }
        
                public async Task<long> DeletePermanently(long? id)
                {
                    return await dishOrderRepository.DeletePermanently(id);
                }
        
                public async Task<DishOrder> Detail(long? id)
                {
                    return await dishOrderRepository.Detail(id);
                }
        
                public async Task<List<DishOrder>> List()
                {
                    return await dishOrderRepository.List();
                }
        
                public async Task<List<DishOrder>> ListPaging(int pageIndex, int pageSize)
                {
                    return await dishOrderRepository.ListPaging(pageIndex, pageSize);
                }
        
                public async Task<DTResult<DishOrder>> ListServerSide(DishOrderDTParameters parameters)
                {
                    return await dishOrderRepository.ListServerSide(parameters);
                }
        
                //public async Task<List<DishOrder>> Search(string keyword)
                //{
                //    return await dishOrderRepository.Search(keyword);
                //}
        
                public async Task Update(DishOrder obj)
                {
                    await dishOrderRepository.Update(obj);
                }
            }
        }
    
    