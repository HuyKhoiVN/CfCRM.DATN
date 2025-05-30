﻿
using CoffeeCRM.Data.Model;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CoffeeCRM.Core.Util;
using CoffeeCRM.Data;
using CoffeeCRM.Core.Util.Parameters;
using CoffeeCRM.Data.ViewModels;
using System.Globalization;
using CoffeeCRM.Data.DTO;
using SkiaSharp;
using CoffeeCRM.Data.Constants;

namespace CoffeeCRM.Core.Repository
{
    public class AccountRepository : IAccountRepository
    {
        SysDbContext db;
        private readonly IUnitOfWork _unitOfWork;
        public AccountRepository(SysDbContext _db, IUnitOfWork unitOfWork)
        {
            db = _db;
            _unitOfWork = unitOfWork;
        }


        public async Task<List<Account>> List()
        {
            if (db != null)
            {
                return await (
                    from row in db.Accounts
                    where (row.Active)
                    orderby row.Id descending
                    select row
                ).ToListAsync();
            }

            return null;
        }

        public async Task<bool> ChangePasswordAsync(int accountId, string oldPassword, string newPassword)
        {
            if (db == null) return false;

            var account = await db.Accounts.FirstOrDefaultAsync(a => a.Id == accountId && a.Active);
            if (account == null)
            {
                throw new BadRequestException("Tài khoản không tồn tại.");
            }

            oldPassword = SecurityUtil.ComputeSha256Hash(oldPassword);

            // Kiểm tra mật khẩu cũ
            if (account.Password != oldPassword)
            {
                throw new BadRequestException("Mật khẩu cũ không chính xác.");
            }

            account.Password = SecurityUtil.ComputeSha256Hash(newPassword);
            await db.SaveChangesAsync();

            return true;
        }

        public async Task<List<Account>> ListPaging(int pageIndex, int pageSize)
        {
            int offSet = 0;
            offSet = (pageIndex - 1) * pageSize;
            if (db != null)
            {
                return await (
                    from row in db.Accounts
                    where (row.Active)
                    orderby row.Id descending
                    select row
                ).Skip(offSet).Take(pageSize).ToListAsync();
            }
            return null;
        }


        public async Task<Account> Detail(long? id)
        {
            if (db != null)
            {
                return await db.Accounts.FirstOrDefaultAsync(row => row.Active && row.Id == id);
            }
            return null;
        }


        public async Task<Account> Add(Account obj)
        {
            if (db != null)
            {
                await db.Accounts.AddAsync(obj);
                await db.SaveChangesAsync();
                return obj;
            }
            return null;
        }

        public async Task<Account> GetByUsername(string username)
        {
            if (db != null)
            {
                return await db.Accounts.FirstOrDefaultAsync(x => x.Username == username && x.Active);
            }
            return null;
        }


        public async Task Update(Account obj)
        {
            if (db != null)
            {
                //Update that object
                db.Accounts.Attach(obj);
                db.Entry(obj).Property(x => x.AccountCode).IsModified = true;
                db.Entry(obj).Property(x => x.Username).IsModified = true;
                db.Entry(obj).Property(x => x.Password).IsModified = true;
                db.Entry(obj).Property(x => x.FullName).IsModified = true;
                db.Entry(obj).Property(x => x.Email).IsModified = true;
                db.Entry(obj).Property(x => x.Photo).IsModified = true;
                db.Entry(obj).Property(x => x.Dob).IsModified = true;
                db.Entry(obj).Property(x => x.PhoneNumber).IsModified = true;
                db.Entry(obj).Property(x => x.Active).IsModified = true;
                db.Entry(obj).Property(x => x.RoleId).IsModified = true;

                //Commit the transaction
                await db.SaveChangesAsync();
            }
        }


