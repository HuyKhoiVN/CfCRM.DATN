using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using CoffeeCRM.Core.Repository.Interfaces;
using CoffeeCRM.Data.Model;
using Microsoft.EntityFrameworkCore;
using SkiaSharp;
using ZXing;

namespace CoffeeCRM.Core.Repository
{
    public class DraftDetailRepository : IDraftDetailRepository
    {
        SysDbContext db;
        public DraftDetailRepository(SysDbContext _db)
        {
            db = _db;
        }


        public async Task<List<StockTransactionDraftDetail>> List()
        {
            if (db != null)
            {
                return await (
                    from row in db.StockTransactionDraftDetails
                    orderby row.Id descending
                    select row
                ).ToListAsync();
            }

            return null;
        }


        //public async Task <List< StockTransactionDraftDetail>> Search(string keyword)
        //{
        //    if(db != null)
        //    {
        //        return await(
        //            from row in db.StockTransactionDraftDetails
        //                        where(row.Active && (row.Name.Contains(keyword) || row.Description.Contains(keyword)))
        //                        orderby row.Id descending
        //                        select row
        //        ).ToListAsync();
        //    }
        //    return null;
        //}


        public async Task<List<StockTransactionDraftDetail>> ListPaging(int pageIndex, int pageSize)
        {
            int offSet = 0;
            offSet = (pageIndex - 1) * pageSize;
            if (db != null)
            {
                return await (
                    from row in db.StockTransactionDraftDetails
                    orderby row.Id descending
                    select row
                ).Skip(offSet).Take(pageSize).ToListAsync();
            }
            return null;
        }


        public async Task<StockTransactionDraftDetail> Detail(long? id)
        {
            if (db != null)
            {
                return await db.StockTransactionDraftDetails.FirstOrDefaultAsync(row => row.Id == id);
            }
            return null;
        }


        public async Task<StockTransactionDraftDetail> Add(StockTransactionDraftDetail obj)
        {
            if (db != null)
            {
                await db.StockTransactionDraftDetails.AddAsync(obj);
                await db.SaveChangesAsync();
                return obj;
            }
            return null;
        }


        public async Task Update(StockTransactionDraftDetail obj)
        {
            if (db != null)
            {
                //Update that object
                db.StockTransactionDraftDetails.Attach(obj);
                db.Entry(obj).Property(x => x.StockTransactionId).IsModified = true;
                db.Entry(obj).Property(x => x.IngredientId).IsModified = true;
                db.Entry(obj).Property(x => x.Quantity).IsModified = true;
                db.Entry(obj).Property(x => x.UnitPrice).IsModified = true;
                db.Entry(obj).Property(x => x.ExpirationDate).IsModified = true;
                db.Entry(obj).Property(x => x.Note).IsModified = true;
                db.Entry(obj).Property(x => x.CreateNewBatch).IsModified = true;

                //Commit the transaction
                await db.SaveChangesAsync();
            }
        }


        public async Task Delete(StockTransactionDraftDetail obj)
        {
            if (db != null)
            {
                var dt = await db.StockTransactionDraftDetails.FirstOrDefaultAsync(x => x.Id == obj.Id);

                if (dt != null)
                {
                    //Delete that obj
                    db.StockTransactionDraftDetails.Remove(dt);

                    //Commit the transaction
                    await db.SaveChangesAsync();
                }

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
                var obj = await db.StockTransactionDraftDetails.FirstOrDefaultAsync(x => x.Id == objId);

                if (obj != null)
                {
                    //Delete that obj
                    db.StockTransactionDraftDetails.Remove(obj);

                    //Commit the transaction
                    result = await db.SaveChangesAsync();
                }
                return result;
            }

            return result;
        }

        public async Task<List<StockTransactionDraftDetail>> GetByTransactionId(int transactionId)
        {
            return await db.StockTransactionDraftDetails
                .Where(x => x.StockTransactionId == transactionId)
                .ToListAsync();
        }

        public async Task DeleteByTransactionId(int transactionId)
        {
            var details = await db.StockTransactionDraftDetails
                .Where(x => x.StockTransactionId == transactionId)
                .ToListAsync();

            if (details != null && details.Any())
            {
                db.StockTransactionDraftDetails.RemoveRange(details);
                await db.SaveChangesAsync();
            }
        }

        public int Count()
        {
            int result = 0;

            if (db != null)
            {
                //Find the obj for specific obj id
                result = (
                    from row in db.StockTransactionDraftDetails
                    select row
                            ).Count();
            }

            return result;
        }
    }
}
