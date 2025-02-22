namespace CoffeeCRM.Data.ViewModels
{
    public class DishViewModel
    {
        public int Id { get; set; }
        public string DishCode { get; set; } = null!;
        public string DishName { get; set; } = null!;
        public decimal Price { get; set; }
        public string? Photo { get; set; }
        public DateTime CreatedTime { get; set; }
        public bool Active { get; set; }
        public int DishCategoryId { get; set; }
        public string? DishCateogryName { get; set; }
    }
}
