using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CoffeeCRM.Core.Util.Parameters
{
    public class StockTransactionDTParameters : DTParameters
    {
        public string SearchAll { get; set; } = "";
        public int? WarehouseId { get; set; }
    }
}