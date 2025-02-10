
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
    public class InventoryDiscrepancyRepository : BaseRepository<InventoryDiscrepancy>, IInventoryDiscrepancyRepository
    {
        public InventoryDiscrepancyRepository(IUnitOfWork unitOfWork, IMapper mapper) : base(unitOfWork, mapper)
        {
        }
    }
}