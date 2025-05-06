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
using NetTopologySuite.Noding;
using Humanizer;
using CfCRM.View.Models.ViewModels;
using System.Collections;

namespace CoffeeCRM.Core.Service
{
    public class StockTransactionService : IStockTransactionService
    {
        IStockTransactionRepository stockTransactionRepository;
        IStockTransactionDetailRepository stockTransactionDetailRepository;
        IStockLevelRepository stockLevelRepository;
        IInventoryDiscrepancyRepository inventoryDiscrepancyRepository;
        IInventoryAuditRepository inventoryAuditRepository;

        public StockTransactionService(
            IStockTransactionRepository _stockTransactionRepository,
            IStockTransactionDetailRepository _stockTransactionDetailRepository,
            IStockLevelRepository _stockLevelRepository,
            IInventoryDiscrepancyRepository _inventoryDiscrepancyRepository,
            IInventoryAuditRepository _inventoryAuditRepository
            )
        {
            stockTransactionRepository = _stockTransactionRepository;
            stockTransactionDetailRepository = _stockTransactionDetailRepository;
            stockLevelRepository = _stockLevelRepository;
            inventoryDiscrepancyRepository = _inventoryDiscrepancyRepository;
            inventoryAuditRepository = _inventoryAuditRepository;
        }
        public async Task Add(StockTransaction obj)
        {
            obj.Active = true;
            obj.CreatedTime = DateTime.Now;
            await stockTransactionRepository.Add(obj);
        }

        public int Count()
        {
            var result = stockTransactionRepository.Count();
            return result;
        }

        public async Task Delete(StockTransaction obj)
        {
            obj.Active = false;
            await stockTransactionRepository.Delete(obj);
        }

        public async Task<long> DeletePermanently(long? id)
        {
            return await stockTransactionRepository.DeletePermanently(id);
        }

        public async Task<StockTransaction> Detail(long? id)
        {
            return await stockTransactionRepository.Detail(id);
        }

        public async Task<List<StockTransaction>> List()
        {
            return await stockTransactionRepository.List();
        }

        public async Task<List<StockTransaction>> ListPaging(int pageIndex, int pageSize)
        {
            return await stockTransactionRepository.ListPaging(pageIndex, pageSize);
        }

        public async Task<DTResult<StockTransaction>> ListServerSide(StockTransactionDTParameters parameters)
        {
            return await stockTransactionRepository.ListServerSide(parameters);
        }

        //public async Task<List<StockTransaction>> Search(string keyword)
        //{
        //    return await stockTransactionRepository.Search(keyword);
        //}

        public async Task Update(StockTransaction obj)
        {
            await stockTransactionRepository.Update(obj);
        }

        public async Task<StockTransaction> AddNewTransaction(StockTransactionImportDto obj)
        {
            if(obj.TransactionType != TransactionTypeConst.IMPORT && obj.TransactionType != TransactionTypeConst.EXPORT && obj.TransactionType != TransactionTypeConst.INVENTORY)
            {
                throw new Exception("Loại giao dịch không hợp lệ");
            }
            using (var transaction = stockTransactionRepository.GetDatabase().BeginTransaction())
            {
                try
                {
                    StockTransaction st;
                    st = new StockTransaction
                    {
                        StockTransactionCode = GenerateTransactionCode(obj.TransactionType),
                        Note = obj.Note,
                        TransactionType = obj.TransactionType,
                        TotalMoney = obj.TotalMoney,
                        Status = TransactionStatusConst.COMPLETED,
                        CreatedTime = DateTime.Now,
                        Active = true,
                        WarehouseId = obj.WarehouseId,
                        AccountId = obj.AccountId,
                        TransactionDate = DateTime.Now
                    };

                    // Thêm mới giao dịch
                    await stockTransactionRepository.Add(st);
                    if (st.Id <= 0)
                    {
                        throw new Exception("Lỗi khi thêm giao dịch");
                    }

                    var stockLevels = await stockLevelRepository.GetByWarehouseId(st.WarehouseId) ?? new List<StockLevel>();
                    // Xử lý chi tiết giao dịch
                    if (obj.Details != null && obj.Details.Any())
                    {
                        decimal totalAmount = 0;

                        foreach (var detailDto in obj.Details)
                        {
                            if (obj.TransactionType == TransactionTypeConst.IMPORT)
                            {
                                // Xử lý nhập kho
                                await ProcessImportTransaction(st, detailDto, stockLevels);
                                totalAmount += detailDto.Quantity * detailDto.UnitPrice;
                            }
                            else if (obj.TransactionType == TransactionTypeConst.EXPORT)
                            {
                                // Xử lý xuất kho theo FIFO
                                stockLevels = stockLevels.Where(x => x.IngredientId == detailDto.IngredientId && x.Quantity > 0).ToList();
                                decimal itemTotal = await ProcessExportTransactionFIFO(st, detailDto, stockLevels);
                                totalAmount += itemTotal;
                            }
                            else if (obj.TransactionType == TransactionTypeConst.INVENTORY)
                            {
                                // Xử lý kiểm kê
                                await ProcessInventoryTransaction(st, detailDto);
                            }
                        }

                        // Cập nhật tổng tiền cho giao dịch
                        st.TotalMoney = totalAmount;
                        await stockTransactionRepository.Update(st);
                    }

                    // Commit transaction
                    await transaction.CommitAsync();
                    return st;
                }
                catch (Exception ex)
                {
                    await transaction.RollbackAsync();
                    throw new Exception($"Lỗi khi xử lý giao dịch: {ex.Message}", ex);
                }
            }
        }

