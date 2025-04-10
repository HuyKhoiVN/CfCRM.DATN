using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CoffeeCRM.Data.Constants
{
    public static class TableConst
    {
        public static string AVAILABLE = "available";
        public static string OCCUPIED = "occupied";
        public static string BOOKED = "booked";
    }

    public static class TableBookingConst
    {
        public const string CONFIRMED = "confirmed";
        public const string CANCELLED = "cancelled";
        public const string COMPLETED = "completed";
        // Đặt bàn đã hết hạn, khách chưa đến và quá thời gian
        public const string EXPIRED = "expired";
    }

}
