
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
        public interface IInventoryAuditRepository
        {
            Task <List< InventoryAudit>> List();

            //Task <List< InventoryAudit>> Search(string keyword);

            Task <List< InventoryAudit>> ListPaging(int pageIndex, int pageSize);

            Task <InventoryAudit> Detail(long ? postId);

            Task <InventoryAudit> Add(InventoryAudit InventoryAudit);

            Task Update(InventoryAudit InventoryAudit);

            Task Delete(InventoryAudit InventoryAudit);

            Task <long> DeletePermanently(long ? InventoryAuditId);

            int Count();

            Task <DTResult<InventoryAudit>> ListServerSide(InventoryAuditDTParameters parameters);
        }
    }
