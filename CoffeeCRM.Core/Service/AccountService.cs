
using CoffeeCRM.Data.Model;
using CoffeeCRM.Core.Repository;

using CoffeeCRM.Core.Util;using CoffeeCRM.Data;
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
using CoffeeCRM.Core.Helper;
using Google.Apis.Logging;
using Microsoft.Extensions.Logging;

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
        ILogger<AccountService> _logger;

        public AccountService(
            IAccountRepository _accountRepository
            , Microsoft.AspNetCore.Hosting.IHostingEnvironment env,
            IHttpContextAccessor _httpContextAccessor,
            IMapper _mapper,
            IConfiguration _config,
            ITokenService _tokenService,
            ILogger<AccountService> logger
            )
        {
            accountRepository = _accountRepository;
            _env = env;
            httpContextAccessor = _httpContextAccessor;
            mapper = _mapper;
            config = _config;
            tokenService = _tokenService;
            _logger = logger;
        }

        public async Task AddDto(AccountCreateDto dto)
        {
            try
            {
                if (await accountRepository.GetByUsername(dto.Username.Trim().ToLower()) != null)
                {
                    _logger.LogError("Account-Add: " + "Tài khoản đã tồn tại");
                    throw new Exception("Tài khoản đã tồn tại");
                }

                var password = SecurityUtil.ComputeSha256Hash("123456");
                if (dto.Password != null && !string.IsNullOrEmpty(dto.Password.Trim()))
                {
                    password = SecurityUtil.ComputeSha256Hash(dto.Password.Trim());
                }

                if (dto.Image != null)
                {
                    try
                    {
                        dto.Photo = await FileHelper.SaveImageAsync(dto.Image);
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError("Account-Add: Lỗi upload ảnh - " + ex.Message);
                        throw new Exception("Lỗi upload ảnh: " + ex.Message);
                    }
                }
                else
                {
                    dto.Photo = "images/userdefault.jpg";
                }

                var account = new Account()
                {
                    AccountCode = dto.AccountCode,
                    Username = dto.Username.Trim().ToLower(),
                    Password = password,
                    FullName = dto.FullName,
                    Email = dto.Email,
                    Photo = dto.Photo,
                    Dob = dto.DOB,
                    PhoneNumber = dto.PhoneNumber,
                    CreatedTime = DateTime.Now,
                    Active = true,
                    RoleId = dto.RoleId
                };

                await accountRepository.Add(account);
            }
            catch (Exception ex)
            {
                _logger.LogError("Account-Add: " + ex.Message);
                throw;
            }
        }

        public async Task AddOrUpdate(AccountCreateDto dto)
        {
            try
            {
                bool isNew = dto.Id == 0;
                string passWord = SecurityUtil.ComputeSha256Hash("123456");

                var existing = await accountRepository.GetByUsername(dto.Username.Trim().ToLower());
                if (isNew && existing != null)
                {
                    _logger.LogError("Account-Add: Tài khoản đã tồn tại");
                    throw new BadRequestException("Tài khoản đã tồn tại");
                }

                if (dto.Image != null)
                {
                    try
                    {
                        dto.Photo = await FileHelper.SaveImageAsync(dto.Image);
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError("Account-Add: Lỗi upload ảnh - " + ex.Message);
                        throw new Exception("Lỗi upload ảnh: " + ex.Message);
                    }
                }

                if (isNew)
                {
                    if (dto.Password != null && !string.IsNullOrEmpty(dto.Password.Trim()))
                    {
                        passWord = SecurityUtil.ComputeSha256Hash(dto.Password.Trim());
                    }
                    
                    if(dto.Photo == null || string.IsNullOrEmpty(dto.Photo))
                    {
                        dto.Photo = "images/userdefault.jpg";
                    }

                    var account = new Account()
                    {
                        AccountCode = dto.AccountCode,
                        Username = dto.Username.Trim().ToLower(),
                        Password = passWord,
                        FullName = dto.FullName,
                        Email = dto.Email,
                        Photo = dto.Photo,
                        Dob = dto.DOB,
                        PhoneNumber = dto.PhoneNumber,
                        CreatedTime = DateTime.Now,
                        Active = true,
                        RoleId = dto.RoleId
                    };

                    await accountRepository.Add(account);
                }
                else
                {
                    var acc = await accountRepository.Detail(dto.Id);
                    if (acc == null)
                    {
                        _logger.LogError("Account-Add: Tài khoản không tồn tại");
                        throw new BadRequestException("Tài khoản không tồn tại");
                    }

                    if(dto.Photo == null || string.IsNullOrEmpty(dto.Photo))
                    {
                        dto.Photo = acc.Photo;
                    }

                    if (dto.Password != null && !string.IsNullOrEmpty(dto.Password.Trim()))
                    {
                        passWord = SecurityUtil.ComputeSha256Hash(dto.Password.Trim());
                    }
                    else
                    {
                        passWord = acc.Password;
                    }

                    acc.AccountCode = dto.AccountCode;
                    acc.Username = dto.Username.Trim().ToLower();
                    acc.Password = passWord;
                    acc.FullName = dto.FullName;
                    acc.Email = dto.Email;
                    acc.Photo = dto.Photo;
                    acc.Dob = dto.DOB;
                    acc.PhoneNumber = dto.PhoneNumber;
                    acc.Active = true;
                    acc.RoleId = dto.RoleId;

                    await accountRepository.Update(acc);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError("Account-AddOrUpdate: " + ex.Message);
                throw;
            }
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

        public async Task<DTResult<AccountDto>> ListServerSide(AccountDTParameters parameters)
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

        public async Task<CoffeeManagementResponse> Login(LoginDto model)
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
                //httpContextAccessor.HttpContext.Session.SetInt32("UserId", (int)account.Id);
                //httpContextAccessor.HttpContext.Session.SetInt32("RoleId", (int)account.RoleId);
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

        public async Task Add(Account obj)
        {
            await accountRepository.Add(obj);
        }
    }
}

