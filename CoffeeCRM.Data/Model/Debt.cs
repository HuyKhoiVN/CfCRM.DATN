using System;
using System.Collections.Generic;

namespace CoffeeCRM.Data.Model
{
    public partial class Debt
    {
        public int Id { get; set; }
        public string? DebtCode { get; set; }
        public string DebtName { get; set; } = null!;
        public decimal TotalMoney { get; set; }
        public bool IsPaId { get; set; }
        public DateTime? PaIdAt { get; set; }
        public string? Note { get; set; }
        public DateTime CreatedTime { get; set; }
        public bool Active { get; set; }
        public int SupplierId { get; set; }

        public virtual Supplier? Supplier { get; set; } = null!;
    }
}
