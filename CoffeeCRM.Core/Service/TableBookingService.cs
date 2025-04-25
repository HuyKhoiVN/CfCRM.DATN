
using CoffeeCRM.Data.Model;
using CoffeeCRM.Core.Repository;

using CoffeeCRM.Core.Util;
using CoffeeCRM.Core.Util.Parameters;
using CoffeeCRM.Data.ViewModels;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using CoffeeCRM.Data.DTO;
using CoffeeCRM.Data.Constants;

namespace CoffeeCRM.Core.Service
{
    public class TableBookingService : ITableBookingService
    {
        ITableBookingRepository tableBookingRepository;
        ITableRepository tableRepository;
        public TableBookingService(
            ITableBookingRepository _tableBookingRepository,
            ITableRepository _tableRepository
            )
        {
            tableBookingRepository = _tableBookingRepository;
            tableRepository = _tableRepository;
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

        public async Task<DTResult<TableBookingDto>> ListServerSide(TableBookingDTParameters parameters)
        {
            return await tableBookingRepository.ListServerSide(parameters);
        }

        public async Task Update(TableBooking obj)
        {
            await tableBookingRepository.Update(obj);
        }

        public async Task<bool> AddOrUpdate(TableBookingDto obj)
        {
            if (obj.Id == 0)
            {

                var booking = new TableBooking();

                booking.Deposit = obj.Deposit != null ? obj.Deposit : 0;
                booking.AccountId = obj.AccountId;
                booking.TableId = obj.TableId;
                booking.CustomerName = obj.CustomerName;
                booking.PhoneNumber = obj.PhoneNumber;
                booking.BookingTime = obj.BookingTime;
                booking.Active = true;
                booking.CreatedTime = DateTime.Now;
                booking.CheckinTime = null;
                booking.BookingStatus = TableBookingConst.CONFIRMED;

                await tableBookingRepository.Add(booking);
                return true;
            }
            else
            {
                var updateObj = await tableBookingRepository.Detail(obj.Id);

                updateObj.BookingTime = obj.BookingTime;
                updateObj.CheckinTime = obj.CheckinTime;
                updateObj.Deposit = obj.Deposit != null ? obj.Deposit : 0;
                updateObj.TableId = obj.TableId;
                updateObj.CustomerName = obj.CustomerName;
                updateObj.PhoneNumber = obj.PhoneNumber;
                updateObj.BookingStatus = obj.BookingStatus;
                updateObj.Active = true;

                if(obj.BookingStatus == TableBookingConst.COMPLETED)
                {
                    updateObj.CheckinTime = DateTime.Now;               
                }

                if (obj.BookingStatus != TableBookingConst.CONFIRMED)
                {
                    var tb = await tableRepository.Detail(obj.TableId);
                    tb.TableStatus = TableConst.AVAILABLE;
                    await tableRepository.Update(tb);    
                }

                await tableBookingRepository.Update(updateObj);
                return true;
            }
        }
    }
}

