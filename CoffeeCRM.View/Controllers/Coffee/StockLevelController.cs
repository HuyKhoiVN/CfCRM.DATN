

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CfCRM.Controllers.Core;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace CfCRM.View.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class StockLevelController : BaseController
    {
        [HttpGet]
        [Route("admin/List")]
        public async Task<IActionResult> AdminListServerSide()
        {
            return View();
        }
        
    }
}
