using AutoMapper;
using CoffeeCRM.Data.DTO;
using CoffeeCRM.Data.Model;
using NPOI.SS.Formula.Functions;

namespace CoffeeCRM.Core.Util
{
    public class AutoMapper : Profile
    {

        public AutoMapper()
        {
            CreateMap<Account, AccountProfileResponseDTO>();
        }
    }
}
