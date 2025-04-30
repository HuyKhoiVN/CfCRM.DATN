using CoffeeCRM.Data.Model;
using CoffeeCRM.Core.Repository;
using CoffeeCRM.Core.Util;using CoffeeCRM.Data;
using CoffeeCRM.Core.Util.Parameters;
using CoffeeCRM.Data.ViewModels;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using CoffeeCRM.Data.Constants;
using Google.Apis.Logging;
using Microsoft.Extensions.Logging;
namespace CoffeeCRM.Core.Service
{
    public class DishOrderService : IDishOrderService
    {
        IDishOrderRepository dishOrderRepository;
        IDishOrderDetailRepository dishOrderDetailRepository;
        INotificationRepository notificationRepository;
        IHubContext<NotificationHub, INotificationHub> notificationHub;
        ITableRepository tableRepository;
        ILogger<DishOrderService> _logger;

        public DishOrderService(IDishOrderRepository dishOrderRepository, 
            IDishOrderDetailRepository dishOrderDetailRepository, 
            INotificationRepository notificationRepository, 
            IHubContext<NotificationHub, 
            INotificationHub> notificationHub, 
            ITableRepository tableRepository,
            ILogger<DishOrderService> logger)
        {
            this.dishOrderRepository = dishOrderRepository;
            this.dishOrderDetailRepository = dishOrderDetailRepository;
            this.notificationRepository = notificationRepository;
            this.notificationHub = notificationHub;
            this.tableRepository = tableRepository;
            _logger = logger;
        }

        public async Task Add(DishOrder obj)
        {
            obj.Active = true;
            obj.CreatedTime = DateTime.Now;
            await dishOrderRepository.Add(obj);
        }

        public int Count()
        {
            var result = dishOrderRepository.Count();
            return result;
        }

        public async Task Delete(DishOrder obj)
        {
            obj.Active = false;
            await dishOrderRepository.Delete(obj);
        }

        public async Task<long> DeletePermanently(long? id)
        {
            return await dishOrderRepository.DeletePermanently(id);
        }

        public async Task<DishOrder> Detail(long? id)
        {
            return await dishOrderRepository.Detail(id);
        }
        public async Task<List<DishOrderViewModel>> DishOrderDetailByTableId(int tableId)
        {
            return await dishOrderRepository.DishOrderDetailByTableId(tableId);
        }
        public async Task<List<DishOrderViewModel>> ListDishOrderNotification()
        {
            return await dishOrderRepository.ListDishOrderNotification();
        }
        public async Task<List<DishOrderViewModel>> ListDishOrderInvoice(int tableId)
        {
            return await dishOrderRepository.ListDishOrderInvoice(tableId);
        }
        public async Task<List<DishOrder>> List()
        {
            return await dishOrderRepository.List();
        }

        public async Task<List<DishOrder>> ListPaging(int pageIndex, int pageSize)
        {
            return await dishOrderRepository.ListPaging(pageIndex, pageSize);
        }

        public async Task<DTResult<DishOrder>> ListServerSide(DishOrderDTParameters parameters)
        {
            return await dishOrderRepository.ListServerSide(parameters);
        }

        //public async Task<List<DishOrder>> Search(string keyword)
        //{
        //    return await dishOrderRepository.Search(keyword);
        //}

