using System;
using System.Collections.Generic;

namespace CoffeeCRM.Data.Model
{
    public partial class Table
    {
        public Table()
        {
            DishOrders = new HashSet<DishOrder>();
            Invoices = new HashSet<Invoice>();
            TableBookings = new HashSet<TableBooking>();
        }

        public int Id { get; set; }
        public string? TableCode { get; set; }
        public string TableName { get; set; } = null!;
        public string TableStatus { get; set; } = null!;
        public DateTime CreatedTime { get; set; }
        public bool Active { get; set; }

        public virtual ICollection<DishOrder> DishOrders { get; set; }
        public virtual ICollection<Invoice> Invoices { get; set; }
        public virtual ICollection<TableBooking> TableBookings { get; set; }
    }
}
