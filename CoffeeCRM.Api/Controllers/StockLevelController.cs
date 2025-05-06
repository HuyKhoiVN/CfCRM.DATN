

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CoffeeCRM.Data.Model;
using CoffeeCRM.Core.Repository;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using CoffeeCRM.Core.Util;
using CoffeeCRM.Data.Constants;
using CoffeeCRM.Core.Service;
using CoffeeCRM.Core.Util.Parameters;
using CoffeeCRM.Data.DTO;
using CoffeeCRM.Core.Helper;

namespace CfCRM.DATN.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class StockLevelController : ControllerBase
    {
        IStockLevelService service;
        public StockLevelController(IStockLevelService _service)
        {
            service = _service;
        }

        [HttpGet]
        [Route("api/List")]
        public async Task<IActionResult> List()
        {
            try
            {
                var dataList = await service.List();
                if (dataList == null || dataList.Count == 0)
                {
                    return NotFound();
                }
                var coffeemanagementResponse = CoffeeManagementResponse.SUCCESS(dataList.Cast<object>().ToList());
                return Ok(coffeemanagementResponse);
            }
            catch (Exception)
            {
                return BadRequest();
            }
        }

        [HttpGet]
        [Route("api/Detail/{Id}")]
        public async Task<IActionResult> Detail(int? Id)
        {
            if (Id == null)
            {
                return BadRequest();
            }
            try
            {
                var dataList = await service.Detail(Id);
                if (dataList == null)
                {
                    return NotFound();
                }
                var coffeemanagementResponse = CoffeeManagementResponse.SUCCESS(dataList);
                return Ok(coffeemanagementResponse);
            }
            catch (Exception)
            {
                return BadRequest();
            }
        }



        [HttpGet]
        [Route("api/ListPaging")]
        public async Task<IActionResult> ListPaging(int pageIndex, int pageSize)
        {
            if (pageIndex < 0 || pageSize < 0) return BadRequest();
            try
            {
                var dataList = await service.ListPaging(pageIndex, pageSize);

                if (dataList == null || dataList.Count == 0)
                {
                    return NotFound();
                }

                var coffeemanagementResponse = CoffeeManagementResponse.SUCCESS(dataList.Cast<object>().ToList());
                return Ok(coffeemanagementResponse);
            }
            catch (Exception)
            {
                return BadRequest();
            }
        }
        [HttpPost]
        [Route("api/Add")]
        public async Task<IActionResult> Add([FromBody] StockLevel model)
        {
            if (ModelState.IsValid)
            {
                //1. business logic

                //data validation
                if (model.Active == false)
                {
                    return BadRequest();
                }
                //2. add new object
                try
                {
                    await service.Add(model);
                    var coffeemanagementResponse = CoffeeManagementResponse.CREATED(model);
                    return Created("", coffeemanagementResponse);
                }
                catch (Exception)
                {

                    return BadRequest();
                }
            }
            return BadRequest();
        }

        [HttpPost]
        [Route("api/AddNewStock")]
        public async Task<IActionResult> AddNewStock([FromBody] StockLevel model)
        {
            if (ModelState.IsValid)
            {
                //1. business logic

                //data validation
                if (model.Active == false)
                {
                    return BadRequest();
                }
                //2. add new object
                try
                {
                    await service.AddNewStock(model);
                    var coffeemanagementResponse = CoffeeManagementResponse.CREATED(model);
                    return Created("", coffeemanagementResponse);
                }
                catch (Exception)
                {

                    return BadRequest();
                }
            }
            return BadRequest();
        }

        [HttpPost]
        [Route("api/Update")]
        public async Task<IActionResult> Update([FromBody] StockLevel model)
        {
            if (ModelState.IsValid)
            {
                try
                {
                    //1. business logic 
                    //2. update object
                    await service.Update(model);
                    var coffeemanagementResponse = CoffeeManagementResponse.SUCCESS(model);
                    return Ok(coffeemanagementResponse);
                }
                catch (Exception ex)
                {
                    if (ex.GetType().FullName == "Microsoft.EntityFrameworkCore.DbUpdateConcurrencyException")
                    {
                        return NotFound();
                    }
                    return BadRequest();
                }
            }
            return BadRequest();
        }
        [HttpPost]
        [Route("api/Delete")]
        public async Task<IActionResult> Delete([FromBody] StockLevel model)
        {
            if (ModelState.IsValid)
            {
                try
                {
                    //1. business logic
                    await service.Delete(model);
                    var coffeemanagementResponse = CoffeeManagementResponse.SUCCESS(model);
                    return Ok(coffeemanagementResponse);
                }
                catch (Exception ex)
                {
                    if (ex.GetType().FullName == "Microsoft.EntityFrameworkCore.DbUpdateConcurrencyException")
                    {
                        return NotFound();
                    }
                    return BadRequest();
                }
            }
            return BadRequest();
        }
        [HttpPost]
        [Route("api/DeletePermanently")]
        public async Task<IActionResult> DeletePermanently([FromBody] StockLevel model)
        {
            var result = 0;
            if (!(model.Id > 0))
            {
                return BadRequest();
            }
            try
            {
                //physically delete object
                result = (int)await service.DeletePermanently(model.Id);
                if (result == 0)
                {
                    return NotFound();
                }
                var coffeemanagementResponse = CoffeeManagementResponse.SUCCESS(model);
                return Ok(coffeemanagementResponse);
            }
            catch (Exception)
            {
                return BadRequest();
            }
        }


        [HttpGet]
        [Route("api/Count")]
        public int CountStockLevel()
        {
            int result = service.Count();
            return result;
        }
        [HttpPost]
        [Route("api/list-server-side")]
        public async Task<IActionResult> ListServerSide([FromBody] StockLevelDTParameters parameters)
        {
            try
            {
                var data = await service.ListServerSide(parameters);
                return Ok(data);
            }
            catch (Exception e)
            {
                return BadRequest(e);
            }
        }

        [HttpGet("api/GetIngredientStockSummary")]
        public async Task<IActionResult> GetIngredientStockSummary(int warehouseId)
        {
            try
            {
                var summary = await service.GetIngredientStockSummaryByWarehouseAsync(warehouseId);
                var coffeemanagementResponse = CoffeeManagementResponse.SUCCESS(summary.Cast<object>().ToList());
                return Ok(coffeemanagementResponse);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Đã xảy ra lỗi khi xử lý yêu cầu");
            }
        }

        [HttpGet("api/GetStockLevelsByIngredient")]
        public async Task<IActionResult> GetStockLevelsByIngredient(int warehouseId, int ingredientId)
        {
            try
            {
                var stockLevels = await service.GetStockLevelsByIngredientAsync(warehouseId, ingredientId);
                var coffeemanagementResponse = CoffeeManagementResponse.SUCCESS(stockLevels.Cast<object>().ToList());
                return Ok(coffeemanagementResponse);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Đã xảy ra lỗi khi xử lý yêu cầu");
            }
        }

        [HttpGet("api/GetStockLevelDetail")]
        public async Task<IActionResult> GetStockLevelDetail(int stockLevelId)
        {
            try
            {
                var detail = await service.GetStockLevelDetailAsync(stockLevelId);
                if (detail == null)
                    return NotFound("Không tìm thấy lô hàng");

                var coffeemanagementResponse = CoffeeManagementResponse.SUCCESS(detail);
                return Ok(coffeemanagementResponse);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Đã xảy ra lỗi khi xử lý yêu cầu");
            }
        }

        [HttpPost("api/AdjustStockLevelQuantity")]
        public async Task<IActionResult> AdjustStockLevelQuantity([FromBody] AdjustStockLevelDto adjustDto)
        {
            try
            {
                // In a real application, get the account ID from authentication
                int accountId = this.GetLoggedInUserId();

                var result = await service.AdjustStockLevelQuantityAsync(adjustDto, accountId);

                if (result)
                {
                    var coffeemanagementResponse = CoffeeManagementResponse.SUCCESS(result);
                    return Ok(coffeemanagementResponse);
                }

                return BadRequest(new { success = false, message = "Không thể điều chỉnh số lượng" });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { success = false, message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Đã xảy ra lỗi khi xử lý yêu cầu" });
            }
        }
    }
}