        public async Task Delete(Account obj)
        {
            if (db != null)
            {
                //Update that obj
                db.Accounts.Attach(obj);
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
                var obj = await db.Accounts.FirstOrDefaultAsync(x => x.Id == objId);

                if (obj != null)
                {
                    //Delete that obj
                    db.Accounts.Remove(obj);

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
                    from row in db.Accounts
                    where row.Active
                    select row
                            ).Count();
            }

            return result;
        }
        public async Task<DTResult<AccountDto>> ListServerSide(AccountDTParameters parameters)
        {
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
            var query = from row in db.Accounts
                        join role in db.Roles on row.RoleId equals role.Id into roleGroup
                        from role in roleGroup.DefaultIfEmpty()
                        where row.Active

                        select new
                        {
                            row,
                            RoleName = role != null ? role.RoleName : "N/A"
                        };

            recordTotal = await query.CountAsync();
            //2. Fillter
            if (!String.IsNullOrEmpty(searchAll))
            {
                searchAll = searchAll.ToLower();
                query = query.Where(c =>
                    EF.Functions.Collate(c.row.Id.ToString().ToLower(), SQLParams.Latin_General).Contains(EF.Functions.Collate(searchAll, SQLParams.Latin_General)) ||
                    EF.Functions.Collate(c.row.AccountCode.ToLower(), SQLParams.Latin_General).Contains(EF.Functions.Collate(searchAll, SQLParams.Latin_General)) ||
                    EF.Functions.Collate(c.row.Username.ToLower(), SQLParams.Latin_General).Contains(EF.Functions.Collate(searchAll, SQLParams.Latin_General)) ||
                    EF.Functions.Collate(c.row.Password.ToLower(), SQLParams.Latin_General).Contains(EF.Functions.Collate(searchAll, SQLParams.Latin_General)) ||
                    EF.Functions.Collate(c.row.FullName.ToLower(), SQLParams.Latin_General).Contains(EF.Functions.Collate(searchAll, SQLParams.Latin_General)) ||
                    EF.Functions.Collate(c.row.Email.ToLower(), SQLParams.Latin_General).Contains(EF.Functions.Collate(searchAll, SQLParams.Latin_General)) ||
                    EF.Functions.Collate(c.row.Photo.ToLower(), SQLParams.Latin_General).Contains(EF.Functions.Collate(searchAll, SQLParams.Latin_General)) ||
                    EF.Functions.Collate(c.row.Dob.ToCustomString().ToLower(), SQLParams.Latin_General).Contains(EF.Functions.Collate(searchAll, SQLParams.Latin_General)) ||
                    EF.Functions.Collate(c.row.PhoneNumber.ToLower(), SQLParams.Latin_General).Contains(EF.Functions.Collate(searchAll, SQLParams.Latin_General)) ||
                    EF.Functions.Collate(c.row.CreatedTime.ToCustomString().ToLower(), SQLParams.Latin_General).Contains(EF.Functions.Collate(searchAll, SQLParams.Latin_General)) ||
                    EF.Functions.Collate(c.row.Active.ToString().ToLower(), SQLParams.Latin_General).Contains(EF.Functions.Collate(searchAll, SQLParams.Latin_General)) ||
                    EF.Functions.Collate(c.row.RoleId.ToString().ToLower(), SQLParams.Latin_General).Contains(EF.Functions.Collate(searchAll, SQLParams.Latin_General))
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
                        case "accountCode":
                            query = query.Where(c => (c.row.AccountCode ?? "").Contains(fillter));
                            break;
                        case "username":
                            query = query.Where(c => (c.row.Username ?? "").Contains(fillter));
                            break;
                        case "password":
                            query = query.Where(c => (c.row.Password ?? "").Contains(fillter));
                            break;
                        case "fullName":
                            query = query.Where(c => (c.row.FullName ?? "").Contains(fillter));
                            break;
                        case "email":
                            query = query.Where(c => (c.row.Email ?? "").Contains(fillter));
                            break;
                        case "photo":
                            query = query.Where(c => (c.row.Photo ?? "").Contains(fillter));
                            break;
                        case "dOB":
                            if (fillter.Contains(" - "))
                            {
                                var dates = fillter.Split(" - ");
                                var startDate = DateTime.ParseExact(dates[0], "dd/MM/yyyy", CultureInfo.InvariantCulture);
                                var endDate = DateTime.ParseExact(dates[1], "dd/MM/yyyy", CultureInfo.InvariantCulture).AddDays(1).AddSeconds(-1);
                                query = query.Where(c => c.row.Dob >= startDate && c.row.Dob <= endDate);
                            }
                            else
                            {
                                var date = DateTime.ParseExact(fillter, "dd/MM/yyyy", CultureInfo.InvariantCulture);
                                query = query.Where(c => c.row.Dob.Date == date.Date);
                            }
                            break;
                        case "phoneNumber":
                            query = query.Where(c => (c.row.PhoneNumber ?? "").Contains(fillter));
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
                        case "roleId":
                            query = query.Where(c => c.row.RoleId.ToString().Trim().Contains(fillter));
                            break;

                    }
                }
            }

            //3.Query second
            var query2 = query.Select(c => new AccountDto()
            {
                Id = c.row.Id,
                AccountCode = c.row.AccountCode,
                Username = c.row.Username,
                Password = c.row.Password,
                FullName = c.row.FullName,
                Email = c.row.Email,
                Photo = c.row.Photo,
                DOB = c.row.Dob,
                PhoneNumber = c.row.PhoneNumber,
                CreatedTime = c.row.CreatedTime,
                Active = c.row.Active,
                RoleId = c.row.RoleId,
                RoleName = c.RoleName
            });
            //4. Sort
            query2 = query2.OrderByDynamic<AccountDto>(orderCritirea, orderDirectionASC ? LinqExtensions.Order.Asc : LinqExtensions.Order.Desc);
            recordFiltered = await query2.CountAsync();
            //5. Return data
            return new DTResult<AccountDto>()
            {
                data = await query2.Skip(parameters.Start).Take(parameters.Length).ToListAsync(),
                draw = parameters.Draw,
                recordsFiltered = recordFiltered,
                recordsTotal = recordTotal
            };
        }

