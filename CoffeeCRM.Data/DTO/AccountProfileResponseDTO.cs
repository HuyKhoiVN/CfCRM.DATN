namespace CoffeeCRM.Data.DTO
{
    public class AccountProfileResponseDTO
    {
        public long Id { get; set; }
        public long RoleId { get; set; }
        public string? RoleName { get; set; }
        public string FullName { get; set; } = null!;
        public string? Photo { get; set; }
        public string Username { get; set; } = null!;
        public string? Email { get; set; } = null!;
    }
}
