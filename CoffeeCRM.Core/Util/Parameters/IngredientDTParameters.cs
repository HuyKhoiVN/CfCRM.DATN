using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CoffeeCRM.Core.Util.Parameters
{
    public class IngredientDTParameters : DTParameters
    {
        public string SearchAll { get; set; } = "";
        public int? CategoryId { get; set; } = null;
        public bool? Warning { get; set; } = false;
    }
}