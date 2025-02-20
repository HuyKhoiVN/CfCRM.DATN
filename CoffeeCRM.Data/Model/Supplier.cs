using System;
using System.Collections.Generic;

namespace CoffeeCRM.Data.Model
{
    public partial class Supplier
    {
        public Supplier()
        {
            Debts = new HashSet<Debt>();
            Ingredients = new HashSet<Ingredient>();
        }

        public int Id { get; set; }
        public string? SupplierCode { get; set; }
        public string ContactInfo { get; set; } = null!;
        public string SupplierName { get; set; } = null!;
        public string? Address { get; set; }
        public DateTime CreatedTime { get; set; }
        public bool? Active { get; set; }

        public virtual ICollection<Debt> Debts { get; set; }
        public virtual ICollection<Ingredient> Ingredients { get; set; }
    }
}
