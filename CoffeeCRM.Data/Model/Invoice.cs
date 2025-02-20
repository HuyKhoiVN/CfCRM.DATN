using System;
using System.Collections.Generic;

namespace CoffeeCRM.Data.Model
{
    public partial class Invoice
    {
        public int Id { get; set; }
        public string? InvoiceCode { get; set; }
        public decimal TotalMoney { get; set; }
        public string PaymentStatus { get; set; } = null!;
        public DateTime CreatedTime { get; set; }
        public bool? Active { get; set; }
        public string PaymentMethod { get; set; } = null!;
        public int AccountId { get; set; }
        public int TableId { get; set; }
        public int? TotalGuest { get; set; }

        public virtual Account Account { get; set; } = null!;
        public virtual Table Table { get; set; } = null!;
    }
}
