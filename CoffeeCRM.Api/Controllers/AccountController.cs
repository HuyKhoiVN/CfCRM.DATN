
     
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

    namespace CfCRM.DATN.Controllers
    {
        [Route("[controller]")]
        [ApiController]
        public class AccountController : ControllerBase
        {
            IAccountService service;
            public AccountController(IAccountService _service)
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
            public async Task<IActionResult> Add([FromBody]Account model)
            {
                if (ModelState.IsValid)
                {
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
            [Route("api/Update")]
            public async Task<IActionResult> Update([FromBody]Account model)
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
            public async Task<IActionResult> Delete([FromBody]Account model)
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
            public async Task<IActionResult> DeletePermanently([FromBody]Account model)
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
            public int CountAccount()
            {
                int result = service.Count();
                return result;
            }
            [HttpPost]
            [Route("api/list-server-side")]
            public async Task<IActionResult> ListServerSide([FromBody] AccountDTParameters parameters)
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
    