using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace CoffeeCRM.Data.DTO
{
    public class AccountDto
    {
        public int Id { get; set; }
        public string AccountCode { get; set; }
        public string Username { get; set; }
        public string Password { get; set; } // Có thể ẩn khi trả về nếu không cần
        public string FullName { get; set; }
        public string Email { get; set; }
        public string Photo { get; set; }
        public IFormFile Image { get; set; }
        public DateTime DOB { get; set; }
        public string PhoneNumber { get; set; }
        public DateTime CreatedTime { get; set; }
        public bool Active { get; set; }
        public int RoleId { get; set; }
        public string RoleName { get; set; } // Từ bảng Role

        // Thông tin tổng quan cho danh sách nhân viên
        public DateTime LastLoginTime { get; set; } // Có thể lưu trong AccountActivity hoặc thêm vào Account
        public int TotalInvoices { get; set; } // Tính từ Invoice
        public int TotalStockTransactions { get; set; } // Tính từ StockTransaction
        public int TotalCheckInDays { get; set; } // Tính từ Attendance

        // Thông tin chi tiết hiệu suất
        public int? TotalWorkHours { get; set; } // Tính từ Attendance
        public decimal TotalRevenue { get; set; } // Tính từ Invoice
        public decimal TotalCashHandled { get; set; } // Tính từ CashFlow
        public int TotalBookings { get; set; } // Tính từ TableBooking
    }
}
