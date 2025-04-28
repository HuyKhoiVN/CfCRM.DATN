
    using CoffeeCRM.Data.Model;
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using CoffeeCRM.Core.Util;
    using CoffeeCRM.Core.Util.Parameters;
    using CoffeeCRM.Data.ViewModels;
using CoffeeCRM.Data.DTO;


    namespace CoffeeCRM.Core.Repository
    {
        public interface IStockLevelRepository
        {
            Task <List< StockLevel>> List();

            //Task <List< StockLevel>> Search(string keyword);

            Task <List< StockLevel>> ListPaging(int pageIndex, int pageSize);

            Task <StockLevel> Detail(long ? postId);

            Task <StockLevel> Add(StockLevel StockLevel);

            Task Update(StockLevel StockLevel);

            Task Delete(StockLevel StockLevel);

            Task <long> DeletePermanently(long ? StockLevelId);

            int Count();

            Task <DTResult<StockLevelDto>> ListServerSide(StockLevelDTParameters parameters);
        }
    }
