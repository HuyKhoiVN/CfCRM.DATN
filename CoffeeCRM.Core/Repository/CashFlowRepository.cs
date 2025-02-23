
using CoffeeCRM.Core.Util;
using CoffeeCRM.Core.Util.Parameters;
using CoffeeCRM.Data.Model;
using Microsoft.EntityFrameworkCore;
using System.Globalization;

namespace CoffeeCRM.Core.Repository
{
    public class CashFlowRepository: ICashFlowRepository
                {
                    SysDbContext db;
                    public CashFlowRepository(SysDbContext _db)
                    {
                        db = _db;
                    }


            public async Task <List<CashFlow>> List()
            {
                            if(db != null)
                    {
                        return await(
                            from row in db.CashFlows
                        where(row.Active)
                        orderby row.Id descending
                        select row
                        ).ToListAsync();
                    }

                    return null;
                }


            //public async Task <List< CashFlow>> Search(string keyword)
            //{
            //    if(db != null)
            //    {
            //        return await(
            //            from row in db.CashFlows
            //                        where(row.Active && (row.Name.Contains(keyword) || row.Description.Contains(keyword)))
            //                        orderby row.Id descending
            //                        select row
            //        ).ToListAsync();
            //    }
            //    return null;
            //}


            public async Task <List<CashFlow>> ListPaging(int pageIndex, int pageSize)
            {
                int offSet = 0;
                offSet = (pageIndex - 1) * pageSize;
                if (db != null) {
                    return await(
                        from row in db.CashFlows
                                    where(row.Active)
                                    orderby row.Id descending
                                    select row
                    ).Skip(offSet).Take(pageSize).ToListAsync();
                }
                return null;
            }


            public async Task <CashFlow> Detail(long ? id)
            {
                if (db != null) {
                    return await db.CashFlows.FirstOrDefaultAsync(row => row.Active && row.Id == id);
                }
                return null;
            }


            public async Task <CashFlow> Add(CashFlow obj)
            {
                if (db != null) {
                    await db.CashFlows.AddAsync(obj);
                    await db.SaveChangesAsync();
                    return obj;
                }
                return null;
            }


            public async Task Update(CashFlow obj)
            {
                if (db != null) {
                    //Update that object
                    db.CashFlows.Attach(obj);
                    db.Entry(obj).Property(x => x.TotalMoney).IsModified = true;
db.Entry(obj).Property(x => x.FlowType).IsModified = true;
db.Entry(obj).Property(x => x.Note).IsModified = true;
db.Entry(obj).Property(x => x.Active).IsModified = true;
db.Entry(obj).Property(x => x.AccountId).IsModified = true;

                    //Commit the transaction
                    await db.SaveChangesAsync();
                }
            }


            public async Task Delete(CashFlow obj)
            {
                if (db != null) {
                    //Update that obj
                    db.CashFlows.Attach(obj);
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
                    var obj = await db.CashFlows.FirstOrDefaultAsync(x => x.Id == objId);

                    if (obj != null) {
                        //Delete that obj
                        db.CashFlows.Remove(obj);

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
                        from row in db.CashFlows
                                    where row.Active
                                    select row
                                ).Count();
                }

                return result;
            }
            public async Task <DTResult<CashFlow>> ListServerSide(CashFlowDTParameters parameters)
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
                var query = from row in db.CashFlows 

                                    
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
EF.Functions.Collate(c.row.TotalMoney.ToString().ToLower(), SQLParams.Latin_General).Contains(EF.Functions.Collate(searchAll, SQLParams.Latin_General)) ||
EF.Functions.Collate(c.row.FlowType.ToLower(), SQLParams.Latin_General).Contains(EF.Functions.Collate(searchAll, SQLParams.Latin_General)) ||
EF.Functions.Collate(c.row.Note.ToLower(), SQLParams.Latin_General).Contains(EF.Functions.Collate(searchAll, SQLParams.Latin_General)) ||
EF.Functions.Collate(c.row.CreatedTime.ToCustomString().ToLower(), SQLParams.Latin_General).Contains(EF.Functions.Collate(searchAll, SQLParams.Latin_General)) ||
EF.Functions.Collate(c.row.Active.ToString().ToLower(), SQLParams.Latin_General).Contains(EF.Functions.Collate(searchAll, SQLParams.Latin_General)) ||
EF.Functions.Collate(c.row.AccountId.ToString().ToLower(), SQLParams.Latin_General).Contains(EF.Functions.Collate(searchAll, SQLParams.Latin_General))

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
case "totalMoney":
                query = query.Where(c => c.row.TotalMoney.ToString().Trim().Contains(fillter));
                break; 
 case "flowType":
                query = query.Where(c => (c.row.FlowType ?? "").Contains(fillter));
                break;
 case "note":
                query = query.Where(c => (c.row.Note ?? "").Contains(fillter));
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

                        }
                    }
                }
                
                //3.Query second
                var query2 = query.Select(c => new CashFlow()
                {
                    Id = c.row.Id,
TotalMoney = c.row.TotalMoney,
FlowType = c.row.FlowType,
Note = c.row.Note,
CreatedTime = c.row.CreatedTime,
Active = c.row.Active,
AccountId = c.row.AccountId,

                });
                //4. Sort
                query2 = query2.OrderByDynamic<CashFlow>(orderCritirea, orderDirectionASC ? LinqExtensions.Order.Asc : LinqExtensions.Order.Desc);
                recordFiltered = await query2.CountAsync();
                //5. Return data
                return new DTResult<CashFlow>()
                {
                    data = await query2.Skip(parameters.Start).Take(parameters.Length).ToListAsync(),
                        draw = parameters.Draw,
                        recordsFiltered = recordFiltered,
                        recordsTotal = recordTotal
                };
            }
        }
    }


