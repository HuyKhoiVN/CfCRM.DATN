
using AutoMapper;
using CfNCKH.Core.BaseCore;
using CfNCKH.Data.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CfNCKH.Core.Repository
{
    public class StockTransactionDetailRepository : BaseRepository<StockTransactionDetail>, IStockTransactionDetailRepository
    {
        public StockTransactionDetailRepository(IUnitOfWork unitOfWork, IMapper mapper) : base(unitOfWork, mapper)
        {
        }
    }
}