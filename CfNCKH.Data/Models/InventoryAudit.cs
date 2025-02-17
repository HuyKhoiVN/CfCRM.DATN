﻿using System;
using System.Collections.Generic;

namespace CfNCKH.Data.Models
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

        public virtual ICollection<InventoryDiscrepancy> InventoryDiscrepancies { get; set; }
    }
}
