using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CoffeeCRM.Core.Repository.Interfaces;
using CoffeeCRM.Data.Constants;
using CoffeeCRM.Data.DTO;
using CoffeeCRM.Data.Model;
using Microsoft.EntityFrameworkCore;

namespace CoffeeCRM.Core.Repository
{
    public class StatisticsRepository : IStatisticsRepository
    {
        SysDbContext db;
        
        public StatisticsRepository(SysDbContext _db)
        {
            db = _db;
        }

        public async Task<decimal> GetTodayRevenueAsync()
        {
            var today = DateTime.Today;
            return await db.Invoices
                .Where(o => o.CreatedTime.Date == today && o.PaymentStatus == PaymentStatusStringConst.PAID)
                .SumAsync(o => o.TotalMoney);
        }

        public async Task<decimal> GetYesterdayRevenueAsync()
        {
            var yesterday = DateTime.Today.AddDays(-1);
            return await db.Invoices
                .Where(o => o.CreatedTime.Date == yesterday && o.PaymentStatus == PaymentStatusStringConst.PAID)
                .SumAsync(o => o.TotalMoney);
        }

        public async Task<int> GetTodayOrdersCountAsync()
        {
            var today = DateTime.Today;
            return await db.Invoices
                .CountAsync(o => o.CreatedTime.Date == today);
        }

        public async Task<int> GetYesterdayOrdersCountAsync()
        {
            var yesterday = DateTime.Today.AddDays(-1);
            return await db.Invoices
                .CountAsync(o => o.CreatedTime.Date == yesterday);
        }

        public async Task<int> GetActiveEmployeesCountAsync()
        {
            return await db.Accounts
                .CountAsync(e => e.Active);
        }

        public async Task<int> GetYesterdayEmployeesCountAsync()
        {
            // This is a simplified example - in a real app you might track employee count history
            // For this example, we'll assume 12% growth means yesterday had fewer employees
            var currentCount = await GetActiveEmployeesCountAsync();
            return (int)(currentCount / 1.12m); // Reverse calculate from 12% growth
        }

        public async Task<int> GetLowStockItemsCountAsync()
        {
            return await db.StockLevels
                    .GroupBy(sl => sl.IngredientId)
                    .Where(g => g.Sum(sl => sl.Quantity) < 3)
                    .CountAsync();
        }

        public async Task<int> GetTotalInventoryItemsCountAsync()
        {
            return await db.StockLevels.SumAsync(sl => sl.Quantity);
        }

        public async Task<int> GetTodayBeveragesSoldCountAsync()
        {
            var today = DateTime.Today;
            var tomorrow = today.AddDays(1);

            var totalToday = await (from x in db.DishOrderDetails
                              where x.Active
                                    && x.CreatedTime >= today
                                    && x.CreatedTime < tomorrow
                              select x.DishId).CountAsync();
            return totalToday;
        }

        public async Task<int> GetYesterdayBeveragesSoldCountAsync()
        {
            var yesterday = DateTime.Today.AddDays(-1);
            var today = DateTime.Today;

            var totalYesterday = await (from x in db.DishOrderDetails
                                  where x.Active
                                        && x.CreatedTime >= yesterday
                                        && x.CreatedTime < today
                                  select x.DishId).CountAsync();
            return totalYesterday;
        }

        // Phương thức mới cho biểu đồ doanh thu
        public async Task<List<decimal>> GetRevenueByPeriodAsync(string period, DateTime startDate, DateTime endDate)
        {
            // Trong môi trường thực tế, bạn sẽ truy vấn dữ liệu từ cơ sở dữ liệu
            // Ở đây, chúng ta sẽ tạo dữ liệu mẫu dựa trên period

            switch (period.ToLower())
            {
                case "week":
                    // Doanh thu theo ngày trong tuần
                    var weeklyRevenue = new List<decimal>();
                    for (int i = 0; i < 7; i++)
                    {
                        var date = startDate.AddDays(i);
                        var revenue = await db.Invoices
                            .Where(o => o.CreatedTime.Date == date.Date)
                            .SumAsync(o => o.TotalMoney);
                        weeklyRevenue.Add(revenue);
                    }
                    return weeklyRevenue;

                case "month":
                    // Doanh thu theo ngày trong tháng
                    var monthlyRevenue = new List<decimal>();
                    int days = (int)(endDate - startDate).TotalDays + 1;
                    for (int i = 0; i < days; i++)
                    {
                        var date = startDate.AddDays(i);
                        var revenue = await db.Invoices
                            .Where(o => o.CreatedTime.Date == date.Date)
                            .SumAsync(o => o.TotalMoney);
                        monthlyRevenue.Add(revenue);
                    }
                    return monthlyRevenue;

                case "year":
                    // Doanh thu theo tháng trong năm
                    var yearlyRevenue = new List<decimal>();
                    for (int i = 1; i <= 12; i++)
                    {
                        var monthStart = new DateTime(startDate.Year, i, 1);
                        var monthEnd = monthStart.AddMonths(1).AddDays(-1);
                        var revenue = await db.Invoices
                            .Where(o => o.CreatedTime.Date >= monthStart && o.CreatedTime.Date <= monthEnd)
                            .SumAsync(o => o.TotalMoney);
                        yearlyRevenue.Add(revenue);
                    }
                    return yearlyRevenue;

                default:
                    return new List<decimal> { 0 };
            }
        }

