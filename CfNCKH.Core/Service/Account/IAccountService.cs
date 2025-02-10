using CfNCKH.Data.ModelDTO;
using CfNCKH.Data.Utils;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CfNCKH.Core.Service.Account
{
    public interface IAccountService
    {
        Task<PagingOutput<AccountDto>> GetAllAccount();
    }
}
