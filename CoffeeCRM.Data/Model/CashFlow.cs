using System;
using System.Collections.Generic;

namespace CoffeeCRM.Data.Model
{
    public partial class CashFlow
    {
        public int Id { get; set; }
        public decimal TotalMoney { get; set; }
        public string FlowType { get; set; } = null!;
        public string Note { get; set; } = null!;
        public DateTime CreatedTime { get; set; }
        public bool Active { get; set; }
        public int AccountId { get; set; }

        public virtual Account Account { get; set; } = null!;
    }
}
