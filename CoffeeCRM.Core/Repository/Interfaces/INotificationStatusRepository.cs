
    using CoffeeCRM.Data.Model;
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using CoffeeCRM.Core.Util;using CoffeeCRM.Data;
    using CoffeeCRM.Core.Util.Parameters;
    using CoffeeCRM.Data.ViewModels;


    namespace CoffeeCRM.Core.Repository
    {
        public interface INotificationStatusRepository
        {
        Task<List<NotificationStatus>> List();

        Task<List<NotificationStatus>> Search(string keyword);

        Task<List<NotificationStatus>> ListPaging(int pageIndex, int pageSize);

        Task<NotificationStatus> Detail(long? postId);

        Task<NotificationStatus> Add(NotificationStatus NotificationStatus);

        Task Update(NotificationStatus NotificationStatus);

        Task Delete(NotificationStatus NotificationStatus);

        Task<long> DeletePermanently(long? NotificationStatusId);

        int Count();
    }
    }
