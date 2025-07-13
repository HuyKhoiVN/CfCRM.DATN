using CoffeeCRM.Core.Helper;
using CoffeeCRM.Core.Helper.VNPay;
using CoffeeCRM.Core.Service;
using CoffeeCRM.Data.Constants;
using CoffeeCRM.Data.Enums.VNPay;
using CoffeeCRM.Data.Model;
using CoffeeCRM.Data.VNPay;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;

namespace CoffeeCRM.Api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class VnpayController : ControllerBase
    {
        private readonly IVNPayService _vnPayservice;
        private readonly IConfiguration _configuration;
        private readonly IInvoiceService _orderService;
        private readonly INotificationService _notificationService;
        IHubContext<NotificationHub, INotificationHub> notificationHub;

        public VnpayController(IVNPayService vnPayservice, IConfiguration configuration, IInvoiceService orderService, INotificationService notificationService, IHubContext<NotificationHub, INotificationHub> notificationHub)
        {
            _vnPayservice = vnPayservice;
            _configuration = configuration;
            _orderService = orderService;
            _notificationService = notificationService;
            this.notificationHub = notificationHub;
            _vnPayservice.Initialize(_configuration["Vnpay:TmnCode"], _configuration["Vnpay:HashSecret"], _configuration["Vnpay:BaseUrl"], _configuration["Vnpay:CallbackUrl"]);
        }

        /// <summary>
        /// Tạo url thanh toán
        /// </summary>
        /// <param name="money">Số tiền phải thanh toán</param>
        /// <param name="description">Mô tả giao dịch</param>
        /// <returns></returns>
        [HttpGet("api/CreatePaymentUrl")]
        public ActionResult<string> CreatePaymentUrl(double money, string description)
        {
            try
            {
                var ipAddress = NetworkHelper.GetIpAddress(HttpContext); // Lấy địa chỉ IP của thiết bị thực hiện giao dịch

                var request = new PaymentRequest
                {
                    PaymentId = DateTime.Now.Ticks,
                    Money = money,
                    Description = description,
                    IpAddress = ipAddress,
                    BankCode = BankCode.ANY, // Tùy chọn. Mặc định là tất cả phương thức giao dịch
                    CreatedDate = DateTime.Now, // Tùy chọn. Mặc định là thời điểm hiện tại
                    Currency = Currency.VND, // Tùy chọn. Mặc định là VND (Việt Nam đồng)
                    Language = DisplayLanguage.Vietnamese // Tùy chọn. Mặc định là tiếng Việt
                };

                var paymentUrl = _vnPayservice.GetPaymentUrl(request);

                return Created(paymentUrl, paymentUrl);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        /// <summary>
        /// Thực hiện hành động sau khi thanh toán. URL này cần được khai báo với VNPAY để API này hoạt đồng (ví dụ: http://localhost:1234/api/Vnpay/IpnAction)
        /// </summary>
        /// <returns></returns>
        [HttpGet("api/IpnAction")]
        public async Task<IActionResult> IpnAction()
        {
            if (Request.QueryString.HasValue)
            {
                try
                {
                    var paymentResult = _vnPayservice.GetPaymentResult(Request.Query);
                    if (paymentResult.IsSuccess)
                    {
                        int orderId = Convert.ToInt32(paymentResult.Description);
                        await _orderService.PaymentSuccess(orderId, paymentResult.PaymentId.ToString());
                    }
                   
                    var redirectUrl = $"{Request.Scheme}://{Request.Host}/tai-khoan/lich-su-don-hang";
                    return Redirect(redirectUrl);
                    // Thực hiện hành động nếu thanh toán thất bại tại đây. Ví dụ: Hủy đơn hàng.        
                    //return BadRequest("Thanh toán thất bại");
                }
                catch (Exception ex)
                {
                    return BadRequest(ex.Message);
                }
            }

            return NotFound("Không tìm thấy thông tin thanh toán.");
        }

        /// <summary>
        /// Trả kết quả thanh toán về cho người dùng
        /// </summary>
        /// <returns></returns>
        [HttpGet("api/Callback")]
        public async Task< ActionResult<PaymentResult>> Callback()
        {
            if (Request.QueryString.HasValue)
            {
                try
                {

                    var paymentResult = _vnPayservice.GetPaymentResult(Request.Query);
                    var ids = Convert.ToInt32(paymentResult.Description);
                    var order = await _orderService.InvoiceDetailById(ids);
                    if (paymentResult.IsSuccess)
                    {
                        await _orderService.PaymentSuccess(order.Id, paymentResult.PaymentId.ToString());
                        var redirectUrl = $"https://localhost:7125/booking/admin/success";
                        var notifi = new Notification
                        {
                            Active = true,
                            AccountId = this.GetLoggedInUserId(), // 
                            NotificationStatusId = NotificationStatusId.Unread,
                            Name = "Thanh toán thành công",
                            SenderId = RoleConst.WAITER,
                            Description = order.Id.ToString(),
                            CreatedTime = DateTime.Now,
                            ApproveTime = null,
                            Url = ""
                        };
                        //await notificationRepository.Add(notifi);
                        await notificationHub.Clients.All.ReceiveNotification(notifi);
                        return Redirect(redirectUrl);
                    }

                    return BadRequest(paymentResult);
                }
                catch (Exception ex)
                {
                    return BadRequest(ex.Message);
                }
            }

            return NotFound("Không tìm thấy thông tin thanh toán.");
        }
    }
}
