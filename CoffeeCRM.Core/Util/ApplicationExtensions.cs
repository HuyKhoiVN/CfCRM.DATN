using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Hosting;

namespace CfCRM.View.Util
{
    public static class ApplicationExtensions
    {
        public static async void UseInfrastructure(this WebApplication app)
        {
            // Configure the HTTP request pipeline.
            if (!app.Environment.IsDevelopment())
            {
                app.Use(async (ctx, next) =>
                {
                    await next();
                    if (ctx.Response.StatusCode == 401 && !ctx.Response.HasStarted)
                    {
                        ctx.Response.Cookies.Delete("Authorization");
                        ctx.Response.Redirect("/admin/action/sign-in");
                    }
                });
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }
            else
            {
                app.Use(async (ctx, next) =>
                {
                    await next();
                    if (ctx.Response.StatusCode == 401 && !ctx.Response.HasStarted)
                    {
                        ctx.Response.Cookies.Delete("Authorization");
                        ctx.Response.Redirect("/admin/action/sign-in");
                    }
                });
            }

            //app.UseHttpsRedirection();
            app.UseStaticFiles();

            app.UseRouting();
            app.UseSession();

            app.UseCors("Default");
            app.UseAuthentication();
            app.UseAuthorization();

            app.MapControllerRoute(
                name: "default",
                pattern: "{controller=Home}/{action=Index}/{id?}"
                );
        }
    }
}
