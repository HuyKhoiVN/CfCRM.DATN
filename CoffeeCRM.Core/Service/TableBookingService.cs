
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
            public class TableBookingService : ITableBookingService
            {
                ITableBookingRepository tableBookingRepository;
                public TableBookingService(
                    ITableBookingRepository _tableBookingRepository
                    )
                {
                    tableBookingRepository = _tableBookingRepository;
                }
                public async Task Add(TableBooking obj)
                {
                    obj.Active = true;
                    obj.CreatedTime = DateTime.Now;
                    await tableBookingRepository.Add(obj);
                }
        
                public int Count()
                {
                    var result = tableBookingRepository.Count();
                    return result;
                }
        
                public async Task Delete(TableBooking obj)
                {
                    obj.Active = false;
                    await tableBookingRepository.Delete(obj);
                }
        
                public async Task<long> DeletePermanently(long? id)
                {
                    return await tableBookingRepository.DeletePermanently(id);
                }
        
                public async Task<TableBooking> Detail(long? id)
                {
                    return await tableBookingRepository.Detail(id);
                }
        
                public async Task<List<TableBooking>> List()
                {
                    return await tableBookingRepository.List();
                }
        
                public async Task<List<TableBooking>> ListPaging(int pageIndex, int pageSize)
                {
                    return await tableBookingRepository.ListPaging(pageIndex, pageSize);
                }
        
                public async Task<DTResult<TableBooking>> ListServerSide(TableBookingDTParameters parameters)
                {
                    return await tableBookingRepository.ListServerSide(parameters);
                }
        
                //public async Task<List<TableBooking>> Search(string keyword)
                //{
                //    return await tableBookingRepository.Search(keyword);
                //}
        
                public async Task Update(TableBooking obj)
                {
                    await tableBookingRepository.Update(obj);
                }
            }
        }
    
    