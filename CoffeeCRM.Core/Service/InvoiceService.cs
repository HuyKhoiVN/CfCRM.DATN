
        using CoffeeCRM.Data.Model;
        using CoffeeCRM.Core.Repository;
         
       using CoffeeCRM.Core.Util;
        using CoffeeCRM.Core.Util.Parameters;
        using CoffeeCRM.Data.ViewModels;
        using System;
        using System.Collections.Generic;
        using System.Threading.Tasks;
        
        namespace CoffeeCRM.Core.Service
        {
            public class InvoiceService : IInvoiceService
            {
                IInvoiceRepository invoiceRepository;
                public InvoiceService(
                    IInvoiceRepository _invoiceRepository
                    )
                {
                    invoiceRepository = _invoiceRepository;
                }
                public async Task Add(Invoice obj)
                {
                    obj.Active = true;
                    obj.CreatedTime = DateTime.Now;
                    await invoiceRepository.Add(obj);
                }
        
                public int Count()
                {
                    var result = invoiceRepository.Count();
                    return result;
                }
        
                public async Task Delete(Invoice obj)
                {
                    obj.Active = false;
                    await invoiceRepository.Delete(obj);
                }
        
                public async Task<long> DeletePermanently(long? id)
                {
                    return await invoiceRepository.DeletePermanently(id);
                }
        
                public async Task<Invoice> Detail(long? id)
                {
                    return await invoiceRepository.Detail(id);
                }
        
                public async Task<List<Invoice>> List()
                {
                    return await invoiceRepository.List();
                }
        
                public async Task<List<Invoice>> ListPaging(int pageIndex, int pageSize)
                {
                    return await invoiceRepository.ListPaging(pageIndex, pageSize);
                }
        
                public async Task<DTResult<Invoice>> ListServerSide(InvoiceDTParameters parameters)
                {
                    return await invoiceRepository.ListServerSide(parameters);
                }
        
                //public async Task<List<Invoice>> Search(string keyword)
                //{
                //    return await invoiceRepository.Search(keyword);
                //}
        
                public async Task Update(Invoice obj)
                {
                    await invoiceRepository.Update(obj);
                }
            }
        }
    
    