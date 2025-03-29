using System;
using System.Collections.Generic;

namespace CoffeeCRM.Data.Model
{
    public partial class DishOrder
    {
        public DishOrder()
        {
            DishOrderDetails = new HashSet<DishOrderDetail>();
        }

        public int Id { get; set; }
        public string? Note { get; set; }
        public int DishOrderStatusId { get; set; }
        public int TableId { get; set; }
        public DateTime CreatedTime { get; set; }
        public bool Active { get; set; }
        public int AccountId { get; set; }

        public virtual Account Account { get; set; } = null!;
        public virtual DishOrderStatus DishOrderStatus { get; set; } = null!;
        public virtual Table Table { get; set; } = null!;
        public virtual ICollection<DishOrderDetail> DishOrderDetails { get; set; }
    }
}
