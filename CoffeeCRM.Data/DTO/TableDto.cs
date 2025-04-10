using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CoffeeCRM.Data.DTO
{
    public class TableDto
    {
        public int Id { get; set; }
        public string? TableCode { get; set; }
        public string TableName { get; set; } = null!;
        public string TableStatus { get; set; } = null!;
        public DateTime CreatedTime { get; set; }
        public int TotalBooking { get; set; }
        public int LastBookingTime { get; set; }
        public int TotalInvoice { get; set; }
        public decimal TotalRevenue { get; set; }
    }
}
