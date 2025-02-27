using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace CoffeeCRM.Data.ViewModels
{
    public abstract class BaseModel
    {
        public BaseModel() { }
        public BaseModel(object obj)
        {
            Mapping(obj);
        }

        public void Mapping(object sourceObj)
        {
            // Check null source object
            if (sourceObj == null)
            {
                return;
            }

            List<PropertyInfo> sourceProperties = sourceObj.GetType().GetProperties().ToList();
            List<PropertyInfo> destProperties = GetType().GetProperties().ToList();
            List<Type> baseType = new List<Type>()
            {
                typeof(Guid), typeof(Guid?), typeof(string), typeof(int), typeof(int?), typeof(long), typeof(long?), typeof(byte), typeof(byte?),
                typeof(short), typeof(short?), typeof(double), typeof(double?), typeof(decimal), typeof(decimal?), typeof(DateTime), typeof(DateTime?),
                typeof(Array), typeof(bool), typeof(bool?), typeof(object)
            };

            // Set value for properties
            foreach (PropertyInfo destProperty in destProperties)
            {
                if (destProperty.PropertyType.IsPublic & baseType.Contains(destProperty.PropertyType))
                {
                    PropertyInfo source = sourceProperties.Where(d => d.Name.Equals(destProperty.Name)).SingleOrDefault();
                    if (source != null && destProperty.CanWrite)
                    {
                        try
                        {
                            destProperty.SetValue(this, source.GetValue(sourceObj));
                        }
                        catch
                        {
                            continue;
                        }
                    }
                }
            }
        }
    }
}
