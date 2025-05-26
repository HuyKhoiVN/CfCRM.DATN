
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

            if (parameters.DishCategoryId.HasValue && parameters.DishCategoryId.Value > 0)
            {
                query = query.Where(c => c.row.DishCategoryId == parameters.DishCategoryId.Value);
            }   

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

        public async Task<List<PopularDishModel>> GetTopPopularDishesAsync(int count, DateTime? startDate = null, DateTime? endDate = null)
        {
            // Mặc định lấy dữ liệu trong tháng hiện tại nếu không có ngày được chỉ định
            startDate ??= new DateTime(DateTime.Now.Year, DateTime.Now.Month, 1);
            endDate ??= DateTime.Now;

            // Sử dụng LINQ để lấy top món ăn bán chạy
            var query = from invoiceDetail in db.InvoiceDetails
                        join invoice in db.Invoices on invoiceDetail.InvoiceId equals invoice.Id
                        join dish in db.Dishes on invoiceDetail.DishId equals dish.Id
                        join category in db.DishCategories on dish.DishCategoryId equals category.Id
                        where invoice.CreatedTime >= startDate && invoice.CreatedTime <= endDate
                        && dish.Active == true
                        group new { invoiceDetail, dish, category } by new { dish.Id, dish.DishCode, dish.DishName, dish.Price, dish.Photo, dish.CreatedTime, dish.Active, category.DishCateogryName } into g
                        select new PopularDishModel
                        {
                            Id = g.Key.Id,
                            DishCode = g.Key.DishCode,
                            DishName = g.Key.DishName,
                            Price = g.Key.Price,
                            Photo = g.Key.Photo,
                            CategoryName = g.Key.DishCateogryName,
                            SalesCount = g.Sum(x => x.invoiceDetail.Quantity),
                            CreatedTime = g.Key.CreatedTime,
                            Active = g.Key.Active
                        };

            // Sắp xếp theo số lượng bán ra giảm dần và lấy top {count} món
            return await query.OrderByDescending(d => d.SalesCount)
                             .Take(count)
                             .ToListAsync();
        }

        public async Task<DTResult<PopularDishModel>> ListPopularServerSide(DishDTParameters parameters)
        {
            string searchAll = parameters.SearchAll.Trim();
            string orderCriteria = "Id";
            bool orderDirectionASC = true;

            if (parameters.Order != null)
            {
                orderCriteria = parameters.Columns[parameters.Order[0].Column].Data;
                orderDirectionASC = parameters.Order[0].Dir == DTOrderDir.ASC;
            }

            // Lấy tất cả món ăn và số lượng bán ra
            var baseQuery = from dish in db.Dishes
                            join category in db.DishCategories on dish.DishCategoryId equals category.Id
                            where dish.Active == true
                            select new
                            {
                                dish.Id,
                                dish.DishCode,
                                dish.DishName,
                                dish.Price,
                                dish.Photo,
                                dish.CreatedTime,
                                dish.Active,
                                CategoryName = category.DishCateogryName
                            };

            int recordsTotal = await baseQuery.CountAsync();

            // Áp dụng tìm kiếm tổng quát
            if (!string.IsNullOrEmpty(searchAll))
            {
                searchAll = searchAll.ToLower();
                baseQuery = baseQuery.Where(c =>
                    c.DishCode.ToLower().Contains(searchAll) ||
                    c.DishName.ToLower().Contains(searchAll) ||
                    c.CategoryName.ToLower().Contains(searchAll)
                );
            }

            // Áp dụng tìm kiếm theo cột
            foreach (var column in parameters.Columns)
            {
                var filter = column.Search?.Value?.Trim() ?? "";
                if (!string.IsNullOrEmpty(filter))
                {
                    switch (column.Data.ToLower())
                    {
                        case "dishcode":
                            baseQuery = baseQuery.Where(c => c.DishCode.Contains(filter));
                            break;
                        case "dishname":
                            baseQuery = baseQuery.Where(c => c.DishName.Contains(filter));
                            break;
                        case "price":
                            if (decimal.TryParse(filter, out var price))
                            {
                                baseQuery = baseQuery.Where(c => c.Price == price);
                            }
                            break;
                        case "categoryname":
                            baseQuery = baseQuery.Where(c => c.CategoryName.Contains(filter));
                            break;
                    }
                }
            }

            // Lấy số lượng bán ra cho mỗi món ăn
            var salesQuery = from invoiceDetail in db.InvoiceDetails
                             join invoice in db.Invoices on invoiceDetail.InvoiceId equals invoice.Id
                             group invoiceDetail by invoiceDetail.DishId into g
                             select new
                             {
                                 DishId = g.Key,
                                 SalesCount = g.Sum(x => x.Quantity)
                             };

            // Thực hiện truy vấn cơ sở trước
            var filteredBaseQuery = baseQuery;
            int recordsFiltered = await filteredBaseQuery.CountAsync();

            // Áp dụng sắp xếp cho truy vấn cơ sở
            IQueryable<dynamic> orderedBaseQuery;
            switch (orderCriteria.ToLower())
            {
                case "id":
                    orderedBaseQuery = orderDirectionASC ? filteredBaseQuery.OrderBy(x => x.Id) : filteredBaseQuery.OrderByDescending(x => x.Id);
                    break;
                case "dishcode":
                    orderedBaseQuery = orderDirectionASC ? filteredBaseQuery.OrderBy(x => x.DishCode) : filteredBaseQuery.OrderByDescending(x => x.DishCode);
                    break;
                case "dishname":
                    orderedBaseQuery = orderDirectionASC ? filteredBaseQuery.OrderBy(x => x.DishName) : filteredBaseQuery.OrderByDescending(x => x.DishName);
                    break;
                case "price":
                    orderedBaseQuery = orderDirectionASC ? filteredBaseQuery.OrderBy(x => x.Price) : filteredBaseQuery.OrderByDescending(x => x.Price);
                    break;
                case "categoryname":
                    orderedBaseQuery = orderDirectionASC ? filteredBaseQuery.OrderBy(x => x.CategoryName) : filteredBaseQuery.OrderByDescending(x => x.CategoryName);
                    break;
                case "createdtime":
                    orderedBaseQuery = orderDirectionASC ? filteredBaseQuery.OrderBy(x => x.CreatedTime) : filteredBaseQuery.OrderByDescending(x => x.CreatedTime);
                    break;
                default:
                    orderedBaseQuery = orderDirectionASC ? filteredBaseQuery.OrderBy(x => x.Id) : filteredBaseQuery.OrderByDescending(x => x.Id);
                    break;
            }

            // Phân trang và lấy dữ liệu
            var pagedBaseData = await orderedBaseQuery
                .Skip(parameters.Start)
                .Take(parameters.Length)
                .ToListAsync();

            // Lấy tất cả ID của món ăn đã phân trang
            var dishIds = pagedBaseData.Select(x => x.Id).ToList();

            // Lấy số lượng bán ra chỉ cho các món ăn đã phân trang
            var salesData = await salesQuery
                .Where(s => dishIds.Contains(s.DishId))
                .ToDictionaryAsync(s => s.DishId, s => s.SalesCount);

            // Kết hợp dữ liệu
            var result = pagedBaseData.Select(item => new PopularDishModel
            {
                Id = item.Id,
                DishCode = item.DishCode,
                DishName = item.DishName,
                Price = item.Price,
                Photo = item.Photo,
                CategoryName = item.CategoryName,
                SalesCount = salesData.ContainsKey(item.Id) ? salesData[item.Id] : 0,
                CreatedTime = item.CreatedTime,
                Active = item.Active
            }).ToList();

            // Nếu sắp xếp theo SalesCount, cần sắp xếp lại sau khi đã kết hợp dữ liệu
            if (orderCriteria.ToLower() == "salescount")
            {
                result = orderDirectionASC
                    ? result.OrderBy(x => x.SalesCount).ToList()
                    : result.OrderByDescending(x => x.SalesCount).ToList();
            }

            return new DTResult<PopularDishModel>
            {
                draw = parameters.Draw,
                recordsTotal = recordsTotal,
                recordsFiltered = recordsFiltered,
                data = result
            };
        }

        public async Task<DishStaticDto> GetDishStatisticsAsync()
        {
            var totalDishCate = await db.DishCategories.CountAsync();
            var totalDish = await db.Dishes.CountAsync();

            int avgDishPrice = 0;
            if (await db.Dishes.AnyAsync())
            {
                var avg = await db.Dishes.AverageAsync(d => d.Price); // avg là decimal
                avgDishPrice = (int)Math.Round(avg / 1000m, MidpointRounding.AwayFromZero) * 1000;
            }

            return new DishStaticDto
            {
                TotalDishCate = totalDishCate,
                TotalDish = totalDish,
                AvgDishPrice = avgDishPrice
            };
        }

    }
}


