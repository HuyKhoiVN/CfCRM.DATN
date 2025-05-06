using System;
using System.Collections.Generic;

namespace CoffeeCRM.Data.Model
{
    public partial class StockTransaction
    {
        public StockTransaction()
        {
            StockTransactionDetails = new HashSet<StockTransactionDetail>();
        }

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
        public DateTime TransactionDate { get; set; }

        public virtual Account? Account { get; set; } = null!;
        public virtual Warehouse? Warehouse { get; set; } = null!;
        public virtual ICollection<StockTransactionDetail> StockTransactionDetails { get; set; }
    }
}
