using CoffeeCRM.Data.Model;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CoffeeCRM.Core.Util;
using CoffeeCRM.Data;
using CoffeeCRM.Core.Util.Parameters;
using CoffeeCRM.Data.ViewModels;
using System.Globalization;
using Microsoft.EntityFrameworkCore.Infrastructure;
using CoffeeCRM.Data.DTO;
using NPOI.SS.Formula.Functions;
using SkiaSharp;

namespace CoffeeCRM.Core.Repository
{
    public class PurchaseOrderRepository : IPurchaseOrderRepository
    {
        SysDbContext db;
        public PurchaseOrderRepository(SysDbContext _db)
        {
            db = _db;
        }


        public async Task<List<PurchaseOrder>> List()
        {
            if (db != null)
            {
                return await (
                    from row in db.PurchaseOrders
                    where (row.Active)
                    orderby row.Id descending
                    select row
                ).ToListAsync();
            }

            return null;
        }


        //public async Task <List< PurchaseOrder>> Search(string keyword)
        //{
        //    if(db != null)
        //    {
        //        return await(
        //            from row in db.PurchaseOrders
        //                        where(row.Active && (row.Name.Contains(keyword) || row.Description.Contains(keyword)))
        //                        orderby row.Id descending
        //                        select row
        //        ).ToListAsync();
        //    }
        //    return null;
        //}


        public async Task<List<PurchaseOrder>> ListPaging(int pageIndex, int pageSize)
        {
            int offSet = 0;
            offSet = (pageIndex - 1) * pageSize;
            if (db != null)
            {
                return await (
                    from row in db.PurchaseOrders
                    where (row.Active)
                    orderby row.Id descending
                    select row
                ).Skip(offSet).Take(pageSize).ToListAsync();
            }
            return null;
        }


        public async Task<PurchaseOrder> Detail(long? id)
        {
            if (db != null)
            {
                return await db.PurchaseOrders.FirstOrDefaultAsync(row => row.Active && row.Id == id);
            }
            return null;
        }


        public async Task<PurchaseOrderDto> DetailDto(int id)
        {
            var query = from po in db.PurchaseOrders
                        where po.Id == id
                        join account in db.Accounts on po.AccountId equals account.Id into accountJoin
                        from acc in accountJoin.DefaultIfEmpty()

                            // Lấy thông tin Supplier từ Detail đầu tiên
                        let firstDetail = db.PurchaseOrderDetails
                            .Where(pod => pod.PurchaseOrderId == po.Id)
                            .FirstOrDefault()
                        join ingredient in db.Ingredients on firstDetail.IngredientId equals ingredient.Id into ingredientJoin
                        from ing in ingredientJoin.DefaultIfEmpty()
                        join supplier in db.Suppliers on ing.SupplierId equals supplier.Id into supplierJoin
                        from sup in supplierJoin.DefaultIfEmpty()
                        
                            // Lấy danh sách Details
                        let details = (from pod in db.PurchaseOrderDetails
                                       where pod.PurchaseOrderId == po.Id
                                       join ingDetail in db.Ingredients on pod.IngredientId equals ingDetail.Id
                                       join unit in db.Units on ingDetail.UnitId equals unit.Id
                                       select new PurchaseOrderDetailDto
                                       {
                                           Id = pod.Id,
                                           Quantity = pod.Quantity,
                                           UnitPrice = pod.UnitPrice,
                                           CreatedTime = pod.CreatedTime,
                                           Active = pod.Active,
                                           UnitId = unit.Id,
                                           UnitName = unit.UnitName,
                                           IngredientId = pod.IngredientId,
                                           IngredientName = ingDetail.IngredientName,
                                           PurchaseOrderId = pod.PurchaseOrderId
                                       }).ToList()

                        // Lấy danh sách Histories
                        let histories = (from act in db.AccountActivities
                                         where act.ActivityType == "purchase_order" && act.ActivityCode == po.Id.ToString()
                                         join historyAccount in db.Accounts on act.AccountId equals historyAccount.Id into historyAccountJoin
                                         from histAcc in historyAccountJoin.DefaultIfEmpty()
                                         select new PurchaseOrderHistory
                                         {
                                             Id = act.Id,
                                             CreatedTime = act.CreatedTime,
                                             AccountId = act.AccountId,
                                             AccountName = histAcc != null ? histAcc.FullName : null,
                                             ActivityDescription = act.ActivityDescription
                                         }).OrderByDescending(x => x.CreatedTime).ToList()

                        select new PurchaseOrderDto
                        {
                            Id = po.Id,
                            PurchaseOrderCode = po.PurchaseOrderCode,
                            TotalPrice = po.TotalPrice,
                            PaymentStatus = po.PaymentStatus,
                            CreatedTime = po.CreatedTime,
                            Active = po.Active,
                            AccountId = po.AccountId,
                            AccountName = acc != null ? acc.FullName : null,
                            SupplierId = sup != null ? sup.Id : 0,
                            SupplierName = sup != null ? sup.SupplierName : null,
                            OrderDate = po.OrderDate,
                            Details = details,
                            Histories = histories
                        };

            return await query.FirstOrDefaultAsync();
        }


