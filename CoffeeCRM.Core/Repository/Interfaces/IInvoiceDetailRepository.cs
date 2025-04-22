using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CoffeeCRM.Core.Util;
using CoffeeCRM.Core.Util.Parameters;
using CoffeeCRM.Data.Model;
using CoffeeCRM.Data.ViewModels;

namespace CoffeeCRM.Core.Repository.Interfaces
{
    public interface IInvoiceDetailRepository : IScoped
    {
        Task<List<InvoiceDetail>> List();
        Task<List<InvoiceDetail>> ListPaging(int pageIndex, int pageSize);
        Task<InvoiceDetail> Detail(long? postId);
        Task<InvoiceDetail> Add(InvoiceDetail InvoiceDetail);
        Task Update(InvoiceDetail InvoiceDetail);
        Task Delete(InvoiceDetail InvoiceDetail);
        Task<long> DeletePermanently(long? InvoiceDetailId);
        int Count();
        Task<List<InvoiceDetailViewModel>> ListByInvoideId(int id);
    }
}
