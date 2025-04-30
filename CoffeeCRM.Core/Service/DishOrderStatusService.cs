
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
            public class DishOrderStatusService : IDishOrderStatusService
            {
                IDishOrderStatusRepository dishOrderStatusRepository;
                public DishOrderStatusService(
                    IDishOrderStatusRepository _dishOrderStatusRepository
                    )
                {
                    dishOrderStatusRepository = _dishOrderStatusRepository;
                }
                public async Task Add(DishOrderStatus obj)
                {
                    obj.Active = true;
                    obj.CreatedTime = DateTime.Now;
                    await dishOrderStatusRepository.Add(obj);
                }
        
                public int Count()
                {
                    var result = dishOrderStatusRepository.Count();
                    return result;
                }
        
                public async Task Delete(DishOrderStatus obj)
                {
                    obj.Active = false;
                    await dishOrderStatusRepository.Delete(obj);
                }
        
                public async Task<long> DeletePermanently(long? id)
                {
                    return await dishOrderStatusRepository.DeletePermanently(id);
                }
        
                public async Task<DishOrderStatus> Detail(long? id)
                {
                    return await dishOrderStatusRepository.Detail(id);
                }
        
                public async Task<List<DishOrderStatus>> List()
                {
                    return await dishOrderStatusRepository.List();
                }
        
                public async Task<List<DishOrderStatus>> ListPaging(int pageIndex, int pageSize)
                {
                    return await dishOrderStatusRepository.ListPaging(pageIndex, pageSize);
                }
        
                public async Task<DTResult<DishOrderStatus>> ListServerSide(DishOrderStatusDTParameters parameters)
                {
                    return await dishOrderStatusRepository.ListServerSide(parameters);
                }
        
                //public async Task<List<DishOrderStatus>> Search(string keyword)
                //{
                //    return await dishOrderStatusRepository.Search(keyword);
                //}
        
                public async Task Update(DishOrderStatus obj)
                {
                    await dishOrderStatusRepository.Update(obj);
                }
            }
        }
    
    