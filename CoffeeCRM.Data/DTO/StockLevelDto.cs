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
        public string? UnitName { get; set; }
        public bool Active { get; set; }
        public int IngredientId { get; set; }
        public string? IngredientName { get; set; }
        public int WarehouseId { get; set; }
        public string? WarehouseName { get; set; }
        public DateTime LastUpdatedTime { get; set; }
        public decimal TotalPrice { get; set; }
        public string Status { get; set; }
        public int? DaysUntilExpiration => (ExpirationDate - DateTime.Today).Days;
        public string? ExpirationStatus =>
            ExpirationDate < DateTime.Today ? "Expired" :
            (ExpirationDate - DateTime.Today).Days <= 30 ? "NearExpiry" : "Good";
    }

    // DTOs/StockLevelDetailDto.cs
    public class StockLevelDetailDto
    {
        public StockLevelDto StockLevel { get; set; }
        public List<StockTransactionHistoryDto> TransactionHistory { get; set; }
    }

    // DTOs/StockTransactionHistoryDto.cs
    public class StockTransactionHistoryDto
    {
        public int Id { get; set; }
        public string TransactionCode { get; set; }
        public string TransactionType { get; set; }
        public int Quantity { get; set; }
        public DateTime TransactionDate { get; set; }
        public string Note { get; set; }
        public string CreatedBy { get; set; }
    }

    // DTOs/IngredientStockSummaryDto.cs
    public class IngredientStockSummaryDto
    {
        public int IngredientId { get; set; }
        public string IngredientCode { get; set; }
        public string IngredientName { get; set; }
        public string UnitName { get; set; }
        public int TotalQuantity { get; set; }
        public decimal AveragePrice { get; set; }
        public decimal TotalValue { get; set; }
        public DateTime EarliestExpirationDate { get; set; }
        public int BatchCount { get; set; }
    }

    // DTOs/AdjustStockLevelDto.cs
    public class AdjustStockLevelDto
    {
        public int StockLevelId { get; set; }
        public int NewQuantity { get; set; }
        public string? AdjustmentReason { get; set; }
        public string? Note { get; set; }
    }
}
