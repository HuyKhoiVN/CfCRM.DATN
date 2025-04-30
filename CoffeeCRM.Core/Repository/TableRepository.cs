
using CoffeeCRM.Data.Model;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CoffeeCRM.Core.Util;using CoffeeCRM.Data;
using CoffeeCRM.Core.Util.Parameters;
using CoffeeCRM.Data.ViewModels;
using System.Globalization;
using CoffeeCRM.Data.DTO;
using CoffeeCRM.Data.Constants;

namespace CoffeeCRM.Core.Repository
{
    public class TableRepository : ITableRepository
    {
        SysDbContext db;
        public TableRepository(SysDbContext _db)
        {
            db = _db;
        }


        public async Task<List<Table>> List()
        {
            if (db != null)
            {
                return await (
                    from row in db.Tables
                    where (row.Active)
                    orderby row.Id ascending
                    select row
                ).ToListAsync();
            }

            return null;
        }

        public async Task<List<TableDto>> ListDto()
        {
            if (db == null) return null;

            var today = DateTime.Today;
            var tomorrow = today.AddDays(1);
            var now = DateTime.Now;

            var rawData = await (
                                    from t in db.Tables
                                    where t.Active
                                    join b in db.TableBookings on t.Id equals b.TableId into tb
                                    from b in tb.DefaultIfEmpty()
                                    group new { t, b } by new
                                    {
                                        t.Id,
                                        t.TableCode,
                                        t.TableName,
                                        t.TableStatus,
                                        t.CreatedTime
                                    } into g
                                    select new
                                    {
                                        g.Key.Id,
                                        g.Key.TableCode,
                                        g.Key.TableName,
                                        g.Key.TableStatus,
                                        g.Key.CreatedTime,
                                        BookingList = g
                                            .Where(x => x.b != null &&
                                                        x.b.Active &&
                                                        x.b.BookingTime >= today &&
                                                        x.b.BookingTime < tomorrow &&
                                                        x.b.BookingStatus == TableBookingConst.CONFIRMED)
                                            .Select(x => x.b)
                                            .ToList()
                                    }
                                ).ToListAsync();

            var result = rawData
                .Select(x => new TableDto
                {
                    Id = x.Id,
                    TableCode = x.TableCode,
                    TableName = x.TableName,
                    TableStatus = x.TableStatus,
                    CreatedTime = x.CreatedTime,
                    TotalBooking = x.BookingList.Count(),
                    LastBookingTime = x.BookingList.Any() ? (int)(x.BookingList
                                                                    .OrderBy(b => Math.Abs((b.BookingTime - now).TotalSeconds))
                                                                    .Select(b => b.BookingTime)
                                                                    .FirstOrDefault() - now).TotalMinutes : 0

                })
                .OrderBy(x => x.Id)
                .ToList();

            foreach(var item in result)
            {
                if(item.TotalBooking > 0 && item.LastBookingTime != 0 && item.LastBookingTime < 60)
                {
                    var tb = await Detail(item.Id);
                    tb.TableStatus = TableConst.BOOKED;
                    await Update(tb);
                }
            }

            return result;
        }

        //public async Task <List< Table>> Search(string keyword)
        //{
        //    if(db != null)
        //    {
        //        return await(
        //            from row in db.Tables
        //                        where(row.Active && (row.Name.Contains(keyword) || row.Description.Contains(keyword)))
        //                        orderby row.Id descending
        //                        select row
        //        ).ToListAsync();
        //    }
        //    return null;
        //}


        public async Task<List<Table>> ListPaging(int pageIndex, int pageSize)
        {
            int offSet = 0;
            offSet = (pageIndex - 1) * pageSize;
            if (db != null)
            {
                return await (
                    from row in db.Tables
                    where (row.Active)
                    orderby row.Id descending
                    select row
                ).Skip(offSet).Take(pageSize).ToListAsync();
            }
            return null;
        }


        public async Task<Table> Detail(long? id)
        {
            if (db != null)
            {
                return await db.Tables.FirstOrDefaultAsync(row => row.Active && row.Id == id);
            }
            return null;
        }


        public async Task<Table> Add(Table obj)
        {
            if (db != null)
            {
                await db.Tables.AddAsync(obj);
                await db.SaveChangesAsync();
                return obj;
            }
            return null;
        }


        public async Task Update(Table obj)
        {
            if (db != null)
            {
                //Update that object
                db.Tables.Attach(obj);
                db.Entry(obj).Property(x => x.TableCode).IsModified = true;
                db.Entry(obj).Property(x => x.TableName).IsModified = true;
                db.Entry(obj).Property(x => x.TableStatus).IsModified = true;
                db.Entry(obj).Property(x => x.Active).IsModified = true;

                //Commit the transaction
                await db.SaveChangesAsync();
            }
        }


        public async Task Delete(Table obj)
        {
            if (db != null)
            {
                //Update that obj
                db.Tables.Attach(obj);
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
                var obj = await db.Tables.FirstOrDefaultAsync(x => x.Id == objId);

                if (obj != null)
                {
                    //Delete that obj
                    db.Tables.Remove(obj);

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
                    from row in db.Tables
                    where row.Active
                    select row
                            ).Count();
            }

            return result;
        }
        public async Task<DTResult<Table>> ListServerSide(TableDTParameters parameters)
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
            var query = from row in db.Tables


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
EF.Functions.Collate(c.row.TableCode.ToLower(), SQLParams.Latin_General).Contains(EF.Functions.Collate(searchAll, SQLParams.Latin_General)) ||
EF.Functions.Collate(c.row.TableName.ToLower(), SQLParams.Latin_General).Contains(EF.Functions.Collate(searchAll, SQLParams.Latin_General)) ||
EF.Functions.Collate(c.row.TableStatus.ToLower(), SQLParams.Latin_General).Contains(EF.Functions.Collate(searchAll, SQLParams.Latin_General)) ||
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
                        case "tableCode":
                            query = query.Where(c => (c.row.TableCode ?? "").Contains(fillter));
                            break;
                        case "tableName":
                            query = query.Where(c => (c.row.TableName ?? "").Contains(fillter));
                            break;
                        case "tableStatus":
                            query = query.Where(c => (c.row.TableStatus ?? "").Contains(fillter));
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
            var query2 = query.Select(c => new Table()
            {
                Id = c.row.Id,
                TableCode = c.row.TableCode,
                TableName = c.row.TableName,
                TableStatus = c.row.TableStatus,
                CreatedTime = c.row.CreatedTime,
                Active = c.row.Active,

            });
            //4. Sort
            query2 = query2.OrderByDynamic<Table>(orderCritirea, orderDirectionASC ? LinqExtensions.Order.Asc : LinqExtensions.Order.Desc);
            recordFiltered = await query2.CountAsync();
            //5. Return data
            return new DTResult<Table>()
            {
                data = await query2.Skip(parameters.Start).Take(parameters.Length).ToListAsync(),
                draw = parameters.Draw,
                recordsFiltered = recordFiltered,
                recordsTotal = recordTotal
            };
        }
    }
}


