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
    public class PurchaseOrderService : IPurchaseOrderService
    {
        IPurchaseOrderRepository purchaseOrderRepository;
        IPurchaseOrderDetailRepository purchaseOrderDetailRepository;
        IAccountActivityRepository accountActivityRepository;
        IDebtRepository debtRepository;
        IIngredientRepository ingredientRepository;
        IStockLevelRepository stockLevelRepository;
        IStockTransactionRepository stockTransactionRepository;
        IStockTransactionDetailRepository stockTransactionDetailRepository;
        ICashFlowRepository cashFlowRepository;

        public PurchaseOrderService(
            IPurchaseOrderRepository _purchaseOrderRepository,
            IPurchaseOrderDetailRepository _purchaseOrderDetailRepository,
            IAccountActivityRepository _accountActivityRepository,
            IDebtRepository _debtRepository,
            IIngredientRepository _ingredientRepository,
            IStockLevelRepository _stockLevelRepository,
            IStockTransactionRepository _stockTransactionRepository,
            IStockTransactionDetailRepository _stockTransactionDetailRepository,
            ICashFlowRepository _cashFlowRepository
            )
        {
            purchaseOrderRepository = _purchaseOrderRepository;
            purchaseOrderDetailRepository = _purchaseOrderDetailRepository;
            accountActivityRepository = _accountActivityRepository;
            debtRepository = _debtRepository;
            ingredientRepository = _ingredientRepository;
            stockLevelRepository = _stockLevelRepository;
            stockTransactionRepository = _stockTransactionRepository;
            stockTransactionDetailRepository = _stockTransactionDetailRepository;
            cashFlowRepository = _cashFlowRepository;
        }
        public async Task Add(PurchaseOrder obj)
        {
            obj.Active = true;
            obj.CreatedTime = DateTime.Now;
            await purchaseOrderRepository.Add(obj);
        }

        public int Count()
        {
            var result = purchaseOrderRepository.Count();
            return result;
        }

        public async Task Delete(PurchaseOrder obj)
        {
            obj.Active = false;
            await purchaseOrderRepository.Delete(obj);
        }

        public async Task<long> DeletePermanently(long? id)
        {
            return await purchaseOrderRepository.DeletePermanently(id);
        }

        public async Task<PurchaseOrder> Detail(long? id)
        {
            return await purchaseOrderRepository.Detail(id);
        }

        public async Task<List<PurchaseOrder>> List()
        {
            return await purchaseOrderRepository.List();
        }

        public async Task<List<PurchaseOrder>> ListPaging(int pageIndex, int pageSize)
        {
            return await purchaseOrderRepository.ListPaging(pageIndex, pageSize);
        }

        public async Task<DTResult<PurchaseOrderDto>> ListServerSide(PurchaseOrderDTParameters parameters)
        {
            return await purchaseOrderRepository.ListServerSide(parameters);
        }

        //public async Task<List<PurchaseOrder>> Search(string keyword)
        //{
        //    return await purchaseOrderRepository.Search(keyword);
        //}

        public async Task Update(PurchaseOrder obj)
        {
            await purchaseOrderRepository.Update(obj);
        }

        public async Task<List<PurchaseOrderDetailDto>> ListByPurchareId(int purchaseId)
        {
            return await purchaseOrderRepository.ListByPurchareId(purchaseId);
        }

        public async Task<PurchaseOrderDto> UpdateStatus(PurchaseOrderDto dto)
        {
            if(dto.Id == 0)
            {
                throw new BadRequestException("Purchase Order is 0");
            }
            using (var transaction = purchaseOrderRepository.GetDatabase().BeginTransaction())
            {
                try
                {
                    var purchaseOrder = await purchaseOrderRepository.Detail(dto.Id);
                    if (purchaseOrder == null)
                    {
                        await transaction.RollbackAsync();
                        throw new BadRequestException("PurchaseOrder not found");
                    }
                    
                    await purchaseOrderRepository.Update(purchaseOrder);
                    if(dto.PaymentStatus == PurchaseOrderStatusConst.APPROVED 
                        || dto.PaymentStatus == PurchaseOrderStatusConst.CANCELLED
                        || dto.PaymentStatus == PurchaseOrderStatusConst.COMPLETED)
                    {
                        purchaseOrder.PaymentStatus = dto.PaymentStatus;
                        await purchaseOrderRepository.Update(purchaseOrder);  
                    }
                    else
                    {
                        await transaction.RollbackAsync();
                        throw new BadRequestException("PaymentStatus not found");
                    }
                    if(dto.PaymentStatus == PurchaseOrderStatusConst.COMPLETED)
                    {
                        if(dto.WarehouseId == null || dto.WarehouseId <= 0)
                        {
                            await transaction.RollbackAsync();
                            throw new BadRequestException("WarehouseId is null or less than 0");
                        }

                        var debt = new Debt()
                        {
                            DebtCode = string.IsNullOrEmpty(purchaseOrder.PurchaseOrderCode)
                                            ? "DEBT_" + Guid.NewGuid().ToString()
                                            : "DEBT_" + purchaseOrder.PurchaseOrderCode,
                            DebtName = "Nợ nhập hàng " + purchaseOrder.PurchaseOrderCode + "-" + DateTime.Now.ToString("dd/MM/yyyy"),
                            TotalMoney = purchaseOrder.TotalPrice,
                            IsPaId = false,
                            PaIdAt = null,
                            Note = "Nợ nhập hàng " + DateTime.Now.ToString("dd/MM/yyyy"),
                            CreatedTime = DateTime.Now,
                            Active = true,
                            SupplierId = dto.SupplierId
                        };
                        await debtRepository.Add(debt);
                        if (debt.Id <= 0)
                        {
                            await transaction.RollbackAsync();
                            throw new BadRequestException("Add Debt failed");
                        }

                        var cashFlow = new CashFlow()
                        {
                            TotalMoney = purchaseOrder.TotalPrice,
                            FlowType = CashFlowConst.CASH_FLOW_TYPE_DEBT,
                            Note = "Nợ nhập hàng " + purchaseOrder.PurchaseOrderCode + "-" + DateTime.Now.ToString("dd/MM/yyyy"),
                            CreatedTime = DateTime.Now,
                            Active = true,
                            AccountId = dto.AccountId,
                        };
                        await cashFlowRepository.Add(cashFlow);
                        if (cashFlow.Id <= 0)
                        {
                            await transaction.RollbackAsync();
                            throw new BadRequestException("Add CashFlow failed");
                        }

                        var stockTransaction = new StockTransaction()
                        {
                            StockTransactionCode = string.IsNullOrEmpty(purchaseOrder.PurchaseOrderCode)
                                            ? "TX-IN-AUTO-" + Guid.NewGuid().ToString()
                                            : "TX-IN-AUTO-" + purchaseOrder.PurchaseOrderCode,
                            Note = "Hệ thống nhập kho tự động cho đơn nhập hàng " + purchaseOrder.PurchaseOrderCode,
                            TransactionType = TransactionTypeConst.IMPORT,
                            TotalMoney = purchaseOrder.TotalPrice,
                            Status = PurchaseOrderStatusConst.COMPLETED,
                            CreatedTime = DateTime.Now,
                            Active = true,
                            WarehouseId = (int)dto.WarehouseId,
                            TransactionDate = DateTime.Now,
                            AccountId = dto.AccountId > 0 ? dto.AccountId : 1
                        };
                        await stockTransactionRepository.Add(stockTransaction);
                        if (stockTransaction.Id <= 0)
                        {
                            await transaction.RollbackAsync();
                            throw new BadRequestException("Add StockTransaction failed");
                        }
                        dto.StockTransId = stockTransaction.Id;
                        dto.StockTransCode = stockTransaction.StockTransactionCode; 

                        var detail = await purchaseOrderRepository.ListDetailByPurchase(purchaseOrder.Id);
                        foreach (var item in detail)
                        {
                            var ing = await ingredientRepository.Detail(item.IngredientId);
                            if (ing == null)
                            {
                                await transaction.RollbackAsync();
                                throw new BadRequestException("Ingredient not found");
                            }

                            if (ing.AveragePrice == 0)
                            {
                                ing.AveragePrice = item.UnitPrice;
                                await ingredientRepository.Update(ing);
                            }
                            else if (ing.AveragePrice > 0 && item.UnitPrice > 0)
                            {
                                // Tính giá trung bình mới
                                ing.AveragePrice = (item.UnitPrice + ing.AveragePrice) / 2;
                                await ingredientRepository.Update(ing);
                            }   

                            var stock = new StockLevel()
                            {
                                Quantity = item.Quantity,
                                ExpirationDate = DateTime.Now.AddDays(ing.SelfLife),
                                UnitPrice = item.UnitPrice,
                                CreatedTime = DateTime.Now,
                                Active = true,
                                IngredientId = item.IngredientId,
                                WarehouseId = (int)dto.WarehouseId,
                                LastUpdatedTime = DateTime.Now
                            };
                            await stockLevelRepository.Add(stock);
                            if (stock.Id <= 0)
                            {
                                await transaction.RollbackAsync();
                                throw new BadRequestException("Add StockLevel failed");
                            }

                            var stockTransactionDetail = new StockTransactionDetail()
                            {
                                StockTransactionId = stockTransaction.Id,
                                StockLevelId = stock.Id,
                                Quantity = item.Quantity,
                                CreatedTime = DateTime.Now,
                                Active = true
                            };
                            await stockTransactionDetailRepository.Add(stockTransactionDetail);
                            if (stockTransactionDetail.Id <= 0)
                            {
                                await transaction.RollbackAsync();
                                throw new BadRequestException("Add StockTransactionDetail failed");
                            }
                        }
                    }
                    var description = string.Empty;
                    switch(dto.PaymentStatus)
                    {
                        case PurchaseOrderStatusConst.APPROVED:
                            description = "Đơn nhập hàng đã được duyệt";
                            break;
                        case PurchaseOrderStatusConst.CANCELLED:
                            description = "Đơn nhập hàng đã bị hủy";
                            break;
                        case PurchaseOrderStatusConst.COMPLETED:
                            description = "Đơn nhập hàng đã hoàn thành";
                            break;
                        default:
                            description = "Đơn nhập hàng đã được cập nhật trạng thái";
                            break;
                    }
                    var accountActivity = new AccountActivity()
                    {
                        ActivityCode = purchaseOrder.Id.ToString(),
                        AccountId = dto.AccountId,
                        ActivityType = ActivityTypeConst.PURCHASE_ORDER,
                        CreatedTime = DateTime.Now,
                        Active = true,
                        ActivityDescription = description,
                    };
                    await accountActivityRepository.Add(accountActivity);
                    if (accountActivity.Id <= 0)
                    {
                        await transaction.RollbackAsync();
                        throw new BadRequestException("Add AccountActivity failed");
                    }
                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    throw new BadRequestException(ex.Message);
                }
                await transaction.CommitAsync();
                return dto;
            }
        }

        public async Task<PurchaseOrderDto> AddOrUpdate(PurchaseOrderDto dto)
        {
            using (var transaction = purchaseOrderRepository.GetDatabase().BeginTransaction())
            {
                bool isNew = dto.Id == 0 ? true : false;
                var purcharseId = dto.Id;
                if (string.IsNullOrEmpty(dto.PurchaseOrderCode))
                {
                    dto.PurchaseOrderCode = await GenerateCode();
                }   

                try
                {             
                    if (dto.Id == 0)
                    {
                        if (dto.PaymentStatus != PurchaseOrderStatusConst.DRAFT)
                            dto.PaymentStatus = (dto.RoleId == RoleConst.ADMIN) 
                                ? PurchaseOrderStatusConst.APPROVED 
                                : PurchaseOrderStatusConst.PENDING;

                        var newPurchaseOrder = new PurchaseOrder()
                        {
                            PurchaseOrderCode = dto.PurchaseOrderCode,
                            TotalPrice = dto.TotalPrice,
                            PaymentStatus = dto.PaymentStatus,
                            CreatedTime = DateTime.Now,
                            Active = true,
                            AccountId = dto.AccountId,
                            OrderDate = dto.OrderDate
                        };
                        await purchaseOrderRepository.Add(newPurchaseOrder);
                        if (newPurchaseOrder.Id <= 0)
                        {
                            await transaction.RollbackAsync();
                            throw new BadRequestException("Add PurchaseOrder failed");
                        }
                        purcharseId = newPurchaseOrder.Id;
                    }
                    else
                    {
                        var purchaseOrder = await purchaseOrderRepository.Detail(dto.Id);
                        if (purchaseOrder == null)
                        {
                            throw new BadRequestException("PurchaseOrder not found");
                        }
                        purchaseOrder.PurchaseOrderCode = dto.PurchaseOrderCode;
                        purchaseOrder.TotalPrice = dto.TotalPrice;
                        purchaseOrder.PaymentStatus = dto.PaymentStatus;
                        purchaseOrder.Active = true;
                        purchaseOrder.OrderDate = dto.OrderDate;
                        await purchaseOrderRepository.Update(purchaseOrder);
                    }

                    var listDetail = dto.Details;
                    var listCurrentDetail = await purchaseOrderRepository.ListByPurchareId(purcharseId);
                    if (listDetail == null || listDetail.Count == 0)
                    {
                        await transaction.RollbackAsync();
                        throw new BadRequestException("PurchaseOrder detail is empty");
                    }
                    foreach (var item in listDetail)
                    {
                        if (item.Id == 0)
                        {
                            var newDetail = new PurchaseOrderDetail()
                            {
                                PurchaseOrderId = purcharseId,
                                IngredientId = item.IngredientId,
                                Quantity = item.Quantity,
                                UnitPrice = item.UnitPrice,
                                Active = true,
                                CreatedTime = DateTime.Now,
                            };
                            await purchaseOrderDetailRepository.Add(newDetail);
                            if (newDetail.Id <= 0)
                            {
                                await transaction.RollbackAsync();
                                throw new BadRequestException("Add PurchaseOrder detail failed");
                            }
                        }
                        else
                        {
                            var detail = await purchaseOrderDetailRepository.Detail(item.Id);
                            if (detail == null)
                            {
                                await transaction.RollbackAsync();
                                throw new BadRequestException("PurchaseOrder detail not found");
                            }
                            detail.Quantity = item.Quantity;
                            detail.UnitPrice = item.UnitPrice;
                            detail.Active = true;

                            await purchaseOrderDetailRepository.Update(detail);
                        }
                    }

                    bool isExit;
                    foreach (var item in listCurrentDetail)
                    {
                        isExit = false;
                        foreach (var i in listDetail)
                        {
                            if (item.Id == i.Id)
                            {
                                isExit = true;
                            }
                        }
                        if (!isExit)
                        {
                            var dt = new PurchaseOrderDetail()
                            {
                                Id = item.Id,
                                Active = false
                            };
                            await purchaseOrderDetailRepository.Delete(dt);
                        }
                    }
                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    throw new BadRequestException(ex.Message);
                }

                var accountActivity = new AccountActivity()
                {
                    ActivityCode = purcharseId.ToString(),
                    AccountId = dto.AccountId,
                    ActivityType = ActivityTypeConst.PURCHASE_ORDER,
                    CreatedTime = DateTime.Now,
                    Active = true,
                    ActivityDescription = isNew ? "Tạo đơn nhập hàng" : "Cập nhật đơn nhập hàng"
                };
                await accountActivityRepository.Add(accountActivity);
                if (accountActivity.Id <= 0)
                {
                    await transaction.RollbackAsync();
                    throw new BadRequestException("Add AccountActivity failed");
                }

                await transaction.CommitAsync();
                return dto;
            }
        }

        private async Task<string> GenerateCode()
        {
            var lastId = await purchaseOrderRepository.GetLastId();
            int nextNumber = lastId + 1;

            // Format với ít nhất 6 chữ số, nếu vượt thì giữ nguyên
            string numberPart = nextNumber.ToString().PadLeft(6, '0');

            string code = $"PO-{numberPart}";

            return code;
        }

        public Task<PurchaseOrderDto> DetailDto(int id)
        {
            return purchaseOrderRepository.DetailDto(id);   
        }
    }
}

