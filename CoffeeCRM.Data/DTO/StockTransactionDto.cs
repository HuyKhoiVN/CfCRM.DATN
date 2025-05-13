using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CoffeeCRM.Data.Constants;
using Npgsql.Replication.PgOutput;

namespace CoffeeCRM.Data.DTO
{
    public class StockTransactionDto
    {
        public int Id { get; set; }
        public string? StockTransactionCode { get; set; }
        public string TransactionType { get; set; }
        public decimal TotalMoney { get; set; }
        public DateTime CreatedTime { get; set; }
    }

    public class StockTransactionImportDto
    {
        public int Id { get; set; }
        public string? StockTransactionCode { get; set; }
        public string? Note { get; set; }
        public string TransactionType { get; set; } = null!;
        public decimal TotalMoney { get; set; }
        public string Status { get; set; } = null!;
        public DateTime CreatedTime { get; set; }
        public bool Active { get; set; }
        public int WarehouseId { get; set; }
        public int AccountId { get; set; }
        public string? AccountName { get; set; }
        public DateTime TransactionDate { get; set; }
        public List<StockTransactionDetailImportDto> Details { get; set; } = new List<StockTransactionDetailImportDto>();
    }

    public partial class StockTransactionDetailImportDto
    {
        public int Id { get; set; }
        public int? StockLevelId { get; set; }
        public int IngredientId { get; set; }
        public string? IngredientName { get; set; }
        public int StockTransactionId { get; set; }
        public int Quantity { get; set; }
        public bool CreateNewBatch { get; set; }
        public decimal UnitPrice { get; set; }
        public DateTime ExpirationDate { get; set; }
        public DateTime CreatedTime { get; set; }
        public string? Note { get; set; }
        public bool Active { get; set; }
    }

    // new view model
    public class TransactionDetailViewModel
    {
        public int Id { get; set; }
        public string TransactionCode { get; set; }
        public string TransactionType { get; set; }
        public string Status { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime TransactionDate { get; set; }
        public decimal TotalMoney { get; set; }
        public string Note { get; set; }
        public string WarehouseName { get; set; }
        public string CreatedBy { get; set; }
        public List<TransactionDetailItemViewModel> Details { get; set; }

        public string StatusText => GetStatusText(Status);
        public string TransactionTypeText => GetTransactionTypeText(TransactionType);
        public bool CanApprove => Status == TransactionStatusConst.PENDING;
        public bool CanCancel => Status == TransactionStatusConst.DRAFT || Status == TransactionStatusConst.PENDING;
        public bool CanEdit => Status == TransactionStatusConst.DRAFT;

        private string GetStatusText(string status)
        {
            switch (status)
            {
                case TransactionStatusConst.DRAFT: return "Nháp";
                case TransactionStatusConst.PENDING: return "Chờ duyệt";
                case TransactionStatusConst.COMPLETED: return "Hoàn thành";
                case TransactionStatusConst.CANCELED: return "Đã hủy";
                default: return status;
            }
        }

        private string GetTransactionTypeText(string type)
        {
            switch (type)
            {
                case TransactionTypeConst.IMPORT: return "Nhập kho";
                case TransactionTypeConst.EXPORT: return "Xuất kho";
                case TransactionTypeConst.INVENTORY: return "Kiểm kê";
                default: return type;
            }
        }
    }

    public class TransactionDetailItemViewModel
    {
        public int Id { get; set; }
        public int IngredientId { get; set; }
        public string IngredientName { get; set; }
        public string IngredientCode { get; set; }
        public int? StockLevelId { get; set; }
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal TotalPrice { get; set; }
        public DateTime ExpirationDate { get; set; }
        public string Unit { get; set; }
        public bool CreateNewBatch { get; set; }
        public string Note { get; set; }

        // Các trường bổ sung
        public int CurrentStock { get; set; }
        public bool StockWarning { get; set; }
        public string WarningMessage { get; set; }
        public int ExpectedQuantity { get; set; }
        public int Discrepancy { get; set; }
    }

    public class StatusHistoryItem
    {
        public string Status { get; set; }
        public DateTime Date { get; set; }
        public int UserId { get; set; }
        public string Reason { get; set; }
    }

    public class UpdateStatusVM
    {
        public int transactionId { get; set; }
        public string newStatus { get; set; }
        public int userId { get; set; }
        public string? note { get; set; }
    }

    public class CancelTransactionVM
    {
        public int transactionId { get; set; }
        public string cancelReason { get; set; }
        public int canceledBy { get; set; }
    }
}

