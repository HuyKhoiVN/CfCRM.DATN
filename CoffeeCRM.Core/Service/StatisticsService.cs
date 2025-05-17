using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CoffeeCRM.Core.Repository.Interfaces;
using CoffeeCRM.Data.DTO;
using Microsoft.Extensions.Caching.Memory;

namespace CoffeeCRM.Core.Service
{
    public class StatisticsService : IStatisticsService
    {
        private readonly IStatisticsRepository _repository;
        IMemoryCache _cache;

        public StatisticsService(IStatisticsRepository repository, IMemoryCache cache)
        {
            _repository = repository;
            _cache = cache;
        }

        public async Task<List<StatisticModel>> GetDashboardStatisticsAsync()
        {
            var statistics = new List<StatisticModel>();

            // Revenue statistic
            var todayRevenue = await _repository.GetTodayRevenueAsync();
            var yesterdayRevenue = await _repository.GetYesterdayRevenueAsync();
            var revenuePercentChange = CalculatePercentChange(todayRevenue, yesterdayRevenue);

            statistics.Add(new StatisticModel
            {
                Title = "Doanh thu hôm nay",
                Value = FormatCurrency(todayRevenue),
                TrendText = $"{Math.Abs(revenuePercentChange):F0}% so với hôm qua",
                IsPositiveTrend = revenuePercentChange > 0,
                IconClass = "fas fa-money-bill-wave",
                CardClass = "revenue"
            });

            // Orders statistic
            var todayOrders = await _repository.GetTodayOrdersCountAsync();
            var yesterdayOrders = await _repository.GetYesterdayOrdersCountAsync();
            var ordersPercentChange = CalculatePercentChange(todayOrders, yesterdayOrders);

            statistics.Add(new StatisticModel
            {
                Title = "Đơn hàng hôm nay",
                Value = todayOrders.ToString(),
                TrendText = $"{Math.Abs(ordersPercentChange):F0}% so với hôm qua",
                IsPositiveTrend = ordersPercentChange > 0,
                IconClass = "fas fa-utensils",
                CardClass = "orders"
            });

            // Employees statistic
            var activeEmployees = await _repository.GetActiveEmployeesCountAsync();
            var yesterdayEmployees = await _repository.GetYesterdayEmployeesCountAsync();
            var employeesPercentChange = CalculatePercentChange(activeEmployees, yesterdayEmployees);

            statistics.Add(new StatisticModel
            {
                Title = "Nhân viên",
                Value = activeEmployees.ToString(),
                TrendText = $"{Math.Abs(employeesPercentChange):F0}% so với tháng trước",
                IsPositiveTrend = employeesPercentChange > 0,
                IconClass = "fas fa-users",
                CardClass = "customers"
            });

            // Inventory statistic
            var lowStockItems = await _repository.GetLowStockItemsCountAsync();
            var totalInventory = await _repository.GetTotalInventoryItemsCountAsync();

            statistics.Add(new StatisticModel
            {
                Title = "Tồn kho",
                Value = totalInventory.ToString(),
                TrendText = $"{lowStockItems} mặt hàng sắp hết",
                IsPositiveTrend = false,
                IconClass = "fas fa-boxes",
                CardClass = "inventory"
            });

            // Beverages statistic
            var todayBeverages = await _repository.GetTodayBeveragesSoldCountAsync();
            var yesterdayBeverages = await _repository.GetYesterdayBeveragesSoldCountAsync();
            var beveragesPercentChange = CalculatePercentChange(todayBeverages, yesterdayBeverages);

            statistics.Add(new StatisticModel
            {
                Title = "Đồ uống bán ra",
                Value = todayBeverages.ToString(),
                TrendText = $"{Math.Abs(beveragesPercentChange):F0}% so với hôm qua",
                IsPositiveTrend = beveragesPercentChange > 0,
                IconClass = "bi bi-cup-hot-fill",
                CardClass = "bg-success"
            });

            return statistics;
        }

