

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
using CoffeeCRM.Core.Helper;
using CoffeeCRM.Data.ViewModels;

namespace CfCRM.DATN.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class DishOrderController : ControllerBase
    {
        IDishOrderService service;
        INotificationService notificationService;
        public DishOrderController(IDishOrderService _service, 
            INotificationService notificationService)
        {
            service = _service;
            this.notificationService = notificationService;
        }

        [HttpGet]
        [Route("api/ListQueue")]
        public async Task<IActionResult> ListQueue(int pageIndex, int pageSize)
        {
            try
            {
                var accountId = this.GetLoggedInUserId();
                var roleId = this.GetLoggedInRoleId();
                if (roleId == RoleConst.BARTENDER)
                {
                    var dataList = await service.ListDishOrderNotification();
                    if (dataList == null || dataList.Count == 0)
                    {
                        return Ok(CoffeeManagementResponse.SUCCESS(new List<DishOrderViewModel>()));
                    }
                    return Ok(CoffeeManagementResponse.SUCCESS(dataList.Cast<object>().ToList()));
                }
                else
                {

                    var dataList = await notificationService.ListPaging(accountId, pageIndex, pageSize);
                    //if (dataList == null || dataList.Count == 0)
                    //{
                    //    return Ok(CoffeeManagementResponse.SUCCESS(new List<DishOrderViewModel>()));
                    //}
                    return Ok(CoffeeManagementResponse.SUCCESS(dataList.Cast<object>().ToList()));
                }

            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
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
        [Route("api/DetailByTableId/{Id}")]
        public async Task<IActionResult> DetailByTableId(int Id)
        {
            try
            {
                var dataList = await service.DishOrderDetailByTableId(Id);
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
        [Route("api/DishDetailByTableId/{Id}")]
        public async Task<IActionResult> DishDetailByTableId(int Id)
        {
            try
            {
                var dataList = await service.ListDishOrderInvoice(Id);
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
        public async Task<IActionResult> Add([FromBody] DishOrder model)
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
        [Route("api/AddOrUpdate")]
        public async Task<IActionResult> AddOrUpdate([FromBody] DishOrderViewModel model)
        {
            if (ModelState.IsValid)
            {
                try
                {
                    var userId = this.GetLoggedInUserId();
                    model.AccountId = userId;
                    if (!(await service.AddOrUpdateByVm(model)))
                    {
                        return BadRequest();
                    }
                    var coffeemanagementResponse = CoffeeManagementResponse.SUCCESS(model);
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
        public async Task<IActionResult> Update([FromBody] DishOrder model)
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
        public async Task<IActionResult> Delete([FromBody] DishOrder model)
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
        public async Task<IActionResult> DeletePermanently([FromBody] DishOrder model)
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
        public int CountDishOrder()
        {
            int result = service.Count();
            return result;
        }
        [HttpPost]
        [Route("api/list-server-side")]
        public async Task<IActionResult> ListServerSide([FromBody] DishOrderDTParameters parameters)
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
    }
}
