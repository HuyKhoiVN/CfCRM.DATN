using System;
using System.Collections.Generic;

namespace CoffeeCRM.Data.Model
{
    public partial class DishCategory
    {
        public DishCategory()
        {
            Dishes = new HashSet<Dish>();
        }

        public int Id { get; set; }
        public string? DishCategoryCode { get; set; }
        public string DishCateogryName { get; set; } = null!;
        public DateTime CreatedTime { get; set; }
        public bool? Active { get; set; }

        public virtual ICollection<Dish> Dishes { get; set; }
    }
}
