
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

    namespace CoffeeCRM.Core.Repository
        {
            public class TableBookingRepository: ITableBookingRepository
                {
                    SysDbContext db;
                    public TableBookingRepository(SysDbContext _db)
                    {
                        db = _db;
                    }


            public async Task <List<TableBooking>> List()
            {
                            if(db != null)
                    {
                        return await(
                            from row in db.TableBookings
                        where(row.Active)
                        orderby row.Id descending
                        select row
                        ).ToListAsync();
                    }

                    return null;
                }


            //public async Task <List< TableBooking>> Search(string keyword)
            //{
            //    if(db != null)
            //    {
            //        return await(
            //            from row in db.TableBookings
            //                        where(row.Active && (row.Name.Contains(keyword) || row.Description.Contains(keyword)))
            //                        orderby row.Id descending
            //                        select row
            //        ).ToListAsync();
            //    }
            //    return null;
            //}


            public async Task <List<TableBooking>> ListPaging(int pageIndex, int pageSize)
            {
                int offSet = 0;
                offSet = (pageIndex - 1) * pageSize;
                if (db != null) {
                    return await(
                        from row in db.TableBookings
                                    where(row.Active)
                                    orderby row.Id descending
                                    select row
                    ).Skip(offSet).Take(pageSize).ToListAsync();
                }
                return null;
            }


            public async Task <TableBooking> Detail(long ? id)
            {
                if (db != null) {
                    return await db.TableBookings.FirstOrDefaultAsync(row => row.Active && row.Id == id);
                }
                return null;
            }


            public async Task <TableBooking> Add(TableBooking obj)
            {
                if (db != null) {
                    await db.TableBookings.AddAsync(obj);
                    await db.SaveChangesAsync();
                    return obj;
                }
                return null;
            }


            public async Task Update(TableBooking obj)
            {
                if (db != null) {
                    //Update that object
                    db.TableBookings.Attach(obj);
                    db.Entry(obj).Property(x => x.BookingTime).IsModified = true;
db.Entry(obj).Property(x => x.CheckinTime).IsModified = true;
db.Entry(obj).Property(x => x.BookingStatus).IsModified = true;
db.Entry(obj).Property(x => x.Deposit).IsModified = true;
db.Entry(obj).Property(x => x.CreatedTime).IsModified = true;
db.Entry(obj).Property(x => x.Active).IsModified = true;
db.Entry(obj).Property(x => x.AccountId).IsModified = true;
db.Entry(obj).Property(x => x.TableId).IsModified = true;

                    //Commit the transaction
                    await db.SaveChangesAsync();
                }
            }


            public async Task Delete(TableBooking obj)
            {
                if (db != null) {
                    //Update that obj
                    db.TableBookings.Attach(obj);
                    db.Entry(obj).Property(x => x.Active).IsModified = true;

                    //Commit the transaction
                    await db.SaveChangesAsync();
                }
            }

            public async Task<long> DeletePermanently(long ? objId)
            {
                            int result = 0;

                if (db != null) {
                    //Find the obj for specific obj id
                    var obj = await db.TableBookings.FirstOrDefaultAsync(x => x.Id == objId);

                    if (obj != null) {
                        //Delete that obj
                        db.TableBookings.Remove(obj);

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

                if (db != null) {
                    //Find the obj for specific obj id
                    result = (
                        from row in db.TableBookings
                                    where row.Active
                                    select row
                                ).Count();
                }

                return result;
            }
            public async Task <DTResult<TableBooking>> ListServerSide(TableBookingDTParameters parameters)
            {
                //0. Options
                string searchAll = parameters.SearchAll.Trim();//Trim text
                string orderCritirea = "Id";//Set default critirea
                int recordTotal, recordFiltered;
                bool orderDirectionASC = true;//Set default ascending
                if (parameters.Order != null) {
                    orderCritirea = parameters.Columns[parameters.Order[0].Column].Data;
                    orderDirectionASC = parameters.Order[0].Dir == DTOrderDir.ASC;
                }
                //1. Join
                var query = from row in db.TableBookings 

                                    
                    where row.Active
                                    
                    select new {
                        row
                    };
                
                recordTotal = await query.CountAsync();
                //2. Fillter
                if (!String.IsNullOrEmpty(searchAll)) {
                    searchAll = searchAll.ToLower();
                    query = query.Where(c =>
                        EF.Functions.Collate(c.row.Id.ToString().ToLower(), SQLParams.Latin_General).Contains(EF.Functions.Collate(searchAll, SQLParams.Latin_General)) ||
EF.Functions.Collate(c.row.BookingTime.ToCustomString().ToLower(), SQLParams.Latin_General).Contains(EF.Functions.Collate(searchAll, SQLParams.Latin_General)) ||
EF.Functions.Collate(c.row.CheckinTime.ToCustomString().ToLower(), SQLParams.Latin_General).Contains(EF.Functions.Collate(searchAll, SQLParams.Latin_General)) ||
EF.Functions.Collate(c.row.BookingStatus.ToLower(), SQLParams.Latin_General).Contains(EF.Functions.Collate(searchAll, SQLParams.Latin_General)) ||
EF.Functions.Collate(c.row.Deposit.ToString().ToLower(), SQLParams.Latin_General).Contains(EF.Functions.Collate(searchAll, SQLParams.Latin_General)) ||
EF.Functions.Collate(c.row.CreatedTime.ToCustomString().ToLower(), SQLParams.Latin_General).Contains(EF.Functions.Collate(searchAll, SQLParams.Latin_General)) ||
EF.Functions.Collate(c.row.Active.ToString().ToLower(), SQLParams.Latin_General).Contains(EF.Functions.Collate(searchAll, SQLParams.Latin_General)) ||
EF.Functions.Collate(c.row.AccountId.ToString().ToLower(), SQLParams.Latin_General).Contains(EF.Functions.Collate(searchAll, SQLParams.Latin_General)) ||
EF.Functions.Collate(c.row.TableId.ToString().ToLower(), SQLParams.Latin_General).Contains(EF.Functions.Collate(searchAll, SQLParams.Latin_General))

                    );
                }
                foreach(var item in parameters.Columns)
                {
                    var fillter = item.Search.Value.Trim();
                    if (fillter.Length > 0) {
                        switch (item.Data) {
                            case "id":
                            query = query.Where(c => c.row.Id.ToString().Trim().Contains(fillter));
                            break;
case "bookingTime":
                if (fillter.Contains(" - "))
                {
                    var dates = fillter.Split(" - ");
                    var startDate = DateTime.ParseExact(dates[0], "dd/MM/yyyy", CultureInfo.InvariantCulture);
                    var endDate = DateTime.ParseExact(dates[1], "dd/MM/yyyy", CultureInfo.InvariantCulture).AddDays(1).AddSeconds(-1);
                    query = query.Where(c => c.row.BookingTime >= startDate && c.row.BookingTime <= endDate);
                }
                else
                {
                    var date = DateTime.ParseExact(fillter, "dd/MM/yyyy", CultureInfo.InvariantCulture);
                    query = query.Where(c => c.row.BookingTime.Date == date.Date);
                }
                break;
case "checkinTime":
                if (fillter.Contains(" - "))
                {
                    var dates = fillter.Split(" - ");
                    var startDate = DateTime.ParseExact(dates[0], "dd/MM/yyyy", CultureInfo.InvariantCulture);
                    var endDate = DateTime.ParseExact(dates[1], "dd/MM/yyyy", CultureInfo.InvariantCulture).AddDays(1).AddSeconds(-1);
                    query = query.Where(c => c.row.CheckinTime >= startDate && c.row.CheckinTime <= endDate);
                }
                else
                {
                    var date = DateTime.ParseExact(fillter, "dd/MM/yyyy", CultureInfo.InvariantCulture);
                    query = query.Where(c => c.row.CheckinTime.Date == date.Date);
                }
                break;
 case "bookingStatus":
                query = query.Where(c => (c.row.BookingStatus ?? "").Contains(fillter));
                break;
case "deposit":
                query = query.Where(c => c.row.Deposit.ToString().Trim().Contains(fillter));
                break; 
case "createTime":
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
case "tableId":
                            query = query.Where(c => c.row.TableId.ToString().Trim().Contains(fillter));
                            break;

                        }
                    }
                }
                
                //3.Query second
                var query2 = query.Select(c => new TableBooking()
                {
                    Id = c.row.Id,
BookingTime = c.row.BookingTime,
CheckinTime = c.row.CheckinTime,
BookingStatus = c.row.BookingStatus,
Deposit = c.row.Deposit,
CreatedTime = c.row.CreatedTime,
Active = c.row.Active,
AccountId = c.row.AccountId,
TableId = c.row.TableId,

                });
                //4. Sort
                query2 = query2.OrderByDynamic<TableBooking>(orderCritirea, orderDirectionASC ? LinqExtensions.Order.Asc : LinqExtensions.Order.Desc);
                recordFiltered = await query2.CountAsync();
                //5. Return data
                return new DTResult<TableBooking>()
                {
                    data = await query2.Skip(parameters.Start).Take(parameters.Length).ToListAsync(),
                        draw = parameters.Draw,
                        recordsFiltered = recordFiltered,
                        recordsTotal = recordTotal
                };
            }
        }
    }


