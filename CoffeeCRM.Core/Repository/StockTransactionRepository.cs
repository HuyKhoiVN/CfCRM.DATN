
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

namespace CoffeeCRM.Core.Repository
{
    public class StockTransactionRepository : IStockTransactionRepository
    {
        SysDbContext db;
        public StockTransactionRepository(SysDbContext _db)
        {
            db = _db;
        }


        public async Task<List<StockTransaction>> List()
        {
            if (db != null)
            {
                return await (
                    from row in db.StockTransactions
                    where (row.Active)
                    orderby row.Id descending
                    select row
                ).ToListAsync();
            }

            return null;
        }


        //public async Task <List< StockTransaction>> Search(string keyword)
        //{
        //    if(db != null)
        //    {
        //        return await(
        //            from row in db.StockTransactions
        //                        where(row.Active && (row.Name.Contains(keyword) || row.Description.Contains(keyword)))
        //                        orderby row.Id descending
        //                        select row
        //        ).ToListAsync();
        //    }
        //    return null;
        //}


        public async Task<List<StockTransaction>> ListPaging(int pageIndex, int pageSize)
        {
            int offSet = 0;
            offSet = (pageIndex - 1) * pageSize;
            if (db != null)
            {
                return await (
                    from row in db.StockTransactions
                    where (row.Active)
                    orderby row.Id descending
                    select row
                ).Skip(offSet).Take(pageSize).ToListAsync();
            }
            return null;
        }


        public async Task<StockTransaction> Detail(long? id)
        {
            if (db != null)
            {
                return await db.StockTransactions.FirstOrDefaultAsync(row => row.Active && row.Id == id);
            }
            return null;
        }


        public async Task<StockTransaction> Add(StockTransaction obj)
        {
            if (db != null)
            {
                await db.StockTransactions.AddAsync(obj);
                await db.SaveChangesAsync();
                return obj;
            }
            return null;
        }


        public async Task Update(StockTransaction obj)
        {
            if (db != null)
            {
                //Update that object
                db.StockTransactions.Attach(obj);
                db.Entry(obj).Property(x => x.StockTransactionCode).IsModified = true;
                db.Entry(obj).Property(x => x.Note).IsModified = true;
                db.Entry(obj).Property(x => x.TransactionType).IsModified = true;
                db.Entry(obj).Property(x => x.TotalMoney).IsModified = true;
                db.Entry(obj).Property(x => x.Status).IsModified = true;
                db.Entry(obj).Property(x => x.Active).IsModified = true;
                db.Entry(obj).Property(x => x.WarehouseId).IsModified = true;
                db.Entry(obj).Property(x => x.AccountId).IsModified = true;
                db.Entry(obj).Property(x => x.TransactionDate).IsModified = true;

                //Commit the transaction
                await db.SaveChangesAsync();
            }
        }


