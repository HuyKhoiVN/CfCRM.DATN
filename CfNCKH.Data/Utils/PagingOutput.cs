using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CfNCKH.Data.Utils
{
    public class PagingOutput<T>
    {
        public List<T> Data { get; set; }

        public int PageSize { get; set; }

        public int PageIndex { get; set; }

        public int TotalRecords { get; set; }
        public int RecordFiltered { get; set; }

        public string Message { get; set; }

        public int StatusCode { get; set; }
    }
}