        public async Task Update(DishOrder obj)
        {
            var detail = await dishOrderRepository.Detail(obj.Id);
            detail.DishOrderStatusId = obj.DishOrderStatusId;
            if (await dishOrderRepository.Update(detail))
            {
                if (obj.DishOrderStatusId == DishOrderStatudConst.DONE)
                {
                    var table = await tableRepository.Detail(detail.TableId);
                    var notifi = new Notification
                    {
                        Active = true,
                        AccountId = obj.AccountId,
                        NotificationStatusId = NotificationStatusId.Unread,
                        Name = "Đơn đặt món " + table.TableName.ToLower() + " đã hoàn thành",
                        SenderId = RoleConst.BARTENDER,
                        Description = "Done",
                        CreatedTime = DateTime.Now,
                        ApproveTime = null,
                        Url = ""
                    };
                    await notificationRepository.Add(notifi);
                    await notificationHub.Clients.All.ReceiveNotification(notifi);
                }
            }

        }
        public async Task<bool> AddOrUpdateByVm(DishOrderViewModel model)
        {
            using (var transaction = dishOrderRepository.GetDatabase().BeginTransaction())
            {
                try
                {
                    var dishOrderId = model.Id;
                    if (model.Id == 0)
                    {
                        var newDishOrder = new DishOrder();
                        newDishOrder.TableId = model.TableId;
                        newDishOrder.AccountId = model.AccountId;
                        newDishOrder.Note = model.Description;
                        newDishOrder.DishOrderStatusId = DishOrderStatudConst.PROCESSING;
                        newDishOrder.Active = true;
                        newDishOrder.CreatedTime = DateTime.Now;
                        await dishOrderRepository.Add(newDishOrder);
                        if (newDishOrder.Id <= 0)
                        {
                            _logger.LogError("AddOrUpdateByVm: Add new DishOrder failed");
                            await transaction.RollbackAsync();
                            return false;
                        }
                        dishOrderId = newDishOrder.Id;
                        _logger.LogInformation("AddOrUpdateByVm: Add new DishOrder success with id " + dishOrderId);
                    }
                    else if (model.Id > 0)
                    { // nếu id > 0 thì update
                        var updateDishOrder = new DishOrder();
                        updateDishOrder.Id = dishOrderId;
                        updateDishOrder.TableId = model.TableId;
                        updateDishOrder.AccountId = model.AccountId;
                        updateDishOrder.Note = model.Description;
                        updateDishOrder.DishOrderStatusId = DishOrderStatudConst.PROCESSING;
                        updateDishOrder.CreatedTime = DateTime.Now;
                        updateDishOrder.Active = true;
                        if (!(await dishOrderRepository.Update(updateDishOrder)))
                        {
                            _logger.LogError("AddOrUpdateByVm: Update DishOrder failed");
                            await transaction.RollbackAsync();
                            return false;
                        }
                        _logger.LogInformation("AddOrUpdateByVm: Update DishOrder success with id " + dishOrderId);
                    }


                    var listDishOrderDetail = model.DishOrderDetails;
                    var listCrrDishOrderDetail = await dishOrderDetailRepository.ListByOrderId(dishOrderId);
                    if (listDishOrderDetail == null || listDishOrderDetail.Count == 0)
                    {
                        _logger.LogError("AddOrUpdateByVm: ListDishOrderDetail is null or empty");
                        await transaction.RollbackAsync();
                        return false;
                    }
                    foreach (var item in listDishOrderDetail)
                    {
                        if (item.Id == 0)
                        {
                            var newDishOrderDetail = new DishOrderDetail();
                            newDishOrderDetail.DishId = item.DishId;
                            newDishOrderDetail.Quantity = item.Quantity;
                            newDishOrderDetail.Note = item.Note;
                            newDishOrderDetail.DishOrderId = dishOrderId;
                            newDishOrderDetail.Active = true;
                            newDishOrderDetail.CreatedTime = DateTime.Now;
                            await dishOrderDetailRepository.Add(newDishOrderDetail);
                            if (newDishOrderDetail.Id <= 0)
                            {
                                _logger.LogError("AddOrUpdateByVm: Add new DishOrderDetail failed");
                                await transaction.RollbackAsync();
                                return false;
                            }
                            _logger.LogInformation("AddOrUpdateByVm: Add new DishOrderDetail success with id " + newDishOrderDetail.Id);
                        }
                        else if (item.Id > 0)
                        {
                            var updateDishOrderDetail = new DishOrderDetail();
                            updateDishOrderDetail.Id = item.Id;
                            updateDishOrderDetail.DishId = item.DishId;
                            updateDishOrderDetail.DishOrderId = item.DishOrderId;
                            updateDishOrderDetail.Quantity = item.Quantity;
                            updateDishOrderDetail.Note = item.Note;
                            updateDishOrderDetail.Active = true;
                            if (!(await dishOrderDetailRepository.Update(updateDishOrderDetail)))
                            {
                                _logger.LogError("AddOrUpdateByVm: Update DishOrderDetail failed");
                                await transaction.RollbackAsync();
                                return false;
                            }
                            _logger.LogInformation("AddOrUpdateByVm: Update DishOrderDetail success with id " + updateDishOrderDetail.Id);
                        }
                    }
                    bool isExist;
                    foreach (var item in listCrrDishOrderDetail)
                    {
                        isExist = false;
                        foreach (var i in listDishOrderDetail)
                        {
                            if (item.Id == i.Id) isExist = true;
                        }
                        if (!isExist)
                        {
                            var od = new DishOrderDetail();
                            od.Id = item.Id;
                            od.Active = false;
                            await dishOrderDetailRepository.Delete(od);
                        }
                    }

                }
                catch (Exception ex)
                {
                    _logger.LogError("AddOrUpdateByVm: Fail while add or update DishOrder " + ex.Message);
                    await transaction.RollbackAsync();
                    return false;
                }

                var table = await tableRepository.Detail(model.TableId);
                if (table == null)
                {
                    await transaction.RollbackAsync();
                    return false;
                }
                table.TableStatus = TableConst.OCCUPIED;
                await tableRepository.Update(table);

                var notifi = new Notification
                {
                    Active = true,
                    AccountId = model.AccountId, // 
                    NotificationStatusId = NotificationStatusId.Unread,
                    Name = "Đơn đặt món mới",
                    SenderId = RoleConst.WAITER,
                    Description = "Add review",
                    CreatedTime = DateTime.Now,
                    ApproveTime = null,
                    Url = ""
                };
                //await notificationRepository.Add(notifi);
                await notificationHub.Clients.All.ReceiveNotification(notifi);
                await transaction.CommitAsync();
                return true;
            }
        }
    }
}

