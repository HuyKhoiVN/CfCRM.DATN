using CoffeeCRM.Data.DTO;

namespace CoffeeCRM.Core.Util
{
    public class SignInResponse
    {
        /// <summary>
        /// Authorization token
        /// </summary>
        public string AccessToken { get; set; } = null!;

        public AccountProfileResponseDTO Profile { get; set; } = null!;
    }
}
