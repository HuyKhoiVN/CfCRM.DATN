using System;
using System.Collections.Generic;

namespace CoffeeCRM.Data.Model
{
    public partial class Warehouse
    {
        public Warehouse()
        {
            InventoryAudits = new HashSet<InventoryAudit>();
            StockLevels = new HashSet<StockLevel>();
            StockTransactions = new HashSet<StockTransaction>();
        }

        public int Id { get; set; }
        public string? WarehouseCode { get; set; }
        public string WarehouseName { get; set; } = null!;
        public string? Location { get; set; }
        public string? Note { get; set; }
        public DateTime CreatedTime { get; set; }
        public bool Active { get; set; }

        public virtual ICollection<InventoryAudit>? InventoryAudits { get; set; }
        public virtual ICollection<StockLevel>? StockLevels { get; set; }
        public virtual ICollection<StockTransaction>? StockTransactions { get; set; }
    }
}
