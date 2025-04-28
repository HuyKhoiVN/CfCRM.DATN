using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CoffeeCRM.Data.DTO
{
    public class IngredientCategoryDto
    {
        public int Id { get; set; }
        public string? IngredientCategoryCode { get; set; }
        public string IngredientCategoryName { get; set; } = null!;
        public DateTime CreatedTime { get; set; } = DateTime.Now;
        public bool Active { get; set; } = true;
        public int? ParentCategory { get; set; }
        public List<IngredientCategoryDto>? Childs { get; set; } = new List<IngredientCategoryDto>();
    }
}
