
using CoffeeCRM.Data.Model;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CoffeeCRM.Core.Util;
using CoffeeCRM.Core.Util.Parameters;
using CoffeeCRM.Data.ViewModels;
using System.Globalization;
using CoffeeCRM.Data.Constants;
using Microsoft.EntityFrameworkCore.Infrastructure;

namespace CoffeeCRM.Core.Repository
{
    public class DishOrderRepository : IDishOrderRepository
    {
        SysDbContext db;
        public DishOrderRepository(SysDbContext _db)
        {
            db = _db;
        }

        public async Task<List<DishOrderViewModel>> ListDishOrderNotification()
        {
            if (db != null)
            {
                var result = await (
                        from row in db.DishOrders
                        where row.Active && row.DishOrderStatusId == DishOrderStatudConst.PROCESSING
                        orderby row.Id ascending
                        select new DishOrderViewModel()
                        {
                            Id = row.Id,
                            TableId = row.TableId,
                            AccountId = row.AccountId,
                            OrdererName = (from a in db.Accounts where a.Id == row.AccountId select a.FullName.ToString()).FirstOrDefault(),
                            TableName = (from t in db.Tables where t.Id == row.TableId select t.TableName.ToString()).FirstOrDefault(),
                            Description = row.Note,
                            DishOrderStatusId = row.DishOrderStatusId,
                            DishOrderStatusName = ((from s in db.DishOrderStatuses where s.Id == row.DishOrderStatusId select s.DishOrderStatusName.ToString()).FirstOrDefault()),
                            CreatedTime = row.CreatedTime,
                            DishOrderDetails = (from dod in db.DishOrderDetails
                                                where row.Id == dod.DishOrderId && dod.Active
                                                select new DishOrderDetailVM()
                                                {
                                                    Id = dod.Id,
                                                    DishOrderId = dod.DishOrderId,
                                                    DishId = dod.DishId,
                                                    Quantity = dod.Quantity,
                                                    DishName = (from d in db.Dishes where d.Active && d.Id == dod.DishId select d.DishName.ToString()).FirstOrDefault(),
                                                    Note = dod.Note
                                                }).ToList()
                        }
                        ).ToListAsync();
                return result;
            }
            return null;
        }

        public async Task<List<DishOrderViewModel>> ListDishOrderInvoice(int tableId)
        {
            if (db != null)
            {
                var validStatuses = new[] { DishOrderStatudConst.PROCESSING, DishOrderStatudConst.DONE };

                var result = await (
                    from row in db.DishOrders
                    join detail in db.DishOrderDetails on row.Id equals detail.DishOrderId
                    where row.TableId == tableId
                          && row.Active
                          && validStatuses.Contains(row.DishOrderStatusId)
                    select new DishOrderViewModel()
                    {
                        Id = row.Id,
                        TableId = row.TableId,
                        AccountId = row.AccountId,
                        OrdererName = (from a in db.Accounts where a.Id == row.AccountId select a.FullName.ToString()).FirstOrDefault(),
                        TableName = (from t in db.Tables where t.Id == row.TableId select t.TableName.ToString()).FirstOrDefault(),
                        Description = row.Note,
                        DishOrderStatusId = row.DishOrderStatusId,
                        DishOrderStatusName = ((from s in db.DishOrderStatuses where s.Id == row.DishOrderStatusId select s.DishOrderStatusName.ToString()).FirstOrDefault()),
                        CreatedTime = row.CreatedTime,
                        DishOrderDetails = (from dod in db.DishOrderDetails
                                            where row.Id == dod.DishOrderId && dod.Active
                                            group dod by dod.DishId into grouped
                                            select new DishOrderDetailVM()
                                            {
                                                DishId = grouped.Key,
                                                Quantity = grouped.Sum(d => d.Quantity),
                                                DishName = (from d in db.Dishes where d.Active && d.Id == grouped.Key select d.DishName.ToString()).FirstOrDefault(),
                                            }).ToList()
                    }
                        ).ToListAsync();
                return result;
            }
            return null;
        }

