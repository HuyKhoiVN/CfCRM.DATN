using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CoffeeCRM.Data.DTO
{
    public class TableBookingDto
    {
        public int Id { get; set; }
        public DateTime BookingTime { get; set; }
        public DateTime? CheckinTime { get; set; }
        public string BookingStatus { get; set; } = null!;
        public decimal? Deposit { get; set; }
        public DateTime CreatedTime { get; set; }
        public bool Active { get; set; }
        public int AccountId { get; set; }
        public string? Orderer { get; set; }
        public int TableId { get; set; }
        public string? TableName { get; set; }
        public string? CustomerName { get; set; }
        public string? PhoneNumber { get; set; }
    }
}
