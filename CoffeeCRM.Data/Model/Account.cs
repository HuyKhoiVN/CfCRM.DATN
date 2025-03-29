using System;
using System.Collections.Generic;

namespace CoffeeCRM.Data.Model
{
    public partial class Account
    {
        public Account()
        {
            AccountActivities = new HashSet<AccountActivity>();
            Attendances = new HashSet<Attendance>();
            CashFlows = new HashSet<CashFlow>();
            DishOrders = new HashSet<DishOrder>();
            Invoices = new HashSet<Invoice>();
            Notifications = new HashSet<Notification>();
            PurchaseOrders = new HashSet<PurchaseOrder>();
            StockTransactions = new HashSet<StockTransaction>();
            TableBookings = new HashSet<TableBooking>();
        }

        public int Id { get; set; }
        public string? AccountCode { get; set; }
        public string Username { get; set; } = null!;
        public string Password { get; set; } = null!;
        public string FullName { get; set; } = null!;
        public string? Email { get; set; }
        public string? Photo { get; set; }
        public DateTime Dob { get; set; }
        public string? PhoneNumber { get; set; }
        public DateTime CreatedTime { get; set; }
        public bool Active { get; set; }
        public int RoleId { get; set; }

        public virtual Role? Role { get; set; }
        public virtual ICollection<AccountActivity> AccountActivities { get; set; }
        public virtual ICollection<Attendance> Attendances { get; set; }
        public virtual ICollection<CashFlow> CashFlows { get; set; }
        public virtual ICollection<DishOrder> DishOrders { get; set; }
        public virtual ICollection<Invoice> Invoices { get; set; }
        public virtual ICollection<Notification> Notifications { get; set; }
        public virtual ICollection<PurchaseOrder> PurchaseOrders { get; set; }
        public virtual ICollection<StockTransaction> StockTransactions { get; set; }
        public virtual ICollection<TableBooking> TableBookings { get; set; }
    }
}
