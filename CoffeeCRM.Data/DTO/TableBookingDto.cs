using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CoffeeCRM.Data.DTO
{
    public class TableBookingDto
    {
        public DateTime BookingTime { get; set; }
        public string TableName { get; set; }
        public string BookingStatus { get; set; }
        public DateTime CreatedTime { get; set; }
    }
}
