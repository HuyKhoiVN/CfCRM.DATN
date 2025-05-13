
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
using CoffeeCRM.Data.DTO;
using SkiaSharp;
using Microsoft.EntityFrameworkCore.Infrastructure;

namespace CoffeeCRM.Core.Repository
{
    public class StockLevelRepository : IStockLevelRepository
    {
        SysDbContext db;
        public StockLevelRepository(SysDbContext _db)
        {
            db = _db;
        }


        public async Task<List<StockLevel>> List()
        {
            if (db != null)
            {
                return await (
                    from row in db.StockLevels
                    where (row.Active)
                    orderby row.Id descending
                    select row
                ).ToListAsync();
            }

            return null;
        }


        //public async Task <List< StockLevel>> Search(string keyword)
        //{
        //    if(db != null)
        //    {
        //        return await(
        //            from row in db.StockLevels
        //                        where(row.Active && (row.Name.Contains(keyword) || row.Description.Contains(keyword)))
        //                        orderby row.Id descending
        //                        select row
        //        ).ToListAsync();
        //    }
        //    return null;
        //}


        public async Task<List<StockLevel>> ListPaging(int pageIndex, int pageSize)
        {
            int offSet = 0;
            offSet = (pageIndex - 1) * pageSize;
            if (db != null)
            {
                return await (
                    from row in db.StockLevels
                    where (row.Active)
                    orderby row.Id descending
                    select row
                ).Skip(offSet).Take(pageSize).ToListAsync();
            }
            return null;
        }


        public async Task<StockLevel> Detail(long? id)
        {
            if (db != null)
            {
                return await db.StockLevels.FirstOrDefaultAsync(row => row.Active && row.Id == id);
            }
            return null;
        }


        public async Task<StockLevel> Add(StockLevel obj)
        {
            if (db != null)
            {
                await db.StockLevels.AddAsync(obj);
                await db.SaveChangesAsync();
                return obj;
            }
            return null;
        }


        public async Task Update(StockLevel obj)
        {
            if (db != null)
            {
                //Update that object
                db.StockLevels.Attach(obj);
                db.Entry(obj).Property(x => x.Quantity).IsModified = true;
                db.Entry(obj).Property(x => x.ExpirationDate).IsModified = true;
                db.Entry(obj).Property(x => x.UnitPrice).IsModified = true;
                db.Entry(obj).Property(x => x.Active).IsModified = true;
                db.Entry(obj).Property(x => x.IngredientId).IsModified = true;
                db.Entry(obj).Property(x => x.WarehouseId).IsModified = true;
                db.Entry(obj).Property(x => x.LastUpdatedTime).IsModified = true;

                //Commit the transaction
                await db.SaveChangesAsync();
            }
        }


        public async Task Delete(StockLevel obj)
        {
            if (db != null)
            {
                //Update that obj
                db.StockLevels.Attach(obj);
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
                var obj = await db.StockLevels.FirstOrDefaultAsync(x => x.Id == objId);

                if (obj != null)
                {
                    //Delete that obj
                    db.StockLevels.Remove(obj);

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
                    from row in db.StockLevels
                    where row.Active
                    select row
                            ).Count();
            }

            return result;
        }
        public async Task<DTResult<StockLevelDto>> ListServerSide(StockLevelDTParameters parameters)
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
            var query = from row in db.StockLevels
                        join ingredient in db.Ingredients on row.IngredientId equals ingredient.Id into ingredientGroup
                        from igre in ingredientGroup.DefaultIfEmpty()
                        join unit in db.Units on igre.UnitId equals unit.Id into unitGroup
                        from un in unitGroup.DefaultIfEmpty()
                        join warehouse in db.Warehouses on row.WarehouseId equals warehouse.Id into warehouseGroup
                        from ware in warehouseGroup.DefaultIfEmpty()
                        where row.Active

                        select new
                        {
                            row,
                            igre,
                            un,
                            WarehouseName = ware.WarehouseName,
                        };

            if (parameters.WarehouseId > 0)
            {
                query = query.Where(c => c.row.WarehouseId == parameters.WarehouseId);
            }

