
using CoffeeCRM.Data.Model;
using CoffeeCRM.Core.Repository;

using CoffeeCRM.Core.Util;using CoffeeCRM.Data;
using CoffeeCRM.Core.Util.Parameters;
using CoffeeCRM.Data.ViewModels;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using CoffeeCRM.Data.DTO;

namespace CoffeeCRM.Core.Service
{
    public class TableService : ITableService
    {
        ITableRepository tableRepository;
        public TableService(
            ITableRepository _tableRepository
            )
        {
            tableRepository = _tableRepository;
        }
        public async Task Add(Table obj)
        {
            obj.Active = true;
            obj.CreatedTime = DateTime.Now;
            await tableRepository.Add(obj);
        }

        public int Count()
        {
            var result = tableRepository.Count();
            return result;
        }

        public async Task Delete(Table obj)
        {
            obj.Active = false;
            await tableRepository.Delete(obj);
        }

        public async Task<long> DeletePermanently(long? id)
        {
            return await tableRepository.DeletePermanently(id);
        }

        public async Task<Table> Detail(long? id)
        {
            return await tableRepository.Detail(id);
        }

        public async Task<List<Table>> List()
        {
            return await tableRepository.List();
        }

        public async Task<List<TableDto>> ListDto()
        {
            return await tableRepository.ListDto();
        }

        public async Task<List<Table>> ListPaging(int pageIndex, int pageSize)
        {
            return await tableRepository.ListPaging(pageIndex, pageSize);
        }

        public async Task<DTResult<Table>> ListServerSide(TableDTParameters parameters)
        {
            return await tableRepository.ListServerSide(parameters);
        }

        //public async Task<List<Table>> Search(string keyword)
        //{
        //    return await tableRepository.Search(keyword);
        //}

        public async Task Update(Table obj)
        {
            await tableRepository.Update(obj);
        }
    }
}

