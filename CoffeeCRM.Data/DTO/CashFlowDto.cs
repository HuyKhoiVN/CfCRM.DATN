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

    public class CashFlowBaseDto
    {
        public int Id { get; set; }
        public decimal TotalMoney { get; set; }
        public string FlowType { get; set; } = null!;
        public string Note { get; set; } = null!;
        public DateTime CreatedTime { get; set; }
        public bool Active { get; set; }
        public int AccountId { get; set; }
        public string AccountName { get; set; } = null!;
    }
}
