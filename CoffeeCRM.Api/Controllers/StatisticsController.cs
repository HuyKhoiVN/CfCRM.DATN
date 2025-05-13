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
    }
}
