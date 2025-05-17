using CoffeeCRM.Core.Service;
using CoffeeCRM.Data.Constants;
using CoffeeCRM.Data.DTO;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace CoffeeCRM.Api.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class StatisticsController : ControllerBase
    {
        private readonly IStatisticsService _statisticsService;

        public StatisticsController(IStatisticsService statisticsService)
        {
            _statisticsService = statisticsService;
        }

        [HttpGet("api/dashboard")]
        public async Task<IActionResult> GetDashboardStatistics()
        {
            try
            {
                var statistics = await _statisticsService.GetDashboardStatisticsAsync();
                var res = CoffeeManagementResponse.SUCCESS(statistics.Cast<object>().ToList());
                return Ok(res);
            }
            catch (Exception ex)
            {
                var res = CoffeeManagementResponse.BAD_REQUEST(ex.Message);
                return BadRequest(res);
            }
        }

        [HttpGet("api/revenue")]
        public async Task<ActionResult<RevenueChartResponse>> GetRevenueChartData(
            [FromQuery] string period = "week",
            [FromQuery] DateTime? startDate = null,
            [FromQuery] DateTime? endDate = null)
        {
            try
            {
                var request = new RevenueChartRequest
                {
                    Period = period,
                    StartDate = startDate,
                    EndDate = endDate
                };

                var chartData = await _statisticsService.GetRevenueChartDataAsync(request);
                var res = CoffeeManagementResponse.SUCCESS(chartData);

                return Ok(res);
            }
            catch (Exception ex)
            {
                var res = CoffeeManagementResponse.BAD_REQUEST(ex.Message);
                return BadRequest(res);
            }
        }

        [HttpGet("api/ingredient-categories")]
        public async Task<ActionResult<IngredientCategoryStatsResponse>> GetIngredientCategoryStats(
            [FromQuery] DateTime? startDate = null,
            [FromQuery] DateTime? endDate = null,
            [FromQuery] int? topCategories = 5)
        {
            try
            {
                var request = new IngredientCategoryStatsRequest
                {
                    StartDate = startDate,
                    EndDate = endDate,
                    TopCategories = topCategories
                };

                var chartData = await _statisticsService.GetIngredientCategoryStatsAsync(request);
                var res = CoffeeManagementResponse.SUCCESS(chartData);

                return Ok(res);
            }
            catch (Exception ex)
            {
                var res = CoffeeManagementResponse.BAD_REQUEST(ex.Message);
                return BadRequest(res);
            }
        }
    }
}
