using AutoMapper;
using CfCRM.Data.Models;
using CfCRM.View.DTO;
using NPOI.SS.Formula.Functions;

namespace CfCRM.View.Util.Extentions
{
    public class AutoMapper : Profile
    {

        public AutoMapper()
        {
            CreateMap<Account, AccountProfileResponseDTO>();
        }
    }
}
