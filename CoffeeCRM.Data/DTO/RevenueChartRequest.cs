using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CoffeeCRM.Data.DTO
{
    public class RevenueChartRequest
    {
        public string Period { get; set; } = "week"; // week, month, year
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
    }

    public class RevenueChartResponse
    {
        public bool Success { get; set; }
        public string Message { get; set; }
        public RevenueChartData Data { get; set; }
    }

    public class RevenueChartData
    {
        public List<string> Labels { get; set; }
        public List<decimal> Revenue { get; set; }
        public List<int> Orders { get; set; }
    }
}
