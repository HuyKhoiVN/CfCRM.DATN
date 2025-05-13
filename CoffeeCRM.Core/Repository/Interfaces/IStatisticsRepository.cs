using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

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
    }
}
