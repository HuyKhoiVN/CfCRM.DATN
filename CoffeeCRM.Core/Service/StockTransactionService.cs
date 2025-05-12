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
using Newtonsoft.Json;
using CoffeeCRM.Core.Repository.Interfaces;

namespace CoffeeCRM.Core.Service
{
    public class StockTransactionService : IStockTransactionService
    {
        IStockTransactionRepository stockTransactionRepository;
        IStockTransactionDetailRepository stockTransactionDetailRepository;
        IStockLevelRepository stockLevelRepository;
        IInventoryDiscrepancyRepository inventoryDiscrepancyRepository;
        IInventoryAuditRepository inventoryAuditRepository;
        IIngredientRepository ingredientRepository;
        IDraftDetailRepository draftDetailRepository;
        IWarehouseRepository warehouseRepository;
        IAccountRepository accountRepository;

        public StockTransactionService(
            IStockTransactionRepository _stockTransactionRepository,
            IStockTransactionDetailRepository _stockTransactionDetailRepository,
            IStockLevelRepository _stockLevelRepository,
            IInventoryDiscrepancyRepository _inventoryDiscrepancyRepository,
            IInventoryAuditRepository _inventoryAuditRepository,
            IIngredientRepository _ingredientRepository,
            IDraftDetailRepository _draftDetailRepository,
            IWarehouseRepository _warehouseRepository,
            IAccountRepository _accountRepository
            )
        {
            stockTransactionRepository = _stockTransactionRepository;
            stockTransactionDetailRepository = _stockTransactionDetailRepository;
            stockLevelRepository = _stockLevelRepository;
            inventoryDiscrepancyRepository = _inventoryDiscrepancyRepository;
            inventoryAuditRepository = _inventoryAuditRepository;
            ingredientRepository = _ingredientRepository;
            draftDetailRepository = _draftDetailRepository;
            warehouseRepository = _warehouseRepository;
            accountRepository = _accountRepository;
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

        public async Task<DTResult<StockTransactionImportDto>> ListServerSideByWarehouse(StockTransactionDTParameters parameters)
        {
            return await stockTransactionRepository.ListServerSideByWarehouse(parameters);
        }

        //public async Task<List<StockTransaction>> Search(string keyword)
        //{
        //    return await stockTransactionRepository.Search(keyword);
        //}

        public async Task Update(StockTransaction obj)
        {
            await stockTransactionRepository.Update(obj);
        }

        public async Task<List<StockTransactionImportDto>> GetTransactionByWarehouse(int warehouseId)
        {
            return await stockTransactionRepository.GetTransactionByWarehouse(warehouseId);
        }

        #region Giao dịch và xử lý trạng thái
        public async Task<StockTransaction> AddNewTransaction(StockTransactionImportDto obj)
        {
            if (obj.TransactionType != TransactionTypeConst.IMPORT &&
                obj.TransactionType != TransactionTypeConst.EXPORT &&
                obj.TransactionType != TransactionTypeConst.INVENTORY)
            {
                throw new Exception("Loại giao dịch không hợp lệ");
            }

            using (var transaction = stockTransactionRepository.GetDatabase().BeginTransaction())
            {
                try
                {
                    // Tạo giao dịch mới
                    var st = new StockTransaction
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

                    await stockTransactionRepository.Add(st);
                    if (st.Id <= 0)
                    {
                        throw new Exception("Lỗi khi thêm giao dịch");
                    }

                    // Xử lý chi tiết giao dịch
                    var stockLevels = await stockLevelRepository.GetByWarehouseId(st.WarehouseId) ?? new List<StockLevel>();
                    decimal totalAmount = 0;

                    if (obj.Details != null && obj.Details.Any())
                    {
                        foreach (var detailDto in obj.Details)
                        {
                            if (obj.TransactionType == TransactionTypeConst.IMPORT)
                            {
                                await ProcessImportTransaction(st, detailDto, stockLevels);
                                totalAmount += detailDto.Quantity * detailDto.UnitPrice;
                            }
                            else if (obj.TransactionType == TransactionTypeConst.EXPORT)
                            {
                                var filteredStockLevels = stockLevels
                                    .Where(x => x.IngredientId == detailDto.IngredientId && x.Quantity > 0)
                                    .ToList();
                                decimal itemTotal = await ProcessExportTransactionFIFO(st, detailDto, filteredStockLevels);
                                totalAmount += itemTotal;
                            }
                            else if (obj.TransactionType == TransactionTypeConst.INVENTORY)
                            {
                                await ProcessInventoryTransaction(st, detailDto);
                            }
                        }

                        // Cập nhật tổng tiền
                        st.TotalMoney = totalAmount;
                        await stockTransactionRepository.Update(st);
                    }

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

        public async Task<StockTransaction> AddOrUpdateTransaction(StockTransactionImportDto obj)
        {
            // Xác định trạng thái ban đầu
            string initialStatus = string.IsNullOrEmpty(obj.Status) ? TransactionStatusConst.DRAFT : obj.Status;

            using (var transaction = stockTransactionRepository.GetDatabase().BeginTransaction())
            {
                try
                {
                    StockTransaction st;
                    bool isNew = obj.Id == 0;

                    if (isNew)
                    {
                        // Tạo mới giao dịch
                        st = new StockTransaction
                        {
                            StockTransactionCode = GenerateTransactionCode(obj.TransactionType),
                            Note = obj.Note,
                            TransactionType = obj.TransactionType,
                            TotalMoney = obj.TotalMoney,
                            Status = initialStatus,
                            CreatedTime = DateTime.Now,
                            Active = true,
                            WarehouseId = obj.WarehouseId,
                            AccountId = obj.AccountId,
                            TransactionDate = DateTime.Now
                        };

                        await stockTransactionRepository.Add(st);
                    }
                    else
                    {
                        // Cập nhật giao dịch hiện có
                        st = await stockTransactionRepository.Detail(obj.Id);
                        if (st == null)
                        {
                            throw new Exception($"Không tìm thấy giao dịch với ID: {obj.Id}");
                        }

                        if (st.Status == TransactionStatusConst.COMPLETED || st.Status == TransactionStatusConst.CANCELED)
                        {
                            throw new Exception("Không thể cập nhật giao dịch đã hoàn thành hoặc đã hủy");
                        }

                        st.Note = obj.Note;
                        st.TotalMoney = obj.TotalMoney;
                        st.Status = obj.Status;
                        st.WarehouseId = obj.WarehouseId;
                        st.AccountId = obj.AccountId;

                        await stockTransactionRepository.Update(st);
                    }

                    // Chỉ xử lý chi tiết và điều chỉnh kho nếu trạng thái là COMPLETED
                    if (st.Status == TransactionStatusConst.COMPLETED)
                    {
                        // Xử lý điều chỉnh kho
                        await ProcessCompletedTransaction(st, obj);
                    }
                    else
                    {
                        // Lưu chi tiết vào bảng dự thảo
                        await SaveDraftDetails(st.Id, obj.Details);
                    }

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

        public async Task<StockTransaction> UpdateTransactionStatus(int transactionId, string newStatus, int userId, string note = null)
        {
            using (var transaction = stockTransactionRepository.GetDatabase().BeginTransaction())
            {
                try
                {
                    var st = await stockTransactionRepository.Detail(transactionId);
                    if (st == null)
                    {
                        throw new Exception($"Không tìm thấy giao dịch với ID: {transactionId}");
                    }

                    if (st.Status == TransactionStatusConst.COMPLETED || st.Status == TransactionStatusConst.CANCELED)
                    {
                        throw new Exception("Không thể thay đổi trạng thái của giao dịch đã hoàn thành hoặc đã hủy");
                    }

                    string oldStatus = st.Status;
                    st.Status = newStatus;

                    // Cập nhật thông tin trạng thái
                    if (newStatus == TransactionStatusConst.PENDING)
                    {
                        // Không cần thêm thông tin
                    }
                    else if (newStatus == TransactionStatusConst.COMPLETED)
                    {
                        st.CompletedDate = DateTime.Now;
                        st.CompletedBy = userId;

                        // Xử lý điều chỉnh kho
                        await ProcessCompletedTransactionFromDraft(st);
                    }
                    else if (newStatus == TransactionStatusConst.CANCELED)
                    {
                        st.CanceledDate = DateTime.Now;
                        st.CanceledBy = userId;
                        st.Note = string.IsNullOrEmpty(note) ? st.Note : st.Note + " | " + note;
                    }

                    // Cập nhật lịch sử trạng thái
                    UpdateStatusHistory(st, newStatus, userId, note);

                    await stockTransactionRepository.Update(st);
                    await transaction.CommitAsync();
                    return st;
                }
                catch (Exception ex)
                {
                    await transaction.RollbackAsync();
                    throw new Exception($"Lỗi khi cập nhật trạng thái: {ex.Message}", ex);
                }
            }
        }

        public async Task<StockTransaction> CancelTransaction(int transactionId, string cancelReason, int canceledBy)
        {
            return await UpdateTransactionStatus(transactionId, TransactionStatusConst.CANCELED, canceledBy, cancelReason);
        }

        public async Task<TransactionDetailViewModel> DetailForReview(int transactionId)
        {
            return await stockTransactionRepository.GetTransactionDetailForReview(transactionId);
        }

        public async Task<TransactionDetailViewModel> GetTransactionDetailForReview(int transactionId)
        {
            // Lấy thông tin giao dịch
            var transaction = await stockTransactionRepository.Detail(transactionId);
            if (transaction == null)
            {
                throw new Exception($"Không tìm thấy giao dịch với ID: {transactionId}");
            }

            // Lấy thông tin kho và người tạo
            var warehouse = await warehouseRepository.Detail(transaction.WarehouseId);
            var creator = await accountRepository.Detail(transaction.AccountId);

            // Khởi tạo ViewModel
            var viewModel = new TransactionDetailViewModel
            {
                Id = transaction.Id,
                TransactionCode = transaction.StockTransactionCode,
                TransactionType = transaction.TransactionType,
                Status = transaction.Status,
                CreatedDate = transaction.CreatedTime,
                TransactionDate = transaction.TransactionDate,
                TotalMoney = transaction.TotalMoney,
                Note = transaction.Note,
                WarehouseName = warehouse?.WarehouseName,
                CreatedBy = creator?.FullName,
                Details = new List<TransactionDetailItemViewModel>()
            };

            // Lấy chi tiết giao dịch dựa vào trạng thái
            if (transaction.Status == TransactionStatusConst.COMPLETED)
            {
                // Nếu đã hoàn thành, lấy từ bảng StockTransactionDetail
                var details = await stockTransactionDetailRepository.GetByTransactionId(transactionId);

                foreach (var detail in details)
                {
                    // Lấy thông tin StockLevel
                    var stockLevel = await stockLevelRepository.Detail(detail.StockLevelId);
                    if (stockLevel == null) continue;

                    // Lấy thông tin nguyên liệu
                    var ingredient = await ingredientRepository.Detail(stockLevel.IngredientId);
                    if (ingredient == null) continue;

                    viewModel.Details.Add(new TransactionDetailItemViewModel
                    {
                        Id = detail.Id,
                        StockLevelId = stockLevel.Id, // Thêm trường này để sử dụng trong kiểm kê
                        IngredientId = stockLevel.IngredientId,
                        IngredientName = ingredient.IngredientName,
                        IngredientCode = ingredient.IngredientCode,
                        Quantity = detail.Quantity,
                        UnitPrice = stockLevel.UnitPrice,
                        TotalPrice = detail.Quantity * stockLevel.UnitPrice,
                        ExpirationDate = stockLevel.ExpirationDate,
                        Unit = ingredient.Unit?.UnitName
                    });
                }
            }
            else
            {
                // Nếu chưa hoàn thành, lấy từ bảng dự thảo
                var draftDetails = await draftDetailRepository.GetByTransactionId(transactionId);

                foreach (var draft in draftDetails)
                {
                    // Lấy thông tin nguyên liệu
                    var ingredient = await ingredientRepository.Detail(draft.IngredientId);
                    if (ingredient == null) continue;

                    var detailItem = new TransactionDetailItemViewModel
                    {
                        Id = draft.Id,
                        IngredientId = draft.IngredientId,
                        IngredientName = ingredient.IngredientName,
                        IngredientCode = ingredient.IngredientCode,
                        Quantity = draft.Quantity,
                        UnitPrice = draft.UnitPrice,
                        TotalPrice = draft.Quantity * draft.UnitPrice,
                        ExpirationDate = draft.ExpirationDate,
                        Unit = ingredient.Unit?.UnitName,
                        CreateNewBatch = draft.CreateNewBatch,
                        Note = draft.Note
                    };

                    // Nếu là kiểm kê, cần thêm StockLevelId
                    if (transaction.TransactionType == TransactionTypeConst.INVENTORY &&
                        draft.StockLevelId.HasValue && draft.StockLevelId.Value > 0)
                    {
                        detailItem.StockLevelId = draft.StockLevelId.Value;

                        // Lấy số lượng hiện tại của lô hàng để tính chênh lệch
                        var stockLevel = await stockLevelRepository.Detail(draft.StockLevelId.Value);
                        if (stockLevel != null)
                        {
                            detailItem.ExpectedQuantity = stockLevel.Quantity;
                            detailItem.Discrepancy = draft.Quantity - stockLevel.Quantity;
                        }
                    }

                    viewModel.Details.Add(detailItem);
                }
            }

            // Nếu là xuất kho, thêm thông tin về tồn kho hiện tại
            if (transaction.TransactionType == TransactionTypeConst.EXPORT &&
                (transaction.Status == TransactionStatusConst.DRAFT || transaction.Status == TransactionStatusConst.PENDING))
            {
                foreach (var detail in viewModel.Details)
                {
                    // Lấy tổng tồn kho hiện tại
                    var currentStock = await stockLevelRepository.GetTotalQuantityByIngredient(detail.IngredientId, transaction.WarehouseId);
                    detail.CurrentStock = currentStock;
                                                  
                    // Kiểm tra nếu số lượng xuất lớn hơn tồn kho
                    if (detail.Quantity > currentStock)
                    {
                        detail.StockWarning = true;
                        detail.WarningMessage = $"Số lượng xuất ({detail.Quantity}) lớn hơn tồn kho hiện tại ({currentStock})";
                    }
                }
            }

            return viewModel;
        }

        private void UpdateStatusHistory(StockTransaction st, string newStatus, int userId, string note)
        {
            var statusHistory = string.IsNullOrEmpty(st.StatusHistory)
                ? new List<StatusHistoryItem>()
                : JsonConvert.DeserializeObject<List<StatusHistoryItem>>(st.StatusHistory);

            if (statusHistory == null)
            {
                statusHistory = new List<StatusHistoryItem>();
            }

            statusHistory.Add(new StatusHistoryItem
            {
                Status = newStatus,
                Date = DateTime.Now,
                UserId = userId,
                Reason = note
            });

            st.StatusHistory = JsonConvert.SerializeObject(statusHistory);
        }
        #endregion

        #region Xử lý giao dịch nhập/xuất kho
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
                case TransactionTypeConst.ADJUSTMENT_IN:
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

        private async Task ProcessImportTransaction(StockTransaction st, StockTransactionDetailImportDto detail, List<StockLevel> stocks)
        {
            // Kiểm tra xem đã có StockLevel cho nguyên liệu và kho này chưa với cùng ngày hết hạn
            var stockExit = stocks
                .Where(x => x.IngredientId == detail.IngredientId && x.ExpirationDate.Date == detail.ExpirationDate.Date)
                .OrderBy(x => x.Quantity)
                .FirstOrDefault();

            if (stockExit != null && !detail.CreateNewBatch)
            {
                // Cập nhật StockLevel hiện có
                decimal totalValue = (stockExit.Quantity * stockExit.UnitPrice) + (detail.Quantity * detail.UnitPrice);
                decimal totalQuantity = stockExit.Quantity + detail.Quantity;
                decimal averagePrice = totalValue / totalQuantity;
                decimal roundedAveragePrice = Math.Ceiling(averagePrice / 1000) * 1000;

                stockExit.Quantity += detail.Quantity;
                stockExit.LastUpdatedTime = DateTime.Now;
                stockExit.UnitPrice = roundedAveragePrice;
                await stockLevelRepository.Update(stockExit);

                await CreateSTD(st.Id, detail.Quantity, stockExit.Id);
            }
            else if (!detail.CreateNewBatch)
            {
                // Không có StockLevel với ngày hết hạn cụ thể, nhưng không yêu cầu tạo lô mới
                // Tìm bất kỳ StockLevel nào của nguyên liệu này
                var stockBatch = stocks
                    .Where(s => s.IngredientId == detail.IngredientId)
                    .OrderBy(x => x.Quantity)
                    .FirstOrDefault();

                if (stockBatch != null)
                {
                    // Cập nhật StockLevel hiện có
                    decimal totalValue = (stockBatch.Quantity * stockBatch.UnitPrice) + (detail.Quantity * detail.UnitPrice);
                    decimal totalQuantity = stockBatch.Quantity + detail.Quantity;
                    decimal averagePrice = totalValue / totalQuantity;
                    decimal roundedAveragePrice = Math.Ceiling(averagePrice / 1000) * 1000;

                    stockBatch.UnitPrice = roundedAveragePrice;
                    stockBatch.Quantity += detail.Quantity;
                    stockBatch.LastUpdatedTime = DateTime.Now;
                    await stockLevelRepository.Update(stockBatch);

                    await CreateSTD(st.Id, detail.Quantity, stockBatch.Id);
                }
                else
                {
                    // Không có StockLevel nào, tạo mới
                    var stockLevel = await NewStockLevel(st.WarehouseId, detail);
                    await CreateSTD(st.Id, detail.Quantity, stockLevel.Id);
                }
            }
            else
            {
                // Yêu cầu tạo lô mới
                var stockLevel = await NewStockLevel(st.WarehouseId, detail);
                await CreateSTD(st.Id, detail.Quantity, stockLevel.Id);
            }
        }

        private async Task<decimal> ProcessExportTransactionFIFO(StockTransaction st, StockTransactionDetailImportDto detail, List<StockLevel> stockLevels)
        {
            int remainingQuantity = detail.Quantity;
            decimal totalAmount = 0;

            // Sắp xếp theo ngày hết hạn và ngày tạo (FIFO)
            var sortedStockLevels = stockLevels
                .Where(x => x.IngredientId == detail.IngredientId && x.Quantity > 0)
                .OrderBy(x => x.ExpirationDate)
                .ThenBy(x => x.CreatedTime)
                .ToList();

            if (!sortedStockLevels.Any())
            {
                throw new Exception($"Không đủ tồn kho cho nguyên liệu ID: {detail.IngredientId}");
            }

            // Kiểm tra tổng số lượng có đủ không
            int totalAvailable = sortedStockLevels.Sum(sl => sl.Quantity);
            if (totalAvailable < remainingQuantity)
            {
                throw new Exception($"Không đủ số lượng tồn kho cho nguyên liệu ID: {detail.IngredientId}. Yêu cầu: {remainingQuantity}, Hiện có: {totalAvailable}");
            }

            // Xuất kho theo FIFO
            foreach (var stockLevel in sortedStockLevels)
            {
                if (remainingQuantity <= 0) break;

                int quantityToDeduct = Math.Min(remainingQuantity, stockLevel.Quantity);
                remainingQuantity -= quantityToDeduct;

                // Cập nhật StockLevel
                stockLevel.Quantity -= quantityToDeduct;
                stockLevel.LastUpdatedTime = DateTime.Now;

                if (stockLevel.Quantity <= 0)
                {
                    stockLevel.Active = false;
                }

                await stockLevelRepository.Update(stockLevel);

                // Tạo chi tiết giao dịch
                var transactionDetail = new StockTransactionDetail
                {
                    StockTransactionId = st.Id,
                    StockLevelId = stockLevel.Id,
                    Quantity = quantityToDeduct,
                    CreatedTime = DateTime.Now,
                    Active = true
                };

                await stockTransactionDetailRepository.Add(transactionDetail);

                // Tính tổng tiền
                totalAmount += quantityToDeduct * stockLevel.UnitPrice;
            }

            if (remainingQuantity > 0)
            {
                throw new Exception($"Không đủ tồn kho cho nguyên liệu ID: {detail.IngredientId}. Còn thiếu {remainingQuantity}");
            }

            return totalAmount;
        }

        private async Task ProcessInventoryTransaction(StockTransaction st, StockTransactionDetailImportDto detail)
        {
            // Lấy StockLevel cần kiểm kê
            var stockLevel = await stockLevelRepository.Detail(detail.StockLevelId);
            if (stockLevel == null)
            {
                throw new Exception($"Không tìm thấy StockLevel với ID: {detail.StockLevelId}");
            }

            // Tạo chi tiết giao dịch
            var transactionDetail = new StockTransactionDetail
            {
                StockTransactionId = st.Id,
                StockLevelId = stockLevel.Id,
                Quantity = detail.Quantity, // Số lượng thực tế sau kiểm kê
                CreatedTime = DateTime.Now,
                Active = true,
            };

            await stockTransactionDetailRepository.Add(transactionDetail);

            // Tạo bản ghi kiểm kê
            var inventoryAudit = new InventoryAudit
            {
                AuditCode = st.StockTransactionCode,
                AuditDate = st.TransactionDate,
                Auditor = st.Account?.Username ?? st.AccountId.ToString(),
                Note = st.Note,
                CreatedTime = DateTime.Now,
                Active = true,
                WarehouseId = st.WarehouseId
            };

            await inventoryAuditRepository.Add(inventoryAudit);

            // Tạo bản ghi chênh lệch nếu có
            if (stockLevel.Quantity != detail.Quantity)
            {
                var discrepancy = new InventoryDiscrepancy
                {
                    InventoryAuditId = inventoryAudit.Id,
                    StockLevelId = stockLevel.Id, // Sử dụng StockLevelId thay vì IngredientId
                    ExpectedQuantity = stockLevel.Quantity,
                    ActualQuantity = detail.Quantity,
                    DiscrepancyReason = detail.Note,
                    CreatedTime = DateTime.Now,
                    Active = true
                };

                await inventoryDiscrepancyRepository.Add(discrepancy);

                // Cập nhật số lượng thực tế vào StockLevel
                stockLevel.Quantity = detail.Quantity;
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
                throw new Exception("Lỗi khi thêm chi tiết tồn kho");
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
        #endregion

        #region Xử lý giao dịch từ dự thảo
        private async Task SaveDraftDetails(int transactionId, List<StockTransactionDetailImportDto> details)
        {
            if (details == null || !details.Any())
                return;

            // Xóa chi tiết dự thảo cũ
            await draftDetailRepository.DeleteByTransactionId(transactionId);

            // Thêm chi tiết dự thảo mới
            foreach (var detail in details)
            {
                var draftDetail = new StockTransactionDraftDetail
                {
                    StockTransactionId = transactionId,
                    IngredientId = detail.IngredientId,
                    StockLevelId = detail.StockLevelId, // Quan trọng cho kiểm kê
                    Quantity = detail.Quantity,
                    UnitPrice = detail.UnitPrice,
                    ExpirationDate = detail.ExpirationDate,
                    Note = detail.Note,
                    CreateNewBatch = detail.CreateNewBatch,
                    CreatedTime = DateTime.Now
                };

                await draftDetailRepository.Add(draftDetail);
            }
        }

        private async Task ProcessCompletedTransaction(StockTransaction st, StockTransactionImportDto obj)
        {
            // Xử lý chi tiết giao dịch
            var stockLevels = await stockLevelRepository.GetByWarehouseId(st.WarehouseId) ?? new List<StockLevel>();
            decimal totalAmount = 0;

            foreach (var detail in obj.Details)
            {
                if (st.TransactionType == TransactionTypeConst.IMPORT)
                {
                    await ProcessImportTransaction(st, detail, stockLevels);
                    totalAmount += detail.Quantity * detail.UnitPrice;
                }
                else if (st.TransactionType == TransactionTypeConst.EXPORT)
                {
                    var filteredStockLevels = stockLevels.Where(x => x.IngredientId == detail.IngredientId && x.Quantity > 0).ToList();
                    decimal itemTotal = await ProcessExportTransactionFIFO(st, detail, filteredStockLevels);
                    totalAmount += itemTotal;
                }
                else if (st.TransactionType == TransactionTypeConst.INVENTORY)
                {
                    await ProcessInventoryTransaction(st, detail);
                }
            }

            // Cập nhật tổng tiền
            st.TotalMoney = totalAmount;
            await stockTransactionRepository.Update(st);
        }

        private async Task ProcessCompletedTransactionFromDraft(StockTransaction st)
        {
            // Lấy chi tiết dự thảo
            var draftDetails = await draftDetailRepository.GetByTransactionId(st.Id);

            if (draftDetails != null && draftDetails.Any())
            {
                // Chuyển đổi từ dự thảo sang DTO
                var detailDtos = draftDetails.Select(d => new StockTransactionDetailImportDto
                {
                    IngredientId = d.IngredientId,
                    StockLevelId = d.StockLevelId, // Quan trọng cho kiểm kê
                    Quantity = d.Quantity,
                    UnitPrice = d.UnitPrice,
                    ExpirationDate = d.ExpirationDate,
                    Note = d.Note,
                    CreateNewBatch = d.CreateNewBatch
                }).ToList();

                // Xử lý điều chỉnh kho
                var stockLevels = await stockLevelRepository.GetByWarehouseId(st.WarehouseId) ?? new List<StockLevel>();
                decimal totalAmount = 0;

                foreach (var detailDto in detailDtos)
                {
                    if (st.TransactionType == TransactionTypeConst.IMPORT)
                    {
                        await ProcessImportTransaction(st, detailDto, stockLevels);
                        totalAmount += detailDto.Quantity * detailDto.UnitPrice;
                    }
                    else if (st.TransactionType == TransactionTypeConst.EXPORT)
                    {
                        var filteredStockLevels = stockLevels.Where(x => x.IngredientId == detailDto.IngredientId && x.Quantity > 0).ToList();
                        decimal itemTotal = await ProcessExportTransactionFIFO(st, detailDto, filteredStockLevels);
                        totalAmount += itemTotal;
                    }
                    else if (st.TransactionType == TransactionTypeConst.INVENTORY)
                    {
                        await ProcessInventoryTransaction(st, detailDto);
                    }
                }

                // Cập nhật tổng tiền
                st.TotalMoney = totalAmount;
                await stockTransactionRepository.Update(st);

                // Xóa chi tiết dự thảo sau khi đã xử lý
                await draftDetailRepository.DeleteByTransactionId(st.Id);
            }
        }
        #endregion
    }

    // Lớp StatusHistoryItem để lưu trữ lịch sử trạng thái
    public class StatusHistoryItem
    {
        public string Status { get; set; }
        public DateTime Date { get; set; }
        public int UserId { get; set; }
        public string Reason { get; set; }
    }
}

