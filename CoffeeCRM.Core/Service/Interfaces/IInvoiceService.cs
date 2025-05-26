using CoffeeCRM.Data.Model;
using CoffeeCRM.Core.Util;using CoffeeCRM.Data;
using CoffeeCRM.Core.Util.Parameters;
using CoffeeCRM.Data.ViewModels;
using System.Threading.Tasks;

namespace CoffeeCRM.Core.Service
{
    public interface IInvoiceService : IBaseService<Invoice>
    {
        Task<DTResult<Invoice>> ListServerSide(InvoiceDTParameters parameters);
        Task<InvoiceVM> InvoiceDetailById(int invoiceId);
        Task<InvoiceViewModel> AddOrUpdateVM(InvoiceViewModel model);
        Task<InvoiceViewModel> UpdateStatus(InvoiceViewModel model);
        Task PaymentSuccess(int id, string transCode);
    }
}
