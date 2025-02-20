using Microsoft.AspNetCore.Mvc;

namespace CoffeeCRM.Data.Constants
{
    public class CoffeeManagementResponse : IActionResult
    {
        public static string STATUS_SUCCESS = "200";
        public string status { get; set; }
        public string message { get; set; }
        public string value { get; set; }
        public IList<Object> data { get; set; }
        public object resources { get; set; }




        public CoffeeManagementResponse(string status, string message, IList<Object> data)
        {
            this.status = status;
            this.message = message;
            this.data = data;
        }
        public CoffeeManagementResponse(string status, string message, object data)
        {
            this.status = status;
            this.message = message;
            this.resources = data;
        }
        public CoffeeManagementResponse(string status, string message)
        {
            this.status = status;
            this.message = message;
        }

        public CoffeeManagementResponse()
        {
        }

        public static CoffeeManagementResponse Success<T>(T? data, string? message = "SUCCESS") where T : class
        {
            return new CoffeeManagementResponse()
            {
                status = "200",
                message = message,
                resources = data
            };
        }

        public static CoffeeManagementResponse Failed(string status, string message, object data)
        {
            return new CoffeeManagementResponse(status, message, new List<object> { data });
        }

        public static CoffeeManagementResponse SUCCESS(IList<Object> data)
        {
            return new CoffeeManagementResponse("200", "SUCCESS", data);
        }
        public static CoffeeManagementResponse ISEXISTUSERNAME()
        {
            return new CoffeeManagementResponse("205", "IS_EXIST_USERNAME");
        }
        public static CoffeeManagementResponse ISEXISTIDSTAFF()
        {
            return new CoffeeManagementResponse("206", "IS_EXIST_IDSTAFF");
        }
        public static CoffeeManagementResponse ISEXISTPHONENUMBER()
        {
            return new CoffeeManagementResponse("207", "IS_EXIST_PHONE_NUMBER");
        }
        public static CoffeeManagementResponse SUCCESS(Object data)
        {
            List<Object> returnData = new List<Object>();
            returnData.Add(data);
            return new CoffeeManagementResponse("200", "SUCCESS", returnData);
        }
        public static CoffeeManagementResponse BAD_REQUEST(Object data)
        {
            List<Object> returnData = new List<Object>();
            returnData.Add(data);
            return new CoffeeManagementResponse("400", "BAD_REQUEST", returnData);
        }

        public static CoffeeManagementResponse BAD_REQUEST()
        {
            List<Object> returnData = new List<Object>();
            var obj = new { Code = 400, Message = "BAD_REQUEST" };
            returnData.Add(obj);
            return new CoffeeManagementResponse("400", "BAD_REQUEST", returnData);
        }
        public static CoffeeManagementResponse FAIL_BOOKING_TIME()
        {
            return new CoffeeManagementResponse("207", "SUCCESS");
        }
        public static CoffeeManagementResponse SUCCESS()
        {
            return new CoffeeManagementResponse("200", "SUCCESS");
        }
        //trả về SUCCESSNOTBIDDING trong hoàn tiền đặt cọc
        //public static CoffeeManagementResponse SUCCESSNOTBIDDING(Object data)
        //{
        //    List<Object> returnData = new List<Object>();
        //    returnData.Add(data);
        //    return new CoffeeManagementResponse("205", "SUCCESSNOTBIDDING", returnData);
        //}
        public static CoffeeManagementResponse SUCCESSNOTBIDDING(IList<Object> data)
        {
            return new CoffeeManagementResponse("205", "SUCCESSNOTBIDDING", data);
        }
        //trả về SUCCESSHAVEBIDDING trong hoàn tiền đặt cọc
        //public static CoffeeManagementResponse SUCCESSHAVEBIDDING(Object data)
        //{
        //    List<Object> returnData = new List<Object>();
        //    returnData.Add(data);
        //    return new CoffeeManagementResponse("206", "SUCCESSHAVEBIDDING", returnData);
        //}
        public static CoffeeManagementResponse SUCCESSHAVEBIDDING(IList<Object> data)
        {
            return new CoffeeManagementResponse("206", "SUCCESSHAVEBIDDING", data);
        }

