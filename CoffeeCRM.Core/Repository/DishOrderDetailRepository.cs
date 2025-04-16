
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

namespace CoffeeCRM.Core.Repository
{
    public class DishOrderDetailRepository : IDishOrderDetailRepository
    {
        SysDbContext db;
        public DishOrderDetailRepository(SysDbContext _db)
        {
            db = _db;
        }


        public async Task<List<DishOrderDetail>> List()
        {
            if (db != null)
            {
                return await (
                    from row in db.DishOrderDetails
                    where (row.Active)
                    orderby row.Id descending
                    select row
                ).ToListAsync();
            }

            return null;
        }


        //public async Task <List< DishOrderDetail>> Search(string keyword)
        //{
        //    if(db != null)
        //    {
        //        return await(
        //            from row in db.DishOrderDetails
        //                        where(row.Active && (row.Name.Contains(keyword) || row.Description.Contains(keyword)))
        //                        orderby row.Id descending
        //                        select row
        //        ).ToListAsync();
        //    }
        //    return null;
        //}

        public async Task<List<DishOrderDetailViewModel>> ListDishOrderInvoice(int tableId)
        {
            if (db != null)
            {
                var validStatuses = new[] { DishOrderStatudConst.PROCESSING, DishOrderStatudConst.DONE };

                var result = await (
                    from row in db.DishOrderDetails
                    join order in db.DishOrders on row.DishOrderId equals order.Id
                    join dish in db.Dishes on row.DishId equals dish.Id
                    where order.TableId == tableId
                          && row.Active
                          && validStatuses.Contains(order.DishOrderStatusId)
                    group new { row, dish } by new { row.DishId, dish.DishName, dish.Price } into grouped
                    select new DishOrderDetailViewModel()
                    {
                        DishId = grouped.Key.DishId,
                        DishName = grouped.Key.DishName,
                        Quantity = grouped.Sum(x => x.row.Quantity),
                        Price = grouped.Key.Price,
                        TotalPrice = grouped.Sum(x => x.row.Quantity * x.dish.Price)
                    }
                ).ToListAsync();
                return result;
            }
            return null;
        }

        public async Task<List<DishOrderDetailViewModel>> ListByOrderId(int id)
        {
            if (db != null)
            {
                return await (
                    from row in db.DishOrderDetails
                    join d in db.Dishes on row.DishId equals d.Id
                    where row.Active && row.DishOrderId == id && d.Active
                    orderby row.Id descending
                    select new DishOrderDetailViewModel()
                    {
                        Id = row.Id,
                        DishOrderId = row.DishOrderId,
                        DishId = row.DishId,
                        Quantity = row.Quantity,
                        DishName = d.DishName,
                        Price = d.Price,
                        Description = row.Note
                    }
                ).ToListAsync();
            }

            return null;
        }


        public async Task<List<DishOrderDetail>> ListPaging(int pageIndex, int pageSize)
        {
            int offSet = 0;
            offSet = (pageIndex - 1) * pageSize;
            if (db != null)
            {
                return await (
                    from row in db.DishOrderDetails
                    where (row.Active)
                    orderby row.Id descending
                    select row
                ).Skip(offSet).Take(pageSize).ToListAsync();
            }
            return null;
        }


        public async Task<DishOrderDetail> Detail(long? id)
        {
            if (db != null)
            {
                return await db.DishOrderDetails.FirstOrDefaultAsync(row => row.Active && row.Id == id);
            }
            return null;
        }


        public async Task<DishOrderDetail> Add(DishOrderDetail obj)
        {
            if (db != null)
            {
                await db.DishOrderDetails.AddAsync(obj);
                await db.SaveChangesAsync();
                return obj;
            }
            return null;
        }


