
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

namespace CoffeeCRM.Core.Repository
{
    public class NotificationRepository : INotificationRepository
    {
        SysDbContext db;

        public NotificationRepository(SysDbContext _db)
        {
            db = _db;
        }


        public async Task<List<Notification>> List()
        {
            if (db != null)
            {
                return await (
                    from row in db.Notifications
                    where (row.Active == true)
                    orderby row.Id descending
                    select row
                ).ToListAsync();
            }

            return null;
        }


        public async Task<List<Notification>> Search(string keyword)
        {
            if (db != null)
            {
                return await (
                    from row in db.Notifications
                    where (row.Active == true && (row.Name.Contains(keyword) || row.Description.Contains(keyword)))
                    orderby row.Id descending
                    select row
                ).ToListAsync();
            }
            return null;
        }


        public async Task<List<Notification>> ListPaging(int AccountId, int pageIndex, int pageSize)
        {
            int offSet = 0;
            offSet = (pageIndex - 1) * pageSize;
            if (db != null)
            {
                return await (
                    from row in db.Notifications
                    where (row.Active == true && row.AccountId == AccountId)
                    orderby row.Id descending
                    select row
                ).Skip(offSet).Take(pageSize).ToListAsync();
            }
            return null;
        }


        public async Task<Notification> Detail(long? id)
        {
            if (db != null)
            {
                return await db.Notifications.FirstOrDefaultAsync(row => row.Active == true && row.Id == id);
            }
            return null;
        }


        public async Task<Notification> Add(Notification obj)
        {
            if (db != null)
            {
                await db.Notifications.AddAsync(obj);
                await db.SaveChangesAsync();
                return obj;
            }
            return null;
        }


        public async Task Update(Notification obj)
        {
            if (db != null)
            {
                //Update that object
                db.Notifications.Attach(obj);
                db.Entry(obj).Property(x => x.AccountId).IsModified = true;
                db.Entry(obj).Property(x => x.NotificationStatusId).IsModified = true;
                db.Entry(obj).Property(x => x.Name).IsModified = true;
                db.Entry(obj).Property(x => x.Description).IsModified = true;
                db.Entry(obj).Property(x => x.Active).IsModified = false;

                //Commit the transaction
                await db.SaveChangesAsync();
            }
        }


        public async Task Delete(Notification obj)
        {
            if (db != null)
            {
                //Update that obj
                db.Notifications.Attach(obj);
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
                var obj = await db.Notifications.FirstOrDefaultAsync(x => x.Id == objId);

                if (obj != null)
                {
                    //Delete that obj
                    db.Notifications.Remove(obj);

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
                    from row in db.Notifications
                    where row.Active == true
                    select row
                            ).Count();
            }

            return result;
        }
        public async Task<DTResult<NotificationViewModel>> ListServerSide(NotificationDTParameters parameters, int accountLoginId)
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
            var query = from row in db.Notifications
                        join ns in db.NotificationStatuses on row.NotificationStatusId equals ns.Id
                        join acd in db.Accounts on row.AccountId equals acd.Id
                        where row.Active == true && ns.Active == true && acd.Active &&
                              row.AccountId == accountLoginId
                        orderby row.CreatedTime descending
                        select new NotificationViewModel
                        {
                            Id = row.Id,
                            AccountId = row.AccountId,
                            SenderId = row.SenderId,
                            Name = row.Name,
                            Description = row.Description,
                            CreatedTime = row.CreatedTime,
                            ApproveTime = row.ApproveTime,
                            UserCreate = (from us in db.Accounts
                                          where us.Id == row.SenderId && us.Active
                                          select us.FullName).FirstOrDefault() ?? "Người dùng ẩn danh",
                            Photo = db.Accounts.FirstOrDefault(x => x.Id == row.SenderId && x.Active).Photo,
                            NotificationStatusId = row.NotificationStatusId,
                            Url = row.Url
                        };
            recordTotal = await query.CountAsync();
            //2. Fillter
            if (!String.IsNullOrEmpty(searchAll))
            {
                searchAll = searchAll.ToLower();
                query = query.Where(c =>
                    EF.Functions.Collate(c.Id.ToString().ToLower(), SQLParams.Latin_General).Contains(EF.Functions.Collate(searchAll, SQLParams.Latin_General)) ||
                    EF.Functions.Collate(c.AccountId.ToString().ToLower(), SQLParams.Latin_General).Contains(EF.Functions.Collate(searchAll, SQLParams.Latin_General)) ||
                    EF.Functions.Collate(c.Name.ToLower(), SQLParams.Latin_General).Contains(EF.Functions.Collate(searchAll, SQLParams.Latin_General)) ||
                    EF.Functions.Collate(c.Description.ToLower(), SQLParams.Latin_General).Contains(EF.Functions.Collate(searchAll, SQLParams.Latin_General)) ||
                    EF.Functions.Collate(c.CreatedTime.ToString().ToLower(), SQLParams.Latin_General).Contains(EF.Functions.Collate(searchAll, SQLParams.Latin_General))
                );
            }

            //4. Sort
            //var query2 = query.OrderByDynamic<Notification>(orderCritirea, orderDirectionASC ? LinqExtensions.Order.Asc : LinqExtensions.Order.Desc);
            recordFiltered = await query.CountAsync();
            //5. Return data
            return new DTResult<NotificationViewModel>()
            {
                data = await query.Skip(parameters.Start).Take(parameters.Length).ToListAsync(),
                draw = parameters.Draw,
                recordsFiltered = recordFiltered,
                recordsTotal = recordTotal
            };
        }

        public async Task ReadNotification(Notification obj)
        {
            if (db != null)
            {
                //Update that obj
                db.Notifications.Attach(obj);
                db.Entry(obj).Property(x => x.NotificationStatusId).IsModified = true;

                //Commit the transaction
                await db.SaveChangesAsync();
            }
        }

        public async Task<List<NotificationViewModel>> LoadNotificationForIcon(int accountLoginId)
        {
            var query = from row in db.Notifications
                        join ns in db.NotificationStatuses on row.NotificationStatusId equals ns.Id
                        join acd in db.Accounts on row.AccountId equals acd.Id
                        where row.Active == true && ns.Active == true && acd.Active &&
                              row.AccountId == accountLoginId
                        orderby row.CreatedTime descending
                        select new NotificationViewModel
                        {
                            Id = row.Id,
                            AccountId = row.AccountId,
                            SenderId = row.SenderId,
                            Name = row.Name,
                            Description = row.Description,
                            CreatedTime = row.CreatedTime,
                            ApproveTime = row.ApproveTime,
                            UserCreate = (from us in db.Accounts
                                          where us.Id == row.SenderId && us.Active
                                          select us.FullName).FirstOrDefault() ?? "Người dùng ẩn danh",
                            Photo = db.Accounts.FirstOrDefault(x => x.Id == row.SenderId && x.Active).Photo,
                            NotificationStatusId = row.NotificationStatusId,
                            Url = row.Url
                        };
            return await query.Take(7).ToListAsync();
        }
    }
}


