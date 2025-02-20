using System;
using System.Collections.Generic;

namespace CoffeeCRM.Data.Model
{
    public partial class InventoryDiscrepancy
    {
        public int Id { get; set; }
        public int InventoryAuditId { get; set; }
        public int StockLevelId { get; set; }
        public int ExpectedQuantity { get; set; }
        public int ActualQuantity { get; set; }
        public string? DiscrepancyReason { get; set; }
        public DateTime CreatedTime { get; set; }
        public bool? Active { get; set; }

        public virtual InventoryAudit InventoryAudit { get; set; } = null!;
        public virtual StockLevel StockLevel { get; set; } = null!;
    }
}
