using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CoffeeCRM.Data.DTO;

namespace CoffeeCRM.Core.Repository.Interfaces
{
    public interface IStatisticsRepository : IScoped
    {
        Task<decimal> GetTodayRevenueAsync();
        Task<decimal> GetYesterdayRevenueAsync();
        Task<int> GetTodayOrdersCountAsync();
        Task<int> GetYesterdayOrdersCountAsync();
        Task<int> GetActiveEmployeesCountAsync();
        Task<int> GetYesterdayEmployeesCountAsync();
        Task<int> GetLowStockItemsCountAsync();
        Task<int> GetTotalInventoryItemsCountAsync();
        Task<int> GetTodayBeveragesSoldCountAsync();
        Task<int> GetYesterdayBeveragesSoldCountAsync();
        Task<List<decimal>> GetRevenueByPeriodAsync(string period, DateTime startDate, DateTime endDate);
        Task<List<int>> GetOrderCountByPeriodAsync(string period, DateTime startDate, DateTime endDate);
        Task<List<string>> GetDateLabelsByPeriodAsync(string period, DateTime startDate, DateTime endDate);
        Task<List<IngredientCategoryStat>> GetIngredientCategoryStatsAsync(DateTime startDate, DateTime endDate, int topCategories);
    }
}
