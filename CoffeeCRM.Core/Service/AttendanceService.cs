
        using CoffeeCRM.Data.Model;
        using CoffeeCRM.Core.Repository;
         
       using CoffeeCRM.Core.Util;using CoffeeCRM.Data;
        using CoffeeCRM.Core.Util.Parameters;
        using CoffeeCRM.Data.ViewModels;
        using System;
        using System.Collections.Generic;
        using System.Threading.Tasks;
        
        namespace CoffeeCRM.Core.Service
        {
            public class AttendanceService : IAttendanceService
            {
                IAttendanceRepository attendanceRepository;
                public AttendanceService(
                    IAttendanceRepository _attendanceRepository
                    )
                {
                    attendanceRepository = _attendanceRepository;
                }
                public async Task Add(Attendance obj)
                {
                    obj.Active = true;
                    obj.CreatedTime = DateTime.Now;
                    await attendanceRepository.Add(obj);
                }
        
                public int Count()
                {
                    var result = attendanceRepository.Count();
                    return result;
                }
        
                public async Task Delete(Attendance obj)
                {
                    obj.Active = false;
                    await attendanceRepository.Delete(obj);
                }
        
                public async Task<long> DeletePermanently(long? id)
                {
                    return await attendanceRepository.DeletePermanently(id);
                }
        
                public async Task<Attendance> Detail(long? id)
                {
                    return await attendanceRepository.Detail(id);
                }
        
                public async Task<List<Attendance>> List()
                {
                    return await attendanceRepository.List();
                }
        
                public async Task<List<Attendance>> ListPaging(int pageIndex, int pageSize)
                {
                    return await attendanceRepository.ListPaging(pageIndex, pageSize);
                }
        
                public async Task<DTResult<Attendance>> ListServerSide(AttendanceDTParameters parameters)
                {
                    return await attendanceRepository.ListServerSide(parameters);
                }
        
                //public async Task<List<Attendance>> Search(string keyword)
                //{
                //    return await attendanceRepository.Search(keyword);
                //}
        
                public async Task Update(Attendance obj)
                {
                    await attendanceRepository.Update(obj);
                }
            }
        }
    
    