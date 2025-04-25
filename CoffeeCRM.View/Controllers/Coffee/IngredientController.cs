using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using CfCRM.Controllers.Core;

namespace CfCRM.View.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class IngredientController : BaseController
    {
        [HttpGet]
        [Route("admin/List")]
        public IActionResult AdminListServerSide()
        {
            return View();
        }
        
    }
}