        public static CoffeeManagementResponse CREATED(Object data)
        {
            List<Object> returnData = new List<Object>();
            returnData.Add(data);
            return new CoffeeManagementResponse("201", "CREATED", returnData);
        }
        public static CoffeeManagementResponse CREATED(List<Object> data)
        {
            List<Object> returnData = new List<Object>();
            returnData = data;
            return new CoffeeManagementResponse("201", "CREATED", returnData);
        }
        public static CoffeeManagementResponse Faild()
        {
            return new CoffeeManagementResponse("099", "FAILD");
        }
        public static CoffeeManagementResponse UNAUTHORIZED()
        {
            return new CoffeeManagementResponse("401", "UNAUTHORIZED");
        }
        public static CoffeeManagementResponse BiddingFaildEnded(Object data)
        {
            List<Object> returnData = new List<Object>();
            returnData.Add(data);
            return new CoffeeManagementResponse("096", "BIDDINGFAILD", returnData);
        }

        public static CoffeeManagementResponse EmailExist(Object data)
        {
            List<Object> returnData = new List<Object>();
            returnData.Add(data);
            return new CoffeeManagementResponse("202", "EMAILEXIST", data);
        }
        public static CoffeeManagementResponse EmailNotValid(Object data)
        {
            List<Object> returnData = new List<Object>();
            returnData.Add(data);
            return new CoffeeManagementResponse("204", "EMAILNOTVALID");
        }
        public static CoffeeManagementResponse UsernameExist(Object data)
        {
            List<Object> returnData = new List<Object>();
            returnData.Add(data);
            return new CoffeeManagementResponse("203", "USENAMEEXIST");
        }
        public static CoffeeManagementResponse IdCardNumberExist(Object data)
        {
            List<Object> returnData = new List<Object>();
            returnData.Add(data);
            return new CoffeeManagementResponse("205", "IDCARNUMBEREXIST");
        }
        public static CoffeeManagementResponse BiddingRequestExist(Object data)
        {
            List<Object> returnData = new List<Object>();
            returnData.Add(data);
            return new CoffeeManagementResponse("203", "BIDDINGREQUESTEXIST", returnData);
        }
        public static CoffeeManagementResponse PhoneExist(Object data)
        {
            List<Object> returnData = new List<Object>();
            returnData.Add(data);
            return new CoffeeManagementResponse("204", "PHONEEXIST");
        }
        public static CoffeeManagementResponse CompanyIdExist(Object data)
        {
            List<Object> returnData = new List<Object>();
            returnData.Add(data);
            return new CoffeeManagementResponse("206", "COMPANYIDEXIST");
        }
        public static CoffeeManagementResponse ItemExist(Object data)
        {
            List<Object> returnData = new List<Object>();
            returnData.Add(data);
            return new CoffeeManagementResponse("203", "ITEMEXIST", returnData);
        }
        public static CoffeeManagementResponse NotFoundBiddingMax()
        {
            return new CoffeeManagementResponse("999", "FAILD");
        }
        public static CoffeeManagementResponse PostNameExist()
        {
            return new CoffeeManagementResponse("203", "POSTNAMEEXIST");
        }
        public static CoffeeManagementResponse NotFoundBiddingSecond()
        {
            return new CoffeeManagementResponse("998", "FAILD");
        }
        public static CoffeeManagementResponse PasswordExist(Object data)
        {
            List<Object> returnData = new List<Object>();
            returnData.Add(data);
            return new CoffeeManagementResponse("202", "PASSWORDEXIST", returnData);
        }
        public static CoffeeManagementResponse PasswordIsNotFormat(Object data)
        {
            List<Object> returnData = new List<Object>();
            returnData.Add(data);
            return new CoffeeManagementResponse("205", "PASSWORDISNOTINCORRECTFORMAT", returnData);
        }

        public static CoffeeManagementResponse OTP_REQUIRED(IList<Object> data)
        {
            return new CoffeeManagementResponse("200", "OTP_REQUIRED", data);
        }
        public static CoffeeManagementResponse OTP_OVER_LIMIT(IList<Object> data)
        {
            return new CoffeeManagementResponse("099", "OTP_OVER_LIMIT", data);
        }
        public static CoffeeManagementResponse OTP_INVALID_DATA(IList<Object> data)
        {
            return new CoffeeManagementResponse("098", "INVALID_DATA", data);
        }
        public static CoffeeManagementResponse OTP_EXIST()
        {
            return new CoffeeManagementResponse("204", "OTP_EXIST");
        }

        public Task ExecuteResultAsync(ActionContext context)
        {
            throw new NotImplementedException();
        }
    }
}
