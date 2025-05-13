using System;
using System.Collections.Generic;

namespace CoffeeCRM.Data.Model
{
    public partial class StockTransactionDraftDetail
    {
        public int Id { get; set; }
        public int StockTransactionId { get; set; }
        public int IngredientId { get; set; }
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public DateTime ExpirationDate { get; set; }
        public string? Note { get; set; }
        public bool CreateNewBatch { get; set; }
        public DateTime CreatedTime { get; set; }
        public int? StockLevelId { get; set; }
    }
}
