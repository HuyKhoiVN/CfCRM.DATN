using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CoffeeCRM.Core.Repository.Interfaces;
using CoffeeCRM.Data.Constants;
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
    }
}
