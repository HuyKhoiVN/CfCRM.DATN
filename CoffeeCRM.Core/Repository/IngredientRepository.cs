
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
    public class IngredientRepository : IIngredientRepository
    {
        SysDbContext db;
        public IngredientRepository(SysDbContext _db)
        {
            db = _db;
        }


        public async Task<List<Ingredient>> List()
        {
            if (db != null)
            {
                return await (
                    from row in db.Ingredients
                    where (row.Active)
                    orderby row.Id descending
                    select row
                ).ToListAsync();
            }

            return null;
        }


        //public async Task <List< Ingredient>> Search(string keyword)
        //{
        //    if(db != null)
        //    {
        //        return await(
        //            from row in db.Ingredients
        //                        where(row.Active && (row.Name.Contains(keyword) || row.Description.Contains(keyword)))
        //                        orderby row.Id descending
        //                        select row
        //        ).ToListAsync();
        //    }
        //    return null;
        //}


        public async Task<List<Ingredient>> ListPaging(int pageIndex, int pageSize)
        {
            int offSet = 0;
            offSet = (pageIndex - 1) * pageSize;
            if (db != null)
            {
                return await (
                    from row in db.Ingredients
                    where (row.Active)
                    orderby row.Id descending
                    select row
                ).Skip(offSet).Take(pageSize).ToListAsync();
            }
            return null;
        }


        public async Task<Ingredient> Detail(long? id)
        {
            if (db != null)
            {
                return await db.Ingredients.FirstOrDefaultAsync(row => row.Active && row.Id == id);
            }
            return null;
        }


        public async Task<Ingredient> Add(Ingredient obj)
        {
            if (db != null)
            {
                obj.Active = true;
                obj.CreatedTime = DateTime.Now;
                await db.Ingredients.AddAsync(obj);
                await db.SaveChangesAsync();
                return obj;
            }
            return null;
        }


        public async Task Update(Ingredient obj)
        {
            if (db != null)
            {
                //Update that object
                db.Ingredients.Attach(obj);
                db.Entry(obj).Property(x => x.IngredientCode).IsModified = true;
                db.Entry(obj).Property(x => x.IngredientName).IsModified = true;
                db.Entry(obj).Property(x => x.SelfLife).IsModified = true;
                db.Entry(obj).Property(x => x.AveragePrice).IsModified = true;
                
                db.Entry(obj).Property(x => x.IngredientCategoryId).IsModified = true;
                db.Entry(obj).Property(x => x.SupplierId).IsModified = true;
                db.Entry(obj).Property(x => x.UnitId).IsModified = true;

                obj.Active = true;
                db.Entry(obj).Property(x => x.Active).IsModified = true;
                //Commit the transaction
                await db.SaveChangesAsync();
            }
        }


        public async Task Delete(Ingredient obj)
        {
            if (db != null)
            {
                //Update that obj
                db.Ingredients.Attach(obj);
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
                var obj = await db.Ingredients.FirstOrDefaultAsync(x => x.Id == objId);

                if (obj != null)
                {
                    //Delete that obj
                    db.Ingredients.Remove(obj);

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
                    from row in db.Ingredients
                    where row.Active
                    select row
                            ).Count();
            }

            return result;
        }

        public async Task<List<IngredientDto>> ListBySupplier(int supplierId)
        {
            if(db != null)
            {
                var query = from i in db.Ingredients
                            join s in db.Suppliers on i.SupplierId equals s.Id
                            join u in db.Units on i.UnitId equals u.Id
                            join ct in db.IngredientCategories on i.IngredientCategoryId equals ct.Id
                            where i.Active && i.SupplierId == supplierId
                            select new IngredientDto()
                            {
                                Id = i.Id,
                                IngredientCode = i.IngredientCode,
                                IngredientName = i.IngredientName,
                                SelfLife = i.SelfLife,
                                AveragePrice = i.AveragePrice,
                                CreatedTime = i.CreatedTime,
                                Active = i.Active,
                                IngredientCategoryId = i.IngredientCategoryId,
                                SupplierId = i.SupplierId,
                                UnitId = i.UnitId,
                                IngredientCategoryName = ct.IngredientCategoryName,
                                SupplierName = s.SupplierName,
                                UnitName = u.UnitName
                            };
                return await query.ToListAsync();
            }
            return null;
        }

        public async Task<DTResult<IngredientDto>> ListServerSide(IngredientDTParameters parameters)
        {
            //0. Options
            string searchAll = parameters.SearchAll.Trim();
            string orderCritirea = "Id";
            int recordTotal, recordFiltered;
            bool orderDirectionASC = true;
            if (parameters.Order != null)
            {
                orderCritirea = parameters.Columns[parameters.Order[0].Column].Data;
                orderDirectionASC = parameters.Order[0].Dir == DTOrderDir.ASC;
            }
            //1. Join
            var query = from row in db.Ingredients
                        join category in db.IngredientCategories on row.IngredientCategoryId equals category.Id into categoryJoin
                        from category in categoryJoin.DefaultIfEmpty()
                        join supplier in db.Suppliers on row.SupplierId equals supplier.Id into supplierJoin
                        from supplier in supplierJoin.DefaultIfEmpty()
                        join unit in db.Units on row.UnitId equals unit.Id into unitJoin
                        from unit in unitJoin.DefaultIfEmpty()
                        join stock in db.StockLevels on row.Id equals stock.IngredientId into stockJoin
                        from stock in stockJoin.DefaultIfEmpty()
                        where row.Active
                        group new { row, category, supplier, unit, stock } by new
                        {
                            row.Id,
                            row.IngredientCode,
                            row.IngredientName,
                            row.SelfLife,
                            row.AveragePrice,
                            row.CreatedTime,
                            row.Active,
                            row.IngredientCategoryId,
                            row.SupplierId,
                            row.UnitId,
                            CategoryName = category != null ? category.IngredientCategoryName : "",
                            SupplierName = supplier != null ? supplier.SupplierName : "",
                            UnitName = unit != null ? unit.UnitName : "",
                        } into g
                        select new
                        {
                            row = new Ingredient
                            {
                                Id = g.Key.Id,
                                IngredientCode = g.Key.IngredientCode,
                                IngredientName = g.Key.IngredientName,
                                SelfLife = g.Key.SelfLife,
                                AveragePrice = g.Key.AveragePrice,
                                CreatedTime = g.Key.CreatedTime,
                                Active = g.Key.Active,
                                IngredientCategoryId = g.Key.IngredientCategoryId,
                                SupplierId = g.Key.SupplierId,
                                UnitId = g.Key.UnitId
                            },
                            CategoryName = g.Key.CategoryName,
                            SupplierName = g.Key.SupplierName,
                            UnitName = g.Key.UnitName,
                            TotalInventory = g.Sum(x => (int?)(x.stock != null ? x.stock.Quantity : 0) ?? 0),
                        };
            if(parameters.CategoryId > 0)
            {
                query = query.Where(c => c.row.IngredientCategoryId == parameters.CategoryId);
            }

            if(parameters.Warning == true)
            {
                query = query.Where(c => c.TotalInventory < 3);
            }

            recordTotal = await query.CountAsync();
            //2. Fillter
            if (!String.IsNullOrEmpty(searchAll))
            {
                searchAll = searchAll.ToLower();
                query = query.Where(c =>
                    EF.Functions.Collate(c.row.Id.ToString().ToLower(), SQLParams.Latin_General).Contains(EF.Functions.Collate(searchAll, SQLParams.Latin_General)) ||
                    EF.Functions.Collate(c.row.IngredientCode.ToLower(), SQLParams.Latin_General).Contains(EF.Functions.Collate(searchAll, SQLParams.Latin_General)) ||
                    EF.Functions.Collate(c.row.IngredientName.ToLower(), SQLParams.Latin_General).Contains(EF.Functions.Collate(searchAll, SQLParams.Latin_General)) ||
                    EF.Functions.Collate(c.row.SelfLife.ToString().ToLower(), SQLParams.Latin_General).Contains(EF.Functions.Collate(searchAll, SQLParams.Latin_General)) ||
                    EF.Functions.Collate(c.row.AveragePrice.ToString().ToLower(), SQLParams.Latin_General).Contains(EF.Functions.Collate(searchAll, SQLParams.Latin_General)) ||
                    EF.Functions.Collate(c.row.CreatedTime.ToCustomString().ToLower(), SQLParams.Latin_General).Contains(EF.Functions.Collate(searchAll, SQLParams.Latin_General)) ||
                    EF.Functions.Collate(c.row.Active.ToString().ToLower(), SQLParams.Latin_General).Contains(EF.Functions.Collate(searchAll, SQLParams.Latin_General)) ||
                    EF.Functions.Collate(c.row.IngredientCategoryId.ToString().ToLower(), SQLParams.Latin_General).Contains(EF.Functions.Collate(searchAll, SQLParams.Latin_General)) ||
                    EF.Functions.Collate(c.row.SupplierId.ToString().ToLower(), SQLParams.Latin_General).Contains(EF.Functions.Collate(searchAll, SQLParams.Latin_General)) ||
                    EF.Functions.Collate(c.row.UnitId.ToString().ToLower(), SQLParams.Latin_General).Contains(EF.Functions.Collate(searchAll, SQLParams.Latin_General))
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
                        case "ingredientCode":
                            query = query.Where(c => (c.row.IngredientCode ?? "").Contains(fillter));
                            break;
                        case "ingredientName":
                            query = query.Where(c => (c.row.IngredientName ?? "").Contains(fillter));
                            break;
                        case "selfLife":
                            query = query.Where(c => c.row.SelfLife.ToString().Trim().Contains(fillter));
                            break;
                        case "averagePrice":
                            query = query.Where(c => c.row.AveragePrice.ToString().Trim().Contains(fillter));
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
                        case "ingredientCategoryId":
                            query = query.Where(c => c.row.IngredientCategoryId.ToString().Trim().Contains(fillter));
                            break;
                        case "supplierId":
                            query = query.Where(c => c.row.SupplierId.ToString().Trim().Contains(fillter));
                            break;
                        case "unitId":
                            query = query.Where(c => c.row.UnitId.ToString().Trim().Contains(fillter));
                            break;

                    }
                }
            }

            //3.Query second
            var query2 = query.Select(c => new IngredientDto()
            {
                Id = c.row.Id,
                IngredientCode = c.row.IngredientCode,
                IngredientName = c.row.IngredientName,
                SelfLife = c.row.SelfLife, // vòng đời sản phẩm
                AveragePrice = c.row.AveragePrice,
                CreatedTime = c.row.CreatedTime,
                Active = c.row.Active,
                IngredientCategoryId = c.row.IngredientCategoryId,
                SupplierId = c.row.SupplierId,
                UnitId = c.row.UnitId,
                IngredientCategoryName = c.CategoryName,
                SupplierName = c.SupplierName,
                UnitName = c.UnitName,
                TotalInvemtory = c.TotalInventory,
                InventoryStatus = c.TotalInventory == 0 ? "Hết hàng"
                      : (c.TotalInventory < 3 ? "Cảnh báo" : "Còn hàng")
            });
            //4. Sort
            query2 = query2.OrderByDynamic<IngredientDto>(orderCritirea, orderDirectionASC ? LinqExtensions.Order.Asc : LinqExtensions.Order.Desc);
            recordFiltered = await query2.CountAsync();
            //5. Return data
            return new DTResult<IngredientDto>()
            {
                data = await query2.Skip(parameters.Start).Take(parameters.Length).ToListAsync(),
                draw = parameters.Draw,
                recordsFiltered = recordFiltered,
                recordsTotal = recordTotal
            };
        }
    }
}


