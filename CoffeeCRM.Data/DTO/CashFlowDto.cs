using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CoffeeCRM.Data.DTO
{
    public class CashFlowDto
    {
        public decimal TotalMoney { get; set; }
        public string FlowType { get; set; }
        public DateTime CreatedTime { get; set; }
    }
}
