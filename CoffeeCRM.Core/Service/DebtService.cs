
using CoffeeCRM.Data.Model;
using CoffeeCRM.Core.Repository;

using CoffeeCRM.Core.Util;
using CoffeeCRM.Data;
using CoffeeCRM.Core.Util.Parameters;
using CoffeeCRM.Data.ViewModels;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using CoffeeCRM.Data.Constants;
using CoffeeCRM.Data.DTO;

namespace CoffeeCRM.Core.Service
{
    public class DebtService : IDebtService
    {
        IDebtRepository debtRepository;
        ICashFlowRepository cashFlowRepository;

        public DebtService(
            IDebtRepository _debtRepository,
            ICashFlowRepository _cashFlowRepository
            )
        {
            debtRepository = _debtRepository;
            cashFlowRepository = _cashFlowRepository;
        }
        public async Task Add(Debt obj)
        {
            obj.Active = true;
            obj.CreatedTime = DateTime.Now;
            await debtRepository.Add(obj);
        }

        public int Count()
        {
            var result = debtRepository.Count();
            return result;
        }

        public async Task Delete(Debt obj)
        {
            obj.Active = false;
            await debtRepository.Delete(obj);
        }

        public async Task<long> DeletePermanently(long? id)
        {
            return await debtRepository.DeletePermanently(id);
        }

        public async Task<Debt> Detail(long? id)
        {
            return await debtRepository.Detail(id);
        }

        public async Task<List<Debt>> List()
        {
            return await debtRepository.List();
        }

        public async Task<List<Debt>> ListPaging(int pageIndex, int pageSize)
        {
            return await debtRepository.ListPaging(pageIndex, pageSize);
        }

        public async Task<DTResult<DebtDto>> ListServerSide(DebtDTParameters parameters)
        {
            return await debtRepository.ListServerSide(parameters);
        }

        //public async Task<List<Debt>> Search(string keyword)
        //{
        //    return await debtRepository.Search(keyword);
        //}

        public async Task Update(Debt obj)
        {
            await debtRepository.Update(obj);
        }

        public async Task RepaymentDebt(int id, int accountId)
        {
            /*
            - Lấy ra khoản nợ
            - Cập nhật isPaid = true;
            - Thêm cashFlow
            */

            using (var transaction = await debtRepository.GetDatabase().BeginTransactionAsync())
            {
                try
                {
                    var debt = await debtRepository.Detail(id);

                    // Đánh dấu khoản nợ đã thanh toán
                    debt.IsPaId = true;
                    debt.PaIdAt = DateTime.Now;

                    await debtRepository.Update(debt);

                    var cashFlow = new CashFlow
                    {
                        TotalMoney = debt.TotalMoney,
                        FlowType = CashFlowConst.CASH_FLOW_TYPE_DEBT_PAYMENT,
                        Note = "Trả nợ cho " + debt.DebtCode,
                        AccountId = accountId,
                        CreatedTime = DateTime.Now,
                        Active = true
                    };
                    await cashFlowRepository.Add(cashFlow);

                    // Commit transaction
                    await transaction.CommitAsync();

                    // Trả về dữ liệu
                    var result = new Dictionary<int, decimal>
                    {
                        { accountId, debt.TotalMoney }
                    };
                }
                catch (Exception ex)
                {
                    // Rollback transaction nếu có lỗi
                    await transaction.RollbackAsync();
                    throw new Exception("Lỗi khi thực hiện thanh toán: " + ex.Message, ex);
                }
            }
        }

    }
}

