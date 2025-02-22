using System;
using System.Collections.Generic;

namespace CoffeeCRM.Data.Model
{
    public partial class Role
    {
        public Role()
        {
            Accounts = new HashSet<Account>();
            Notifications = new HashSet<Notification>();
        }

        public int Id { get; set; }
        public string? RoleCode { get; set; }
        public string RoleName { get; set; } = null!;
        public DateTime CreatedTime { get; set; }
        public bool? Active { get; set; }

        public virtual ICollection<Account> Accounts { get; set; }
        public virtual ICollection<Notification> Notifications { get; set; }
    }
}
