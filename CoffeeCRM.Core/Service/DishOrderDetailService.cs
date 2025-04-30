
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
    public class DishOrderDetailService : IDishOrderDetailService
    {
        IDishOrderDetailRepository dishOrderDetailRepository;
        public DishOrderDetailService(
            IDishOrderDetailRepository _dishOrderDetailRepository
            )
        {
            dishOrderDetailRepository = _dishOrderDetailRepository;
        }
        public async Task Add(DishOrderDetail obj)
        {
            obj.Active = true;
            obj.CreatedTime = DateTime.Now;
            await dishOrderDetailRepository.Add(obj);
        }

        public int Count()
        {
            var result = dishOrderDetailRepository.Count();
            return result;
        }

        public async Task Delete(DishOrderDetail obj)
        {
            obj.Active = false;
            await dishOrderDetailRepository.Delete(obj);
        }

        public async Task<long> DeletePermanently(long? id)
        {
            return await dishOrderDetailRepository.DeletePermanently(id);
        }

        public async Task<DishOrderDetail> Detail(long? id)
        {
            return await dishOrderDetailRepository.Detail(id);
        }

        public async Task<List<DishOrderDetail>> List()
        {
            return await dishOrderDetailRepository.List();
        }

        public async Task<List<DishOrderDetail>> ListPaging(int pageIndex, int pageSize)
        {
            return await dishOrderDetailRepository.ListPaging(pageIndex, pageSize);
        }

        public async Task<DTResult<DishOrderDetail>> ListServerSide(DishOrderDetailDTParameters parameters)
        {
            return await dishOrderDetailRepository.ListServerSide(parameters);
        }

        public async Task<List<DishOrderDetailViewModel>> ListDishOrderInvoice(int tableId)
        {
            return await dishOrderDetailRepository.ListDishOrderInvoice(tableId);
        }
        public async Task<List<DishOrderDetailViewModel>> ListByOrderId(int id)
        {
            return await dishOrderDetailRepository.ListByOrderId(id);
        }

        public async Task Update(DishOrderDetail obj)
        {
            await dishOrderDetailRepository.Update(obj);
        }
    }
}

