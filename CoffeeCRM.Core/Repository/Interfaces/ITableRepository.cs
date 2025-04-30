
using CoffeeCRM.Data.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CoffeeCRM.Core.Util;using CoffeeCRM.Data;
using CoffeeCRM.Core.Util.Parameters;
using CoffeeCRM.Data.ViewModels;
using CoffeeCRM.Data.DTO;


namespace CoffeeCRM.Core.Repository
{
    public interface ITableRepository
    {
        Task<List<Table>> List();
        Task<List<TableDto>> ListDto();

        //Task <List< Table>> Search(string keyword);

        Task<List<Table>> ListPaging(int pageIndex, int pageSize);

        Task<Table> Detail(long? postId);

        Task<Table> Add(Table Table);

        Task Update(Table Table);

        Task Delete(Table Table);

        Task<long> DeletePermanently(long? TableId);

        int Count();

        Task<DTResult<Table>> ListServerSide(TableDTParameters parameters);
    }
}