            recordTotal = await query.CountAsync();
            //2. Fillter
            if (!String.IsNullOrEmpty(searchAll))
            {
                searchAll = searchAll.ToLower();
                query = query.Where(c =>
                    EF.Functions.Collate(c.row.Id.ToString().ToLower(), SQLParams.Latin_General).Contains(EF.Functions.Collate(searchAll, SQLParams.Latin_General)) ||
                    EF.Functions.Collate(c.row.Quantity.ToString().ToLower(), SQLParams.Latin_General).Contains(EF.Functions.Collate(searchAll, SQLParams.Latin_General)) ||
                    EF.Functions.Collate(c.row.ExpirationDate.ToCustomString().ToLower(), SQLParams.Latin_General).Contains(EF.Functions.Collate(searchAll, SQLParams.Latin_General)) ||
                    EF.Functions.Collate(c.row.UnitPrice.ToString().ToLower(), SQLParams.Latin_General).Contains(EF.Functions.Collate(searchAll, SQLParams.Latin_General)) ||
                    EF.Functions.Collate(c.row.CreatedTime.ToCustomString().ToLower(), SQLParams.Latin_General).Contains(EF.Functions.Collate(searchAll, SQLParams.Latin_General)) ||
                    EF.Functions.Collate(c.row.IngredientId.ToString().ToLower(), SQLParams.Latin_General).Contains(EF.Functions.Collate(searchAll, SQLParams.Latin_General)) ||
                    EF.Functions.Collate(c.row.WarehouseId.ToString().ToLower(), SQLParams.Latin_General).Contains(EF.Functions.Collate(searchAll, SQLParams.Latin_General)) ||
                    EF.Functions.Collate(c.row.LastUpdatedTime.ToCustomString().ToLower(), SQLParams.Latin_General).Contains(EF.Functions.Collate(searchAll, SQLParams.Latin_General)) ||
                    EF.Functions.Collate(c.igre.IngredientName.ToLower(), SQLParams.Latin_General).Contains(EF.Functions.Collate(searchAll, SQLParams.Latin_General))
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
                        case "expirationDate":
                            if (fillter.Contains(" - "))
                            {
                                var dates = fillter.Split(" - ");
                                var startDate = DateTime.ParseExact(dates[0], "dd/MM/yyyy", CultureInfo.InvariantCulture);
                                var endDate = DateTime.ParseExact(dates[1], "dd/MM/yyyy", CultureInfo.InvariantCulture).AddDays(1).AddSeconds(-1);
                                query = query.Where(c => c.row.ExpirationDate >= startDate && c.row.ExpirationDate <= endDate);
                            }
                            else
                            {
                                var date = DateTime.ParseExact(fillter, "dd/MM/yyyy", CultureInfo.InvariantCulture);
                                query = query.Where(c => c.row.ExpirationDate.Date == date.Date);
                            }
                            break;
                        case "unitPrice":
                            query = query.Where(c => c.row.UnitPrice.ToString().Trim().Contains(fillter));
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
                        case "ingredientId":
                            query = query.Where(c => c.row.IngredientId.ToString().Trim().Contains(fillter));
                            break;
                        case "ingredientName":
                            query = query.Where(c => c.igre.IngredientName.ToString().Trim().Contains(fillter));
                            break;
                        case "warehouseId":
                            query = query.Where(c => c.row.WarehouseId.ToString().Trim().Contains(fillter));
                            break;
                        case "lastUpdatedTime":
                            if (fillter.Contains(" - "))
                            {
                                var dates = fillter.Split(" - ");
                                var startDate = DateTime.ParseExact(dates[0], "dd/MM/yyyy", CultureInfo.InvariantCulture);
                                var endDate = DateTime.ParseExact(dates[1], "dd/MM/yyyy", CultureInfo.InvariantCulture).AddDays(1).AddSeconds(-1);
                                query = query.Where(c => c.row.LastUpdatedTime >= startDate && c.row.LastUpdatedTime <= endDate);
                            }
                            else
                            {
                                var date = DateTime.ParseExact(fillter, "dd/MM/yyyy", CultureInfo.InvariantCulture);
                                query = query.Where(c => c.row.LastUpdatedTime.Date == date.Date);
                            }
                            break;

                    }
                }
            }

