
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
        public interface IFinancialTargetRepository
        {
            Task <List< FinancialTarget>> List();

            //Task <List< FinancialTarget>> Search(string keyword);

            Task <List< FinancialTarget>> ListPaging(int pageIndex, int pageSize);

            Task <FinancialTarget> Detail(long ? postId);

            Task <FinancialTarget> Add(FinancialTarget FinancialTarget);

            Task Update(FinancialTarget FinancialTarget);

            Task Delete(FinancialTarget FinancialTarget);

            Task <long> DeletePermanently(long ? FinancialTargetId);

            int Count();

            Task <DTResult<FinancialTarget>> ListServerSide(FinancialTargetDTParameters parameters);
        }
    }
