using System;
using System.Collections.Generic;

namespace CoffeeCRM.Data.Model
{
    public partial class IngredientCategory
    {
        public IngredientCategory()
        {
            Ingredients = new HashSet<Ingredient>();
        }

        public int Id { get; set; }
        public string? IngredientCategoryCode { get; set; }
        public string IngredientCategoryName { get; set; } = null!;
        public DateTime CreatedTime { get; set; }
        public bool? Active { get; set; }

        public virtual ICollection<Ingredient> Ingredients { get; set; }
    }
}
