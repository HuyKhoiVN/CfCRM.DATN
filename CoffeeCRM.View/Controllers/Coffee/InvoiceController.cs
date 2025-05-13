
using Microsoft.AspNetCore.Mvc;

using CfCRM.Controllers.Core;

using CfCRM.View.Models.ViewModels;
namespace CfCRM.View.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class InvoiceController : BaseController
    {

        [HttpGet]
        [Route("admin/List")]
        public async Task<IActionResult> AdminListServerSide()
        {
            return View();
        }
    }
}
