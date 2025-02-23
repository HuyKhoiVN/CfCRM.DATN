
    using CoffeeCRM.Data.Model;
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using CoffeeCRM.Core.Util;
    using CoffeeCRM.Core.Util.Parameters;
    using CoffeeCRM.Data.ViewModels;


    namespace CoffeeCRM.Core.Repository
    {
        public interface INotificationRepository
        {
        Task<List<Notification>> List();

        Task<List<Notification>> Search(string keyword);

        Task<List<Notification>> ListPaging(int AccountId, int pageIndex, int pageSize);

        Task<Notification> Detail(long? postId);

        Task<Notification> Add(Notification Notification);

        Task Update(Notification Notification);

        Task Delete(Notification Notification);

        Task<long> DeletePermanently(long? NotificationId);

        int Count();

        Task<DTResult<NotificationViewModel>> ListServerSide(NotificationDTParameters parameters, int accountLoginId);
        Task ReadNotification(Notification obj);
        Task<List<NotificationViewModel>> LoadNotificationForIcon(int accountLoginId);
    }
    }
