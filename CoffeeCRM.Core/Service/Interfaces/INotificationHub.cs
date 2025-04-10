using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CoffeeCRM.Data.Model;

namespace CoffeeCRM.Core.Service
{
    public interface INotificationHub : IScoped
    {
        Task ReceiveNotification(Notification obj);
    }
}
