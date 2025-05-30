﻿using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CoffeeCRM.Core.Util
{
    public static class CodeConnvert
    {
        public static string ConvertToCode(string input)
        {
            if (string.IsNullOrWhiteSpace(input))
                return string.Empty;

            // Chuẩn hóa về chữ thường
            input = input.ToLower();

            // Loại bỏ dấu tiếng Việt
            string normalizedString = input.Normalize(NormalizationForm.FormD);
            StringBuilder stringBuilder = new StringBuilder();

            foreach (var c in normalizedString)
            {
                var unicodeCategory = CharUnicodeInfo.GetUnicodeCategory(c);
                if (unicodeCategory != UnicodeCategory.NonSpacingMark)
                {
                    stringBuilder.Append(c);
                }
            }

            // Loại bỏ khoảng trắng và trả về chuỗi không dấu
            return stringBuilder.ToString().Normalize(NormalizationForm.FormC).Replace(" ", "");
        }
    }
}
