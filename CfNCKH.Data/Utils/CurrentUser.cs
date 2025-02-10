using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CfNCKH.Data.Utils
{
    public class CurrentUser : BaseModel
    {
        public int Id { get; set; }
        //public string Id { get; set; }
        public string UserName { get; set; }


        public CurrentUser() : base() { }
        public CurrentUser(object obj) : base(obj) { }
    }
}
