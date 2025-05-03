using System;
using System.Collections.Generic;

namespace CoffeeCRM.Data.Model
{
    public partial class PurchaseOrder
    {
        public PurchaseOrder()
        {
            PurchaseOrderDetails = new HashSet<PurchaseOrderDetail>();
        }

        public int Id { get; set; }
        public string? PurchaseOrderCode { get; set; }
        public decimal TotalPrice { get; set; }
        public string PaymentStatus { get; set; } = null!;
        public DateTime CreatedTime { get; set; }
        public bool Active { get; set; }
        public int AccountId { get; set; }
        public DateTime OrderDate { get; set; } // ngày dự kiến nhận hàng

        public virtual Account? Account { get; set; } = null!;
        public virtual ICollection<PurchaseOrderDetail> PurchaseOrderDetails { get; set; }
    }
}
