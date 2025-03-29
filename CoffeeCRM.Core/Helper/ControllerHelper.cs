using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using CoffeeCRM.Data.Constants;
using Microsoft.AspNetCore.Http;


namespace CoffeeCRM.Core.Helper
{
    [AttributeUsage(AttributeTargets.Method | AttributeTargets.Class)]
    public class MultipartFormDataAttribute : ActionFilterAttribute
    {
        public override void OnActionExecuting(ActionExecutingContext context)
        {
            var request = context.HttpContext.Request;

            if (request.HasFormContentType && request.ContentType.StartsWith("multipart/form-data", StringComparison.OrdinalIgnoreCase))
            {
                return;
            }
            context.Result = new StatusCodeResult(StatusCodes.Status415UnsupportedMediaType);
        }
    }
    [AttributeUsage(AttributeTargets.Class | AttributeTargets.Method)]
    public class DisableFormValueModelBindingAttribute : Attribute, IResourceFilter
    {
        public void OnResourceExecuting(ResourceExecutingContext context)
        {
            var factories = context.ValueProviderFactories;
            factories.RemoveType<FormValueProviderFactory>();
            factories.RemoveType<FormFileValueProviderFactory>();
            factories.RemoveType<JQueryFormValueProviderFactory>();
        }

        public void OnResourceExecuted(ResourceExecutedContext context)
        {
        }
    }
    public static class ControllerHelper
    {
        /// <summary>
        /// Return logged in user info
        /// </summary>
        /// <param name="controller"></param>
        /// <param name="key"></param>
        /// <returns></returns>
        public static string GetLoggedInUserInfo(this ControllerBase controller, string key)
        {
            try
            {
                if (controller.HttpContext.User.Identity is ClaimsIdentity identity)
                {
                    return identity.FindFirst(key)?.Value;
                }

                return null;
            }
            catch (Exception)
            {
                return null;
            }
        }

        public static int GetLoggedInUserId(this ControllerBase controller)
        {
            return Convert.ToInt32(GetLoggedInUserInfo(controller, ClaimNames.ID));
        }
        public static int GetLoggedInRoleId(this ControllerBase controller)
        {
            return Convert.ToInt32(GetLoggedInUserInfo(controller, ClaimNames.ROLE_ID));
        }
    }
}
