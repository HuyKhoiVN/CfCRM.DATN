using System;
using System.Collections.Generic;

namespace CoffeeCRM.Data.Model
{
    public partial class Attendance
    {
        public int Id { get; set; }
        public DateTime CheckInTime { get; set; }
        public DateTime CheckOutTime { get; set; }
        public DateTime CreatedTime { get; set; }
        public bool Active { get; set; }
        public int? AccountId { get; set; }
        public int? WorkHours { get; set; }

        public virtual Account? Account { get; set; }
    }
}