            //3.Query second
            var now = DateTime.Now;

            var query2 = query
                .GroupBy(x => x.row.IngredientId)
                .Select(g => new StockLevelDto
                {
                    Id = g.First().row.Id,
                    IngredientId = g.Key,
                    IngredientName = g.First().igre.IngredientName,
                    UnitName = g.First().un.UnitName,
                    UnitPrice = (decimal)g.First().igre.AveragePrice,
                    Quantity = g.Sum(x => x.row.Quantity),
                    TotalPrice = (decimal) (g.Sum(x => x.row.Quantity) * g.First().igre.AveragePrice),
                    ExpirationDate = g.Max(x => x.row.ExpirationDate),
                    LastUpdatedTime = g.Max(x => x.row.LastUpdatedTime),
                    Status = g.All(x => x.row.ExpirationDate < now) ? "danger"
                            : g.Sum(x => x.row.Quantity) <= 3 ? "warning" : "normal",
                    WarehouseId = g.First().row.WarehouseId,
                    WarehouseName = g.First().WarehouseName,
                    CreatedTime = g.First().igre.CreatedTime
                });

            if (parameters.isWarning)
                query2 = query2.Where(c => c.Quantity <= 3);

            //4. Sort
            query2 = query2.OrderByDynamic<StockLevelDto>(orderCritirea, orderDirectionASC ? LinqExtensions.Order.Asc : LinqExtensions.Order.Desc);
            recordFiltered = await query2.CountAsync();
            //5. Return data
            return new DTResult<StockLevelDto>()
            {
                data = await query2.Skip(parameters.Start).Take(parameters.Length).ToListAsync(),
                draw = parameters.Draw,
                recordsFiltered = recordFiltered,
                recordsTotal = recordTotal
            };
        }

        public async Task<List<IngredientStockSummaryDto>> GetIngredientStockSummaryByWarehouseAsync(int warehouseId)
        {
            var query = from sl in db.StockLevels
                        join ing in db.Ingredients on sl.IngredientId equals ing.Id
                        join unit in db.Units on ing.UnitId equals unit.Id
                        where sl.WarehouseId == warehouseId && sl.Active && sl.Quantity > 0
                        group new { sl, ing, unit } by new { ing.Id, ing.IngredientCode, ing.IngredientName, unit.UnitName } into g
                        select new IngredientStockSummaryDto
                        {
                            IngredientId = g.Key.Id,
                            IngredientCode = g.Key.IngredientCode,
                            IngredientName = g.Key.IngredientName,
                            UnitName = g.Key.UnitName,
                            TotalQuantity = g.Sum(x => x.sl.Quantity),
                            AveragePrice = (int)(Math.Round(
    g.Where(x => x.sl.UnitPrice > 0).Sum(x => x.sl.Quantity * x.sl.UnitPrice)
    / g.Where(x => x.sl.UnitPrice > 0).Sum(x => x.sl.Quantity),
    0, MidpointRounding.AwayFromZero
) / 1000) * 1000,
                            TotalValue = g.Sum(x => x.sl.Quantity * x.sl.UnitPrice),
                            EarliestExpirationDate = g.Min(x => x.sl.ExpirationDate),
                            BatchCount = g.Count()
                        };

            return await query.OrderBy(s => s.IngredientName).ToListAsync();
        }

        public async Task<List<StockLevelDto>> GetStockLevelsByIngredientAsync(int warehouseId, int ingredientId)
        {
            var query = from sl in db.StockLevels
                        join ing in db.Ingredients on sl.IngredientId equals ing.Id
                        join unit in db.Units on ing.UnitId equals unit.Id
                        join wh in db.Warehouses on sl.WarehouseId equals wh.Id
                        where sl.WarehouseId == warehouseId && sl.IngredientId == ingredientId && sl.Active
                        select new StockLevelDto
                        {
                            Id = sl.Id,
                            Quantity = sl.Quantity,
                            ExpirationDate = sl.ExpirationDate,
                            UnitPrice = sl.UnitPrice,
                            CreatedTime = sl.CreatedTime,
                            LastUpdatedTime = sl.LastUpdatedTime,
                            Active = sl.Active,
                            IngredientId = sl.IngredientId,
                            IngredientName = ing.IngredientName,
                            UnitName = unit.UnitName,
                            WarehouseId = sl.WarehouseId,
                            WarehouseName = wh.WarehouseName
                        };

            return await query.OrderBy(sl => sl.ExpirationDate).ToListAsync();
        }

        public async Task<List<StockLevel>> GetByWarehouseId(int warehouseId)
        {
            var query = from sl in db.StockLevels
                        where sl.WarehouseId == warehouseId && sl.Active
                        select sl;
            return await query.ToListAsync();
        }

        public async Task<StockLevelDetailDto> GetStockLevelDetailAsync(int stockLevelId)
        {
            // Get stock level details
            var stockLevelQuery = from sl in db.StockLevels
                                  join ing in db.Ingredients on sl.IngredientId equals ing.Id
                                  join unit in db.Units on ing.UnitId equals unit.Id
                                  join wh in db.Warehouses on sl.WarehouseId equals wh.Id
                                  where sl.Id == stockLevelId
                                  select new StockLevelDto
                                  {
                                      Id = sl.Id,
                                      Quantity = sl.Quantity,
                                      ExpirationDate = sl.ExpirationDate,
                                      UnitPrice = sl.UnitPrice,
                                      CreatedTime = sl.CreatedTime,
                                      LastUpdatedTime = sl.LastUpdatedTime,
                                      Active = sl.Active,
                                      IngredientId = sl.IngredientId,
                                      IngredientName = ing.IngredientName,
                                      UnitName = unit.UnitName,
                                      WarehouseId = sl.WarehouseId,
                                      WarehouseName = wh.WarehouseName
                                  };

            var stockLevel = await stockLevelQuery.FirstOrDefaultAsync();

            if (stockLevel == null)
                return null;

            // Get transaction history
            var transactionHistoryQuery = from std in db.StockTransactionDetails
                                          join st in db.StockTransactions on std.StockTransactionId equals st.Id
                                          join acc in db.Accounts on st.AccountId equals acc.Id
                                          where std.StockLevelId == stockLevelId && std.Active
                                          select new StockTransactionHistoryDto
                                          {
                                              Id = std.Id,
                                              TransactionCode = st.StockTransactionCode,
                                              TransactionType = st.TransactionType,
                                              Quantity = std.Quantity,
                                              TransactionDate = st.TransactionDate,
                                              Note = st.Note,
                                              CreatedBy = acc.Username
                                          };

            var transactionHistory = await transactionHistoryQuery
                .OrderByDescending(th => th.TransactionDate)
                .ToListAsync();

            return new StockLevelDetailDto
            {
                StockLevel = stockLevel,
                TransactionHistory = transactionHistory
            };
        }

        public async Task<StockLevel> GetStockLevelByIdAsync(int stockLevelId)
        {
            var query = from sl in db.StockLevels
                        where sl.Id == stockLevelId && sl.Active
                        select sl;

            return await query.FirstOrDefaultAsync();
        }

        public async Task<bool> UpdateStockLevelAsync(StockLevel stockLevel)
        {
            db.StockLevels.Update(stockLevel);
            return await db.SaveChangesAsync() > 0;
        }

        public async Task<bool> CreateStockTransactionAsync(StockTransaction transaction, StockTransactionDetail detail)
        {
            using (var dbTransaction = await db.Database.BeginTransactionAsync())
            {
                try
                {
                    await db.StockTransactions.AddAsync(transaction);
                    await db.SaveChangesAsync();

                    detail.StockTransactionId = transaction.Id;
                    await db.StockTransactionDetails.AddAsync(detail);
                    await db.SaveChangesAsync();

                    await dbTransaction.CommitAsync();
                    return true;
                }
                catch
                {
                    await dbTransaction.RollbackAsync();
                    return false;
                }
            }
        }

        public async Task<int> GetTotalQuantityByIngredient(int ingredientId, int warehouseId)
        {
            return await db.StockLevels
                .Where(x => x.IngredientId == ingredientId && x.WarehouseId == warehouseId && x.Active)
                .SumAsync(x => x.Quantity);
        }

        public DatabaseFacade GetDatabase()
        {
            return db.Database;
        }
    }
}


