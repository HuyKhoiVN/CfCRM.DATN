using System.Security.Cryptography;
using System.Text;

namespace CoffeeCRM.Core.Util
{
    public class SecurityUtil
    {
        //Phân quyền api
        public static bool AuthorizeRequestSimple(string RequestedURL, int AccountId, int RoleId)
        {
            RequestedURL = RequestedURL.ToLower();
            bool isAuthorizingNeeded = false;
            bool result = true;

            string entityRequested = "";
            string resourceRequested = "";
            string actionRequested = "";

            try
            {
                if (RequestedURL.IndexOf("/") == 0) RequestedURL = RequestedURL.Substring(1);
                entityRequested = RequestedURL.Substring(0, RequestedURL.IndexOf("/"));
                string temp = RequestedURL.Substring(RequestedURL.IndexOf("/") + 1);
                resourceRequested = temp.Substring(0, temp.IndexOf("/"));
                actionRequested = temp.Substring(temp.IndexOf("/") + 1);
            }
            catch (Exception) { }

            //Nếu tài nguyên được yêu cầu là API --> cần xác thực
            if (resourceRequested == "api")
            {
                isAuthorizingNeeded = true;
            }

            //Nếu không cần kiểm tra thì ngừng
            if (isAuthorizingNeeded == false) return result;

            //List
            if (actionRequested == "list")
            {
                //Cho phép truy cập trừ trang account
                if (entityRequested == "account")
                {
                    //if(RoleId == SystemConstant.ROLE_UNVERIFIED_USER || RoleId == SystemConstant.ROLE_VERIFIED_USER)
                    //{
                    //    result = false;
                    //}
                }
            }

            //Add
            if (actionRequested == "add")
            {
                if (AccountId == 0)
                {
                    //result = false;
                    result = true;

                    //Không cho phép trừ: (cần hoàn thiện sau)
                    //activitylog
                    //contact
                    //subscribe
                    if (
                        entityRequested == "activitylog" ||
                        entityRequested == "contact" ||
                        entityRequested == "subscribe"
                    ) result = true;
                }
            }

            //Update
            if (actionRequested == "update")
            {
                if (AccountId == 0)
                {
                    result = false;
                }
            }

            //Delete
            if (actionRequested == "delete")
            {
                if (AccountId == 0)
                {
                    result = false;
                }
            }

            return result;
        }

        //public static bool AuthorizeRequest(string requestedURL, List<RoleRight> listRoleRightsByRoleId, List<Right> listRights)
        //{
        //    bool result = true;
        //    if (requestedURL.Contains("DeletePermanently"))
        //    {
        //        result = false;
        //        return result;
        //    }

        //    int RightId = GetRightsIdFromRequestedURL(requestedURL, listRights);

        //    if (RightId == 0)
        //    {
        //        //Không cần quyền --> Cho phép truy cập
        //        return result;
        //    }
        //    else
        //    {
        //        //Cần quyền --> Kiểm tra truy cập
        //        result = false;

        //        if (listRoleRightsByRoleId.Count <= 0)
        //        {
        //            //User không có danh sách quyền --> Chặn truy cập
        //            return result;
        //        }
        //        else
        //        {
        //            //User  có danh sách quyền --> Kiểm tra
        //            for (int i = 0; i < listRoleRightsByRoleId.Count; i++)
        //            {
        //                if (listRoleRightsByRoleId[i].RightsId == RightId)
        //                {
        //                    //Đã tìm thấy quyền
        //                    result = true;
        //                    break;
        //                }
        //            }
        //        }
        //    }

        //    return result;
        //}

        //public static bool AuthorizeRequestByToken(string requestedURL, List<RoleRight> listRoleRights, List<Right> listRights, int? RoleId)
        //{
        //    bool result = true;
        //    if (requestedURL.Contains("DeletePermanently"))
        //    {
        //        result = false;
        //        return result;
        //    }

        //    int RightId = GetRightsIdFromRequestedURL(requestedURL, listRights);

        //    if (RightId == 0)
        //    {
        //        //Không cần quyền --> Cho phép truy cập
        //        return result;
        //    }
        //    else
        //    {
        //        //Cần quyền --> Kiểm tra truy cập
        //        result = false;

        //        if (listRoleRights.Count <= 0)
        //        {
        //            //User không có danh sách quyền --> Chặn truy cập
        //            return result;
        //        }
        //        else
        //        {
        //            //User  có danh sách quyền --> Kiểm tra
        //            for (int i = 0; i < listRoleRights.Count; i++)
        //            {
        //                if (listRoleRights[i].RightsId == RightId && listRoleRights[i].RoleId == RoleId)
        //                {
        //                    //Đã tìm thấy quyền
        //                    result = true;
        //                    break;
        //                }
        //            }
        //        }
        //    }

            //    return result;
            //}
            //public static int GetRightsIdFromRequestedURL(string requestedURL, List<Right> listRights)
            //{
            //    int RightId = 0;
            //    requestedURL = requestedURL.Substring(1);
            //    //Get RightId from RequestURL and listRight
            //    if (listRights != null)
            //    {
            //        RightId = (int)listRights.Where(x => x.Url.ToLower().Trim() == requestedURL.ToLower().Trim()).Select(x => x.Id).FirstOrDefault();
            //    }
            //    return RightId;
            //}

