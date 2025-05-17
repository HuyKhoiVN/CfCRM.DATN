using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CoffeeCRM.Data.DTO
{
    public class PopularDishModel
    {
        public int Id { get; set; }
        public string DishCode { get; set; }
        public string DishName { get; set; }
        public string CategoryName { get; set; }
        public decimal Price { get; set; }
        public string Photo { get; set; }
        public int SalesCount { get; set; }
        public DateTime CreatedTime { get; set; }
        public bool Active { get; set; }
    }
}
