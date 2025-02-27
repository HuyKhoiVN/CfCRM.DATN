
using CoffeeCRM.Data.Model;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CoffeeCRM.Core.Util;
using CoffeeCRM.Core.Util.Parameters;
using CoffeeCRM.Data.ViewModels;
using System.Globalization;
using CoffeeCRM.Data.DTO;

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


        //public async Task <List< Account>> Search(string keyword)
        //{
        //    if(db != null)
        //    {
        //        return await(
        //            from row in db.Accounts
        //                        where(row.Active && (row.Name.Contains(keyword) || row.Description.Contains(keyword)))
        //                        orderby row.Id descending
        //                        select row
        //        ).ToListAsync();
        //    }
        //    return null;
        //}


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
        public async Task<DTResult<Account>> ListServerSide(AccountDTParameters parameters)
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


                        where row.Active

                        select new
                        {
                            row
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
            var query2 = query.Select(c => new Account()
            {
                Id = c.row.Id,
                AccountCode = c.row.AccountCode,
                Username = c.row.Username,
                Password = c.row.Password,
                FullName = c.row.FullName,
                Email = c.row.Email,
                Photo = c.row.Photo,
                Dob = c.row.Dob,
                PhoneNumber = c.row.PhoneNumber,
                CreatedTime = c.row.CreatedTime,
                Active = c.row.Active,
                RoleId = c.row.RoleId,

            });
            //4. Sort
            query2 = query2.OrderByDynamic<Account>(orderCritirea, orderDirectionASC ? LinqExtensions.Order.Asc : LinqExtensions.Order.Desc);
            recordFiltered = await query2.CountAsync();
            //5. Return data
            return new DTResult<Account>()
            {
                data = await query2.Skip(parameters.Start).Take(parameters.Length).ToListAsync(),
                draw = parameters.Draw,
                recordsFiltered = recordFiltered,
                recordsTotal = recordTotal
            };
        }

        public async Task<DTResult<AccountDto>> GetAccountsListServerSide(AccountDTParameters parameters)
        {
            // 0. Options
            string searchAll = parameters.SearchAll.Trim();
            string orderCriteria = "Id"; // Default criteria
            int recordTotal, recordFiltered;
            bool orderDirectionASC = true; // Default ascending
            if (parameters.Order != null)
            {
                orderCriteria = parameters.Columns[parameters.Order[0].Column].Data;
                orderDirectionASC = parameters.Order[0].Dir == DTOrderDir.ASC;
            }

            // 1. Join các b?ng liên quan
            var query = from account in db.Accounts
                        join role in db.Roles on account.RoleId equals role.Id into roleJoin
                        from role in roleJoin.DefaultIfEmpty()
                        where account.Active // Ch? l?y tài kho?n ?ang ho?t ??ng
                        select new
                        {
                            account,
                            RoleName = role != null ? role.RoleName : null
                        };

            recordTotal = await query.CountAsync();

            // 2. Filter
            if (!string.IsNullOrEmpty(searchAll))
            {
                searchAll = searchAll.ToLower();
                query = query.Where(c =>
                    EF.Functions.Collate(c.account.Id.ToString().ToLower(), "SQL_Latin1_General_CP1_CI_AS").Contains(searchAll) ||
                    EF.Functions.Collate((c.account.AccountCode ?? "").ToLower(), "SQL_Latin1_General_CP1_CI_AS").Contains(searchAll) ||
                    EF.Functions.Collate((c.account.Username ?? "").ToLower(), "SQL_Latin1_General_CP1_CI_AS").Contains(searchAll) ||
                    EF.Functions.Collate((c.account.FullName ?? "").ToLower(), "SQL_Latin1_General_CP1_CI_AS").Contains(searchAll) ||
                    EF.Functions.Collate((c.account.Email ?? "").ToLower(), "SQL_Latin1_General_CP1_CI_AS").Contains(searchAll) ||
                    EF.Functions.Collate((c.account.PhoneNumber ?? "").ToLower(), "SQL_Latin1_General_CP1_CI_AS").Contains(searchAll) ||
                    EF.Functions.Collate(c.RoleName.ToLower(), "SQL_Latin1_General_CP1_CI_AS").Contains(searchAll)
                );
            }

            foreach (var item in parameters.Columns)
            {
                var filter = item.Search.Value?.Trim();
                if (!string.IsNullOrEmpty(filter))
                {
                    switch (item.Data)
                    {
                        case "id":
                            query = query.Where(c => c.account.Id.ToString().Contains(filter));
                            break;
                        case "accountCode":
                            query = query.Where(c => (c.account.AccountCode ?? "").Contains(filter));
                            break;
                        case "username":
                            query = query.Where(c => (c.account.Username ?? "").Contains(filter));
                            break;
                        case "fullName":
                            query = query.Where(c => (c.account.FullName ?? "").Contains(filter));
                            break;
                        case "email":
                            query = query.Where(c => (c.account.Email ?? "").Contains(filter));
                            break;
                        case "phoneNumber":
                            query = query.Where(c => (c.account.PhoneNumber ?? "").Contains(filter));
                            break;
                        case "roleName":
                            query = query.Where(c => (c.RoleName ?? "").Contains(filter));
                            break;
                        case "createdTime":
                            if (filter.Contains(" - "))
                            {
                                var dates = filter.Split(" - ");
                                var startDate = DateTime.ParseExact(dates[0], "dd/MM/yyyy", CultureInfo.InvariantCulture);
                                var endDate = DateTime.ParseExact(dates[1], "dd/MM/yyyy", CultureInfo.InvariantCulture).AddDays(1).AddSeconds(-1);
                                query = query.Where(c => c.account.CreatedTime >= startDate && c.account.CreatedTime <= endDate);
                            }
                            else
                            {
                                var date = DateTime.ParseExact(filter, "dd/MM/yyyy", CultureInfo.InvariantCulture);
                                query = query.Where(c => c.account.CreatedTime.Date == date.Date);
                            }
                            break;
                    }
                }
            }

            // 3. T?ng h?p d? li?u hi?u su?t
            var query2 = from q in query
                         join invoice in db.Invoices on q.account.Id equals invoice.AccountId into invoices
                         join stock in db.StockTransactions on q.account.Id equals stock.AccountId into stocks
                         join attendance in db.Attendances on q.account.Id equals attendance.AccountId into attendances
                         join cashFlow in db.CashFlows on q.account.Id equals cashFlow.AccountId into cashFlows
                         join booking in db.TableBookings on q.account.Id equals booking.AccountId into bookings
                         join activity in db.AccountActivities on q.account.Id equals activity.AccountId into activities
                         select new AccountDto
                         {
                             Id = q.account.Id,
                             AccountCode = q.account.AccountCode,
                             Username = q.account.Username,
                             Password = q.account.Password,
                             FullName = q.account.FullName,
                             Email = q.account.Email,
                             Photo = q.account.Photo,
                             DOB = q.account.Dob,
                             PhoneNumber = q.account.PhoneNumber,
                             CreatedTime = q.account.CreatedTime,
                             Active = q.account.Active,
                             RoleId = q.account.RoleId,
                             RoleName = q.RoleName,
                             LastLoginTime = activities.OrderByDescending(a => a.CreatedTime).Select(a => (DateTime?)a.CreatedTime).FirstOrDefault(),
                             TotalInvoices = invoices.Count(),
                             TotalStockTransactions = stocks.Count(),
                             TotalCheckInDays = attendances.Select(a => a.CreatedTime.Date).Distinct().Count(),
                             TotalWorkHours = attendances.Sum(a => a.WorkHours),
                             TotalRevenue = invoices.Sum(i => i.TotalMoney),
                             TotalCashHandled = cashFlows.Sum(c => c.TotalMoney),
                             TotalBookings = bookings.Count(),
                             ActivityHistory = activities.Select(a => new ActivityDto
                             {
                                 ActivityType = a.ActivityType,
                                 ActivityDescription = a.ActivityDescription,
                                 CreatedTime = a.CreatedTime
                             }).ToList(),
                             RecentInvoices = invoices.OrderByDescending(i => i.CreatedTime).Take(5).Select(i => new InvoiceDto
                             {
                                 InvoiceCode = i.InvoiceCode,
                                 TotalMoney = i.TotalMoney,
                                 CreatedTime = i.CreatedTime
                             }).ToList(),
                             RecentStockTransactions = stocks.OrderByDescending(s => s.CreatedTime).Take(1).Select(s => new StockTransactionDto
                             {
                                 StockTransactionCode = s.StockTransactionCode,
                                 TransactionType = s.TransactionType,
                                 TotalMoney = s.TotalMoney,
                                 CreatedTime = s.CreatedTime
                             }).ToList(),
                             RecentCashFlows = cashFlows.OrderByDescending(c => c.CreatedTime).Take(5).Select(c => new CashFlowDto
                             {
                                 TotalMoney = c.TotalMoney,
                                 FlowType = c.FlowType,
                                 CreatedTime = c.CreatedTime
                             }).ToList(),
                             RecentBookings = bookings.OrderByDescending(b => b.CreatedTime).Take(5).Select(b => new TableBookingDto
                             {
                                 BookingTime = b.BookingTime,
                                 TableName = db.Tables.Where(t => t.Id == b.TableId).Select(t => t.TableName).FirstOrDefault(),
                                 BookingStatus = b.BookingStatus,
                                 CreatedTime = b.CreatedTime
                             }).ToList()
                         };

            // 4. Sort
            query2 = query2.OrderByDynamic(orderCriteria, orderDirectionASC ? LinqExtensions.Order.Asc : LinqExtensions.Order.Desc);
            recordFiltered = await query2.CountAsync();

            // 5. Return data
            return new DTResult<AccountDto>
            {
                data = await query2.Skip(parameters.Start).Take(parameters.Length).ToListAsync(),
                draw = parameters.Draw,
                recordsFiltered = recordFiltered,
                recordsTotal = recordTotal
            };
        }

        public async Task<Account> Login(Account obj)
        {
            var account = await (
                from a in db.Accounts
                where (a.Active == true && a.Username == obj.Username) select a
                ).FirstOrDefaultAsync();
            return account;
        }
    }
}


