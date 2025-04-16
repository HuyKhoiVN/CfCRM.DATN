using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace CoffeeCRM.Data.DTO
{
    public class AccountCreateDto
    {
        public int Id { get; set; }
        public string AccountCode { get; set; }
        public string Username { get; set; }
        public string? Password { get; set; } = null;
        public string FullName { get; set; }
        public string? Email { get; set; } = null;
        public string? Photo { get; set; } = null;
        public IFormFile? Image { get; set; } = null;
        public DateTime DOB { get; set; }
        public string? PhoneNumber { get; set; } = null;
        public int RoleId { get; set; }
    }
}
