using System;
using System.Collections.Generic;

namespace CoffeeCRM.Data.Model
{
    public partial class TableBooking
    {
        public int Id { get; set; }
        public DateTime BookingTime { get; set; }
        public DateTime CheckinTime { get; set; }
        public string BookingStatus { get; set; } = null!;
        public decimal? Deposit { get; set; }
        public DateTime CreatedTime { get; set; }
        public bool Active { get; set; }
        public int AccountId { get; set; }
        public int TableId { get; set; }

        public virtual Account? Account { get; set; } = null!;
        public virtual Table? Table { get; set; } = null!;
    }
}