        public async Task<Account> Login(LoginDto obj)
        {
            var account = await (
                from a in db.Accounts
                where (a.Active == true && a.Username == obj.Username) select a
                ).FirstOrDefaultAsync();
            return account;
        }

        public async Task<List<Account>> GetByRoleId(int roleId)
        {
            var account = await (
                from a in db.Accounts
                where (a.Active == true && a.RoleId == roleId)
                select a
                ).ToListAsync();
            return account;
        }

        public async Task<DTResult<AccountSummaryDto>> ListServerSideSummary(AccountDTParameters parameters)
        {
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
            var now = DateTime.Now;
            var startOfMonth = new DateTime(now.Year, now.Month, 1);
            var endOfMonth = startOfMonth.AddMonths(1);

            var query = from acc in db.Accounts where acc.Active
                        join role in db.Roles on acc.RoleId equals role.Id into roleGroup
                        from role in roleGroup.DefaultIfEmpty()
                        select new AccountSummaryDto
                        {
                            Id = acc.Id,
                            FullName = acc.FullName,
                            Username = acc.Username,
                            Photo = acc.Photo,
                            RoleName = role != null ? role.RoleName : "N/A"
                        };


            recordTotal = await query.CountAsync();
            //2. Fillter
            if (!String.IsNullOrEmpty(searchAll))
            {
                searchAll = searchAll.ToLower();
                query = query.Where(x =>
                                x.FullName.Contains(searchAll) ||
                                x.Username.Contains(searchAll) ||
                                x.RoleName.Contains(searchAll));

            }

            var pagedData = await query
                                .Skip(parameters.Start)
                                .Take(parameters.Length)
                                .ToListAsync();
            var accountIds = pagedData.Select(x => x.Id).ToList();

            var invoiceStats = await db.Invoices
       .Where(x => x.Active
           && accountIds.Contains(x.AccountId)
           && x.CreatedTime >= startOfMonth && x.CreatedTime < endOfMonth)
       .GroupBy(x => x.AccountId)
       .Select(g => new {
           AccountId = g.Key,
           Total = g.Count(),
           TotalValue = g.Sum(x => x.TotalMoney)
       }).ToListAsync();

            var poStats = await db.PurchaseOrders
                .Where(x => x.PaymentStatus == PurchaseOrderStatusConst.COMPLETED
                    && accountIds.Contains(x.AccountId)
                    && x.CreatedTime >= startOfMonth && x.CreatedTime < endOfMonth)
                .GroupBy(x => x.AccountId)
                .Select(g => new {
                    AccountId = g.Key,
                    Total = g.Count(),
                    TotalValue = g.Sum(x => x.TotalPrice)
                }).ToListAsync();

            var orderStats = await db.DishOrders
                .Where(x => x.DishOrderStatusId != DishOrderStatudConst.CANCEL
                    && accountIds.Contains(x.AccountId)
                    && x.CreatedTime >= startOfMonth && x.CreatedTime < endOfMonth)
                .GroupBy(x => x.AccountId)
                .Select(g => new {
                    AccountId = g.Key,
                    Total = g.Count()
                }).ToListAsync();

            var bookingStats = await db.TableBookings
                .Where(x => accountIds.Contains(x.AccountId)
                    && x.CreatedTime >= startOfMonth && x.CreatedTime < endOfMonth)
                .GroupBy(x => x.AccountId)
                .Select(g => new {
                    AccountId = g.Key,
                    Total = g.Count()
                }).ToListAsync();


            //3.Query second
            foreach (var acc in pagedData)
            {
                acc.TotalInvoice = invoiceStats.FirstOrDefault(x => x.AccountId == acc.Id)?.Total ?? 0;
                acc.TotalInvoiceValue = invoiceStats.FirstOrDefault(x => x.AccountId == acc.Id)?.TotalValue ?? 0;

                acc.TotalPurchaseOrder = poStats.FirstOrDefault(x => x.AccountId == acc.Id)?.Total ?? 0;
                acc.TotalPurchaseOrderValue = poStats.FirstOrDefault(x => x.AccountId == acc.Id)?.TotalValue ?? 0;

                acc.TotalDishOrder = orderStats.FirstOrDefault(x => x.AccountId == acc.Id)?.Total ?? 0;
                acc.TotalTableBooking = bookingStats.FirstOrDefault(x => x.AccountId == acc.Id)?.Total ?? 0;
            }

            //4. Sort
           
            recordFiltered = pagedData.Count();
            //5. Return data
            return new DTResult<AccountSummaryDto>()
            {
                data = pagedData,
                draw = parameters.Draw,
                recordsFiltered = recordFiltered,
                recordsTotal = recordTotal
            };
        }
    }
}


