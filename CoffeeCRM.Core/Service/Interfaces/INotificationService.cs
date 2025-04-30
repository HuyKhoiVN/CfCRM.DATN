
using CoffeeCRM.Data.Model;
using CoffeeCRM.Core.Util;using CoffeeCRM.Data;
using CoffeeCRM.Core.Util.Parameters;
using CoffeeCRM.Data.ViewModels;
using System.Threading.Tasks;
using CoffeeCRM.Data.Constants;
namespace CoffeeCRM.Core.Service
{
    public interface INotificationService : IBaseService<Notification>
    {
        Task<DTResult<NotificationViewModel>> ListServerSide(NotificationDTParameters parameters, int accountLoginId);
        Task<CoffeeManagementResponse> ReadNotification(long notifiId);
        Task<List<NotificationViewModel>> LoadNotificationForIcon(int accountLoginId);
        Task<List<Notification>> ListPaging(int AccountId, int pageIndex, int pageSize);
    }
}