        public async Task<List<DishOrder>> List()
        {
            if (db != null)
            {
                return await (
                    from row in db.DishOrders
                    where (row.Active)
                    orderby row.Id descending
                    select row
                ).ToListAsync();
            }

            return null;
        }

        public async Task<List<DishOrder>> ListPaging(int pageIndex, int pageSize)
        {
            int offSet = 0;
            offSet = (pageIndex - 1) * pageSize;
            if (db != null)
            {
                return await (
                    from row in db.DishOrders
                    where (row.Active)
                    orderby row.Id descending
                    select row
                ).Skip(offSet).Take(pageSize).ToListAsync();
            }
            return null;
        }

        public DatabaseFacade GetDatabase()
        {
            return db.Database;

        }


        public async Task<DishOrder> Detail(long? id)
        {
            if (db != null)
            {
                return await db.DishOrders.FirstOrDefaultAsync(row => row.Active && row.Id == id);
            }
            return null;
        }


        public async Task<DishOrder> Add(DishOrder obj)
        {
            if (db != null)
            {
                await db.DishOrders.AddAsync(obj);
                await db.SaveChangesAsync();
                return obj;
            }
            return null;
        }

        public async Task<bool> Update(DishOrder obj)
        {
            if (db != null)
            {
                try
                {
                    var existingEntity = await db.DishOrders.FindAsync(obj.Id);
                    if (existingEntity != null)
                    {
                        db.Entry(existingEntity).State = EntityState.Detached;
                    }
                    db.DishOrders.Attach(obj);
                    db.Entry(obj).Property(x => x.TableId).IsModified = true;
                    db.Entry(obj).Property(x => x.AccountId).IsModified = true;
                    db.Entry(obj).Property(x => x.DishOrderStatusId).IsModified = true;
                    db.Entry(obj).Property(x => x.Active).IsModified = true;

                    //Commit the transaction
                    return await db.SaveChangesAsync() > 0;
                }
                catch (Exception ex)
                {
                    // Log exception to identify the error
                    Console.WriteLine(ex.Message);
                    return false;
                }
            }
            return false;
        }

        public async Task<List<DishOrder>> ListUnPaid(int tableId)
        {
            if (db != null)
            {
                return await (
                    from row in db.DishOrders
                    where (row.Active && (row.DishOrderStatusId != DishOrderStatudConst.PAID) && row.TableId == tableId)
                    orderby row.Id
                    select row
                ).ToListAsync();
            }

            return null;
        }
        public async Task<List<DishOrderViewModel>> DishOrderDetailByTableId(int tableId)
        {
            if (db != null)
            {
                var result = await (
                        from row in db.DishOrders
                        where row.TableId == tableId && row.Active && row.DishOrderStatusId != DishOrderStatudConst.PAID
                        orderby row.Id descending
                        select new DishOrderViewModel()
                        {
                            Id = row.Id,
                            TableId = row.TableId,
                            AccountId = row.AccountId,
                            OrdererName = (from a in db.Accounts where a.Id == row.AccountId select a.FullName.ToString()).FirstOrDefault(),
                            Description = row.Note,
                            DishOrderStatusId = row.DishOrderStatusId,
                            DishOrderStatusName = (from s in db.DishOrderStatuses where s.Id == row.DishOrderStatusId select s.DishOrderStatusName.ToString()).FirstOrDefault(),
                            CreatedTime = row.CreatedTime
                            //DishOrderDetails = (from dod in db.DishOrderDetails where row.Id == dod.DishOrderId && dod.Active select dod).ToList()
                        }
                        ).ToListAsync();
                return result;
            }
            return null;
        }

