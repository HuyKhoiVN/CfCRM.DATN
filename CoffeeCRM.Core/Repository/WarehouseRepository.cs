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
using CoffeeCRM.Data.DTO;
using System.Text.RegularExpressions;
using NPOI.SS.Formula.Functions;

namespace CoffeeCRM.Core.Repository
{
    public class WarehouseRepository : IWarehouseRepository
    {
        SysDbContext db;
        public WarehouseRepository(SysDbContext _db)
        {
            db = _db;
        }

        public async Task<List<Warehouse>> List()
        {
            if(db != null)
            {
                return await db.Warehouses.Where(row => row.Active).ToListAsync();
            }
            return null;
        }

        public async Task<List<WarehouseDto>> ListDto()
        {
            var currentDate = DateTime.Now;
            if (db != null)
            {
                var query =
                    from row in db.Warehouses
                    join stockLevel in db.StockLevels on row.Id equals stockLevel.WarehouseId into stockGroup
                    from stock in stockGroup.DefaultIfEmpty()
                    join ingredient in db.Ingredients on stock.IngredientId equals ingredient.Id into ingredientGroup
                    from ing in ingredientGroup.DefaultIfEmpty()
                    where (row.Active && stock.Active && ing.Active)
                    group new { row, stock, ing } by new
                    {
                        row.Id,
                        row.WarehouseCode,
                        row.WarehouseName,
                        row.Location,
                        row.Note,
                        row.CreatedTime,
                        row.Active
                    }
                    into g
                    orderby g.Key.Id ascending
                    select new WarehouseDto
                    {
                        Id = g.Key.Id,
                        WarehouseCode = g.Key.WarehouseCode,
                        WarehouseName = g.Key.WarehouseName,
                        Location = g.Key.Location,
                        Note = g.Key.Note,
                        CreatedTime = g.Key.CreatedTime,
                        Active = g.Key.Active,
                        ItemsStored = g.Sum(x => x.stock != null ? x.stock.Quantity : 0),
                        TotalValue = g.Sum(x =>
                                        (x.stock != null ? x.stock.Quantity : 0) *
                                        (x.ing != null ? (x.ing.AveragePrice ?? 0) : 0)),
                        LowStock = g.Where(x => x.stock != null && x.ing != null)
                                .GroupBy(x => x.ing.Id)
                                .Select(ig => new { TotalQty = ig.Sum(s => s.stock.Quantity) })
                                .Count(t => t.TotalQty < 3),
                        Expired = g.Where(x => x.stock != null && x.stock.ExpirationDate < currentDate)
                               .Sum(x => x.stock.Quantity)
                    };
                return await query.ToListAsync();
            }

            return null;
        }

        public async Task<WarehouseDto> DetailDto (int id)
        {
            var currentDate = DateTime.Now;
            if (db != null)
            {
                var query = from row in db.Warehouses
                            join stockLevel in db.StockLevels on row.Id equals stockLevel.WarehouseId into stockGroup
                            from stock in stockGroup.DefaultIfEmpty()
                            join ingredient in db.Ingredients on stock.IngredientId equals ingredient.Id into ingredientGroup
                            from ing in ingredientGroup.DefaultIfEmpty()
                            where (row.Active && row.Id == id && stock.Active && ing.Active)
                            group new { row, stock, ing } by new
                            {
                                row.Id,
                                row.WarehouseCode,
                                row.WarehouseName,
                                row.Location,
                                row.Note,
                                row.CreatedTime,
                                row.Active
                            }
                            into g
                            select new WarehouseDto
                            {
                                Id = g.Key.Id,
                                WarehouseCode = g.Key.WarehouseCode,
                                WarehouseName = g.Key.WarehouseName,
                                Location = g.Key.Location,
                                Note = g.Key.Note,
                                CreatedTime = g.Key.CreatedTime,
                                Active = g.Key.Active,
                                ItemsStored = g.Sum(x => x.stock != null ? x.stock.Quantity : 0),
                                TotalValue = g.Sum(x =>
                                                (x.stock != null ? x.stock.Quantity : 0) *
                                                (x.ing != null ? (x.ing.AveragePrice ?? 0) : 0)),
                                LowStock = g.Where(x => x.stock != null && x.ing != null)
                                .GroupBy(x => x.ing.Id)
                                .Select(ig => new { TotalQty = ig.Sum(s => s.stock.Quantity) })
                                .Count(t => t.TotalQty < 3),
                                Expired = g.Where(x => x.stock != null && x.stock.ExpirationDate < currentDate)
                               .Sum(x => x.stock.Quantity)
                            };
                return await query.FirstOrDefaultAsync();
            }
            return null;
        }

        public async Task<List<Warehouse>> ListPaging(int pageIndex, int pageSize)
        {
            int offSet = 0;
            offSet = (pageIndex - 1) * pageSize;
            if (db != null)
            {
                return await (
                    from row in db.Warehouses
                    where (row.Active)
                    orderby row.Id descending
                    select row
                ).Skip(offSet).Take(pageSize).ToListAsync();
            }
            return null;
        }


        public async Task<Warehouse> Detail(long? id)
        {
            if (db != null)
            {
                return await db.Warehouses.FirstOrDefaultAsync(row => row.Active && row.Id == id);
            }
            return null;
        }


