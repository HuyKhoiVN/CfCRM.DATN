using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CoffeeCRM.Data.DTO
{
    public class StockTransactionDto
    {
        public string StockTransactionCode { get; set; }
        public string TransactionType { get; set; }
        public decimal TotalMoney { get; set; }
        public DateTime CreatedTime { get; set; }
    }
}
