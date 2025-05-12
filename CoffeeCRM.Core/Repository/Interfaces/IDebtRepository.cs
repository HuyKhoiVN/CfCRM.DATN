
using CoffeeCRM.Data.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CoffeeCRM.Core.Util;
using CoffeeCRM.Data;
using CoffeeCRM.Core.Util.Parameters;
using CoffeeCRM.Data.ViewModels;
using Microsoft.EntityFrameworkCore.Infrastructure;
using CoffeeCRM.Data.DTO;


namespace CoffeeCRM.Core.Repository
{
    public interface IDebtRepository
    {
        Task<List<Debt>> List();

        //Task <List< Debt>> Search(string keyword);

        Task<List<Debt>> GetDebtsBySupplierIdAsync(int supplierId);
        DatabaseFacade GetDatabase();
        Task<List<Debt>> ListPaging(int pageIndex, int pageSize);

        Task<Debt> Detail(long? postId);

        Task<Debt> Add(Debt Debt);

        Task Update(Debt Debt);

        Task Delete(Debt Debt);

        Task<long> DeletePermanently(long? DebtId);

        int Count();

        Task<DTResult<DebtDto>> ListServerSide(DebtDTParameters parameters);
    }
}
