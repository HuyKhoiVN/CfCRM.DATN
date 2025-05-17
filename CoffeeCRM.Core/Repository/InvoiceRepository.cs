
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
using Microsoft.EntityFrameworkCore.Infrastructure;

namespace CoffeeCRM.Core.Repository
{
    public class InvoiceRepository : IInvoiceRepository
    {
        SysDbContext db;
        public InvoiceRepository(SysDbContext _db)
        {
            db = _db;
        }

        public async Task<List<Invoice>> List()
        {
            if (db != null)
            {
                return await (
                    from row in db.Invoices
                    where (row.Active)
                    orderby row.Id descending
                    select row
                ).ToListAsync();
            }

            return null;
        }

        public async Task<List<Invoice>> ListPaging(int pageIndex, int pageSize)
        {
            int offSet = 0;
            offSet = (pageIndex - 1) * pageSize;
            if (db != null)
            {
                return await (
                    from row in db.Invoices
                    where (row.Active)
                    orderby row.Id descending
                    select row
                ).Skip(offSet).Take(pageSize).ToListAsync();
            }
            return null;
        }

        public async Task<Invoice> Detail(long? id)
        {
            if (db != null)
            {
                return await db.Invoices.FirstOrDefaultAsync(row => row.Active && row.Id == id);
            }
            return null;
        }

        public async Task<Invoice> Add(Invoice obj)
        {
            if (db != null)
            {
                await db.Invoices.AddAsync(obj);
                await db.SaveChangesAsync();
                return obj;
            }
            return null;
        }

        public async Task Update(Invoice obj)
        {
            if (db != null)
            {
                //Update that object
                db.Invoices.Attach(obj);
                db.Entry(obj).Property(x => x.InvoiceCode).IsModified = true;
                db.Entry(obj).Property(x => x.TotalMoney).IsModified = true;
                db.Entry(obj).Property(x => x.PaymentStatus).IsModified = true;
                db.Entry(obj).Property(x => x.Active).IsModified = true;
                db.Entry(obj).Property(x => x.PaymentMethod).IsModified = true;
                db.Entry(obj).Property(x => x.AccountId).IsModified = true;
                db.Entry(obj).Property(x => x.TableId).IsModified = true;
                db.Entry(obj).Property(x => x.TotalGuest).IsModified = true;

                //Commit the transaction
                await db.SaveChangesAsync();
            }
        }

        public async Task Delete(Invoice obj)
        {
            if (db != null)
            {
                //Update that obj
                db.Invoices.Attach(obj);
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
                var obj = await db.Invoices.FirstOrDefaultAsync(x => x.Id == objId);

                if (obj != null)
                {
                    //Delete that obj
                    db.Invoices.Remove(obj);

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
                    from row in db.Invoices
                    where row.Active
                    select row
                            ).Count();
            }

            return result;
        }

