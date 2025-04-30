
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
            public class NotificationStatusService : INotificationStatusService
            {
                INotificationStatusRepository notificationStatusRepository;
                public NotificationStatusService(
                    INotificationStatusRepository _notificationStatusRepository
                    )
                {
                    notificationStatusRepository = _notificationStatusRepository;
                }
                public async Task Add(NotificationStatus obj)
                {
                    obj.Active = true;
                    obj.CreatedTime = DateTime.Now;
                    await notificationStatusRepository.Add(obj);
                }
        
                public int Count()
                {
                    var result = notificationStatusRepository.Count();
                    return result;
                }
        
                public async Task Delete(NotificationStatus obj)
                {
                    obj.Active = false;
                    await notificationStatusRepository.Delete(obj);
                }
        
                public async Task<long> DeletePermanently(long? id)
                {
                    return await notificationStatusRepository.DeletePermanently(id);
                }
        
                public async Task<NotificationStatus> Detail(long? id)
                {
                    return await notificationStatusRepository.Detail(id);
                }
        
                public async Task<List<NotificationStatus>> List()
                {
                    return await notificationStatusRepository.List();
                }
        
                public async Task<List<NotificationStatus>> ListPaging(int pageIndex, int pageSize)
                {
                    return await notificationStatusRepository.ListPaging(pageIndex, pageSize);
                }
        
                //public async Task<List<NotificationStatus>> Search(string keyword)
                //{
                //    return await notificationStatusRepository.Search(keyword);
                //}
        
                public async Task Update(NotificationStatus obj)
                {
                    await notificationStatusRepository.Update(obj);
                }
            }
        }
    
    