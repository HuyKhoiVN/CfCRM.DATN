using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using CfCRM.Controllers.Core;
using Microsoft.AspNetCore.Mvc;

namespace CfCRM.View.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class PurchaseOrderController : BaseController
    {
        [HttpGet]
        [Route("admin/List")]
        public async Task<IActionResult> AdminListServerSide()
        {
            return View();
        }
        
    }
}