        public async Task<RevenueChartData> GetRevenueChartDataAsync(RevenueChartRequest request)
        {
            // Xác định ngày bắt đầu và kết thúc dựa trên period nếu không được cung cấp
            DateTime startDate = request.StartDate ?? DateTime.Today;
            DateTime endDate = request.EndDate ?? DateTime.Today;

            if (request.StartDate == null || request.EndDate == null)
            {
                switch (request.Period.ToLower())
                {
                    case "week":
                        // Lấy ngày đầu tuần (thứ 2)
                        int diff = (7 + (startDate.DayOfWeek - DayOfWeek.Monday)) % 7;
                        startDate = startDate.AddDays(-diff);
                        endDate = startDate.AddDays(6); // Chủ nhật
                        break;

                    case "month":
                        // Lấy 15 ngày gần nhất
                        startDate = DateTime.Today.AddDays(-14);
                        endDate = DateTime.Today;
                        break;

                    case "year":
                        // Lấy cả năm hiện tại
                        startDate = new DateTime(DateTime.Today.Year, 1, 1);
                        endDate = new DateTime(DateTime.Today.Year, 12, 31);
                        break;
                }
            }

            // Lấy dữ liệu từ repository
            var labels = await _repository.GetDateLabelsByPeriodAsync(request.Period, startDate, endDate);
            var revenue = await _repository.GetRevenueByPeriodAsync(request.Period, startDate, endDate);
            var orders = await _repository.GetOrderCountByPeriodAsync(request.Period, startDate, endDate);

            return new RevenueChartData
            {
                Labels = labels,
                Revenue = revenue,
                Orders = orders
            };
        }

        public async Task<IngredientCategoryStatsData> GetIngredientCategoryStatsAsync(IngredientCategoryStatsRequest request)
        {
            // Tạo cache key dựa trên tham số
            string cacheKey = $"IngredientCategoryStats_{request.StartDate}_{request.EndDate}_{request.TopCategories}";

            // Kiểm tra cache
            if (_cache.TryGetValue(cacheKey, out IngredientCategoryStatsData cachedData))
            {
                return cachedData;
            }

            try
            {
                // Xác định ngày bắt đầu và kết thúc
                DateTime startDate = request.StartDate ?? DateTime.Today.AddDays(-30); // Mặc định 30 ngày gần nhất
                DateTime endDate = request.EndDate ?? DateTime.Today;
                int topCategories = request.TopCategories ?? 5; // Mặc định lấy top 5

                // Lấy dữ liệu từ repository
                var categoryStats = await _repository.GetIngredientCategoryStatsAsync(startDate, endDate, topCategories);

                // Tạo danh sách màu sắc cho biểu đồ
                var colors = new List<string> {
                    "#4361ee", "#f72585", "#4cc9f0", "#3a0ca3", "#7209b7",
                    "#560bad", "#480ca8", "#3f37c9", "#4895ef", "#4cc9f0"
                };

                // Tính tổng số lượng
                int total = categoryStats.Sum(stat => stat.Quantity);

                // Tạo dữ liệu trả về
                var result = new IngredientCategoryStatsData
                {
                    Labels = categoryStats.Select(stat => stat.IngredientCategoryName).ToList(),
                    Values = categoryStats.Select(stat => stat.Quantity).ToList(),
                    Colors = colors.Take(categoryStats.Count).ToList(),
                    Total = total
                };

                // Lưu vào cache trong 10 phút
                var cacheOptions = new MemoryCacheEntryOptions()
                    .SetAbsoluteExpiration(TimeSpan.FromMinutes(10));

                _cache.Set(cacheKey, result, cacheOptions);

                return result;
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        private decimal CalculatePercentChange(decimal current, decimal previous)
        {
            if (previous == 0)
                return 100; // Avoid division by zero

            return ((current - previous) / previous) * 100;
        }

        private string FormatCurrency(decimal amount)
        {
            // Format as Vietnamese currency
            return string.Format(new CultureInfo("vi-VN"), "{0:N0} ₫", amount);
        }
    }
}

