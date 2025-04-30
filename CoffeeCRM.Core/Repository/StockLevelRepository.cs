
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

            if (parameters.isWarning)
                query = query.Where(c => c.row.Quantity <= 3);

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
            var query2 = query.Select(c => new StockLevelDto()
            {
                Id = c.row.Id,
                Quantity = c.row.Quantity,
                ExpirationDate = c.row.ExpirationDate,
                UnitPrice = c.row.UnitPrice,
                CreatedTime = c.row.CreatedTime,
                Active = c.row.Active,
                IngredientId = c.row.IngredientId,
                WarehouseId = c.row.WarehouseId,
                LastUpdatedTime = c.row.LastUpdatedTime,
                IngredientName = c.igre.IngredientName,
                UnitName = c.un.UnitName,
                TotalPrice = c.row.Quantity * c.row.UnitPrice,
                Status = (c.row.Quantity == 0) ? "danger" : (c.row.Quantity <= 3 ? "warning" : "normal"),
                WarehouseName = c.WarehouseName
            });
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
    }
}


