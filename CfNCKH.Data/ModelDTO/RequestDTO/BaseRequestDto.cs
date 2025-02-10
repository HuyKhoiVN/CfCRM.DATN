using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CfNCKH.Data.ModelDTO
{
    public  class BaseRequestDto
    {
        public int PageIndex { get; set; }
        public int PageSize { get; set; }
        //public string OperationId { get; set; } //Id của Menu
        public SortProperty SortProperty { get; set; }
        public List<SearchProperty> SearchProperty { get; set; }
        public string Freetext { get; set; }
        //public int? PageIndex { get; set; } = 0;
        //public int? PageSize { get; set; } = 10;
    }

    public class SortProperty
    {
        public string PropertyName { get; set; }
        public string SortType { get; set; }
    }

    public class SearchProperty
    {
        public string PropertyName { get; set; }
        public string SearchType { get; set; }
        public string Value { get; set; }
    }

}
