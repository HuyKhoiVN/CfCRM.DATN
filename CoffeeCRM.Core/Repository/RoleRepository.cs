
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

    namespace CoffeeCRM.Core.Repository
        {
            public class RoleRepository: IRoleRepository
                {
                    SysDbContext db;
                    public RoleRepository(SysDbContext _db)
                    {
                        db = _db;
                    }


            public async Task <List<Role>> List()
            {
                            if(db != null)
                    {
                        return await(
                            from row in db.Roles
                        where(row.Active)
                        orderby row.Id descending
                        select row
                        ).ToListAsync();
                    }

                    return null;
                }


            //public async Task <List< Role>> Search(string keyword)
            //{
            //    if(db != null)
            //    {
            //        return await(
            //            from row in db.Roles
            //                        where(row.Active && (row.Name.Contains(keyword) || row.Description.Contains(keyword)))
            //                        orderby row.Id descending
            //                        select row
            //        ).ToListAsync();
            //    }
            //    return null;
            //}


            public async Task <List<Role>> ListPaging(int pageIndex, int pageSize)
            {
                int offSet = 0;
                offSet = (pageIndex - 1) * pageSize;
                if (db != null) {
                    return await(
                        from row in db.Roles
                                    where(row.Active)
                                    orderby row.Id descending
                                    select row
                    ).Skip(offSet).Take(pageSize).ToListAsync();
                }
                return null;
            }


            public async Task <Role> Detail(long ? id)
            {
                if (db != null) {
                    return await db.Roles.FirstOrDefaultAsync(row => row.Active && row.Id == id);
                }
                return null;
            }


            public async Task <Role> Add(Role obj)
            {
                if (db != null) {
                    await db.Roles.AddAsync(obj);
                    await db.SaveChangesAsync();
                    return obj;
                }
                return null;
            }


            public async Task Update(Role obj)
            {
                if (db != null) {
                    //Update that object
                    db.Roles.Attach(obj);
                    db.Entry(obj).Property(x => x.RoleCode).IsModified = true;
db.Entry(obj).Property(x => x.RoleName).IsModified = true;
db.Entry(obj).Property(x => x.Active).IsModified = true;

                    //Commit the transaction
                    await db.SaveChangesAsync();
                }
            }


            public async Task Delete(Role obj)
            {
                if (db != null) {
                    //Update that obj
                    db.Roles.Attach(obj);
                    db.Entry(obj).Property(x => x.Active).IsModified = true;

                    //Commit the transaction
                    await db.SaveChangesAsync();
                }
            }

            public async Task<long> DeletePermanently(long ? objId)
            {
                            int result = 0;

                if (db != null) {
                    //Find the obj for specific obj id
                    var obj = await db.Roles.FirstOrDefaultAsync(x => x.Id == objId);

                    if (obj != null) {
                        //Delete that obj
                        db.Roles.Remove(obj);

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

                if (db != null) {
                    //Find the obj for specific obj id
                    result = (
                        from row in db.Roles
                                    where row.Active
                                    select row
                                ).Count();
                }

                return result;
            }
            public async Task <DTResult<Role>> ListServerSide(RoleDTParameters parameters)
            {
                //0. Options
                string searchAll = parameters.SearchAll.Trim();//Trim text
                string orderCritirea = "Id";//Set default critirea
                int recordTotal, recordFiltered;
                bool orderDirectionASC = true;//Set default ascending
                if (parameters.Order != null) {
                    orderCritirea = parameters.Columns[parameters.Order[0].Column].Data;
                    orderDirectionASC = parameters.Order[0].Dir == DTOrderDir.ASC;
                }
                //1. Join
                var query = from row in db.Roles 

                                    
                    where row.Active
                                    
                    select new {
                        row
                    };
                
                recordTotal = await query.CountAsync();
                //2. Fillter
                if (!String.IsNullOrEmpty(searchAll)) {
                    searchAll = searchAll.ToLower();
                    query = query.Where(c =>
                        EF.Functions.Collate(c.row.Id.ToString().ToLower(), SQLParams.Latin_General).Contains(EF.Functions.Collate(searchAll, SQLParams.Latin_General)) ||
EF.Functions.Collate(c.row.RoleCode.ToLower(), SQLParams.Latin_General).Contains(EF.Functions.Collate(searchAll, SQLParams.Latin_General)) ||
EF.Functions.Collate(c.row.RoleName.ToLower(), SQLParams.Latin_General).Contains(EF.Functions.Collate(searchAll, SQLParams.Latin_General)) ||
EF.Functions.Collate(c.row.CreatedTime.ToCustomString().ToLower(), SQLParams.Latin_General).Contains(EF.Functions.Collate(searchAll, SQLParams.Latin_General)) ||
EF.Functions.Collate(c.row.Active.ToString().ToLower(), SQLParams.Latin_General).Contains(EF.Functions.Collate(searchAll, SQLParams.Latin_General))

                    );
                }
                foreach(var item in parameters.Columns)
                {
                    var fillter = item.Search.Value.Trim();
                    if (fillter.Length > 0) {
                        switch (item.Data) {
                            case "id":
                            query = query.Where(c => c.row.Id.ToString().Trim().Contains(fillter));
                            break;
 case "roleCode":
                query = query.Where(c => (c.row.RoleCode ?? "").Contains(fillter));
                break;
 case "roleName":
                query = query.Where(c => (c.row.RoleName ?? "").Contains(fillter));
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

                        }
                    }
                }
                
                //3.Query second
                var query2 = query.Select(c => new Role()
                {
                    Id = c.row.Id,
RoleCode = c.row.RoleCode,
RoleName = c.row.RoleName,
CreatedTime = c.row.CreatedTime,
Active = c.row.Active,

                });
                //4. Sort
                query2 = query2.OrderByDynamic<Role>(orderCritirea, orderDirectionASC ? LinqExtensions.Order.Asc : LinqExtensions.Order.Desc);
                recordFiltered = await query2.CountAsync();
                //5. Return data
                return new DTResult<Role>()
                {
                    data = await query2.Skip(parameters.Start).Take(parameters.Length).ToListAsync(),
                        draw = parameters.Draw,
                        recordsFiltered = recordFiltered,
                        recordsTotal = recordTotal
                };
            }
        }
    }


