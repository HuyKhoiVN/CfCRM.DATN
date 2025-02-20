using System;
using System.Collections.Generic;

namespace CoffeeCRM.Data.Model
{
    public partial class FinancialTarget
    {
        public int Id { get; set; }
        public decimal TargetRevenue { get; set; }
        public decimal? TargetProfit { get; set; }
        public string? Period { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public DateTime CreatedTime { get; set; }
        public bool? Active { get; set; }
    }
}
