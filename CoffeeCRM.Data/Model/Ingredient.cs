using System;
using System.Collections.Generic;

namespace CoffeeCRM.Data.Model
{
    public partial class Ingredient
    {
        public Ingredient()
        {
            PurchaseOrderDetails = new HashSet<PurchaseOrderDetail>();
            StockLevels = new HashSet<StockLevel>();
        }

        public int Id { get; set; }
        public string? IngredientCode { get; set; }
        public string IngredientName { get; set; } = null!;
        public int SelfLife { get; set; }
        public decimal? AveragePrice { get; set; }
        public DateTime CreatedTime { get; set; }
        public bool? Active { get; set; }
        public int IngredientCategoryId { get; set; }
        public int SupplierId { get; set; }
        public int UnitId { get; set; }

        public virtual IngredientCategory IngredientCategory { get; set; } = null!;
        public virtual Supplier Supplier { get; set; } = null!;
        public virtual Unit Unit { get; set; } = null!;
        public virtual ICollection<PurchaseOrderDetail> PurchaseOrderDetails { get; set; }
        public virtual ICollection<StockLevel> StockLevels { get; set; }
    }
}