        public async Task<PurchaseOrder> Add(PurchaseOrder obj)
        {
            if (db != null)
            {
                await db.PurchaseOrders.AddAsync(obj);
                await db.SaveChangesAsync();
                return obj;
            }
            return null;
        }


        public async Task Update(PurchaseOrder obj)
        {
            if (db != null)
            {
                //Update that object
                db.PurchaseOrders.Attach(obj);
                db.Entry(obj).Property(x => x.PurchaseOrderCode).IsModified = true;
                db.Entry(obj).Property(x => x.TotalPrice).IsModified = true;
                db.Entry(obj).Property(x => x.PaymentStatus).IsModified = true;
                db.Entry(obj).Property(x => x.Active).IsModified = true;
                db.Entry(obj).Property(x => x.AccountId).IsModified = true;
                db.Entry(obj).Property(x => x.OrderDate).IsModified = true;

                //Commit the transaction
                await db.SaveChangesAsync();
            }
        }


        public async Task Delete(PurchaseOrder obj)
        {
            if (db != null)
            {
                //Update that obj
                db.PurchaseOrders.Attach(obj);
                db.Entry(obj).Property(x => x.Active).IsModified = true;

                //Commit the transaction
                await db.SaveChangesAsync();
            }
        }

        public async Task<long> DeletePermanently(long? objId)
        {
            int result = 0;

            if (db != null)
            {
                //Find the obj for specific obj id
                var obj = await db.PurchaseOrders.FirstOrDefaultAsync(x => x.Id == objId);

                if (obj != null)
                {
                    //Delete that obj
                    db.PurchaseOrders.Remove(obj);

                    //Commit the transaction
                    result = await db.SaveChangesAsync();
                }
                return result;
            }

            return result;
        }

        public async Task<int> GetLastId()
        {
            if (db != null)
            {
                var lastId = await db.PurchaseOrders.
                    OrderByDescending(x => x.Id).
                    Select(x => x.Id).FirstOrDefaultAsync();
                return lastId;
            }
            return 0;
        }