        public async Task<List<int>> GetOrderCountByPeriodAsync(string period, DateTime startDate, DateTime endDate)
        {
            // Tương tự như doanh thu, nhưng đếm số lượng đơn hàng
            switch (period.ToLower())
            {
                case "week":
                    // Số đơn hàng theo ngày trong tuần
                    var weeklyOrders = new List<int>();
                    for (int i = 0; i < 7; i++)
                    {
                        var date = startDate.AddDays(i);
                        var orders = await db.Invoices
                            .CountAsync(o => o.CreatedTime.Date == date.Date);
                        weeklyOrders.Add(orders);
                    }
                    return weeklyOrders;

                case "month":
                    // Số đơn hàng theo ngày trong tháng
                    var monthlyOrders = new List<int>();
                    int days = (int)(endDate - startDate).TotalDays + 1;
                    for (int i = 0; i < days; i++)
                    {
                        var date = startDate.AddDays(i);
                        var orders = await db.Invoices
                            .CountAsync(o => o.CreatedTime.Date == date.Date);
                        monthlyOrders.Add(orders);
                    }
                    return monthlyOrders;

                case "year":
                    // Số đơn hàng theo tháng trong năm
                    var yearlyOrders = new List<int>();
                    for (int i = 1; i <= 12; i++)
                    {
                        var monthStart = new DateTime(startDate.Year, i, 1);
                        var monthEnd = monthStart.AddMonths(1).AddDays(-1);
                        var orders = await db.Invoices
                            .CountAsync(o => o.CreatedTime.Date >= monthStart && o.CreatedTime.Date <= monthEnd);
                        yearlyOrders.Add(orders);
                    }
                    return yearlyOrders;

                default:
                    return new List<int> { 0 };
            }
        }

        public async Task<List<string>> GetDateLabelsByPeriodAsync(string period, DateTime startDate, DateTime endDate)
        {
            // Tạo nhãn cho trục x dựa trên period
            var labels = new List<string>();

            switch (period.ToLower())
            {
                case "week":
                    // Nhãn cho các ngày trong tuần (T2, T3, T4, T5, T6, T7, CN)
                    string[] weekDays = { "T2", "T3", "T4", "T5", "T6", "T7", "CN" };
                    for (int i = 0; i < 7; i++)
                    {
                        labels.Add(weekDays[i]);
                    }
                    break;

                case "month":
                    // Nhãn cho các ngày trong tháng (dd/MM)
                    int days = (int)(endDate - startDate).TotalDays + 1;
                    for (int i = 0; i < days; i++)
                    {
                        var date = startDate.AddDays(i);
                        labels.Add(date.ToString("dd/MM"));
                    }
                    break;

                case "year":
                    // Nhãn cho các tháng trong năm (T1, T2, ..., T12)
                    for (int i = 1; i <= 12; i++)
                    {
                        labels.Add($"T{i}");
                    }
                    break;

                default:
                    labels.Add("Unknown");
                    break;
            }

            return await Task.FromResult(labels);
        }

        public async Task<List<IngredientCategoryStat>> GetIngredientCategoryStatsAsync(DateTime startDate, DateTime endDate, int topCategories)
        {
            // Lấy tổng số lượng món bán ra theo từng nhóm món trong khoảng thời gian
            var categoryStats = await (
                                from id in db.InvoiceDetails
                                join inv in db.Invoices on id.InvoiceId equals inv.Id
                                join ing in db.Dishes on id.DishId equals ing.Id
                                join cat in db.DishCategories on ing.DishCategoryId equals cat.Id
                                where inv.CreatedTime >= startDate && inv.CreatedTime <= endDate
                                group new { id, cat } by new { cat.Id, cat.DishCateogryName } into g
                                orderby g.Sum(x => x.id.Quantity) descending
                                select new IngredientCategoryStat
                                {
                                    IngredientCategoryId = g.Key.Id,
                                    IngredientCategoryName = g.Key.DishCateogryName,
                                    Quantity = g.Sum(x => x.id.Quantity)
                                }
                            )
                            .Take(topCategories)
                            .ToListAsync();


            return categoryStats;
        }
    }
}
