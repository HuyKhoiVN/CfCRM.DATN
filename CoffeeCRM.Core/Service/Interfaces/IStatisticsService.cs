using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CoffeeCRM.Data.DTO;

namespace CoffeeCRM.Core.Service
{
    public interface IStatisticsService : IScoped
    {
        Task<List<StatisticModel>> GetDashboardStatisticsAsync();
        Task<RevenueChartData> GetRevenueChartDataAsync(RevenueChartRequest request);
        Task<IngredientCategoryStatsData> GetIngredientCategoryStatsAsync(IngredientCategoryStatsRequest request);
    }
}
