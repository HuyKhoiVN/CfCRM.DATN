using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CoffeeCRM.Core.Repository.Interfaces;
using CoffeeCRM.Data.Model;
using CoffeeCRM.Data.ViewModels;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using Microsoft.EntityFrameworkCore;

namespace CoffeeCRM.Core.Repository
{
    public class InvoiceDetailRepository : IInvoiceDetailRepository
    {
        SysDbContext db;
        public InvoiceDetailRepository(SysDbContext _db)
        {
            db = _db;
        }


        public async Task<List<InvoiceDetail>> List()
        {
            if (db != null)
            {
                return await (
                    from row in db.InvoiceDetails
                    where (row.Active == true)
                    orderby row.Id descending
                    select row
                ).ToListAsync();
            }

            return null;
        }

        public async Task<List<InvoiceDetailViewModel>> ListByInvoideId(int id)
        {
            if (db != null)
            {
                return await (
                    from row in db.InvoiceDetails
                    join d in db.Dishes on row.DishId equals d.Id
                    where row.Active && row.InvoiceId == id && d.Active
                    orderby row.Id descending
                    select new InvoiceDetailViewModel()
                    {
                        Id = row.Id,
                        InvoiceId = row.InvoiceId,
                        DishId = row.DishId,
                        Quantity = row.Quantity,
                        DishName = d.DishName,
                        UnitPrice = d.Price
                    }
                ).ToListAsync();
            }

            return null;
        }

        public async Task<List<InvoiceDetail>> ListPaging(int pageIndex, int pageSize)
        {
            int offSet = 0;
            offSet = (pageIndex - 1) * pageSize;
            if (db != null)
            {
                return await (
                    from row in db.InvoiceDetails
                    where (row.Active == true)
                    orderby row.Id descending
                    select row
                ).Skip(offSet).Take(pageSize).ToListAsync();
            }
            return null;
        }


        public async Task<InvoiceDetail> Detail(long? id)
        {
            if (db != null)
            {
                return await db.InvoiceDetails.FirstOrDefaultAsync(row => row.Active == true && row.Id == id);
            }
            return null;
        }


        public async Task<InvoiceDetail> Add(InvoiceDetail obj)
        {
            if (db != null)
            {
                await db.InvoiceDetails.AddAsync(obj);
                await db.SaveChangesAsync();
                return obj;
            }
            return null;
        }


        public async Task Update(InvoiceDetail obj)
        {
            if (db != null)
            {
                //Update that object
                db.InvoiceDetails.Attach(obj);
                db.Entry(obj).Property(x => x.Quantity).IsModified = true;
                db.Entry(obj).Property(x => x.UnitPrice).IsModified = true;
                db.Entry(obj).Property(x => x.Active).IsModified = true;
                db.Entry(obj).Property(x => x.InvoiceId).IsModified = true;
                db.Entry(obj).Property(x => x.DishId).IsModified = true;

                //Commit the transaction
                await db.SaveChangesAsync();
            }
        }

        public async Task Delete(InvoiceDetail obj)
        {
            if (db != null)
            {
                //Update that obj
                db.InvoiceDetails.Attach(obj);
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
                var obj = await db.InvoiceDetails.FirstOrDefaultAsync(x => x.Id == objId);

                if (obj != null)
                {
                    //Delete that obj
                    db.InvoiceDetails.Remove(obj);

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
                    from row in db.InvoiceDetails
                    where row.Active == true
                    select row
                            ).Count();
            }

            return result;
        }
    }
}
