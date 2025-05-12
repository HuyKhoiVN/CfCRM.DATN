using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CoffeeCRM.Data.DTO
{
    public class SupplierDto
    {
        public int Id { get; set; }
        public string? SupplierCode { get; set; }
        public string ContactInfo { get; set; } = null!;
        public string SupplierName { get; set; } = null!;
        public string? Address { get; set; }
        public DateTime CreatedTime { get; set; }
        public bool Active { get; set; }
        public decimal TotalDebt { get; set; }
        public decimal PaidAmount { get; set; }
        public int UnpaidCount { get; set; }
    }
}
