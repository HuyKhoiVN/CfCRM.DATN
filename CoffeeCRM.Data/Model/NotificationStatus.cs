using System;
using System.Collections.Generic;

namespace CoffeeCRM.Data.Model
{
    public partial class NotificationStatus
    {
        public NotificationStatus()
        {
            Notifications = new HashSet<Notification>();
        }

        public int Id { get; set; }
        public bool? Active { get; set; }
        public string? Name { get; set; }
        public string? Description { get; set; }
        public DateTime? CreatedTime { get; set; }

        public virtual ICollection<Notification> Notifications { get; set; }
    }
}