        // Phương thức sinh mã giao dịch tự động
        private string GenerateTransactionCode(string transactionType)
        {
            string prefix;
            switch (transactionType)
            {
                case TransactionTypeConst.IMPORT:
                    prefix = "TX-IN";
                    break;
                case TransactionTypeConst.EXPORT:
                    prefix = "TX-OUT";
                    break;
                case TransactionTypeConst.INVENTORY:
                    prefix = "INV";
                    break;
                case TransactionTypeConst.ADJUSTMENT:
                    prefix = "ADJ";
                    break;
                case TransactionTypeConst.ADJUSTMENT_IN:
                    prefix = "ADJ";
                    break;
                case TransactionTypeConst.ADJUSTMENT_OUT:
                    prefix = "ADJ";
                    break;
                default:
                    prefix = "TRX";
                    break;
            }

            string timestamp = DateTime.Now.ToString("yyyyMMddHHmmss");
            return $"{prefix}-{timestamp}";
        }

        // Phương thức xử lý nhập kho
        private async Task ProcessImportTransaction(StockTransaction st, StockTransactionDetailImportDto detail, List<StockLevel> stocks)
        {
            // Kiểm tra xem đã có StockLevel cho nguyên liệu và kho này chưa
            var stockExit = stocks.Where(x => x.IngredientId == detail.IngredientId && x.ExpirationDate.Date == detail.ExpirationDate.Date)
                            .OrderBy(x => x.Quantity).FirstOrDefault();
            if (stockExit != null)
            {
                decimal totalValue = (stockExit.Quantity * stockExit.UnitPrice) + (detail.Quantity * detail.UnitPrice);
                decimal totalQuantity = stockExit.Quantity + detail.Quantity;
                decimal averagePrice = totalValue / totalQuantity;
                decimal roundedAveragePrice = Math.Ceiling(averagePrice / 1000) * 1000;

                stockExit.Quantity += detail.Quantity;
                stockExit.LastUpdatedTime = DateTime.Now;
                stockExit.UnitPrice = roundedAveragePrice;
                await stockLevelRepository.Update(stockExit);

                var std = await CreateSTD(st.Id, detail.Quantity, stockExit.Id);
            }
            else if (!detail.CreateNewBatch)
            {
                var stockBatch = stocks.Where(s => s.IngredientId == detail.IngredientId).OrderBy(x => x.Quantity).FirstOrDefault();
                if (stockBatch != null)
                {
                    decimal totalValue = (stockBatch.Quantity * stockBatch.UnitPrice) + (detail.Quantity * detail.UnitPrice);
                    decimal totalQuantity = stockBatch.Quantity + detail.Quantity;
                    decimal averagePrice = totalValue / totalQuantity;
                    decimal roundedAveragePrice = Math.Ceiling(averagePrice / 1000) * 1000;

                    stockBatch.UnitPrice = roundedAveragePrice;
                    stockBatch.Quantity += detail.Quantity;
                    stockBatch.LastUpdatedTime = DateTime.Now;
                    await stockLevelRepository.Update(stockBatch);

                    var std = await CreateSTD(st.Id, detail.Quantity, stockBatch.Id);
                }
                else
                {
                    var stockLevel = await NewStockLevel(st.WarehouseId, detail);
                    var std = await CreateSTD(st.Id, detail.Quantity, stockLevel.Id);
                }
            }
            else
            {
                var stockLevel = await NewStockLevel(st.WarehouseId, detail);
                var std = await CreateSTD(st.Id, detail.Quantity, stockLevel.Id);
            }
        }