        public async Task<Warehouse> Add(Warehouse obj)
        {
            if (db != null)
            {
                await db.Warehouses.AddAsync(obj);
                await db.SaveChangesAsync();
                return obj;
            }
            return null;
        }


        public async Task Update(Warehouse obj)
        {
            if (db != null)
            {
                //Update that object
                db.Warehouses.Attach(obj);
                db.Entry(obj).Property(x => x.WarehouseCode).IsModified = true;
                db.Entry(obj).Property(x => x.WarehouseName).IsModified = true;
                db.Entry(obj).Property(x => x.Location).IsModified = true;
                db.Entry(obj).Property(x => x.Note).IsModified = true;
                db.Entry(obj).Property(x => x.Active).IsModified = true;

                //Commit the transaction
                await db.SaveChangesAsync();
            }
        }


        public async Task Delete(Warehouse obj)
        {
            if (db != null)
            {
                //Update that obj
                db.Warehouses.Attach(obj);
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
                var obj = await db.Warehouses.FirstOrDefaultAsync(x => x.Id == objId);

                if (obj != null)
                {
                    //Delete that obj
                    db.Warehouses.Remove(obj);

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
                    from row in db.Warehouses
                    where row.Active
                    select row
                            ).Count();
            }

            return result;
        }
        public async Task<DTResult<WarehouseDto>> ListServerSide(WarehouseDTParameters parameters)
        {
            var currentDate = DateTime.Now;//Get current date
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
            var query = from w in db.Warehouses
                        join sl in db.StockLevels on w.Id equals sl.WarehouseId into stockGroup
                        from sg in stockGroup.DefaultIfEmpty()
                        join ing in db.Ingredients on sg.IngredientId equals ing.Id into ingGroup
                        from ig in ingGroup.DefaultIfEmpty()
                        where (w.Active && sg.Active && ig.Active)
                        group new { sg, ig } by new
                        {
                            w.Id,
                            w.WarehouseCode,
                            w.WarehouseName,
                            w.Location,
                            w.Note,
                            w.CreatedTime,
                            w.Active
                        } into g

                        select new
                        {
                            row = g.Key,
                            ItemsStored = g.Sum(x => x.sg != null ? x.sg.Quantity : 0),
                            TotalValue = g.Sum(x => (x.sg != null && x.ig != null) ? x.sg.Quantity * (x.ig.AveragePrice ?? 0) : 0),
                            LowStock = g.Where(x => x.sg != null && x.ig != null)
                                .GroupBy(x => x.ig.Id)
                                .Select(ig => new { TotalQty = ig.Sum(s => s.sg.Quantity) })
                                .Count(t => t.TotalQty < 3),
                            Expired = g.Where(x => x.sg != null && x.sg.ExpirationDate < currentDate)
                               .Sum(x => x.sg.Quantity) 
                        };


            recordTotal = await query.CountAsync();
            //2. Fillter
            if (!String.IsNullOrEmpty(searchAll))
            {
                searchAll = searchAll.ToLower();
                query = query.Where(c =>
                    EF.Functions.Collate(c.row.Id.ToString().ToLower(), SQLParams.Latin_General).Contains(EF.Functions.Collate(searchAll, SQLParams.Latin_General)) ||
                    EF.Functions.Collate(c.row.WarehouseCode.ToLower(), SQLParams.Latin_General).Contains(EF.Functions.Collate(searchAll, SQLParams.Latin_General)) ||
                    EF.Functions.Collate(c.row.WarehouseName.ToLower(), SQLParams.Latin_General).Contains(EF.Functions.Collate(searchAll, SQLParams.Latin_General)) ||
                    EF.Functions.Collate(c.row.Location.ToLower(), SQLParams.Latin_General).Contains(EF.Functions.Collate(searchAll, SQLParams.Latin_General)) ||
                    EF.Functions.Collate(c.row.Note.ToLower(), SQLParams.Latin_General).Contains(EF.Functions.Collate(searchAll, SQLParams.Latin_General)) ||
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
                        case "warehouseCode":
                            query = query.Where(c => (c.row.WarehouseCode ?? "").Contains(fillter));
                            break;
                        case "warehouseName":
                            query = query.Where(c => (c.row.WarehouseName ?? "").Contains(fillter));
                            break;
                        case "location":
                            query = query.Where(c => (c.row.Location ?? "").Contains(fillter));
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

                    }
                }
            }

            //3.Query second
            var query2 = query.Select(c => new WarehouseDto()
            {
                Id = c.row.Id,
                WarehouseCode = c.row.WarehouseCode,
                WarehouseName = c.row.WarehouseName,
                Location = c.row.Location,
                Note = c.row.Note,
                CreatedTime = c.row.CreatedTime,
                Active = c.row.Active,
                ItemsStored = c.ItemsStored,
                TotalValue = c.TotalValue
            });

            //4. Sort
            query2 = query2.OrderByDynamic<WarehouseDto>(orderCritirea, orderDirectionASC ? LinqExtensions.Order.Asc : LinqExtensions.Order.Desc);
            recordFiltered = await query2.CountAsync();
            //5. Return data
            return new DTResult<WarehouseDto>()
            {
                data = await query2.Skip(parameters.Start).Take(parameters.Length).ToListAsync(),
                draw = parameters.Draw,
                recordsFiltered = recordFiltered,
                recordsTotal = recordTotal
            };
        }
    }
}


