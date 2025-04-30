
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
        public interface IUnitRepository
        {
            Task <List< Unit>> List();

            //Task <List< Unit>> Search(string keyword);

            Task <List< Unit>> ListPaging(int pageIndex, int pageSize);

            Task <Unit> Detail(long ? postId);

            Task <Unit> Add(Unit Unit);

            Task Update(Unit Unit);

            Task Delete(Unit Unit);

            Task <long> DeletePermanently(long ? UnitId);

            int Count();

            Task <DTResult<Unit>> ListServerSide(UnitDTParameters parameters);
        }
    }
