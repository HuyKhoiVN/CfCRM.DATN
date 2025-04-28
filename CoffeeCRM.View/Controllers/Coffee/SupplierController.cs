

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

using CfCRM.Controllers.Core;
using Newtonsoft.Json;

namespace CfCRM.View.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class SupplierController : BaseController
    {

        [HttpGet]
        [Route("admin/List")]
        public async Task<IActionResult> AdminListServerSide()
        {
            return View();
        }
        
    }
}
