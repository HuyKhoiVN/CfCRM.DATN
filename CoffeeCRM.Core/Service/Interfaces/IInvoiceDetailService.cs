using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CoffeeCRM.Core.Util.Parameters;
using CoffeeCRM.Core.Util;using CoffeeCRM.Data;
using CoffeeCRM.Data.Model;

namespace CoffeeCRM.Core.Service.Interfaces
{
    public interface IInvoiceDetailService : IBaseService<InvoiceDetail>, IScoped
    {
    }
}
