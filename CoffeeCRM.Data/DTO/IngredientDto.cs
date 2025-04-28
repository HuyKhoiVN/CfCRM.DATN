using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CoffeeCRM.Data.DTO
{
    public class IngredientDto
    {
        public int Id { get; set; }
        public string? IngredientCode { get; set; }
        public string IngredientName { get; set; } = null!;
        public int SelfLife { get; set; } // hạn sử dụng x ngày
        public decimal? AveragePrice { get; set; }
        public DateTime CreatedTime { get; set; }
        public bool Active { get; set; }
        public int IngredientCategoryId { get; set; }
        public int SupplierId { get; set; }
        public int UnitId { get; set; }
        public string? IngredientCategoryName { get; set; }
        public string? SupplierName { get; set; }
        public string? UnitName { get; set; }
        public int? TotalInvemtory { get; set; }
        public string? InventoryStatus   { get; set; }
    }
}
