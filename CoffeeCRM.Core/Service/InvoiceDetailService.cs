using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CoffeeCRM.Core.Repository.Interfaces;
using CoffeeCRM.Core.Service.Interfaces;
using CoffeeCRM.Core.Util.Parameters;
using CoffeeCRM.Core.Util;using CoffeeCRM.Data;
using CoffeeCRM.Data.Model;

namespace CoffeeCRM.Core.Service
{
    public class InvoiceDetailService : IInvoiceDetailService
    {
        IInvoiceDetailRepository invoiceDetailRepository;
        public InvoiceDetailService(
            IInvoiceDetailRepository _invoiceDetailRepository
            )
        {
            invoiceDetailRepository = _invoiceDetailRepository;
        }
        public async Task Add(InvoiceDetail obj)
        {
            obj.Active = true;
            obj.CreatedTime = DateTime.Now;
            await invoiceDetailRepository.Add(obj);
        }

        public int Count()
        {
            var result = invoiceDetailRepository.Count();
            return result;
        }

        public async Task Delete(InvoiceDetail obj)
        {
            obj.Active = false;
            await invoiceDetailRepository.Delete(obj);
        }

        public async Task<long> DeletePermanently(long? id)
        {
            return await invoiceDetailRepository.DeletePermanently(id);
        }

        public async Task<InvoiceDetail> Detail(long? id)
        {
            return await invoiceDetailRepository.Detail(id);
        }

        public async Task<List<InvoiceDetail>> List()
        {
            return await invoiceDetailRepository.List();
        }

        public async Task<List<InvoiceDetail>> ListPaging(int pageIndex, int pageSize)
        {
            return await invoiceDetailRepository.ListPaging(pageIndex, pageSize);
        }

        public async Task Update(InvoiceDetail obj)
        {
            await invoiceDetailRepository.Update(obj);
        }
    }
}
