

using CoffeeCRM.Data.Model;

namespace CoffeeCRM.Data.ViewModels
{
    public class NotificationViewModel : Notification
    {
        public string NotificationStatusName { get; set; }
        public string UserCreate { get; set; }
        public string? Photo { get; set; }
    }
}
