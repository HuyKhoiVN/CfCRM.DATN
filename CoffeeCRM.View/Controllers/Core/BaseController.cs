using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Globalization;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.AccessControl;
using System.Security.Claims;
using CoffeeCRM.Core.Util;
using CoffeeCRM.Core.Service;
using Microsoft.AspNetCore.Http;
using System.Net.Http.Headers;
using System.Net.Http;
using CoffeeCRM.Data.Constants;
using CoffeeCRM.Data.Model;

namespace CfCRM.Controllers.Core
{
    public class BaseController : Controller
    {

        public static string SystemURL = "";
        private static readonly HttpClient _httpClient = new HttpClient();

        public BaseController()
        {
            
        }

        public override async Task OnActionExecutionAsync(ActionExecutingContext filterContext, ActionExecutionDelegate next)
        {
            string ServerURL = $"{this.Request.Scheme}://{this.Request.Host}{this.Request.PathBase}" + "/";
            SystemURL = ServerURL;
            ViewBag.SystemURL = ServerURL;
            string RequestedURL = filterContext.HttpContext.Request.Path.ToString().ToLower();
            bool IsValidRequest = true;
            var accountId = HttpContext.Request.Cookies["UserId"];
            var roleId = HttpContext.Request.Cookies["RoleId"];
            if (!RequestedURL.Contains("api") && !RequestedURL.Contains("sign-in"))
            {
                if (accountId == null)
                {
                    filterContext.Result = RedirectToAction("login", "admin");
                }
                else
                {
                    var token = HttpContext.Request.Cookies["Authorization"];
                    if (string.IsNullOrEmpty(token))
                    {
                        filterContext.Result = new RedirectToActionResult("login", "admin", null);
                        return;
                    }

                    _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
                    var response = await _httpClient.GetAsync(SystemConstant.API_URL + $"Account/api/detail/{accountId}");

                    if (!response.IsSuccessStatusCode)
                    {
                        filterContext.Result = new RedirectToActionResult("login", "admin", null);
                        return;
                    }

                    // Đọc dữ liệu JSON trả về
                    var responseBody = await response.Content.ReadAsStringAsync();
                    var apiResponse = JsonConvert.DeserializeObject<CoffeeManagementResponse>(responseBody);

                    if (apiResponse?.data == null || apiResponse.data.Count == 0)
                    {
                        filterContext.Result = new RedirectToActionResult("login", "admin", null);
                        return;
                    }

                    var accountJson = JsonConvert.SerializeObject(apiResponse.data[0]);
                    Account account = JsonConvert.DeserializeObject<Account>(accountJson);


                    ViewBag.RoleId = account.RoleId;
                    ViewBag.AccountId = account.Id;
                }
            }
            
            SystemConstant.DEFAULT_URL = ServerURL;
            ViewBag.ServerURL = ServerURL;
            
            await base.OnActionExecutionAsync(filterContext, next);

        }
    }
}
