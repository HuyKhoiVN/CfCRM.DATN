namespace CoffeeCRM.Data.ViewModels
{
    public class AccountViewModel
    {
        public int Id { get; set; }
        public string? AccountCode { get; set; }
        public string Username { get; set; } = null!;
        public string Password { get; set; } = null!;
        public string FullName { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string? Photo { get; set; }
        public DateTime Dob { get; set; }
        public string PhoneNumber { get; set; } = null!;
        public DateTime CreatedTime { get; set; }
        public bool Active { get; set; }
        public int RoleId { get; set; }
        public string? RoleName { get; set; }
    }
}
