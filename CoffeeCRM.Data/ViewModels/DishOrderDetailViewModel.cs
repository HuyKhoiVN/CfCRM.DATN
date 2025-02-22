namespace CoffeeCRM.Data.ViewModels
{
    public class DishOrderDetailViewModel
    {
        public int Id { get; set; }
        public int DishOrderId { get; set; }
        public int DishId { get; set; }
        public int Quantity { get; set; }
        public string DishName { get; set; } = null!;
        public decimal Price { get; set; }
        public string? Description { get; set; }
        public decimal TotalPrice { get; set; }
    }
}
