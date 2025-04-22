using System;
using System.Collections.Generic;

namespace CoffeeCRM.Data.Model
{
    public partial class InvoiceDetail
    {
        public int Id { get; set; }
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public DateTime CreatedTime { get; set; }
        public bool Active { get; set; }
        public int InvoiceId { get; set; }
        public int DishId { get; set; }
    }
}
