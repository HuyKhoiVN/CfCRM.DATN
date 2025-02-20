using System;
using System.Collections.Generic;

namespace CoffeeCRM.Data.Model
{
    public partial class Unit
    {
        public Unit()
        {
            Ingredients = new HashSet<Ingredient>();
        }

        public int Id { get; set; }
        public string? UnitCode { get; set; }
        public string UnitName { get; set; } = null!;
        public DateTime CreatedTime { get; set; }
        public bool? Active { get; set; }

        public virtual ICollection<Ingredient> Ingredients { get; set; }
    }
}
