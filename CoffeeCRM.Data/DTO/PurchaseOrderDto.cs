using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CoffeeCRM.Data.Model;

namespace CoffeeCRM.Data.DTO
{
    public class PurchaseOrderDto
    {
        public int Id { get; set; }
        public string? PurchaseOrderCode { get; set; }
        public decimal TotalPrice { get; set; }
        public string PaymentStatus { get; set; } = null!;
        public DateTime CreatedTime { get; set; }
        public bool Active { get; set; }
        public int AccountId { get; set; }
        public string? AccountName { get; set; }
        public int SupplierId { get; set; }
        public string? SupplierName { get; set; }
        public int? WarehouseId { get; set; } // bỏ qua
        public int? RoleId { get; set; } // bỏ qua
        public int? StockTransId { get; set; }
        public string? StockTransCode { get; set; }
        public DateTime OrderDate { get; set; }

        public List<PurchaseOrderDetailDto> Details { get; set; } = new List<PurchaseOrderDetailDto>();
        public List<PurchaseOrderHistory> Histories { get; set; } = new List<PurchaseOrderHistory>();
    }

    public class PurchaseOrderDetailDto
    {
        public int Id { get; set; }
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public int? UnitId { get; set; }
        public string? UnitName { get; set; }
        public DateTime CreatedTime { get; set; }
        public bool Active { get; set; }
        public int IngredientId { get; set; }
        public string? IngredientName { get; set; }
        public int PurchaseOrderId { get; set; }
    }

    public class PurchaseOrderHistory
    {
        public int Id { get; set; }
        public DateTime CreatedTime { get; set; }
        public int? AccountId { get; set; }
        public string AccountName { get; set; }
        public string ActivityDescription { get; set; } = null!;
    }
}
