
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
        public interface IAccountActivityRepository
        {
            Task <List< AccountActivity>> List();

            //Task <List< AccountActivity>> Search(string keyword);

            Task <List< AccountActivity>> ListPaging(int pageIndex, int pageSize);

            Task <AccountActivity> Detail(long ? postId);

            Task <AccountActivity> Add(AccountActivity AccountActivity);

            Task Update(AccountActivity AccountActivity);

            Task Delete(AccountActivity AccountActivity);

            Task <long> DeletePermanently(long ? AccountActivityId);

            int Count();

            Task <DTResult<AccountActivity>> ListServerSide(AccountActivityDTParameters parameters);
        }
    }
