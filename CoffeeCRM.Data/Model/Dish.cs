using System;
using System.Collections.Generic;

namespace CoffeeCRM.Data.Model
{
    public partial class Dish
    {
        public Dish()
        {
            DishOrderDetails = new HashSet<DishOrderDetail>();
        }

        public int Id { get; set; }
        public string? DishCode { get; set; }
        public string DishName { get; set; } = null!;
        public decimal Price { get; set; }
        public string Photo { get; set; } = null!;
        public DateTime CreatedTime { get; set; }
        public bool? Active { get; set; }
        public int DishCategoryId { get; set; }

        public virtual DishCategory DishCategory { get; set; } = null!;
        public virtual ICollection<DishOrderDetail> DishOrderDetails { get; set; }
    }
}
