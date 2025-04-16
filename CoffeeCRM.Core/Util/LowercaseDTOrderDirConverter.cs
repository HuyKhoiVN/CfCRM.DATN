using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace CoffeeCRM.Core.Util
{
    public class LowercaseDTOrderDirConverter : JsonConverter<DTOrderDir>
    {
        public override DTOrderDir Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
        {
            // Xử lý nếu kiểu dữ liệu là số nguyên (0,1)
            if (reader.TokenType == JsonTokenType.Number && reader.TryGetInt32(out int intValue))
            {
                return intValue switch
                {
                    0 => DTOrderDir.ASC,
                    1 => DTOrderDir.DESC,
                    _ => throw new JsonException($"Invalid numeric value for DTOrderDir: {intValue}")
                };
            }

            // Xử lý nếu kiểu dữ liệu là chuỗi ("asc", "desc", hoặc "ASC", "DESC")
            if (reader.TokenType == JsonTokenType.String)
            {
                string? value = reader.GetString()?.ToLowerInvariant();
                return value switch
                {
                    "asc" => DTOrderDir.ASC,
                    "desc" => DTOrderDir.DESC,
                    _ => throw new JsonException($"Invalid string value for DTOrderDir: {value}")
                };
            }

            throw new JsonException($"Unexpected token parsing DTOrderDir. Token: {reader.TokenType}");
        }

        public override void Write(Utf8JsonWriter writer, DTOrderDir value, JsonSerializerOptions options)
        {
            writer.WriteStringValue(value.ToString().ToLowerInvariant());
        }
    }


}
