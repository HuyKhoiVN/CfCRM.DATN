
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
        public interface ISupplierRepository
        {
            Task <List< Supplier>> List();

            //Task <List< Supplier>> Search(string keyword);

            Task <List< Supplier>> ListPaging(int pageIndex, int pageSize);

            Task <Supplier> Detail(long ? postId);

            Task <Supplier> Add(Supplier Supplier);

            Task Update(Supplier Supplier);

            Task Delete(Supplier Supplier);

            Task <long> DeletePermanently(long ? SupplierId);

            int Count();

            Task <DTResult<Supplier>> ListServerSide(SupplierDTParameters parameters);
        }
    }
