using CfCRM.Controllers.Core;
using CoffeeCRM.Core.Service;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
namespace CfCRM.Controllers.Admin
{
    [Route("admin")]
    [ApiController]
    public class AdminController : BaseController
    {
        public AdminController(
            ) : base()
        {
            
        }
        [Route("action/sign-in")]
        public IActionResult Login()
        {
            return View();
        }
        [Route("action/forgot-password")]
        public IActionResult ForgotPassword()
        {
            return View();
        }

        //[HttpGet("action/doi-mat-khau/{code}/{hash}")]
        //public async Task<IActionResult> ResetPasswordAdmin(string code, string hash)
        //{
        //    try
        //    {
        //        var tokenValid = await accountService.CheckKeyValid(code, hash);
        //        ViewBag.tokenValid = tokenValid;
        //        ViewBag.Value = code;
        //        ViewBag.Hash = hash;
        //        if (tokenValid)
        //        {
        //            return View("~/Views/Admin/ResetPasswordAdmin.cshtml");
        //        }
        //        else
        //        {
        //            return View();
        //        }
        //        return View();
        //    }
        //    catch (Exception ex)
        //    {
        //        return View();
        //    }
        //}

        [HttpGet]
        [Route("dashboard")]
        public async Task<IActionResult> DashBoard()
        {
            return View();
        }
        //[HttpGet]
        //[Route("")]
        //public async Task<IActionResult> Index()
        //{
        //    var roleId = this.GetLoggedInRoleId();
        //    if (roleId == SystemConstant.ROLE_SYSTEM_ADMIN)
        //    {
        //        return Redirect("account/admin/list-staff");
        //    }   
        //    else
        //    {
        //        return Redirect("notification/admin/list");
        //    }
        //}
        [HttpGet]
        [Route("user-profile")]
        public async Task<IActionResult> UserProfile()
        {
            ////Load data userprofile
            //var account = await accountService.GetProfile(this.GetLoggedInUserId());
            //ViewBag.Account = account != null ? account : null;
            //ViewBag.AccountJson = account != null ? JsonConvert.SerializeObject(account) : null;

            return View();
        }
    }
}
