using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using CfCRM.Controllers.Core;
using System.Security.Principal;
using CfCRM.View.Models.ViewModels;
using System.Security.Cryptography.X509Certificates;

namespace CfCRM.View.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class AccountController : BaseController
    {
        public AccountController() : base()
        {
        }
        [HttpGet]
        [Route("admin/List")]
        public async Task<IActionResult> AdminListServerSide()
        {
            return View();
        }
        
        //[HttpPost]
        //[Route("api/upload-file")]
        //public async Task<IActionResult> UploadFile([FromForm(Name = "file")] IFormFile files)
        //{
        //    try
        //    {
        //        var response = await service.UploadFile(files);
        //        return Ok(response);

        //    }
        //    catch (Exception e)
        //    {
        //        return BadRequest(e);
        //    }
        //}
    }
}
