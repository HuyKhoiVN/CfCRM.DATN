using CoffeeCRM.Data.Model;
using CoffeeCRM.Core.Repository;
using CoffeeCRM.Core.Util;
using CoffeeCRM.Core.Util.Parameters;
using CoffeeCRM.Data.ViewModels;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using CoffeeCRM.Data.Constants;
namespace CoffeeCRM.Core.Service
{
    public class NotificationService : INotificationService
    {
        INotificationRepository notificationRepository;
        public NotificationService(
            INotificationRepository _notificationRepository
            )
        {
            notificationRepository = _notificationRepository;
        }
        public async Task Add(Notification obj)
        {
            obj.Active = true;
            obj.CreatedTime = DateTime.Now;
            await notificationRepository.Add(obj);
        }

        public int Count()
        {
            var result = notificationRepository.Count();
            return result;
        }

        public async Task Delete(Notification obj)
        {
            obj.Active = false;
            await notificationRepository.Delete(obj);
        }

        public async Task<long> DeletePermanently(long? id)
        {
            return await notificationRepository.DeletePermanently(id);
        }

        public async Task<Notification> Detail(long? id)
        {
            return await notificationRepository.Detail(id);
        }

        public async Task<List<Notification>> List()
        {
            return await notificationRepository.List();
        }

        public async Task<List<Notification>> ListPaging(int AccountId, int pageIndex, int pageSize)
        {
            return await notificationRepository.ListPaging(AccountId, pageIndex, pageSize);
        }
        public async Task<List<Notification>> ListPaging(int pageIndex, int pageSize)
        {
            return await notificationRepository.ListPaging(1, pageIndex, pageSize);
        }
        public async Task<DTResult<NotificationViewModel>> ListServerSide(NotificationDTParameters parameters, int accountLoginId)
        {
            return await notificationRepository.ListServerSide(parameters, accountLoginId);
        }

        public async Task<List<Notification>> Search(string keyword)
        {
            return await notificationRepository.Search(keyword);
        }

        public async Task Update(Notification obj)
        {
            await notificationRepository.Update(obj);
        }
        public async Task<CoffeeManagementResponse> ReadNotification(long notifiId)
        {
            var notifi = await notificationRepository.Detail(notifiId);
            if (notifi != null)
            {
                notifi.NotificationStatusId = NotificationStatusId.Read;
                await notificationRepository.ReadNotification(notifi);
                return CoffeeManagementResponse.SUCCESS();
            }
            return CoffeeManagementResponse.BAD_REQUEST();
        }
        public async Task<List<NotificationViewModel>> LoadNotificationForIcon(int accountLoginId)
        {
            return await notificationRepository.LoadNotificationForIcon(accountLoginId);
        }
    }
    public class NotificationStatusId
    {
        public const int Unread = 2;
        public const int Read = 1;
    }
}

