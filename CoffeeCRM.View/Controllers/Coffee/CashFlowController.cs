using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using CfCRM.Controllers.Core;

namespace CfCRM.View.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class CashFlowController : BaseController
    {

        [HttpGet]
        [Route("admin/List")]
        public async Task<IActionResult> AdminListServerSide()
        {
            return View();
        }

    }
}
