using CoffeeCRM.Data.Model;

namespace CoffeeCRM.Data.ViewModels
{
    public class DishOrderViewModel
    {
        public int Id { get; set; }
        public int TableId { get; set; }
        public int AccountId { get; set; }
        public string? OrdererName { get; set; }
        public string? TableName { get; set; }
        public string? Description { get; set; }
        public int DishOrderStatusId { get; set; }
        public string? DishOrderStatusName { get; set; }
        public DateTime CreatedTime { get; set; }
        public List<DishOrderDetailVM>? DishOrderDetails { get; set; }
    }
    public partial class DishOrderDetailVM
    {
        public int Id { get; set; }
        public int DishOrderId { get; set; }
        public int DishId { get; set; }
        public string? DishName { get; set; }
        public string? Note { get; set; }
        public int Quantity { get; set; }
        public bool Active { get; set; }
    }
}