        public async Task Delete(StockTransaction obj)
        {
            if (db != null)
            {
                //Update that obj
                db.StockTransactions.Attach(obj);
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
                var obj = await db.StockTransactions.FirstOrDefaultAsync(x => x.Id == objId);

                if (obj != null)
                {
                    //Delete that obj
                    db.StockTransactions.Remove(obj);

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
                    from row in db.StockTransactions
                    where row.Active
                    select row
                            ).Count();
            }

            return result;
        }
        public async Task<DTResult<StockTransaction>> ListServerSide(StockTransactionDTParameters parameters)
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
            var query = from row in db.StockTransactions


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
EF.Functions.Collate(c.row.StockTransactionCode.ToLower(), SQLParams.Latin_General).Contains(EF.Functions.Collate(searchAll, SQLParams.Latin_General)) ||
EF.Functions.Collate(c.row.Note.ToLower(), SQLParams.Latin_General).Contains(EF.Functions.Collate(searchAll, SQLParams.Latin_General)) ||
EF.Functions.Collate(c.row.TransactionType.ToString().ToLower(), SQLParams.Latin_General).Contains(EF.Functions.Collate(searchAll, SQLParams.Latin_General)) ||
EF.Functions.Collate(c.row.TotalMoney.ToString().ToLower(), SQLParams.Latin_General).Contains(EF.Functions.Collate(searchAll, SQLParams.Latin_General)) ||
EF.Functions.Collate(c.row.Status.ToLower(), SQLParams.Latin_General).Contains(EF.Functions.Collate(searchAll, SQLParams.Latin_General)) ||
EF.Functions.Collate(c.row.CreatedTime.ToCustomString().ToLower(), SQLParams.Latin_General).Contains(EF.Functions.Collate(searchAll, SQLParams.Latin_General)) ||
EF.Functions.Collate(c.row.Active.ToString().ToLower(), SQLParams.Latin_General).Contains(EF.Functions.Collate(searchAll, SQLParams.Latin_General)) ||
EF.Functions.Collate(c.row.WarehouseId.ToString().ToLower(), SQLParams.Latin_General).Contains(EF.Functions.Collate(searchAll, SQLParams.Latin_General)) ||
EF.Functions.Collate(c.row.AccountId.ToString().ToLower(), SQLParams.Latin_General).Contains(EF.Functions.Collate(searchAll, SQLParams.Latin_General)) ||
EF.Functions.Collate(c.row.TransactionDate.ToCustomString().ToLower(), SQLParams.Latin_General).Contains(EF.Functions.Collate(searchAll, SQLParams.Latin_General))

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
                        case "stockTransactionCode":
                            query = query.Where(c => (c.row.StockTransactionCode ?? "").Contains(fillter));
                            break;
                        case "note":
                            query = query.Where(c => (c.row.Note ?? "").Contains(fillter));
                            break;
                        case "transactionType":
                            query = query.Where(c => c.row.TransactionType.ToString().Trim().Contains(fillter));
                            break;
                        case "totalMoney":
                            query = query.Where(c => c.row.TotalMoney.ToString().Trim().Contains(fillter));
                            break;
                        case "status":
                            query = query.Where(c => (c.row.Status ?? "").Contains(fillter));
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
                        case "warehouseId":
                            query = query.Where(c => c.row.WarehouseId.ToString().Trim().Contains(fillter));
                            break;
                        case "accountId":
                            query = query.Where(c => c.row.AccountId.ToString().Trim().Contains(fillter));
                            break;
                        case "transactionDate":
                            if (fillter.Contains(" - "))
                            {
                                var dates = fillter.Split(" - ");
                                var startDate = DateTime.ParseExact(dates[0], "dd/MM/yyyy", CultureInfo.InvariantCulture);
                                var endDate = DateTime.ParseExact(dates[1], "dd/MM/yyyy", CultureInfo.InvariantCulture).AddDays(1).AddSeconds(-1);
                                query = query.Where(c => c.row.TransactionDate >= startDate && c.row.TransactionDate <= endDate);
                            }
                            else
                            {
                                var date = DateTime.ParseExact(fillter, "dd/MM/yyyy", CultureInfo.InvariantCulture);
                                query = query.Where(c => c.row.TransactionDate.Date == date.Date);
                            }
                            break;

                    }
                }
            }

            //3.Query second
            var query2 = query.Select(c => new StockTransaction()
            {
                Id = c.row.Id,
                StockTransactionCode = c.row.StockTransactionCode,
                Note = c.row.Note,
                TransactionType = c.row.TransactionType,
                TotalMoney = c.row.TotalMoney,
                Status = c.row.Status,
                CreatedTime = c.row.CreatedTime,
                Active = c.row.Active,
                WarehouseId = c.row.WarehouseId,
                AccountId = c.row.AccountId,
                TransactionDate = c.row.TransactionDate,

            });
            //4. Sort
            query2 = query2.OrderByDynamic<StockTransaction>(orderCritirea, orderDirectionASC ? LinqExtensions.Order.Asc : LinqExtensions.Order.Desc);
            recordFiltered = await query2.CountAsync();
            //5. Return data
            return new DTResult<StockTransaction>()
            {
                data = await query2.Skip(parameters.Start).Take(parameters.Length).ToListAsync(),
                draw = parameters.Draw,
                recordsFiltered = recordFiltered,
                recordsTotal = recordTotal
            };
        }

        public DatabaseFacade GetDatabase()
        {
            return db.Database;
        }
    
        public async Task<List<StockTransactionImportDto>> GetTransactionByWarehouse(int warehouseId)
        {
            var query = from row in db.StockTransactions
                        join a in db.Accounts on row.AccountId equals a.Id
                        join dt in db.StockTransactionDetails on row.Id equals dt.StockTransactionId
                        where row.Active && row.WarehouseId == warehouseId && dt.Active
                        join st in db.StockLevels on dt.StockLevelId equals st.Id
                        join i in db.Ingredients on st.IngredientId equals i.Id
                        join unit in db.Units on i.UnitId equals unit.Id
                        select new StockTransactionImportDto()
                        {
                            Id = row.Id,
                            StockTransactionCode = row.StockTransactionCode,
                            Note = row.Note,
                            TransactionType = row.TransactionType,
                            TotalMoney = row.TotalMoney,
                            Status = row.Status,
                            CreatedTime = row.CreatedTime,
                            Active = row.Active,
                            WarehouseId = row.WarehouseId,
                            AccountId = row.AccountId,
                            AccountName = a.FullName,
                            TransactionDate = row.TransactionDate,
                            Details = new List<StockTransactionDetailImportDto>()
                            {
                                new StockTransactionDetailImportDto()
                                {
                                    Id = dt.Id,
                                    StockTransactionId = dt.StockTransactionId,
                                    StockLevelId = st.Id,
                                    IngredientId = st.IngredientId,
                                    IngredientName = i.IngredientName,
                                    Quantity = dt.Quantity,
                                    UnitPrice = st.UnitPrice,
                                }
                            }
                        };
            return await query.ToListAsync();
        }
    }
}


