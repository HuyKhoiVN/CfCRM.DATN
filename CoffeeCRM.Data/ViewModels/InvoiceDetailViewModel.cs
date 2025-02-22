namespace CoffeeCRM.Data.ViewModels
{
    public class InvoiceDetailViewModel
    {
        public int Id { get; set; }
        public string? InvoiceDetailCode { get; set; }
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public DateTime CreatedTime { get; set; }
        public decimal? TotalMoney { get; set; }
        public string DishName { get; set; } = null!;
        public int? InvoiceId { get; set; }
        public int DishId { get; set; }
    }
}
