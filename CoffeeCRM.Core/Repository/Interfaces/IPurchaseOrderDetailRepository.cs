
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
        public interface IPurchaseOrderDetailRepository
        {
            Task <List< PurchaseOrderDetail>> List();

            //Task <List< PurchaseOrderDetail>> Search(string keyword);

            Task <List< PurchaseOrderDetail>> ListPaging(int pageIndex, int pageSize);

            Task <PurchaseOrderDetail> Detail(long ? postId);

            Task <PurchaseOrderDetail> Add(PurchaseOrderDetail PurchaseOrderDetail);

            Task Update(PurchaseOrderDetail PurchaseOrderDetail);

            Task Delete(PurchaseOrderDetail PurchaseOrderDetail);

            Task <long> DeletePermanently(long ? PurchaseOrderDetailId);

            int Count();

            Task <DTResult<PurchaseOrderDetail>> ListServerSide(PurchaseOrderDetailDTParameters parameters);
        }
    }
