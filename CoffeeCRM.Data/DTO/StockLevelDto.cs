using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CoffeeCRM.Data.DTO
{
    public class StockLevelDto
    {
        public int Id { get; set; }
        public int Quantity { get; set; }
        public DateTime ExpirationDate { get; set; }
        public decimal UnitPrice { get; set; }
        public DateTime CreatedTime { get; set; }
        public bool Active { get; set; }
        public int IngredientId { get; set; }
        public string? IngredientName { get; set; }
        public int WarehouseId { get; set; }
        public string? WarehouseName { get; set; }
        public DateTime LastUpdatedTime { get; set; }
        public decimal TotalPrice { get; set; }
    }
}
