using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CfCRM.View.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using CfCRM.Controllers.Core;
namespace CfCRM.View.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class WarehouseController : BaseController
    {

        [HttpGet]
        [Route("warehouse/List")]
        public async Task<IActionResult> List()
        {
            return View();
        }

        [HttpGet]
        [Route("admin/List")]
        public async Task<IActionResult> AdminListServerSide()
        {
            return View();
        }


    }
}
