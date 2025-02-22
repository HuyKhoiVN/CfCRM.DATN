namespace CfCRM.View.Models.ViewModels
{
    public class StockLevelVM
    {
        public int Id { get; set; }
        public string? StockLevelCode { get; set; }
        public int Quantity { get; set; }
        public DateTime ExpirationDate { get; set; }
        public DateTime CreatedTime { get; set; }
        public bool Active { get; set; }
        public int IngredientId { get; set; }
        public int WarehouseId { get; set; }
        public string Note { get; set; }
        public string IngredientName { get; set; } 
    }
}
