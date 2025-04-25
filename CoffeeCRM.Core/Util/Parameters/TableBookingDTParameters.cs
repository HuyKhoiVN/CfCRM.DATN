using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CoffeeCRM.Core.Util.Parameters
{
    public class TableBookingDTParameters : DTParameters
    {
        public int? TableId { get; set; }
        public string SearchAll { get; set; } = "";
    }
}