
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
            public class UnitService : IUnitService
            {
                IUnitRepository unitRepository;
                public UnitService(
                    IUnitRepository _unitRepository
                    )
                {
                    unitRepository = _unitRepository;
                }
                public async Task Add(Unit obj)
                {
                    obj.Active = true;
                    obj.CreatedTime = DateTime.Now;
                    await unitRepository.Add(obj);
                }
        
                public int Count()
                {
                    var result = unitRepository.Count();
                    return result;
                }
        
                public async Task Delete(Unit obj)
                {
                    obj.Active = false;
                    await unitRepository.Delete(obj);
                }
        
                public async Task<long> DeletePermanently(long? id)
                {
                    return await unitRepository.DeletePermanently(id);
                }
        
                public async Task<Unit> Detail(long? id)
                {
                    return await unitRepository.Detail(id);
                }
        
                public async Task<List<Unit>> List()
                {
                    return await unitRepository.List();
                }
        
                public async Task<List<Unit>> ListPaging(int pageIndex, int pageSize)
                {
                    return await unitRepository.ListPaging(pageIndex, pageSize);
                }
        
                public async Task<DTResult<Unit>> ListServerSide(UnitDTParameters parameters)
                {
                    return await unitRepository.ListServerSide(parameters);
                }
        
                //public async Task<List<Unit>> Search(string keyword)
                //{
                //    return await unitRepository.Search(keyword);
                //}
        
                public async Task Update(Unit obj)
                {
                    await unitRepository.Update(obj);
                }
            }
        }
    
    