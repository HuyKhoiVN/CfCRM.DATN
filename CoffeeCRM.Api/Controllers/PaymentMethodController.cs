using CoffeeCRM.Data.Constants;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace CoffeeCRM.Api.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class PaymentMethodController : ControllerBase
    {
        [HttpGet]
        [Route("api/List")]
        public IActionResult List()
        {
            try
            {
                var paymentList = PaymentMethodConst.All
                .Select(p => new { paymentName = p })
                .ToList();


                var response = CoffeeManagementResponse.SUCCESS(paymentList);
                return Ok(response);
            }
            catch (Exception)
            {
                return BadRequest();
            }
        }

    }
}
