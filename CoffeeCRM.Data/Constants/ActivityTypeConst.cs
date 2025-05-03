using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CoffeeCRM.Data.Constants
{
    public static class ActivityTypeConst
    {
        public const string PURCHASE_ORDER = "purchase_order";

        public const string OTHER = "other";
        public static List<string> GetAllActivityTypes()
        {
            return new List<string>
            {
                PURCHASE_ORDER,
                OTHER
            };
        }
    }
}
