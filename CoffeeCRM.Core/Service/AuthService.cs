using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using CoffeeCRM.Core.Repository;
using CoffeeCRM.Data.Constants;
using CoffeeCRM.Data.DTO;
using CoffeeCRM.Data.Model;
using Microsoft.IdentityModel.Tokens;

namespace CoffeeCRM.Core.Service
{
    public class AuthService : IAuthService
    {
        private readonly IAccountRepository _accountRepository;

        public AuthService(IAccountRepository accountRepository)
        {
            _accountRepository = accountRepository;
        }
     
    }
}
