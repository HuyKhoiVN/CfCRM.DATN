
using CoffeeCRM.Data.Model;
using CoffeeCRM.Core.Repository;

using CoffeeCRM.Core.Util;
using CoffeeCRM.Core.Util.Parameters;
using CoffeeCRM.Data.ViewModels;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using CoffeeCRM.Data.Constants;
using CoffeeCRM.Data.DTO;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;

namespace CoffeeCRM.Core.Service
{
    public class AccountService : IAccountService
    {
        IAccountRepository accountRepository;
        Microsoft.AspNetCore.Hosting.IHostingEnvironment _env;
        IHttpContextAccessor httpContextAccessor;
        IMapper mapper;
        ITokenService tokenService;
        IConfiguration config;
        public AccountService(
            IAccountRepository _accountRepository
            , Microsoft.AspNetCore.Hosting.IHostingEnvironment env,
            IHttpContextAccessor _httpContextAccessor,
            IMapper _mapper,
            IConfiguration _config,
            ITokenService _tokenService

            )
        {
            accountRepository = _accountRepository;
            _env = env;
            httpContextAccessor = _httpContextAccessor;
            mapper = _mapper;
            config = _config;
            tokenService = _tokenService;
        }

        public async Task Add(Account obj)
        {
            obj.Password = SecurityUtil.ComputeSha256Hash(obj.Password);

            obj.Active = true;
            obj.CreatedTime = DateTime.Now;
            await accountRepository.Add(obj);
        }

        public int Count()
        {
            var result = accountRepository.Count();
            return result;
        }

        public async Task Delete(Account obj)
        {
            obj.Active = false;
            await accountRepository.Delete(obj);
        }

        public async Task<long> DeletePermanently(long? id)
        {
            return await accountRepository.DeletePermanently(id);
        }

        public async Task<Account> Detail(long? id)
        {
            return await accountRepository.Detail(id);
        }

        public async Task<List<Account>> List()
        {
            return await accountRepository.List();
        }

        public async Task<List<Account>> ListPaging(int pageIndex, int pageSize)
        {
            return await accountRepository.ListPaging(pageIndex, pageSize);
        }

        public async Task<DTResult<Account>> ListServerSide(AccountDTParameters parameters)
        {
            return await accountRepository.ListServerSide(parameters);
        }

        //public async Task<List<Account>> Search(string keyword)
        //{
        //    return await accountRepository.Search(keyword);
        //}

        public async Task Update(Account obj)
        {
            if (obj.Password.Length > 0)
            {
                obj.Password = SecurityUtil.ComputeSha256Hash(obj.Password);
            }
            await accountRepository.Update(obj);
        }

        public async Task<CoffeeManagementResponse> Login(Account model)
        {
            //trim
            model.Username = model.Username.Trim();
            model.Password = model.Password.Trim();
            if (model.Username.Length == 0 || model.Password.Length == 0)
            {
                return CoffeeManagementResponse.BAD_REQUEST();
            }
            var data = await accountRepository.Login(model);

            if (data == null)
            {
                return CoffeeManagementResponse.Failed("404", "Tài khoản không tìm thấy", null);
            }
            else if (data.Password == SecurityUtil.ComputeSha256Hash(model.Password))
            {
                string accessToken = tokenService.GenerateToken(new AccountToken()//get access token
                {
                    Id = data.Id,
                    Username = data.Username,
                    RoleId = data.RoleId,
                }, DateTime.Now.AddMinutes(int.Parse(config["Jwt:AdminExpireMinutes"])));
                var account = mapper.Map<AccountProfileResponseDTO>(data);
                httpContextAccessor.HttpContext.Session.SetInt32("UserId", (int)account.Id);
                httpContextAccessor.HttpContext.Session.SetInt32("RoleId", (int)account.RoleId);
                return CoffeeManagementResponse.Success(new SignInResponse()//Change resources
                {
                    AccessToken = accessToken,
                    Profile = account
                });
            }
            else
            {
                return CoffeeManagementResponse.BAD_REQUEST();
            }
        }

    }
}

