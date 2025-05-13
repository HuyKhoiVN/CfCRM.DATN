
using CoffeeCRM.Data.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CoffeeCRM.Core.Util;
using CoffeeCRM.Data;
using CoffeeCRM.Core.Util.Parameters;
using CoffeeCRM.Data.ViewModels;
using CoffeeCRM.Data.DTO;


namespace CoffeeCRM.Core.Repository
{
    public interface ITableBookingRepository
    {
        Task<List<TableBooking>> List();

        //Task <List< TableBooking>> Search(string keyword);

        Task<List<TableBooking>> ListPaging(int pageIndex, int pageSize);

        Task<TableBooking> Detail(long? postId);

        Task<TableBooking> Add(TableBooking TableBooking);

        Task Update(TableBooking TableBooking);

        Task Delete(TableBooking TableBooking);

        Task<long> DeletePermanently(long? TableBookingId);
        Task<bool> IsBookingTimeConflict(DateTime bookingTime, int tableId, int? excludeId = null);
        int Count();

        Task<DTResult<TableBookingDto>> ListServerSide(TableBookingDTParameters parameters);
    }
}
