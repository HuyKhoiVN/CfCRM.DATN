using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CoffeeCRM.Data.DTO
{
    public class DebtDto
    {
        public int Id { get; set; }
        public string? DebtCode { get; set; }
        public string DebtName { get; set; } = null!;
        public decimal TotalMoney { get; set; }
        public bool IsPaId { get; set; }
        public DateTime? PaIdAt { get; set; }
        public string? Note { get; set; }
        public DateTime CreatedTime { get; set; }
        public bool Active { get; set; }
        public int SupplierId { get; set; }
        public decimal TotalDebt { get; set; }
        public decimal PaidAmount { get; set; }
        public int UnpaidCount { get; set; }
    }
}
