using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CoffeeCRM.Core.Service;
using CoffeeCRM.Data.Model;
using Microsoft.AspNetCore.SignalR;

namespace CoffeeCRM.Core.Service
{
    public class NotificationHub : Hub<INotificationHub>
    {
        public async Task ReceiveNotification(Notification obj)
        {
            await Clients.All.ReceiveNotification(obj);
        }
    }
}
