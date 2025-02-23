using System;
using System.Collections.Generic;

namespace CoffeeCRM.Data.Model
{
    public partial class AccountActivity
    {
        public int Id { get; set; }
        public string? ActivityCode { get; set; }
        public DateTime CreatedTime { get; set; }
        public bool Active { get; set; }
        public int? AccountId { get; set; }
        public string ActivityDescription { get; set; } = null!;
        public string ActivityType { get; set; } = null!;

        public virtual Account? Account { get; set; }
    }
}
