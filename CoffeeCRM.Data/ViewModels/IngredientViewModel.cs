
namespace CoffeeCRM.Data.ViewModels
{
    public class IngredientViewModel
    {
        public int Id { get; set; }
        public string? IngredientCode { get; set; }
        public string IngredientName { get; set; } = null!;
        public DateTime CreatedTime { get; set; }
        public bool Active { get; set; }
        public int IngredientCategoryId { get; set; }
        public string IngredientCategoryName { get; set; } = null!;
        public int SupplierId { get; set; }
        public string SupplierName { get; set; } = null!;
    }
}
