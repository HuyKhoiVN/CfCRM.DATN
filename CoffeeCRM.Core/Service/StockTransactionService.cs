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
            if (obj.TransactionType != TransactionTypeConst.IMPORT && obj.TransactionType != TransactionTypeConst.EXPORT && obj.TransactionType != TransactionTypeConst.INVENTORY)
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
                                decimal itemTotal = await ProcessExportTransactionFIFO2(st, detailDto, stockLevels);
                                totalAmount += itemTotal;
                            }
                            else if (obj.TransactionType == TransactionTypeConst.INVENTORY)
                            {
                                // Xử lý kiểm kê
                                await ProcessInventoryTransaction2(st, detailDto);
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
        private async Task<decimal> ProcessExportTransactionFIFO2(StockTransaction transaction, StockTransactionDetailImportDto detailDto, List<StockLevel> stockLevels)
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
        private async Task ProcessInventoryTransaction2(StockTransaction transaction, StockTransactionDetailImportDto detailDto)
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

        // new methods
        // Phương thức thêm/cập nhật giao dịch với hỗ trợ trạng thái
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

        // Phương thức cập nhật trạng thái
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

        // Phương thức hủy giao dịch
        public async Task<StockTransaction> CancelTransaction(int transactionId, string cancelReason, int canceledBy)
        {
            return await UpdateTransactionStatus(transactionId, TransactionStatusConst.CANCELED, canceledBy, cancelReason);
        }

        // Phương thức xem chi tiết giao dịch
        public async Task<TransactionDetailViewModel> GetTransactionDetailForReview(int transactionId)
        {
            // Lấy thông tin giao dịch
            var transaction = await stockTransactionRepository.Detail(transactionId);
            if (transaction == null)
            {
                throw new Exception($"Không tìm thấy giao dịch với ID: {transactionId}");
            }

            // Lấy thông tin kho
            var warehouse = await warehouseRepository.Detail(transaction.WarehouseId);

            // Lấy thông tin người tạo
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

                    viewModel.Details.Add(new TransactionDetailItemViewModel
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
                    });
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

            // Nếu là kiểm kê, thêm thông tin về tồn kho dự kiến
            if (transaction.TransactionType == TransactionTypeConst.INVENTORY &&
                (transaction.Status == TransactionStatusConst.DRAFT || transaction.Status == TransactionStatusConst.PENDING))
            {
                foreach (var detail in viewModel.Details)
                {
                    // Lấy tổng tồn kho hiện tại cho nguyên liệu này
                    var currentStock = await stockLevelRepository.GetTotalQuantityByIngredient(detail.IngredientId, transaction.WarehouseId);
                    detail.ExpectedQuantity = currentStock;
                    detail.Discrepancy = detail.Quantity - currentStock;
                }
            }

            return viewModel;
        }

        // Phương thức lưu chi tiết dự thảo
        private async Task SaveDraftDetails(int transactionId, List<StockTransactionDetailImportDto> details)
        {
            // Xóa chi tiết dự thảo cũ
            await draftDetailRepository.DeleteByTransactionId(transactionId);

            // Thêm chi tiết dự thảo mới
            foreach (var detail in details)
            {
                var draftDetail = new StockTransactionDraftDetail
                {
                    StockTransactionId = transactionId,
                    IngredientId = detail.IngredientId,
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

        // Phương thức xử lý giao dịch hoàn thành từ dự thảo
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
                        stockLevels = stockLevels.Where(x => x.IngredientId == detailDto.IngredientId && x.Quantity > 0).ToList();
                        decimal itemTotal = await ProcessExportTransactionFIFO(st, detailDto, stockLevels);
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

        // Cập nhật lịch sử trạng thái
        private void UpdateStatusHistory(StockTransaction st, string newStatus, int userId, string note)
        {
            var statusHistory = string.IsNullOrEmpty(st.StatusHistory)
                ? new List<StatusHistoryItem>()
                : JsonConvert.DeserializeObject<List<StatusHistoryItem>>(st.StatusHistory);

            statusHistory.Add(new StatusHistoryItem
            {
                Status = newStatus,
                Date = DateTime.Now,
                UserId = userId,
                Reason = note
            });

            st.StatusHistory = JsonConvert.SerializeObject(statusHistory);
        }

        // Phương thức xử lý giao dịch hoàn thành
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

        // Phương thức xử lý giao dịch xuất kho theo FIFO
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

            foreach (var stockLevel in sortedStockLevels)
            {
                if (remainingQuantity <= 0) break;

                int quantityToDeduct = Math.Min(remainingQuantity, stockLevel.Quantity);
                remainingQuantity -= quantityToDeduct;

                // Cập nhật StockLevel
                stockLevel.Quantity -= quantityToDeduct;
                stockLevel.LastUpdatedTime = DateTime.Now;

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

        // Phương thức xử lý giao dịch kiểm kê
        private async Task ProcessInventoryTransaction(StockTransaction st, StockTransactionDetailImportDto detail)
        {
            // Lấy tổng số lượng hiện tại
            int currentQuantity = await stockLevelRepository.GetTotalQuantityByIngredient(detail.IngredientId, st.WarehouseId);
            int discrepancy = detail.Quantity - currentQuantity;

            // Tạo bản ghi kiểm kê
            var inventoryAudit = new InventoryAudit
            {
                AuditCode = st.StockTransactionCode,
                AuditDate = st.CompletedDate ?? DateTime.Now,
                Auditor = st.AccountId.ToString(), // Hoặc lấy từ Account nếu có
                Note = st.Note,
                CreatedTime = DateTime.Now,
                Active = true,
                WarehouseId = st.WarehouseId
            };

            await inventoryAuditRepository.Add(inventoryAudit);

            // Nếu có chênh lệch, tạo bản ghi chênh lệch
            if (discrepancy != 0)
            {
                var inventoryDiscrepancy = new InventoryDiscrepancy
                {
                    InventoryAuditId = inventoryAudit.Id,
                    StockLevelId = detail.IngredientId, // Thêm trường này vào model nếu chưa có
                    ExpectedQuantity = currentQuantity,
                    ActualQuantity = detail.Quantity,
                    DiscrepancyReason = detail.Note,
                    CreatedTime = DateTime.Now,
                    Active = true
                };

                await inventoryDiscrepancyRepository.Add(inventoryDiscrepancy);

                // Điều chỉnh tồn kho nếu có chênh lệch
                if (discrepancy > 0)
                {
                    // Thêm vào kho nếu thừa
                    var stockLevel = new StockLevel
                    {
                        IngredientId = detail.IngredientId,
                        WarehouseId = st.WarehouseId,
                        Quantity = discrepancy,
                        UnitPrice = detail.UnitPrice,
                        ExpirationDate = detail.ExpirationDate,
                        CreatedTime = DateTime.Now,
                        LastUpdatedTime = DateTime.Now,
                        Active = true
                    };

                    await stockLevelRepository.Add(stockLevel);
                }
                else if (discrepancy < 0)
                {
                    // Giảm từ kho nếu thiếu (sử dụng FIFO)
                    var stockLevels = await stockLevelRepository.GetByWarehouseId(st.WarehouseId);
                    stockLevels = stockLevels.Where(x => x.IngredientId == detail.IngredientId && x.Quantity > 0)
                        .OrderBy(x => x.ExpirationDate)
                        .ThenBy(x => x.CreatedTime)
                        .ToList();

                    int remainingToDeduct = Math.Abs(discrepancy);

                    foreach (var stockLevel in stockLevels)
                    {
                        if (remainingToDeduct <= 0) break;

                        int quantityToDeduct = Math.Min(remainingToDeduct, stockLevel.Quantity);
                        remainingToDeduct -= quantityToDeduct;

                        stockLevel.Quantity -= quantityToDeduct;
                        stockLevel.LastUpdatedTime = DateTime.Now;

                        await stockLevelRepository.Update(stockLevel);
                    }
                }
            }
        }
    }
}

