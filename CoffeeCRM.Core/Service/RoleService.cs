
        using CoffeeCRM.Data.Model;
        using CoffeeCRM.Core.Repository;
         
       using CoffeeCRM.Core.Util;
        using CoffeeCRM.Core.Util.Parameters;
        using CoffeeCRM.Data.ViewModels;
        using System;
        using System.Collections.Generic;
        using System.Threading.Tasks;
        
        namespace CoffeeCRM.Core.Service
        {
            public class RoleService : IRoleService
            {
                IRoleRepository roleRepository;
                public RoleService(
                    IRoleRepository _roleRepository
                    )
                {
                    roleRepository = _roleRepository;
                }
                public async Task Add(Role obj)
                {
                    obj.Active = true;
                    obj.CreatedTime = DateTime.Now;
                    await roleRepository.Add(obj);
                }
        
                public int Count()
                {
                    var result = roleRepository.Count();
                    return result;
                }
        
                public async Task Delete(Role obj)
                {
                    obj.Active = false;
                    await roleRepository.Delete(obj);
                }
        
                public async Task<long> DeletePermanently(long? id)
                {
                    return await roleRepository.DeletePermanently(id);
                }
        
                public async Task<Role> Detail(long? id)
                {
                    return await roleRepository.Detail(id);
                }
        
                public async Task<List<Role>> List()
                {
                    return await roleRepository.List();
                }
        
                public async Task<List<Role>> ListPaging(int pageIndex, int pageSize)
                {
                    return await roleRepository.ListPaging(pageIndex, pageSize);
                }
        
                public async Task<DTResult<Role>> ListServerSide(RoleDTParameters parameters)
                {
                    return await roleRepository.ListServerSide(parameters);
                }
        
                //public async Task<List<Role>> Search(string keyword)
                //{
                //    return await roleRepository.Search(keyword);
                //}
        
                public async Task Update(Role obj)
                {
                    await roleRepository.Update(obj);
                }
            }
        }
    
    