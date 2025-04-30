
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
using CfCRM.View.Models.ViewModels;
using CoffeeCRM.Data.DTO;
using CoffeeCRM.Core.Helper;

namespace CoffeeCRM.Core.Repository
{
    public class DishRepository : IDishRepository
    {
        SysDbContext db;

        public DishRepository(SysDbContext _db)
        {
            db = _db;
        }


        public async Task<List<Dish>> List()
        {
            if (db != null)
            {
                return await (
                    from row in db.Dishes
                    where (row.Active)
                    orderby row.Id descending
                    select row
                ).ToListAsync();
            }

            return null;
        }

        /// <summary>
        /// Search by dish name
        /// </summary>
        /// <param name="selectVM"></param>
        /// <returns></returns>
        public async Task<List<Dish>> Search(Select2VM selectVM)
        {
            if (db != null)
            {
                return await (
                    from row in db.Dishes
                    where (row.Active == true && 
                    (EF.Functions.Collate(row.DishName.ToLower(), SQLParams.Latin_General).
                    Contains(EF.Functions.Collate(selectVM.searchString, SQLParams.Latin_General))))
                    orderby row.Id descending
                    select row
                ).ToListAsync();
            }
            return null;
        }


        public async Task<List<Dish>> ListPaging(int pageIndex, int pageSize)
        {
            int offSet = 0;
            offSet = (pageIndex - 1) * pageSize;
            if (db != null)
            {
                return await (
                    from row in db.Dishes
                    where (row.Active)
                    orderby row.Id descending
                    select row
                ).Skip(offSet).Take(pageSize).ToListAsync();
            }
            return null;
        }


        public async Task<Dish> Detail(long? id)
        {
            if (db != null)
            {
                return await db.Dishes.FirstOrDefaultAsync(row => row.Active && row.Id == id);
            }
            return null;
        }


        public async Task<Dish> Add(Dish obj)
        {
            if (db != null)
            {
                await db.Dishes.AddAsync(obj);
                await db.SaveChangesAsync();
                return obj;
            }
            return null;
        }

        public async Task<Dish> GetDishByCode(string dishCode)
        {
            if (db != null)
            {
                return await db.Dishes.FirstOrDefaultAsync(row => row.Active && row.DishCode == dishCode);
            }
            return null;
        }

        public async Task Update(Dish obj)
        {
            if (db != null)
            {
                //Update that object
                db.Dishes.Attach(obj);
                db.Entry(obj).Property(x => x.DishCode).IsModified = true;
                db.Entry(obj).Property(x => x.DishName).IsModified = true;
                db.Entry(obj).Property(x => x.Price).IsModified = true;
                db.Entry(obj).Property(x => x.Photo).IsModified = true;
                db.Entry(obj).Property(x => x.Active).IsModified = true;
                db.Entry(obj).Property(x => x.DishCategoryId).IsModified = true;

                //Commit the transaction
                await db.SaveChangesAsync();
            }
        }


        public async Task Delete(Dish obj)
        {
            if (db != null)
            {
                //Update that obj
                db.Dishes.Attach(obj);
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
                var obj = await db.Dishes.FirstOrDefaultAsync(x => x.Id == objId);

                if (obj != null)
                {
                    //Delete that obj
                    db.Dishes.Remove(obj);

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
                    from row in db.Dishes
                    where row.Active
                    select row
                            ).Count();
            }

            return result;
        }
        public async Task<DTResult<DishViewModel>> ListServerSide(DishDTParameters parameters)
        {
            string searchAll = parameters.SearchAll.Trim();
            string orderCriteria = "Id";
            int recordTotal, recordFiltered;
            bool orderDirectionASC = true;
            if (parameters.Order != null)
            {
                orderCriteria = parameters.Columns[parameters.Order[0].Column].Data;
                orderDirectionASC = parameters.Order[0].Dir == DTOrderDir.ASC;
            }

            var query = from row in db.Dishes
                        join category in db.DishCategories on row.DishCategoryId equals category.Id
                        where row.Active == true
                        select new
                        {
                            row,
                            category,
                        };

            recordTotal = await query.CountAsync();

            if (!String.IsNullOrEmpty(searchAll))
            {
                searchAll = searchAll.ToLower();
                query = query.Where(c =>
EF.Functions.Collate(c.row.DishCode.ToLower(), SQLParams.Latin_General).Contains(EF.Functions.Collate(searchAll, SQLParams.Latin_General)) ||
EF.Functions.Collate(c.row.DishName.ToLower(), SQLParams.Latin_General).Contains(EF.Functions.Collate(searchAll, SQLParams.Latin_General)) ||
                EF.Functions.Collate(c.category.DishCateogryName.ToLower(), SQLParams.Latin_General).Contains(EF.Functions.Collate(searchAll, SQLParams.Latin_General))
                );
            }

            foreach (var item in parameters.Columns)
            {
                var filter = item.Search.Value.Trim();

                var fillter = item.Search.Value.Trim();
                if (fillter.Length > 0)
                {
                    switch (item.Data)
                    {
                        case "id":
                            query = query.Where(c => c.row.Id.ToString().Trim().Contains(filter));
                            break;
                        case "dishCode":
                            query = query.Where(c => (c.row.DishCode ?? "").Contains(filter));
                            break;
                        case "dishName":
                            query = query.Where(c => (c.row.DishName ?? "").Contains(filter));
                            break;
                        case "price":
                            if (decimal.TryParse(filter, out var price))
                            {
                                query = query.Where(c => c.row.Price == price);
                            }
                            break;
                        case "photo":
                            query = query.Where(c => (c.row.Photo ?? "").Contains(filter));
                            break;
                        case "createdTime":
                            if (filter.Contains(" - "))
                            {
                                var dates = filter.Split(" - ");
                                var startDate = DateTime.ParseExact(dates[0], "dd/MM/yyyy", CultureInfo.InvariantCulture);
                                var endDate = DateTime.ParseExact(dates[1], "dd/MM/yyyy", CultureInfo.InvariantCulture).AddDays(1).AddSeconds(-1);
                                query = query.Where(c => c.row.CreatedTime >= startDate && c.row.CreatedTime <= endDate);
                            }
                            else
                            {
                                var date = DateTime.ParseExact(filter, "dd/MM/yyyy", CultureInfo.InvariantCulture);
                                query = query.Where(c => c.row.CreatedTime.Date == date.Date);
                            }
                            break;
                        case "active":
                            query = query.Where(c => c.row.Active.ToString().Trim().Contains(filter));
                            break;
                        case "dishCateogryName":
                            query = query.Where(c => (c.category.DishCateogryName ?? "").Contains(filter));
                            break;
                    }
                }
            }

            var query2 = query.Select(c => new DishViewModel()
            {
                Id = c.row.Id,
                DishCode = c.row.DishCode,
                DishName = c.row.DishName,
                Price = c.row.Price,
                Photo = c.row.Photo,
                CreatedTime = c.row.CreatedTime,
                Active = c.row.Active,
                DishCategoryId = c.row.DishCategoryId,
                DishCateogryName = c.category.DishCateogryName,
            });

            query2 = query2.OrderByDynamic<DishViewModel>(orderCriteria, orderDirectionASC ? LinqExtensions.Order.Asc : LinqExtensions.Order.Desc);
            recordFiltered = query2.Count();

            return new DTResult<DishViewModel>()
            {
                data = await query2.Skip(parameters.Start).Take(parameters.Length).ToListAsync(),
                draw = parameters.Draw,
                recordsFiltered = recordFiltered,
                recordsTotal = recordTotal
            };
        }
    }
}


