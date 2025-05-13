using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CoffeeCRM.Core.Repository.Interfaces;
using CoffeeCRM.Data.DTO;

namespace CoffeeCRM.Core.Service
{
    public class StatisticsService : IStatisticsService
    {
        private readonly IStatisticsRepository _repository;

        public StatisticsService(IStatisticsRepository repository)
        {
            _repository = repository;
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

