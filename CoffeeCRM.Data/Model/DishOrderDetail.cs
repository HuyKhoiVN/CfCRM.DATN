using System;
using System.Collections.Generic;

namespace CoffeeCRM.Data.Model
{
    public partial class DishOrderDetail
    {
        public int Id { get; set; }
        public int Quantity { get; set; }
        public string? Note { get; set; }
        public int DishOrderId { get; set; }
        public int DishId { get; set; }
        public DateTime CreatedTime { get; set; }
        public bool? Active { get; set; }
        public decimal Price { get; set; }

        public virtual Dish Dish { get; set; } = null!;
        public virtual DishOrder DishOrder { get; set; } = null!;
    }
}