            //Phân quyền trang
            //public static bool AuthorizeAdminPage(string requestedURL, List<RoleMenu> listRoleMenuByRoleId, List<Menu> listMenu)
            //{
            //    bool result = true;
            //    if (requestedURL.Contains("DeletePermanently"))
            //    {
            //        result = false;
            //        return result;
            //    }
            //    //Xu ly requestUrl
            //    requestedURL = requestedURL.Substring(1, requestedURL.Length - 1);
            //    //Xu ly listMenu
            //    List<Menu> newListMenu = new List<Menu>();
            //    if (listMenu != null)
            //    {
            //        for (int i = 0; i < listMenu.Count; i++)
            //        {
            //            if (listMenu[i].Url == null)
            //            {
            //                continue;
            //            }
            //            else if (listMenu[i].GroupId == 3 && listMenu[i].Url.Length != 0)
            //            {
            //                newListMenu.Add(listMenu[i]);
            //            }
            //        }
            //    }


            //    int MenuId = GetMenuIdFromRequestedURL(requestedURL, newListMenu);

            //    if (MenuId == 0)
            //    {
            //        //Không cần quyền --> Cho phép truy cập
            //        return result;
            //    }
            //    else
            //    {
            //        //Cần quyền --> Kiểm tra truy cập
            //        result = false;

            //        if (listRoleMenuByRoleId.Count <= 0)
            //        {
            //            //User không có danh sách quyền --> Chặn truy cập
            //            return result;
            //        }
            //        else
            //        {
            //            //User  có danh sách quyền --> Kiểm tra
            //            for (int i = 0; i < listRoleMenuByRoleId.Count; i++)
            //            {
            //                if (listRoleMenuByRoleId[i].MenuId == MenuId)
            //                {
            //                    //Đã tìm thấy quyền
            //                    result = true;
            //                    break;
            //                }
            //            }
            //        }
            //    }

            //    return result;
            //}
            //Phân quyền trang
            //public static bool AuthorizeAdminPageByToken(string requestedURL, List<RoleMenu> listRoleMenuByRoleId, List<Menu> listMenu, int RoleId)
            //{
            //    bool result = true;
            //    if (requestedURL.Contains("DeletePermanently"))
            //    {
            //        result = false;
            //        return result;
            //    }
            //    if (requestedURL == "/admin")
            //    {
            //        return true;
            //    }
            //    //Xu ly requestUrl
            //    requestedURL = requestedURL.Substring(1, requestedURL.Length - 1);
            //    //Xu ly listMenu
            //    List<Menu> newListMenu = new List<Menu>();
            //    if (listMenu != null)
            //    {
            //        for (int i = 0; i < listMenu.Count; i++)
            //        {
            //            if (listMenu[i].Url == null)
            //            {
            //                continue;
            //            }
            //            else if (listMenu[i].GroupId == 2 && listMenu[i].Url.Length != 0)
            //            {
            //                newListMenu.Add(listMenu[i]);
            //            }
            //        }
            //    }


            //    int MenuId = GetMenuIdFromRequestedURL(requestedURL, newListMenu);
            //    if (MenuId == 0 && RoleId != SystemConstant.ROLE_SYSTEM_ADMIN)
            //    {
            //        //Không cần quyền --> Cho phép truy cập
            //        return false;
            //    }
            //    else if (RoleId == SystemConstant.ROLE_SYSTEM_ADMIN)
            //    {
            //        return true;
            //    }
            //    else
            //    {
            //        //Cần quyền --> Kiểm tra truy cập
            //        result = false;

            //        if (listRoleMenuByRoleId.Count <= 0)
            //        {
            //            //User không có danh sách quyền --> Chặn truy cập
            //            return result;
            //        }
            //        else
            //        {
            //            //User  có danh sách quyền --> Kiểm tra
            //            for (int i = 0; i < listRoleMenuByRoleId.Count; i++)
            //            {
            //                if (listRoleMenuByRoleId[i].MenuId == MenuId)
            //                {
            //                    //Đã tìm thấy quyền
            //                    result = true;
            //                    break;
            //                }
            //            }
            //        }
            //    }

            //    return result;
            //}
            //public static int GetMenuIdFromRequestedURL(string requestedURL, List<Menu> listMenu)
            //{
            //    int MenuId = 0;
            //    //Get MenuId from RequestURL and listMenu
            //    if (listMenu != null)
            //    {
            //        for (int i = 0; i < listMenu.Count; i++)
            //        {
            //            if (requestedURL.ToLower() == listMenu[i].Url.ToLower()
            //                || requestedURL.ToLower() == listMenu[i].Url.ToLower() + "/")
            //            {
            //                MenuId = (int)listMenu[i].Id;
            //                break;
            //            }
            //        }
            //    }
            //    return MenuId;
            //}


            public static string ConvertIntToHex(int value)
        {
            return value.ToString("X");
        }

        public static int ConvertHexInt(string value)
        {
            return int.Parse(value, System.Globalization.NumberStyles.HexNumber);
        }

        public static string ComputeSha256Hash(string rawData)
        {
            // Create a SHA256   
            using (SHA256 sha256Hash = SHA256.Create())
            {
                // ComputeHash - returns byte array  
                byte[] bytes = sha256Hash.ComputeHash(Encoding.UTF8.GetBytes(rawData));

                // Convert byte array to a string   
                StringBuilder builder = new StringBuilder();
                for (int i = 0; i < bytes.Length; i++)
                {
                    builder.Append(bytes[i].ToString("x2"));
                }
                return builder.ToString();
            }
        }

    }
}
