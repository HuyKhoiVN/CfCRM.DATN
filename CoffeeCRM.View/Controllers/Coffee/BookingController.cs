using CfCRM.Controllers.Core;
using Microsoft.AspNetCore.Mvc;

namespace CfCRM.View.Controllers.Coffee
{
    [Route("[controller]")]
    [ApiController]
    public class BookingController : BaseController
    {
        public BookingController ()
        {
        }
        [HttpGet("admin/success")]
        public ActionResult Success()
        {
            return View();
        }
        [HttpGet]
        [Route("admin/TableBooking")]
        public async Task<IActionResult> TableBooking()
        {
            //List<Table> listTable = await tableService.List();
            return View();
        }

        [HttpGet]
        [Route("admin/TableList")]
        public async Task<IActionResult> TableList()
        {
            //List<Table> listTable = await tableService.List();
            return View();
        }
    }
}
