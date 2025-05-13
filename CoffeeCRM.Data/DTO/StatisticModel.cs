using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CoffeeCRM.Data.DTO
{
    public class StatisticModel
    {
        public string Title { get; set; }
        public string Value { get; set; }
        public string TrendText { get; set; }
        public bool IsPositiveTrend { get; set; }
        public string IconClass { get; set; }
        public string CardClass { get; set; }
    }
}
