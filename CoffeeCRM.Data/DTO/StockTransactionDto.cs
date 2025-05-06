using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CoffeeCRM.Data.DTO
{
    public class StockTransactionDto
    {
        public int Id { get; set; }
        public string? StockTransactionCode { get; set; }
        public string TransactionType { get; set; }
        public decimal TotalMoney { get; set; }
        public DateTime CreatedTime { get; set; }
    }

    public class StockTransactionImportDto
    {
        public int Id { get; set; }
        public string? StockTransactionCode { get; set; }
        public string? Note { get; set; }
        public string TransactionType { get; set; } = null!;
        public decimal TotalMoney { get; set; }
        public string Status { get; set; } = null!;
        public DateTime CreatedTime { get; set; }
        public bool Active { get; set; }
        public int WarehouseId { get; set; }
        public int AccountId { get; set; }
        public string? AccountName { get; set; }
        public DateTime TransactionDate { get; set; }
        public List<StockTransactionDetailImportDto> Details { get; set; } = new List<StockTransactionDetailImportDto>();
    }

    public partial class StockTransactionDetailImportDto
    {
        public int Id { get; set; }
        public int StockLevelId { get; set; }
        public int IngredientId { get; set; }
        public string? IngredientName { get; set; }
        public int StockTransactionId { get; set; }
        public int Quantity { get; set; }
        public bool CreateNewBatch { get; set; }
        public decimal UnitPrice { get; set; } 
        public DateTime ExpirationDate { get; set; }
        public DateTime CreatedTime { get; set; }
        public string? Note { get; set; }
        public bool Active { get; set; }
    }
}
