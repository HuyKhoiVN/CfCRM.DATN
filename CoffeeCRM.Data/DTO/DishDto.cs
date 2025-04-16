using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace CoffeeCRM.Data.DTO
{
    public class DishDto
    {
        public int Id { get; set; }
        public string? DishCode { get; set; }
        public string DishName { get; set; } = null!;
        public decimal Price { get; set; }
        public string? Photo { get; set; } = null!;
        public IFormFile? Image { get; set; }
        public int DishCategoryId { get; set; }
        public string? DishCategoryName { get; set; } = null!;
    }
}
