
    using CoffeeCRM.Data.Model;
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using CoffeeCRM.Core.Util;using CoffeeCRM.Data;
    using CoffeeCRM.Core.Util.Parameters;
    using CoffeeCRM.Data.ViewModels;


    namespace CoffeeCRM.Core.Repository
    {
        public interface IRoleRepository
        {
            Task <List< Role>> List();

            //Task <List< Role>> Search(string keyword);

            Task <List< Role>> ListPaging(int pageIndex, int pageSize);

            Task <Role> Detail(long ? postId);

            Task <Role> Add(Role Role);

            Task Update(Role Role);

            Task Delete(Role Role);

            Task <long> DeletePermanently(long ? RoleId);

            int Count();

            Task <DTResult<Role>> ListServerSide(RoleDTParameters parameters);
        }
    }