        public int Count()
        {
            int result = 0;

            if (db != null)
            {
                //Find the obj for specific obj id
                result = (
                    from row in db.PurchaseOrders
                    where row.Active
                    select row
                            ).Count();
            }

            return result;
        }
        public async Task<DTResult<PurchaseOrderDto>> ListServerSide(PurchaseOrderDTParameters parameters)
        {
            //0. Options
            string searchAll = parameters.SearchAll.Trim();//Trim text
            string orderCritirea = "Id";//Set default critirea
            int recordTotal, recordFiltered;
            bool orderDirectionASC = true;//Set default ascending
            if (parameters.Order != null)
            {
                orderCritirea = parameters.Columns[parameters.Order[0].Column].Data;
                orderDirectionASC = parameters.Order[0].Dir == DTOrderDir.ASC;
            }
            //1. Join
            var query = from row in db.PurchaseOrders
                        where row.Active
                        select new
                        {
                            row
                        };

            recordTotal = await query.CountAsync();
            //2. Fillter
            if (!String.IsNullOrEmpty(searchAll))
            {
                searchAll = searchAll.ToLower();
                query = query.Where(c =>
                    EF.Functions.Collate(c.row.Id.ToString().ToLower(), SQLParams.Latin_General).Contains(EF.Functions.Collate(searchAll, SQLParams.Latin_General)) ||
                    EF.Functions.Collate(c.row.PurchaseOrderCode.ToLower(), SQLParams.Latin_General).Contains(EF.Functions.Collate(searchAll, SQLParams.Latin_General)) ||
                    EF.Functions.Collate(c.row.TotalPrice.ToString().ToLower(), SQLParams.Latin_General).Contains(EF.Functions.Collate(searchAll, SQLParams.Latin_General)) ||
                    EF.Functions.Collate(c.row.PaymentStatus.ToLower(), SQLParams.Latin_General).Contains(EF.Functions.Collate(searchAll, SQLParams.Latin_General)) ||
                    EF.Functions.Collate(c.row.CreatedTime.ToCustomString().ToLower(), SQLParams.Latin_General).Contains(EF.Functions.Collate(searchAll, SQLParams.Latin_General)) ||
                    EF.Functions.Collate(c.row.Active.ToString().ToLower(), SQLParams.Latin_General).Contains(EF.Functions.Collate(searchAll, SQLParams.Latin_General)) ||
                    EF.Functions.Collate(c.row.AccountId.ToString().ToLower(), SQLParams.Latin_General).Contains(EF.Functions.Collate(searchAll, SQLParams.Latin_General)) ||
                    EF.Functions.Collate(c.row.OrderDate.ToCustomString().ToLower(), SQLParams.Latin_General).Contains(EF.Functions.Collate(searchAll, SQLParams.Latin_General))

                );
            }
            foreach (var item in parameters.Columns)
            {
                var fillter = item.Search.Value.Trim();
                if (fillter.Length > 0)
                {
                    switch (item.Data)
                    {
                        case "id":
                            query = query.Where(c => c.row.Id.ToString().Trim().Contains(fillter));
                            break;
                        case "purchaseOrderCode":
                            query = query.Where(c => (c.row.PurchaseOrderCode ?? "").Contains(fillter));
                            break;
                        case "totalPrice":
                            query = query.Where(c => c.row.TotalPrice.ToString().Trim().Contains(fillter));
                            break;
                        case "paymentStatus":
                            query = query.Where(c => (c.row.PaymentStatus ?? "").Contains(fillter));
                            break;
                        case "createdTime":
                            if (fillter.Contains(" - "))
                            {
                                var dates = fillter.Split(" - ");
                                var startDate = DateTime.ParseExact(dates[0], "dd/MM/yyyy", CultureInfo.InvariantCulture);
                                var endDate = DateTime.ParseExact(dates[1], "dd/MM/yyyy", CultureInfo.InvariantCulture).AddDays(1).AddSeconds(-1);
                                query = query.Where(c => c.row.CreatedTime >= startDate && c.row.CreatedTime <= endDate);
                            }
                            else
                            {
                                var date = DateTime.ParseExact(fillter, "dd/MM/yyyy", CultureInfo.InvariantCulture);
                                query = query.Where(c => c.row.CreatedTime.Date == date.Date);
                            }
                            break;
                        case "active":
                            query = query.Where(c => c.row.Active.ToString().Trim().Contains(fillter));
                            break;
                        case "accountId":
                            query = query.Where(c => c.row.AccountId.ToString().Trim().Contains(fillter));
                            break;
                        case "orderDate":
                            if (fillter.Contains(" - "))
                            {
                                var dates = fillter.Split(" - ");
                                var startDate = DateTime.ParseExact(dates[0], "dd/MM/yyyy", CultureInfo.InvariantCulture);
                                var endDate = DateTime.ParseExact(dates[1], "dd/MM/yyyy", CultureInfo.InvariantCulture).AddDays(1).AddSeconds(-1);
                                query = query.Where(c => c.row.OrderDate >= startDate && c.row.OrderDate <= endDate);
                            }
                            else
                            {
                                var date = DateTime.ParseExact(fillter, "dd/MM/yyyy", CultureInfo.InvariantCulture);
                                query = query.Where(c => c.row.OrderDate.Date == date.Date);
                            }
                            break;

                    }
                }
            }
            //3.Query second
            // 1. Lấy danh sách ID cần thiết từ query phân trang trước
            var pagedOrderIds = await query.Select(q => q.row.Id)
                                          .Skip(parameters.Start)
                                          .Take(parameters.Length)
                                          .ToListAsync();

            // 2. Chỉ join với các bản ghi cần thiết
            var query2 = from p in db.PurchaseOrders.Where(x => pagedOrderIds.Contains(x.Id))
                         join a in db.Accounts on p.AccountId equals a.Id
                         // Lấy 1 detail đại diện để lấy Supplier (vì bạn nói tất cả cùng Supplier)
                         let firstPod = db.PurchaseOrderDetails.FirstOrDefault(pod => pod.PurchaseOrderId == p.Id)
                         join ing in db.Ingredients on firstPod.IngredientId equals ing.Id
                         join s in db.Suppliers on ing.SupplierId equals s.Id
                         select new PurchaseOrderDto()
                         {
                             Id = p.Id,
                             PurchaseOrderCode = p.PurchaseOrderCode,
                             TotalPrice = p.TotalPrice,
                             PaymentStatus = p.PaymentStatus,
                             CreatedTime = p.CreatedTime,
                             Active = p.Active,
                             AccountId = p.AccountId,
                             SupplierId = s.Id,
                             SupplierName = s.SupplierName,
                             OrderDate = p.OrderDate,
                             AccountName = a.FullName,
                         };

            // 3. Sắp xếp
            query2 = query2.OrderByDynamic<PurchaseOrderDto>(orderCritirea, orderDirectionASC ? LinqExtensions.Order.Asc : LinqExtensions.Order.Desc);

            // 4. Lấy tổng số bản ghi (trước khi phân trang)
            recordFiltered = await query.CountAsync();

            // 5. Trả về dữ liệu
            return new DTResult<PurchaseOrderDto>()
            {
                data = await query2.ToListAsync(), // Đã phân trang ở bước 1
                draw = parameters.Draw,
                recordsFiltered = recordFiltered,
                recordsTotal = recordTotal
            };
        }

        public DatabaseFacade GetDatabase()
        {
            return db.Database;

        }

        public async Task<List<PurchaseOrderDetail>> ListDetailByPurchase(int id)
        {
            if (db != null)
            {
                var query = from row in db.PurchaseOrderDetails
                            where (row.Active && row.PurchaseOrderId == id)
                            select row;
                return await query.ToListAsync();
            }
            return null;    
        }

        public Task<List<PurchaseOrderDetailDto>> ListByPurchareId(int id)
        {
            if (db != null)
            {
                var query = from row in db.PurchaseOrderDetails
                            join i in db.Ingredients on row.IngredientId equals i.Id
                            where row.Active && row.PurchaseOrderId == id && i.Active
                            select new PurchaseOrderDetailDto()
                            {
                                Id = row.Id,
                                Quantity = row.Quantity,
                                UnitPrice = row.UnitPrice,
                                CreatedTime = row.CreatedTime,
                                Active = row.Active,
                                IngredientId = row.IngredientId,
                                IngredientName = i.IngredientName,
                                PurchaseOrderId = row.PurchaseOrderId
                            };
                return query.ToListAsync();
            }
            else
            {
                return null;
            }
        }
    }
}


