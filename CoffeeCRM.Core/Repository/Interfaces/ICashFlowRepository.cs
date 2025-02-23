
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
        public interface ICashFlowRepository
        {
            Task <List< CashFlow>> List();

            //Task <List< CashFlow>> Search(string keyword);

            Task <List< CashFlow>> ListPaging(int pageIndex, int pageSize);

            Task <CashFlow> Detail(long ? postId);

            Task <CashFlow> Add(CashFlow CashFlow);

            Task Update(CashFlow CashFlow);

            Task Delete(CashFlow CashFlow);

            Task <long> DeletePermanently(long ? CashFlowId);

            int Count();

            Task <DTResult<CashFlow>> ListServerSide(CashFlowDTParameters parameters);
        }
    }
