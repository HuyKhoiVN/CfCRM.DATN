using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using CfCRM.Controllers.Core;
using CfCRM.View.Models.ViewModels;
namespace CfCRM.View.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class DishController : BaseController
    {

        [HttpGet]
        [Route("admin/List")]
        public async Task<IActionResult> AdminListServerSide()
        {
            return View();
        }
        [HttpGet]
        [Route("admin/ListById")]
        public async Task<IActionResult> DishList(int id)
        {
            return View();
        }
    }
}
