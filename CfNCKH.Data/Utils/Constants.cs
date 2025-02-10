using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CfNCKH.Data.Utils
{
    public class Constants
    {
        public static class JwtKey
        {
            public const string SUBJECT = "Jwt:Subject";
            public const string KEY = "Jwt:Key";
            public const string ISSUER = "Jwt:Issuer";
            public const string AUDIENCE = "Jwt:Audience";
        }
        public static class Mail
        {
            public const string USERNAME = "Mail:UserName";
            public const string PASSWORD = "Mail:Password";
            public const string PORT = "Mail:Port";
            public const string HOST = "Mail:Host";
        }

        public static class Message
        {
            public const string SUCCESS = "Thành công";
            public const string INVALIDID = "Id không tồn tại";
            public const string ERROR = "Có lỗi xảy ra, vui lòng thử lại";
        }
    }
}
