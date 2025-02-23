
    using CoffeeCRM.Data.Model;
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using CoffeeCRM.Core.Util;
    using CoffeeCRM.Core.Util.Parameters;
    using CoffeeCRM.Data.ViewModels;


    namespace CoffeeCRM.Core.Repository
    {
        public interface IInvoiceRepository
        {
            Task <List< Invoice>> List();

            //Task <List< Invoice>> Search(string keyword);

            Task <List< Invoice>> ListPaging(int pageIndex, int pageSize);

            Task <Invoice> Detail(long ? postId);

            Task <Invoice> Add(Invoice Invoice);

            Task Update(Invoice Invoice);

            Task Delete(Invoice Invoice);

            Task <long> DeletePermanently(long ? InvoiceId);

            int Count();

            Task <DTResult<Invoice>> ListServerSide(InvoiceDTParameters parameters);
        }
    }
