namespace CoffeeCRM.Data.Constants
{
    public class PaymentStatusConst
    {
        public static int PENDING = 0;
        public static int PAID = 1;
        public static int CANCELLED = 2;
       
    }

    public static class PaymentStatusStringConst
    {
        public static string PENDING = "Chờ thanh toán";
        public static string PAID = "Đã thanh toán";
        public static string CANCELLED = "Đã hủy";
        public static List<string> All => new() { PENDING, PAID, CANCELLED };
    }

    public static class PaymentMethodConst
    {
        public static string BANKING = "Chuyển khoản";
        public static string CASH = "Tiền mặt";
        public static string MOMO = "Momo";
        public static string ZALOPAY = "ZaloPay";
        public static string VNPAY = "VNPay";
        public static string PAYPAL = "Paypal";
        public static string STRIPE = "Stripe";
        public static string CREDITCARD = "Thẻ tín dụng";
        public static string OTHER = "Khác";
        public static List<string> All => new() { CASH, BANKING };
    }
}
