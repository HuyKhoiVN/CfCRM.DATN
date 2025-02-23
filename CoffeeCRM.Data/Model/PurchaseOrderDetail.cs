using System;
using System.Collections.Generic;

namespace CoffeeCRM.Data.Model
{
    public partial class PurchaseOrderDetail
    {
        public int Id { get; set; }
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public DateTime CreatedTime { get; set; }
        public bool Active { get; set; }
        public int IngredientId { get; set; }
        public int PurchaseOrderId { get; set; }

        public virtual Ingredient Ingredient { get; set; } = null!;
        public virtual PurchaseOrder PurchaseOrder { get; set; } = null!;
    }
}
