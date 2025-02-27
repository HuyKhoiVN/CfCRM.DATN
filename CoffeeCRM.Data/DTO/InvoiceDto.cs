using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CoffeeCRM.Data.DTO
{
    public class InvoiceDto
    {
        public string InvoiceCode { get; set; }
        public decimal TotalMoney { get; set; }
        public DateTime CreatedTime { get; set; }
    }
}
