using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CoffeeCRM.Data.Enums.VNPay
{
    /// <summary>
    /// Đơn vị tiền tệ sử dụng cho giao dịch
    /// </summary>
    public enum Currency
    {
        [Description("Việt Nam đồng")]
        VND,

        //[Description("Đô la Mỹ")]
        //USD,
    }
}
