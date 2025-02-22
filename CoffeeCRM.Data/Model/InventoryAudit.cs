using System;
using System.Collections.Generic;

namespace CoffeeCRM.Data.Model
{
    public partial class InventoryAudit
    {
        public InventoryAudit()
        {
            InventoryDiscrepancies = new HashSet<InventoryDiscrepancy>();
        }

        public int Id { get; set; }
        public string? AuditCode { get; set; }
        public DateTime AuditDate { get; set; }
        public string Auditor { get; set; } = null!;
        public string? Note { get; set; }
        public DateTime CreatedTime { get; set; }
        public bool? Active { get; set; }
        public int WarehouseId { get; set; }

        public virtual Warehouse Warehouse { get; set; } = null!;
        public virtual ICollection<InventoryDiscrepancy> InventoryDiscrepancies { get; set; }
    }
}
