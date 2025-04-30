
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
        public interface IInventoryDiscrepancyRepository
        {
            Task <List< InventoryDiscrepancy>> List();

            //Task <List< InventoryDiscrepancy>> Search(string keyword);

            Task <List< InventoryDiscrepancy>> ListPaging(int pageIndex, int pageSize);

            Task <InventoryDiscrepancy> Detail(long ? postId);

            Task <InventoryDiscrepancy> Add(InventoryDiscrepancy InventoryDiscrepancy);

            Task Update(InventoryDiscrepancy InventoryDiscrepancy);

            Task Delete(InventoryDiscrepancy InventoryDiscrepancy);

            Task <long> DeletePermanently(long ? InventoryDiscrepancyId);

            int Count();

            Task <DTResult<InventoryDiscrepancy>> ListServerSide(InventoryDiscrepancyDTParameters parameters);
        }
    }