        public async Task<bool> Update(DishOrderDetail obj)
        {
            if (db != null)
            {
                //Update that object
                db.DishOrderDetails.Attach(obj);
                db.Entry(obj).Property(x => x.DishOrderId).IsModified = true;
                db.Entry(obj).Property(x => x.DishId).IsModified = true;
                db.Entry(obj).Property(x => x.Quantity).IsModified = true;
                db.Entry(obj).Property(x => x.Note).IsModified = true;
                db.Entry(obj).Property(x => x.Active).IsModified = true;

                //Commit the transaction
                return await db.SaveChangesAsync() > 0;
            }
            return false;
        }


        public async Task Delete(DishOrderDetail obj)
        {
            if (db != null)
            {
                //Update that obj
                db.DishOrderDetails.Attach(obj);
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
                var obj = await db.DishOrderDetails.FirstOrDefaultAsync(x => x.Id == objId);

                if (obj != null)
                {
                    //Delete that obj
                    db.DishOrderDetails.Remove(obj);

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
                    from row in db.DishOrderDetails
                    where row.Active
                    select row
                            ).Count();
            }

            return result;
        }
        public async Task<DTResult<DishOrderDetail>> ListServerSide(DishOrderDetailDTParameters parameters)
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
            var query = from row in db.DishOrderDetails


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
                    EF.Functions.Collate(c.row.Quantity.ToString().ToLower(), SQLParams.Latin_General).Contains(EF.Functions.Collate(searchAll, SQLParams.Latin_General)) ||
                    EF.Functions.Collate(c.row.Note.ToLower(), SQLParams.Latin_General).Contains(EF.Functions.Collate(searchAll, SQLParams.Latin_General)) ||
                    EF.Functions.Collate(c.row.DishOrderId.ToString().ToLower(), SQLParams.Latin_General).Contains(EF.Functions.Collate(searchAll, SQLParams.Latin_General)) ||
                    EF.Functions.Collate(c.row.DishId.ToString().ToLower(), SQLParams.Latin_General).Contains(EF.Functions.Collate(searchAll, SQLParams.Latin_General)) ||
                    EF.Functions.Collate(c.row.CreatedTime.ToCustomString().ToLower(), SQLParams.Latin_General).Contains(EF.Functions.Collate(searchAll, SQLParams.Latin_General)) ||
                    EF.Functions.Collate(c.row.Active.ToString().ToLower(), SQLParams.Latin_General).Contains(EF.Functions.Collate(searchAll, SQLParams.Latin_General)) ||
                    EF.Functions.Collate(c.row.Price.ToString().ToLower(), SQLParams.Latin_General).Contains(EF.Functions.Collate(searchAll, SQLParams.Latin_General))
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
                        case "quantity":
                            query = query.Where(c => c.row.Quantity.ToString().Trim().Contains(fillter));
                            break;
                        case "note":
                            query = query.Where(c => (c.row.Note ?? "").Contains(fillter));
                            break;
                        case "dishOrderId":
                            query = query.Where(c => c.row.DishOrderId.ToString().Trim().Contains(fillter));
                            break;
                        case "dishId":
                            query = query.Where(c => c.row.DishId.ToString().Trim().Contains(fillter));
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
                        case "price":
                            query = query.Where(c => c.row.Price.ToString().Trim().Contains(fillter));
                            break;

                    }
                }
            }

            //3.Query second
            var query2 = query.Select(c => new DishOrderDetail()
            {
                Id = c.row.Id,
                Quantity = c.row.Quantity,
                Note = c.row.Note,
                DishOrderId = c.row.DishOrderId,
                DishId = c.row.DishId,
                CreatedTime = c.row.CreatedTime,
                Active = c.row.Active,
                Price = c.row.Price,

            });
            //4. Sort
            query2 = query2.OrderByDynamic<DishOrderDetail>(orderCritirea, orderDirectionASC ? LinqExtensions.Order.Asc : LinqExtensions.Order.Desc);
            recordFiltered = await query2.CountAsync();
            //5. Return data
            return new DTResult<DishOrderDetail>()
            {
                data = await query2.Skip(parameters.Start).Take(parameters.Length).ToListAsync(),
                draw = parameters.Draw,
                recordsFiltered = recordFiltered,
                recordsTotal = recordTotal
            };
        }
    }
}