        public async Task<DTResult<Invoice>> ListServerSide(InvoiceDTParameters parameters)
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
            var query = from row in db.Invoices


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
EF.Functions.Collate(c.row.InvoiceCode.ToLower(), SQLParams.Latin_General).Contains(EF.Functions.Collate(searchAll, SQLParams.Latin_General)) ||
EF.Functions.Collate(c.row.TotalMoney.ToString().ToLower(), SQLParams.Latin_General).Contains(EF.Functions.Collate(searchAll, SQLParams.Latin_General)) ||
EF.Functions.Collate(c.row.PaymentStatus.ToLower(), SQLParams.Latin_General).Contains(EF.Functions.Collate(searchAll, SQLParams.Latin_General)) ||
EF.Functions.Collate(c.row.CreatedTime.ToCustomString().ToLower(), SQLParams.Latin_General).Contains(EF.Functions.Collate(searchAll, SQLParams.Latin_General)) ||
EF.Functions.Collate(c.row.Active.ToString().ToLower(), SQLParams.Latin_General).Contains(EF.Functions.Collate(searchAll, SQLParams.Latin_General)) ||
EF.Functions.Collate(c.row.PaymentMethod.ToLower(), SQLParams.Latin_General).Contains(EF.Functions.Collate(searchAll, SQLParams.Latin_General)) ||
EF.Functions.Collate(c.row.AccountId.ToString().ToLower(), SQLParams.Latin_General).Contains(EF.Functions.Collate(searchAll, SQLParams.Latin_General)) ||
EF.Functions.Collate(c.row.TableId.ToString().ToLower(), SQLParams.Latin_General).Contains(EF.Functions.Collate(searchAll, SQLParams.Latin_General)) ||
EF.Functions.Collate(c.row.TotalGuest.ToString().ToLower(), SQLParams.Latin_General).Contains(EF.Functions.Collate(searchAll, SQLParams.Latin_General))

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
                        case "invoiceCode":
                            query = query.Where(c => (c.row.InvoiceCode ?? "").Contains(fillter));
                            break;
                        case "totalMoney":
                            query = query.Where(c => c.row.TotalMoney.ToString().Trim().Contains(fillter));
                            break;
                        case "paymentStatus":
                            query = query.Where(c => (c.row.PaymentStatus ?? "").Contains(fillter));
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
                        case "paymentMethod":
                            query = query.Where(c => (c.row.PaymentMethod ?? "").Contains(fillter));
                            break;
                        case "accountId":
                            query = query.Where(c => c.row.AccountId.ToString().Trim().Contains(fillter));
                            break;
                        case "tableId":
                            query = query.Where(c => c.row.TableId.ToString().Trim().Contains(fillter));
                            break;
                        case "totalGuest":
                            query = query.Where(c => c.row.TotalGuest.ToString().Trim().Contains(fillter));
                            break;

                    }
                }
            }

            //3.Query second
            var query2 = query.Select(c => new Invoice()
            {
                Id = c.row.Id,
                InvoiceCode = c.row.InvoiceCode,
                TotalMoney = c.row.TotalMoney,
                PaymentStatus = c.row.PaymentStatus,
                CreatedTime = c.row.CreatedTime,
                Active = c.row.Active,
                PaymentMethod = c.row.PaymentMethod,
                AccountId = c.row.AccountId,
                TableId = c.row.TableId,
                TotalGuest = c.row.TotalGuest,

            });
            //4. Sort
            query2 = query2.OrderByDynamic<Invoice>(orderCritirea, orderDirectionASC ? LinqExtensions.Order.Asc : LinqExtensions.Order.Desc);
            recordFiltered = await query2.CountAsync();
            //5. Return data
            return new DTResult<Invoice>()
            {
                data = await query2.Skip(parameters.Start).Take(parameters.Length).ToListAsync(),
                draw = parameters.Draw,
                recordsFiltered = recordFiltered,
                recordsTotal = recordTotal
            };
        }

        public DatabaseFacade GetDatabase()
        {
            return db.Database;

        }
        public async Task<Invoice> getLastestInvoice()
        {
            // Lấy năm hiện tại
            var currentYear = DateTime.Now.Year;

            // Lấy hóa đơn mới nhất trong năm hiện tại
            var lastInvoice = await db.Invoices
                .Where(i => i.CreatedTime.Year == currentYear)
                .OrderByDescending(i => i.Id)
                .FirstOrDefaultAsync();
            return lastInvoice;

        }

        public async Task<InvoiceVM> InvoiceDetailById(int invoiceId)
        {
            if (db != null)
            {
                var result = await (from row in db.Invoices
                                    where row.Id == invoiceId && row.Active == true
                                    select new InvoiceVM()
                                    {
                                        Id = row.Id,
                                        InvoiceCode = row.InvoiceCode,
                                        TotalMoney = row.TotalMoney,
                                        PaymentStatus = row.PaymentStatus,
                                        CreatedTime = row.CreatedTime,
                                        PaymentMethod = row.PaymentMethod,
                                        AccountId = row.AccountId,
                                        CashierName = (from a in db.Accounts where a.Active == true && a.Id == row.AccountId select a.FullName).FirstOrDefault(),
                                        invoiceDetails = (from d in db.InvoiceDetails
                                                          where d.InvoiceId == row.Id && d.Active == true
                                                          select new InvoiceDetailViewModel()
                                                          {
                                                              Id = d.Id,
                                                              Quantity = d.Quantity,
                                                              InvoiceId = row.Id,
                                                              UnitPrice = d.UnitPrice,
                                                              DishName = (from dish in db.Dishes where dish.Id == d.DishId && dish.Active == true select dish.DishName).FirstOrDefault(),
                                                              DishId = d.DishId
                                                          }).ToList()
                                    }).FirstOrDefaultAsync();
                return result;
            }
            return null;
        }
    }
}


