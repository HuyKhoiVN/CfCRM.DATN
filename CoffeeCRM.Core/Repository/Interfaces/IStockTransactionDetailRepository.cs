
using CoffeeCRM.Data.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CoffeeCRM.Core.Util;
using CoffeeCRM.Data;
using CoffeeCRM.Core.Util.Parameters;
using CoffeeCRM.Data.ViewModels;


namespace CoffeeCRM.Core.Repository
{
    public interface IStockTransactionDetailRepository
    {
        Task<List<StockTransactionDetail>> List();

        //Task <List< StockTransactionDetail>> Search(string keyword);

        Task<List<StockTransactionDetail>> ListPaging(int pageIndex, int pageSize);

        Task<StockTransactionDetail> Detail(long? postId);

        Task<StockTransactionDetail> Add(StockTransactionDetail StockTransactionDetail);

        Task Update(StockTransactionDetail StockTransactionDetail);

        Task Delete(StockTransactionDetail StockTransactionDetail);

        Task<long> DeletePermanently(long? StockTransactionDetailId);
        Task<List<StockTransactionDetail>> GetByTransactionId(int id);

        int Count();

        Task<DTResult<StockTransactionDetail>> ListServerSide(StockTransactionDetailDTParameters parameters);
    }
}