        public async Task<List<DishOrderViewModel>> DishOrderDetailList(int tableId)
        {
            if (db != null)
            {
                var validStatuses = new[] { DishOrderStatudConst.PROCESSING, DishOrderStatudConst.DONE };

                var result = await (
                    from order in db.DishOrders
                    where
                        order.TableId == tableId
                        && order.Active
                        && validStatuses.Contains(order.DishOrderStatusId)
                    orderby order.Id descending
                    select new DishOrderViewModel
                    {
                        Id = order.Id,
                        TableId = order.TableId,
                        AccountId = order.AccountId,
                        OrdererName = (from account in db.Accounts
                                       where account.Id == order.AccountId
                                       select account.FullName.ToString()).FirstOrDefault(),
                        Description = order.Note,
                        DishOrderStatusId = order.DishOrderStatusId,
                        DishOrderStatusName = (from status in db.DishOrderStatuses
                                               where status.Id == order.DishOrderStatusId
                                               select status.DishOrderStatusName.ToString()).FirstOrDefault(),
                        CreatedTime = order.CreatedTime,
                    }
                ).ToListAsync();

                return result;
            }
            return null;
        }


        public async Task Delete(DishOrder obj)
        {
            if (db != null)
            {
                //Update that obj
                db.DishOrders.Attach(obj);
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
                var obj = await db.DishOrders.FirstOrDefaultAsync(x => x.Id == objId);

                if (obj != null)
                {
                    //Delete that obj
                    db.DishOrders.Remove(obj);

                    //Commit the transaction
                    result = await db.SaveChangesAsync();
                }
                return result;
            }

            return result;
        }


        public int Count()
        {
            int result = 0;

            if (db != null)
            {
                //Find the obj for specific obj id
                result = (
                    from row in db.DishOrders
                    where row.Active
                    select row
                            ).Count();
            }

            return result;
        }
        public async Task<DTResult<DishOrder>> ListServerSide(DishOrderDTParameters parameters)
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
            var query = from row in db.DishOrders


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
                    EF.Functions.Collate(c.row.Note.ToLower(), SQLParams.Latin_General).Contains(EF.Functions.Collate(searchAll, SQLParams.Latin_General)) ||
                    EF.Functions.Collate(c.row.DishOrderStatusId.ToString().ToLower(), SQLParams.Latin_General).Contains(EF.Functions.Collate(searchAll, SQLParams.Latin_General)) ||
                    EF.Functions.Collate(c.row.TableId.ToString().ToLower(), SQLParams.Latin_General).Contains(EF.Functions.Collate(searchAll, SQLParams.Latin_General)) ||
                    EF.Functions.Collate(c.row.CreatedTime.ToCustomString().ToLower(), SQLParams.Latin_General).Contains(EF.Functions.Collate(searchAll, SQLParams.Latin_General)) ||
                    EF.Functions.Collate(c.row.Active.ToString().ToLower(), SQLParams.Latin_General).Contains(EF.Functions.Collate(searchAll, SQLParams.Latin_General))

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
                        case "note":
                            query = query.Where(c => (c.row.Note ?? "").Contains(fillter));
                            break;
                        case "dishOrderStatusId":
                            query = query.Where(c => c.row.DishOrderStatusId.ToString().Trim().Contains(fillter));
                            break;
                        case "tableId":
                            query = query.Where(c => c.row.TableId.ToString().Trim().Contains(fillter));
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

                    }
                }
            }

            //3.Query second
            var query2 = query.Select(c => new DishOrder()
            {
                Id = c.row.Id,
                Note = c.row.Note,
                DishOrderStatusId = c.row.DishOrderStatusId,
                TableId = c.row.TableId,
                CreatedTime = c.row.CreatedTime,
                Active = c.row.Active,

            });
            //4. Sort
            query2 = query2.OrderByDynamic<DishOrder>(orderCritirea, orderDirectionASC ? LinqExtensions.Order.Asc : LinqExtensions.Order.Desc);
            recordFiltered = await query2.CountAsync();
            //5. Return data
            return new DTResult<DishOrder>()
            {
                data = await query2.Skip(parameters.Start).Take(parameters.Length).ToListAsync(),
                draw = parameters.Draw,
                recordsFiltered = recordFiltered,
                recordsTotal = recordTotal
            };
        }
    }
}


