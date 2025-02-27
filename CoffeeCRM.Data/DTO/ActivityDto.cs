using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CoffeeCRM.Data.DTO
{
    public class ActivityDto
    {
        public string ActivityType { get; set; }
        public string ActivityDescription { get; set; }
        public DateTime CreatedTime { get; set; }
    }
}