        // Phương thức xử lý xuất kho theo FIFO
        private async Task<decimal> ProcessExportTransactionFIFO(StockTransaction transaction, StockTransactionDetailImportDto detailDto, List<StockLevel> stockLevels)
        {
            decimal totalAmount = 0;
            decimal remainingQuantity = detailDto.Quantity;

            // Sắp xếp theo ngày tạo hoặc ngày hết hạn (FIFO)
            stockLevels = stockLevels.OrderBy(sl => sl.ExpirationDate).ThenBy(sl => sl.CreatedTime).ToList();

            if (stockLevels == null || !stockLevels.Any())
            {
                throw new Exception($"Không có tồn kho cho nguyên liệu ID: {detailDto.IngredientId}");
            }

            // Kiểm tra tổng số lượng có đủ không
            int totalAvailable = stockLevels.Sum(sl => sl.Quantity);
            if (totalAvailable < remainingQuantity)
            {
                throw new Exception($"Không đủ số lượng tồn kho cho nguyên liệu ID: {detailDto.IngredientId}. Yêu cầu: {remainingQuantity}, Hiện có: {totalAvailable}");
            }

            // Xuất kho theo FIFO
            foreach (var stockLevel in stockLevels)
            {
                if (remainingQuantity <= 0)
                    break;

                var stUpdate = await stockLevelRepository.Detail(stockLevel.Id);

                int quantityToTake = (int)Math.Min(stUpdate.Quantity, remainingQuantity);

                // Tạo chi tiết giao dịch
                var detail = new StockTransactionDetail
                {
                    StockTransactionId = transaction.Id,
                    StockLevelId = stUpdate.Id,
                    Quantity = quantityToTake,
                    CreatedTime = DateTime.Now,
                    Active = true
                };

                await stockTransactionDetailRepository.Add(detail);

                // Cập nhật StockLevel
                stUpdate.Quantity -= quantityToTake;
                stUpdate.LastUpdatedTime = DateTime.Now;

                // Nếu số lượng = 0, đánh dấu không còn hoạt động
                if (stUpdate.Quantity <= 0)
                {
                    stUpdate.Active = false;
                    await stockLevelRepository.Delete(stUpdate);
                }
                else
                {
                    await stockLevelRepository.Update(stUpdate);
                }

                // Cập nhật số lượng còn lại và tổng tiền
                remainingQuantity -= quantityToTake;
                totalAmount += quantityToTake * stockLevel.UnitPrice;
            }

            return totalAmount;
        }

        // Phương thức xử lý kiểm kê
        private async Task ProcessInventoryTransaction(StockTransaction transaction, StockTransactionDetailImportDto detailDto)
        {
            // Lấy StockLevel hiện tại
            var stockLevel = await stockLevelRepository.Detail(detailDto.StockLevelId);

            if (stockLevel == null)
            {
                throw new Exception($"Không tìm thấy StockLevel với ID: {detailDto.StockLevelId}");
            }

            // Tạo chi tiết giao dịch
            var detail = new StockTransactionDetail
            {
                StockTransactionId = transaction.Id,
                StockLevelId = stockLevel.Id,
                Quantity = detailDto.Quantity, // Số lượng thực tế sau kiểm kê
                CreatedTime = DateTime.Now,
                Active = true
            };

            await stockTransactionDetailRepository.Add(detail);

            // Tạo bản ghi kiểm kê
            var inventoryAudit = new InventoryAudit
            {
                AuditCode = transaction.StockTransactionCode,
                AuditDate = transaction.TransactionDate,
                Auditor = transaction.Account.Username, // Giả sử Account có trường Username
                Note = transaction.Note,
                CreatedTime = DateTime.Now,
                Active = true,
                WarehouseId = transaction.WarehouseId
            };

            await inventoryAuditRepository.Add(inventoryAudit);

            // Tạo bản ghi chênh lệch nếu có
            if (stockLevel.Quantity != detailDto.Quantity)
            {
                var discrepancy = new InventoryDiscrepancy
                {
                    InventoryAuditId = inventoryAudit.Id,
                    StockLevelId = stockLevel.Id,
                    ExpectedQuantity = stockLevel.Quantity,
                    ActualQuantity = detailDto.Quantity,
                    DiscrepancyReason = detailDto.Note,
                    CreatedTime = DateTime.Now,
                    Active = true
                };

                await inventoryDiscrepancyRepository.Add(discrepancy);

                // Cập nhật số lượng thực tế vào StockLevel
                stockLevel.Quantity = detailDto.Quantity;
                stockLevel.LastUpdatedTime = DateTime.Now;
                await stockLevelRepository.Update(stockLevel);
            }
        }       
        private async Task<StockLevel> NewStockLevel(int warehouseId, StockTransactionDetailImportDto detail)
        {
            var stockLevel = new StockLevel
            {
                IngredientId = detail.IngredientId,
                WarehouseId = warehouseId,
                Quantity = detail.Quantity,
                UnitPrice = detail.UnitPrice,
                ExpirationDate = detail.ExpirationDate,
                CreatedTime = DateTime.Now,
                LastUpdatedTime = DateTime.Now,
                Active = true
            };
            await stockLevelRepository.Add(stockLevel);
            if (stockLevel.Id <= 0)
            {
                throw new Exception("Lỗi khi thêm chi tiết giao dịch");
            }
            return stockLevel;
        }

        private async Task<StockTransactionDetail> CreateSTD(int stId, int quantity, int stLevelId)
        {
            var std = new StockTransactionDetail
            {
                StockLevelId = stLevelId,
                StockTransactionId = stId,
                Quantity = quantity,
                CreatedTime = DateTime.Now,
                Active = true
            };
            await stockTransactionDetailRepository.Add(std);
            if (std.Id <= 0)
            {
                throw new Exception("Lỗi khi thêm chi tiết giao dịch");
            }
            return std;
        }
    
        public async Task<List<StockTransactionImportDto>> GetTransactionByWarehouse(int warehouseId)
        {
            return await stockTransactionRepository.GetTransactionByWarehouse(warehouseId);
        }
    }
}

