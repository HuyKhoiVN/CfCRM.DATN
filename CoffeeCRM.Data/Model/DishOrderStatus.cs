using System;
using System.Collections.Generic;

namespace CoffeeCRM.Data.Model
{
    public partial class DishOrderStatus
    {
        public DishOrderStatus()
        {
            DishOrders = new HashSet<DishOrder>();
        }

        public int Id { get; set; }
        public string? DishOrderStatusCode { get; set; }
        public string DishOrderStatusName { get; set; } = null!;
        public DateTime CreatedTime { get; set; }
        public bool Active { get; set; }

        public virtual ICollection<DishOrder> DishOrders { get; set; }
    }
}
