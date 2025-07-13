using CoffeeCRM.Data.Model;

namespace CoffeeCRM.Data.ViewModels
{
    public class InvoiceViewModel
    {
        public int Id { get; set; }
        public string? InvoiceCode { get; set; }
        public decimal TotalMoney { get; set; }
        public string PaymentStatus { get; set; }
        public DateTime CreatedTime { get; set; }
        public bool Active { get; set; }
        public int PaymentMethodId { get; set; }
        public string  PaymentMethod { get; set; }
        public int AccountId { get; set; }
        public int TableId { get; set; }
        public string? TableName { get; set; }
        public string? OrdererName { get; set; }
        public string? UriVnPay { get; set; }
        public List<InvoiceDetail>? InvoiceDetails { get; set; }
    }
}
