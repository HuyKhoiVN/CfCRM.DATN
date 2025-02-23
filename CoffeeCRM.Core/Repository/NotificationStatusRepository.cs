
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
    public class NotificationStatusRepository : INotificationStatusRepository
    {
        SysDbContext db;
        public NotificationStatusRepository(SysDbContext _db)
        {
            db = _db;
        }


        public async Task<List<NotificationStatus>> List()
        {
            if (db != null)
            {
                return await (
                    from row in db.NotificationStatuses
                    where (row.Active == true)
                    orderby row.Id descending
                    select row
                ).ToListAsync();
            }

            return null;
        }


        public async Task<List<NotificationStatus>> Search(string keyword)
        {
            if (db != null)
            {
                return await (
                    from row in db.NotificationStatuses
                    where (row.Active == true && (row.Name.Contains(keyword) || row.Description.Contains(keyword)))
                    orderby row.Id descending
                    select row
                ).ToListAsync();
            }
            return null;
        }


        public async Task<List<NotificationStatus>> ListPaging(int pageIndex, int pageSize)
        {
            int offSet = 0;
            offSet = (pageIndex - 1) * pageSize;
            if (db != null)
            {
                return await (
                    from row in db.NotificationStatuses
                    where (row.Active == true)
                    orderby row.Id descending
                    select row
                ).Skip(offSet).Take(pageSize).ToListAsync();
            }
            return null;
        }


        public async Task<NotificationStatus> Detail(long? id)
        {
            if (db != null)
            {
                return await db.NotificationStatuses.FirstOrDefaultAsync(row => row.Active == true && row.Id == id);
            }
            return null;
        }


        public async Task<NotificationStatus> Add(NotificationStatus obj)
        {
            if (db != null)
            {
                await db.NotificationStatuses.AddAsync(obj);
                await db.SaveChangesAsync();
                return obj;
            }
            return null;
        }


        public async Task Update(NotificationStatus obj)
        {
            if (db != null)
            {
                //Update that object
                db.NotificationStatuses.Attach(obj);
                db.Entry(obj).Property(x => x.Name).IsModified = true;
                db.Entry(obj).Property(x => x.Description).IsModified = true;
                db.Entry(obj).Property(x => x.Active).IsModified = false;

                //Commit the transaction
                await db.SaveChangesAsync();
            }
        }


        public async Task Delete(NotificationStatus obj)
        {
            if (db != null)
            {
                //Update that obj
                db.NotificationStatuses.Attach(obj);
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
                var obj = await db.NotificationStatuses.FirstOrDefaultAsync(x => x.Id == objId);

                if (obj != null)
                {
                    //Delete that obj
                    db.NotificationStatuses.Remove(obj);

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
                    from row in db.NotificationStatuses
                    where row.Active == true
                    select row
                            ).Count();
            }

            return result;
        }
    }
}


