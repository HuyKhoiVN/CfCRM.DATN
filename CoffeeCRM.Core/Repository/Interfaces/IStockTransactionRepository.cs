
using CoffeeCRM.Data.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CoffeeCRM.Core.Util;
using CoffeeCRM.Data;
using CoffeeCRM.Core.Util.Parameters;
using CoffeeCRM.Data.ViewModels;
using Microsoft.EntityFrameworkCore.Infrastructure;
using CoffeeCRM.Data.DTO;


namespace CoffeeCRM.Core.Repository
{
    public interface IStockTransactionRepository
    {
        Task<List<StockTransaction>> List();

        //Task <List< StockTransaction>> Search(string keyword);

        Task<List<StockTransaction>> ListPaging(int pageIndex, int pageSize);

        Task<StockTransaction> Detail(long? postId);

        Task<StockTransaction> Add(StockTransaction StockTransaction);

        Task Update(StockTransaction StockTransaction);

        Task Delete(StockTransaction StockTransaction);

        Task<long> DeletePermanently(long? StockTransactionId);

        int Count();
        Task<List<StockTransactionImportDto>> GetTransactionByWarehouse(int warehouseId);

        Task<DTResult<StockTransaction>> ListServerSide(StockTransactionDTParameters parameters);
        Task<DTResult<StockTransactionImportDto>> ListServerSideByWarehouse(StockTransactionDTParameters parameters);
        DatabaseFacade GetDatabase();
        Task<TransactionDetailViewModel> GetTransactionDetailForReview(int transactionId);
    }
}
