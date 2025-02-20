using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Nancy.Helpers;
using Quartz;
using System.Reflection;
using System.Text;

namespace CoffeeCRM.Core.Util
{
    public static class ServiceExtensions
    {
        private static readonly HttpClient httpClient;
        public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
        {
            // Add services to the container.
            services.AddControllersWithViews().AddNewtonsoftJson().AddJsonOptions(options =>
            {
                options.JsonSerializerOptions.Converters.Add(new DateTimeConverter());
            }).AddNewtonsoftJson(options => options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore);
            // Đoạn mã này dùng để cấu hình JSON serialization cho ứng dụng. Cụ thể:
            //AddControllersWithViews(): Thêm hỗ trợ cho MVC(Model - View - Controller) với các Controller.
            //AddNewtonsoftJson(): Sử dụng thư viện Newtonsoft.Json để chuyển đổi giữa C# objects và JSON. Đây là một thư viện rất phổ biến để làm việc với JSON trong .NET.
            //AddJsonOptions(): Tùy chỉnh cách JSON được chuyển đổi.Ở đây:
            //DateTimeConverter là một converter tùy chỉnh cho việc chuyển đổi kiểu DateTime.
            //ReferenceLoopHandling.Ignore được cấu hình để ngăn lỗi vòng lặp tham chiếu(reference loop), chẳng hạn như khi đối tượng có tham chiếu đến chính nó.




            services.AddControllers(options => options.SuppressImplicitRequiredAttributeForNonNullableReferenceTypes = true);
            services.AddRazorPages()
                .AddRazorRuntimeCompilation();
            //services.AddSingleton<ICacheHelper, CacheHelper>();
            services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();
            //AddRazorPages(): Thêm hỗ trợ cho Razor Pages, một dạng page-based framework trong ASP.NET Core.
            //AddRazorRuntimeCompilation(): Cho phép biên dịch Razor Pages trong thời gian chạy(runtime), giúp bạn thấy ngay các thay đổi mà không cần phải khởi động lại ứng dụng.
            //AddSingleton<ICacheHelper, CacheHelper>(): Đăng ký CacheHelper làm một singleton(chỉ có một instance duy nhất trong toàn bộ vòng đời ứng dụng) để xử lý caching trong ứng dụng.
            //AddSingleton<IHttpContextAccessor, HttpContextAccessor>(): Đăng ký IHttpContextAccessor, cho phép truy cập đến HttpContext để lấy các thông tin của request, cookies, session, v.v.




            services.AddSession(options =>
            {
                options.IdleTimeout = TimeSpan.FromSeconds(72000);
            });
            services.AddSession(cfg =>
            {                            // Đăng ký dịch vụ Session
                cfg.Cookie.Name = SystemConstant.SECURITY_KEY_NAME; // "novaticSecurityToken";             // Đặt tên Session - tên này sử dụng ở Browser (Cookie)
                cfg.IdleTimeout = new TimeSpan(0, 120, 0);           // Thời gian tồn tại của Session
            });


            //AddSession(): Đăng ký Session cho ứng dụng, giúp lưu trữ dữ liệu người dùng trong phiên làm việc(session) qua các lần request.
            //IdleTimeout: Thời gian session tồn tại khi người dùng không tương tác.Ở đây, thời gian là 72000 giây(tương đương 20 giờ) trong đoạn đầu và 120 phút trong đoạn thứ hai.
            //cfg.Cookie.Name: Tên của cookie lưu session được đặt theo giá trị từ SystemConstant.SECURITY_KEY_NAME.

            services.AddControllersWithViews()
                .ConfigureApiBehaviorOptions(opt =>
                {
                    opt.SuppressModelStateInvalidFilter = true;
                })
                .AddSessionStateTempDataProvider();
            services.AddCors(options =>
            {
                options.AddPolicy("Default", policy =>
                {
                    policy.WithOrigins(configuration.GetSection("CorsOrigins").Get<string[]>())
                    .AllowAnyHeader()
                    .AllowAnyOrigin()
                    .AllowAnyMethod();
                });
            });

            //Cấu hình CORS để cho phép hoặc từ chối các yêu cầu từ các domain khác nhau.Trong đoạn này:
            //WithOrigins: Cho phép các domain được liệt kê trong cấu hình(CorsOrigins).
            //AllowAnyHeader, AllowAnyOrigin, AllowAnyMethod: Cho phép bất kỳ header, domain, và phương thức nào(GET, POST, PUT, DELETE, v.v.) từ các domain được chỉ định.


            //ADD SWWAGGER 
            services.AddSwaggerGen(options =>
            {
                options.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo { Title = "COFFEE API", Version = "v1" });
                options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
                {
                    In = ParameterLocation.Header,
                    Description = "Please enter token",
                    Name = "Authorization",
                    Type = SecuritySchemeType.Http,
                    BearerFormat = "JWT",
                    Scheme = "bearer"
                });
                options.AddSecurityRequirement(new OpenApiSecurityRequirement
                {
                    {
                        new OpenApiSecurityScheme
                        {
                            Reference = new OpenApiReference
                            {
                                Type=ReferenceType.SecurityScheme,
                                Id="Bearer"
                            }
                        },
                        new string[]{}
                    }
                });
                // Set the comments path for the Swagger JSON and UI.
                var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
                var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
                options.IncludeXmlComments(xmlPath);
            });
            //Swagger là một công cụ giúp bạn tạo ra tài liệu API. Đoạn mã này cấu hình Swagger như sau:
            //SwaggerDoc("v1", ...): Tạo một tài liệu API cho phiên bản v1 của API với tiêu đề là "COFFEE API".
            //AddSecurityDefinition: Thêm cấu hình bảo mật cho Swagger bằng cách sử dụng token JWT(Bearer Token).
            //AddSecurityRequirement: Yêu cầu bảo mật cho tất cả các endpoint bằng cách sử dụng token.
            //IncludeXmlComments: Đính kèm tài liệu XML(được tạo ra bởi các comment trong mã) để Swagger có thể hiển thị các mô tả chi tiết của các API.


            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(options =>
            {

                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = configuration.GetValue<string>("Jwt:Issuer"),
                    ValidAudience = configuration.GetValue<string>("Jwt:Issuer"),
                    IssuerSigningKey = new
                        SymmetricSecurityKey
                        (Encoding.UTF8.GetBytes
                            (configuration.GetValue<string>("Jwt:Key")))
                };
                options.Events = new JwtBearerEvents
                {
                    OnMessageReceived = context =>
                    {
                        if (!context.Request.Path.Value.Contains("api"))
                        {
                            context.Token = context.Request.Cookies["Authorization"];
                        }
                        else
                        {
                            var accessToken = context.Request.Query["access_token"];
                            // If the request is for our hub...
                            var path = context.HttpContext.Request.Path;
                            if (!string.IsNullOrEmpty(accessToken) &&
                               (path.StartsWithSegments("/AccountSendMessageHub")))
                            {
                                // Read the token out of the query string
                                context.Token = accessToken;
                            }
                        }
                        return Task.CompletedTask;
                    }
                };
            });
            //Cấu hình JWT Authentication để bảo vệ API bằng cách sử dụng token.Các bước thực hiện:
            //TokenValidationParameters: Các tham số để xác minh token, bao gồm việc kiểm tra tính hợp lệ của issuer(người phát hành), audience(đối tượng), lifetime(thời gian hiệu lực), và signing key(khóa ký token).
            //JwtBearerEvents: Tùy chỉnh sự kiện khi nhận token.Ví dụ:
            //Nếu không phải là API request, lấy token từ cookie.
            //Nếu là request đến SignalR Hub, lấy token từ query string.

            services.AddAuthorization(options =>
            {
                options.DefaultPolicy = new AuthorizationPolicyBuilder()
                    .RequireAuthenticatedUser()
                    .AddAuthenticationSchemes("Bearer")
                    .Build();
            });
            // Cấu hình Authorization để yêu cầu mọi người dùng phải được xác thực (authenticated) và sử dụng token Bearer.
            services.Configure<RouteOptions>(options =>
            {
                options.LowercaseUrls = true;
                options.LowercaseQueryStrings = true;
            });
            //HTTPS ENFORCE
            services.AddHttpsRedirection(options =>
            {
                options.HttpsPort = 443;
            });
            //LowercaseUrls, LowercaseQueryStrings: Tạo URL và query string dưới dạng chữ thường để đồng nhất định dạng URL.
            //AddHttpsRedirection: Đảm bảo rằng ứng dụng sẽ chuyển hướng tất cả các request từ HTTP sang HTTPS, sử dụng cổng 443.
            return services;

        }
        public static IServiceCollection AddInfrastructureQuazt(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddQuartz(options =>
            {
                options.UseMicrosoftDependencyInjectionJobFactory();
            });
            services.AddQuartzHostedService(options =>
            {
                options.WaitForJobsToComplete = true;
            });
            return services;
        }
    }
}
