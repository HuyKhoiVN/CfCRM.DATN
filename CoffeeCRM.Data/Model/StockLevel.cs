using System;
using System.Collections.Generic;

namespace CoffeeCRM.Data.Model
{
    public partial class StockLevel
    {
        public StockLevel()
        {
            InventoryDiscrepancies = new HashSet<InventoryDiscrepancy>();
            StockTransactionDetails = new HashSet<StockTransactionDetail>();
        }

        public int Id { get; set; }
        public int Quantity { get; set; }
        public DateTime ExpirationDate { get; set; }
        public decimal UnitPrice { get; set; }
        public DateTime CreatedTime { get; set; }
        public bool? Active { get; set; }
        public int IngredientId { get; set; }
        public int WarehouseId { get; set; }
        public DateTime LastUpdatedTime { get; set; }

        public virtual Ingredient Ingredient { get; set; } = null!;
        public virtual Warehouse Warehouse { get; set; } = null!;
        public virtual ICollection<InventoryDiscrepancy> InventoryDiscrepancies { get; set; }
        public virtual ICollection<StockTransactionDetail> StockTransactionDetails { get; set; }
    }
}
