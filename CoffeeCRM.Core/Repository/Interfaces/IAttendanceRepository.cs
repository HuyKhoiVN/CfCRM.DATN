
    using CoffeeCRM.Data.Model;
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using CoffeeCRM.Core.Util;
    using CoffeeCRM.Core.Util.Parameters;
    using CoffeeCRM.Data.ViewModels;


    namespace CoffeeCRM.Core.Repository
    {
        public interface IAttendanceRepository
        {
            Task <List< Attendance>> List();

            //Task <List< Attendance>> Search(string keyword);

            Task <List< Attendance>> ListPaging(int pageIndex, int pageSize);

            Task <Attendance> Detail(long ? postId);

            Task <Attendance> Add(Attendance Attendance);

            Task Update(Attendance Attendance);

            Task Delete(Attendance Attendance);

            Task <long> DeletePermanently(long ? AttendanceId);

            int Count();

            Task <DTResult<Attendance>> ListServerSide(AttendanceDTParameters parameters);
        }
    }
