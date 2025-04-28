using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CoffeeCRM.Data.DTO
{
    public class WarehouseDto
    {
        public int Id { get; set; }
        public string? WarehouseCode { get; set; }
        public string WarehouseName { get; set; } = null!;
        public string? Location { get; set; }
        public string? Note { get; set; }
        public DateTime CreatedTime { get; set; }
        public bool Active { get; set; }
        public int? ItemsStored { get; set; }
        public decimal? TotalValue { get; set; }
        public int? LowStock { get; set; }
        public int? Expired { get; set; }
    }
}
