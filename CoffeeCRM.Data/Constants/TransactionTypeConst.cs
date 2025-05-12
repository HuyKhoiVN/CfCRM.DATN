using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CoffeeCRM.Data.Constants
{
    public static class TransactionTypeConst
    {
        public const string IMPORT = "IMPORT";
        public const string EXPORT = "EXPORT";
        public const string INVENTORY = "INVENTORY";
        public const string ADJUSTMENT = "ADJUSTMENT";
        public const string ADJUSTMENT_IN = "ADJUSTMENT_IN";
        public const string ADJUSTMENT_OUT = "ADJUSTMENT_OUT";

        public static List<string> All = new() { IMPORT, EXPORT, ADJUSTMENT, ADJUSTMENT_IN, ADJUSTMENT_OUT } ;
    }

    public static class TransactionStatusConst
    {
        public const string DRAFT = "draft";
        public const string PENDING = "pending";
        public const string APPROVED = "approved";
        public const string COMPLETED = "completed";
        public const string CANCELED = "canceled";
    }
}
