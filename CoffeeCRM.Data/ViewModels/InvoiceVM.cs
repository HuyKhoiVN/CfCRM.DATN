namespace CoffeeCRM.Data.ViewModels
{
    public class InvoiceVM
    {
        public int Id { get; set; }
        public string? InvoiceCode { get; set; }
        public decimal TotalMoney { get; set; }
        public string PaymentStatus { get; set; }
        public DateTime CreatedTime { get; set; }
        public string PaymentMethod { get; set; }
        public int AccountId { get; set; }
        public string? TableName { get; set; }
        public string CashierName { get; set; }
        public List<InvoiceDetailViewModel> invoiceDetails { get; set; }  
    }

}
