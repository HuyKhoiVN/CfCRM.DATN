using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CfNCKH.Data.ModelDTO
{
    public class AccountDto
    {
        public int Id { get; set; }
        public string? AccountCode { get; set; }
        public string Username { get; set; } = null!;
        public string Password { get; set; } = null!;
        public string FullName { get; set; } = null!;
        public string? Email { get; set; }
        public string? Photo { get; set; }
        public DateTime? Dob { get; set; }
        public string? PhoneNumber { get; set; }
        public DateTime? CreatedTime { get; set; }
        public bool? Active { get; set; }
        public int? RoleId { get; set; }
        public string RoleName { get; set; }
    }
}
