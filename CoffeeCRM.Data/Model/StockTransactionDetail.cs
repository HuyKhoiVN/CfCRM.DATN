using System;
using System.Collections.Generic;

namespace CoffeeCRM.Data.Model
{
    public partial class StockTransactionDetail
    {
        public int Id { get; set; }
        public int StockLevelId { get; set; }
        public int StockTransactionId { get; set; }
        public int Quantity { get; set; }
        public DateTime CreatedTime { get; set; }
        public bool? Active { get; set; }

        public virtual StockLevel StockLevel { get; set; } = null!;
        public virtual StockTransaction StockTransaction { get; set; } = null!;
    }
}
