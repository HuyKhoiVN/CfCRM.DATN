using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CoffeeCRM.Data.DTO
{
    public class IngredientCategoryStatsRequest
    {
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public int? TopCategories { get; set; } = 5; // Mặc định lấy top 5 nhóm món
    }

    public class IngredientCategoryStatsResponse
    {
        public bool Success { get; set; }
        public string Message { get; set; }
        public IngredientCategoryStatsData Data { get; set; }
    }

    public class IngredientCategoryStatsData
    {
        public List<string> Labels { get; set; } = new List<string>();
        public List<int> Values { get; set; } = new List<int>();
        public List<string> Colors { get; set; } = new List<string>();
        public int Total { get; set; }
    }

    public class IngredientCategoryStat
    {
        public int IngredientCategoryId { get; set; }
        public string IngredientCategoryName { get; set; }
        public int Quantity { get; set; }
    }
}
