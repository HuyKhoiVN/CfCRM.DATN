using CoffeeCRM.Data.Model;
using CoffeeCRM.Core.Repository;
using CoffeeCRM.Core.Util;using CoffeeCRM.Data;
using CoffeeCRM.Core.Util.Parameters;
using CoffeeCRM.Data.ViewModels;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using CfCRM.View.Models.ViewModels;
using Google.Apis.Logging;
using Microsoft.Extensions.Logging;
using CoffeeCRM.Data.DTO;
using CoffeeCRM.Core.Helper;
using Microsoft.Extensions.Caching.Memory;
using NuGet.Protocol.Core.Types;

namespace CoffeeCRM.Core.Service
{
    public class DishService : IDishService
    {
        IDishRepository dishRepository;
        private readonly ILogger<DishService> _logger;
        private readonly IMemoryCache _cache;

        public DishService(
            IDishRepository _dishRepository
            , ILogger<DishService> logger,
            IMemoryCache cache
            )
        {
            dishRepository = _dishRepository;
            _logger = logger;
            _cache = cache;
        }
        public async Task Add(Dish obj)
        {
            obj.Active = true;
            obj.CreatedTime = DateTime.Now;
            await dishRepository.Add(obj);
        }

        public async Task AddOrUpdateDto(DishDto dto)
        {
            dto.DishCode = CodeConnvert.ConvertToCode(dto.DishName);
            var dishExit = await dishRepository.GetDishByCode(dto.DishCode);
            if( dishExit != null && dto.DishCode != dishExit.DishCode)
            {
                _logger.LogError("Món ăn đã tồn tại");
                throw new BadRequestException("Món ăn đã tồn tại");
            }

            bool isNew = dto.Id == 0;
            if (isNew && dto.Image == null)
            {
                dto.Photo = "images/coffeedefault.jpg";
            }
            dto.Photo = dto.Image != null ? await FileHelper.SaveImageAsync(dto.Image, "images/dish") : dto.Photo;

            if(isNew)
            {
                var dish = new Dish()
                {
                    DishCode = CodeConnvert.ConvertToCode(dto.DishName),
                    DishName = dto.DishName,
                    Price = dto.Price,
                    Photo = dto.Photo,
                    CreatedTime = DateTime.Now,
                    Active = true,
                    DishCategoryId = dto.DishCategoryId
                };
                await dishRepository.Add(dish);
            }else
            {
                var dish = await dishRepository.Detail(dto.Id);
                if (dish == null)
                {
                    _logger.LogError("Món ăn không tồn tại");
                    throw new BadRequestException("Món ăn không tồn tại");
                }
                dish.DishName = dto.DishName;
                dish.DishCode = CodeConnvert.ConvertToCode(dto.DishName);
                dish.Price = dto.Price;
                dish.Photo = string.IsNullOrEmpty(dto.Photo) ? dish.Photo : dto.Photo;
                dish.DishCategoryId = dto.DishCategoryId;
                await dishRepository.Update(dish);
            }
        }

        public async Task<List<PopularDishModel>> GetTopPopularDishesAsync(int count, DateTime? startDate = null, DateTime? endDate = null)
        {
            try
            {
                // Tạo cache key dựa trên tham số
                string cacheKey = $"TopPopularDishes_{count}_{startDate}_{endDate}";

                // Kiểm tra cache
                if (_cache.TryGetValue(cacheKey, out List<PopularDishModel> cachedData))
                {
                    return cachedData;
                }

                // Lấy dữ liệu từ repository
                var result = await dishRepository.GetTopPopularDishesAsync(count, startDate, endDate);

                // Lưu vào cache trong 10 phút
                var cacheOptions = new MemoryCacheEntryOptions()
                    .SetAbsoluteExpiration(TimeSpan.FromMinutes(10));

                _cache.Set(cacheKey, result, cacheOptions);

                return result;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting top popular dishes");
                throw;
            }
        }

        public async Task<DTResult<PopularDishModel>> ListPopularServerSide(DishDTParameters parameters)
        {
            try
            {
                // Không cache kết quả DataTables vì mỗi request có thể khác nhau
                return await dishRepository.ListPopularServerSide(parameters);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting dishes list server side");
                throw;
            }
        }
        public int Count()
        {
            var result = dishRepository.Count();
            return result;
        }

        public async Task Delete(Dish obj)
        {
            obj.Active = false;
            await dishRepository.Delete(obj);
        }

        public async Task<long> DeletePermanently(long? id)
        {
            return await dishRepository.DeletePermanently(id);
        }

        public async Task<Dish> Detail(long? id)
        {
            return await dishRepository.Detail(id);
        }

        public async Task<List<Dish>> List()
        {
            return await dishRepository.List();
        }

        public async Task<List<Dish>> ListPaging(int pageIndex, int pageSize)
        {
            return await dishRepository.ListPaging(pageIndex, pageSize);
        }

        public async Task<DTResult<DishViewModel>> ListServerSide(DishDTParameters parameters)
        {
            return await dishRepository.ListServerSide(parameters);
        }

        public async Task<List<Dish>> Search(Select2VM selectVM)
        {
            return await dishRepository.Search(selectVM);
        }

        public async Task Update(Dish obj)
        {
            await dishRepository.Update(obj);
        }

        public async Task<DishStaticDto> GetDishStatisticsAsync()
        {
            return await dishRepository.GetDishStatisticsAsync();
        }
    }
}

