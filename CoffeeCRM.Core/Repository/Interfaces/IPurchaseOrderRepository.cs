
    using CoffeeCRM.Data.Model;
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using CoffeeCRM.Core.Util;using CoffeeCRM.Data;
    using CoffeeCRM.Core.Util.Parameters;
    using CoffeeCRM.Data.ViewModels;


    namespace CoffeeCRM.Core.Repository
    {
        public interface IPurchaseOrderRepository
        {
            Task <List< PurchaseOrder>> List();

            //Task <List< PurchaseOrder>> Search(string keyword);

            Task <List< PurchaseOrder>> ListPaging(int pageIndex, int pageSize);

            Task <PurchaseOrder> Detail(long ? postId);

            Task <PurchaseOrder> Add(PurchaseOrder PurchaseOrder);

            Task Update(PurchaseOrder PurchaseOrder);

            Task Delete(PurchaseOrder PurchaseOrder);

            Task <long> DeletePermanently(long ? PurchaseOrderId);

            int Count();

            Task <DTResult<PurchaseOrder>> ListServerSide(PurchaseOrderDTParameters parameters);
        }
    }
