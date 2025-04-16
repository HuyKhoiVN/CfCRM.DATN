using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace CoffeeCRM.Core.Helper
{
    public static class FileHelper
    {
        // Danh sách các định dạng ảnh hợp lệ
        public static readonly string[] AllowedImageExtensions = { ".jpg", ".jpeg", ".png" };

        /// <summary>
        /// Lưu file ảnh vào thư mục chỉ định, trả về đường dẫn ảo (/uploads/...)
        /// </summary>
        public static async Task<string> SaveImageAsync(IFormFile file, string folder = "images/avatar", long maxSizeKB = 2048)
        {
            return await SaveFileAsync(file, folder, AllowedImageExtensions, maxSizeKB);
        }

        /// <summary>
        /// Lưu file (có thể là ảnh, pdf, zip, ...) vào thư mục chỉ định, kiểm tra định dạng và size
        /// </summary>
        public static async Task<string> SaveFileAsync(IFormFile file, string folder, string[] allowedExtensions, long maxSizeKB)
        {
            if (file == null || file.Length == 0)
                throw new ArgumentException("File is rỗng.");

            var extension = Path.GetExtension(file.FileName).ToLower();
            if (!allowedExtensions.Contains(extension))
                throw new InvalidOperationException($"Định dạng file không được hỗ trợ ({extension}). Cho phép: {string.Join(", ", allowedExtensions)}");

            if (file.Length > maxSizeKB * 1024)
                throw new InvalidOperationException($"File vượt quá dung lượng cho phép ({maxSizeKB}KB).");

            var fileName = $"{Guid.NewGuid()}{extension}";
            var folderPath = Path.Combine("wwwroot", folder);
            var fullPath = Path.Combine(Directory.GetCurrentDirectory(), folderPath, fileName);

            if (!Directory.Exists(folderPath))
                Directory.CreateDirectory(folderPath);

            using (var stream = new FileStream(fullPath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            // Trả về đường dẫn ảo tương đối cho client dùng (không có wwwroot)
            return $"{folder.Replace("\\", "/")}/{fileName}";
        }
    }
}
