
using CoffeeCRM.Data.Model;
using CoffeeCRM.Core.Repository;

using CoffeeCRM.Core.Util;
using CoffeeCRM.Data;
using CoffeeCRM.Core.Util.Parameters;
using CoffeeCRM.Data.ViewModels;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using CoffeeCRM.Data.DTO;
using CoffeeCRM.Data.Constants;
namespace CoffeeCRM.Core.Service
{
    public class StockLevelService : IStockLevelService
    {
        IStockLevelRepository stockLevelRepository;
        IWarehouseRepository warehouseRepository;
        IStockTransactionRepository stockTransactionRepository;
        IStockTransactionDetailRepository stockTransactionDetailRepository;
        IIngredientRepository ingredientRepository;

        public StockLevelService(
            IStockLevelRepository _stockLevelRepository,
            IWarehouseRepository _warehouseRepository,
            IStockTransactionRepository _stockTransactionRepository,
            IStockTransactionDetailRepository _stockTransactionDetailRepository,
            IIngredientRepository _ingredientRepository
            )
        {
            stockLevelRepository = _stockLevelRepository;
            warehouseRepository = _warehouseRepository;
            stockTransactionRepository = _stockTransactionRepository;
            stockTransactionDetailRepository = _stockTransactionDetailRepository;
            ingredientRepository = _ingredientRepository;
        }
        public async Task Add(StockLevel obj)
        {
            obj.Active = true;
            obj.CreatedTime = DateTime.Now;
            await stockLevelRepository.Add(obj);
        }

        public int Count()
        {
            var result = stockLevelRepository.Count();
            return result;
        }

        public async Task Delete(StockLevel obj)
        {
            obj.Active = false;
            await stockLevelRepository.Delete(obj);
        }

        public async Task<long> DeletePermanently(long? id)
        {
            return await stockLevelRepository.DeletePermanently(id);
        }

        public async Task<StockLevel> Detail(long? id)
        {
            return await stockLevelRepository.Detail(id);
        }

        public async Task<List<StockLevel>> List()
        {
            return await stockLevelRepository.List();
        }

        public async Task<List<StockLevel>> ListPaging(int pageIndex, int pageSize)
        {
            return await stockLevelRepository.ListPaging(pageIndex, pageSize);
        }

        public async Task<DTResult<StockLevelDto>> ListServerSide(StockLevelDTParameters parameters)
        {
            return await stockLevelRepository.ListServerSide(parameters);
        }

        //public async Task<List<StockLevel>> Search(string keyword)
        //{
        //    return await stockLevelRepository.Search(keyword);
        //}

        public async Task Update(StockLevel obj)
        {
            await stockLevelRepository.Update(obj);
        }

        public async Task<List<IngredientStockSummaryDto>> GetIngredientStockSummaryByWarehouseAsync(int warehouseId)
        {
            return await stockLevelRepository.GetIngredientStockSummaryByWarehouseAsync(warehouseId);
        }

        public async Task<List<StockLevelDto>> GetStockLevelsByIngredientAsync(int warehouseId, int ingredientId)
        {
            return await stockLevelRepository.GetStockLevelsByIngredientAsync(warehouseId, ingredientId);
        }

        public async Task<StockLevelDetailDto> GetStockLevelDetailAsync(int stockLevelId)
        {
            return await stockLevelRepository.GetStockLevelDetailAsync(stockLevelId);
        }

        public async Task<StockLevel> AddNewStock(StockLevel st)
        {
            using (var transaction = stockLevelRepository.GetDatabase().BeginTransaction())
            {
                try
                {
                    st.Active = true;
                    st.CreatedTime = DateTime.Now;
                    st.LastUpdatedTime = DateTime.Now;

                    var result = await stockLevelRepository.Add(st);
                    if (result.Id <= 0)
                    {
                        await transaction.RollbackAsync();
                        return null;
                    }

                    var ig = await ingredientRepository.Detail(st.IngredientId);
                    if (ig == null)
                    {
                        await transaction.RollbackAsync();
                        return null;
                    }

                    if (ig.AveragePrice == 0)
                    {
                        ig.AveragePrice = st.UnitPrice;
                    }
                    else
                    {
                        ig.AveragePrice = (ig.AveragePrice + st.UnitPrice) / 2;
                    }

                    await ingredientRepository.Update(ig);

                    await transaction.CommitAsync();
                    return result;
                }
                catch (Exception)
                {
                    await transaction.RollbackAsync();
                    throw;
                }
            }
        }

        public async Task<bool> AdjustStockLevelQuantityAsync(AdjustStockLevelDto adjustDto, int accountId)
        {
            // Validate input
            if (adjustDto.NewQuantity < 0)
                throw new ArgumentException("Số lượng mới không thể âm");

            if (string.IsNullOrWhiteSpace(adjustDto.AdjustmentReason))
                throw new ArgumentException("Phải nhập lý do điều chỉnh");

            // Get current stock level
            var stockLevel = await stockLevelRepository.Detail(adjustDto.StockLevelId);
            if (stockLevel == null)
                throw new KeyNotFoundException("Không tìm thấy lô hàng");

            // Get warehouse information
            var warehouse = await warehouseRepository.Detail(stockLevel.WarehouseId);
            if (warehouse == null)
                throw new KeyNotFoundException("Không tìm thấy thông tin kho");

            // Calculate quantity difference
            int quantityDifference = adjustDto.NewQuantity - stockLevel.Quantity;
            if (quantityDifference == 0)
                return true; // No change needed

            // Create transaction for adjustment
            using (var transaction = stockLevelRepository.GetDatabase().BeginTransaction())
            {
                try
                {
                    var sttransaction = new StockTransaction
                    {
                        StockTransactionCode = $"ADJ-{DateTime.Now:yyyyMMdd}-{Guid.NewGuid().ToString().Substring(0, 8)}",
                        TransactionType = quantityDifference > 0 ? TransactionTypeConst.ADJUSTMENT_IN : TransactionTypeConst.ADJUSTMENT_OUT,
                        Note = $"{adjustDto.AdjustmentReason}: {adjustDto.Note}",
                        TotalMoney = Math.Abs(quantityDifference) * stockLevel.UnitPrice,
                        Status = TransactionStatusConst.COMPLETED,
                        CreatedTime = DateTime.Now,
                        TransactionDate = DateTime.Now,
                        Active = true,
                        WarehouseId = stockLevel.WarehouseId,
                        AccountId = accountId
                    };
                    await stockTransactionRepository.Add(sttransaction);
                    if(sttransaction.Id <= 0)
                    {
                        await transaction.RollbackAsync();
                        return false;
                    }

                    var transactionDetail = new StockTransactionDetail
                    {
                        StockLevelId = stockLevel.Id,
                        Quantity = Math.Abs(quantityDifference),
                        StockTransactionId = sttransaction.Id,
                        CreatedTime = DateTime.Now,
                        Active = true
                    };
                    await stockTransactionDetailRepository.Add(transactionDetail);
                    if (transactionDetail.Id <= 0)
                    {
                        await transaction.RollbackAsync();
                        return false;
                    }

                    // Update stock level
                    stockLevel.Quantity = adjustDto.NewQuantity;
                    stockLevel.LastUpdatedTime = DateTime.Now;   
                    await stockLevelRepository.Update(stockLevel);
                }
                catch (Exception)
                {
                    await transaction.RollbackAsync();
                    throw;
                }
                await transaction.CommitAsync();
                return true;
            }       
        }
    }
}

