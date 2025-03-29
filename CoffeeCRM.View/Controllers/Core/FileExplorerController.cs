//using CfCRM.Controllers.Core;
//using CfCRM.Util;
//using Microsoft.AspNetCore.Mvc;
//using CfCRM.Constants;
//using CfCRM.Helper;
//using CfCRM.Models.UploadFileModel;
//using CfCRM.Services.Interfaces;

//namespace CfCRM.Controllers.Core
//{
//    [ApiController]
//    [Route("api/file-explorer")]
//    [Route("admin/file-explorer")]
//    public class FileExplorerController : BaseController
//    {
//        private readonly IFileExplorerService _fileExplorerService;
//        private readonly IWebHostEnvironment _webHostEnvironment;
//        private readonly ILogger _logger;
//        public FileExplorerController(IFileExplorerService fileExplorerService, IWebHostEnvironment webHostEnvironment, ILoggerFactory loggerFactory, ICacheHelper cacheHelper) : base(cacheHelper)
//        {
//            _fileExplorerService = fileExplorerService;
//            _webHostEnvironment = webHostEnvironment;
//            _logger = loggerFactory.CreateLogger<FileExplorerController>();
//        }
//        [HttpGet]
//        [Route("demo")]
//        public async Task<IActionResult> FileExplorer()
//        {
//            return View();
//        }
//        [HttpPost("add-folder")]
//        public async Task<IActionResult> AddFolder([FromBody] InsertFolderUploadDTO obj)
//        {
//            try
//            {
//                var response = await _fileExplorerService.AddFolder(obj);
//                return Ok(response);
//            }
//            catch (Exception e)
//            {
//                _logger.LogError(e, "Failed to add folder.");
//                return BadRequest();
//            }
//        }
//        [HttpGet("list-all-folder")]
//        public async Task<IActionResult> ListAllFolder()
//        {
//            try
//            {
//                var response = await _fileExplorerService.GetAllFolders();
//                return Ok(response);
//            }
//            catch (Exception e)
//            {
//                _logger.LogError(e, "Failed to get list all folder upload");
//                return BadRequest();
//            }
//        }
//        [HttpPost("upload-file")]
//        [MultipartFormData]
//        public async Task<IActionResult> UploadFile([FromForm] InsertUploadFileDTO obj)
//        {
//            try
//            {
//                var response = await _fileExplorerService.SaveFile(obj);
//                return Ok(response);
//            }
//            catch (Exception e)
//            {
//                _logger.LogError(e, "Failed to upload file to server");
//                return BadRequest();
//            }
//        }
//        [HttpPost("upload-large-file/{id}")]
//        [MultipartFormData]
//        [DisableFormValueModelBinding]
//        public async Task<IActionResult> UploadLargeFile(int id)
//        {
//            try
//            {
//                var accountId = this.GetLoggedInUserId();
//                if (accountId == 0)
//                {
//                    accountId = AdminAccountConst.SUPER_ADMIN_ID;
//                }
//                var obj = new InsertLargeUploadFileDTO()
//                {
//                    Stream = HttpContext.Request.Body,
//                    AdminUploadId = accountId,
//                    ContentType = HttpContext.Request.ContentType,
//                    FolderRoot = "",
//                    FolderUploadId = id
//                };
//                var response = await _fileExplorerService.SaveLargeFile(obj);
//                return Ok(response);
//            }
//            catch (Exception e)
//            {
//                _logger.LogError(e, "Failed to upload file to server");
//                return BadRequest();
//            }
//        }
//        [HttpPost("list-upload-file")]
//        public async Task<IActionResult> ListUploadFile([FromBody] PagingUploadFileParameter parameters)
//        {
//            try
//            {
//                var response = await _fileExplorerService.ListPagingFile(parameters);
//                return Ok(response);
//            }
//            catch (Exception e)
//            {
//                _logger.LogError(e, "Failed to get list paging upload file.");
//                return BadRequest();
//            }
//        }
//        [HttpPost("upload/{user}/{type}")]
//        public async Task<IActionResult> Upload([FromForm] InsertUploadFileDTO obj, string user, string type)
//        {
//            try
//            {

//                if (!FolderUploadConst.MAPPING.ContainsKey(user))
//                {
//                    return NotFound();
//                }
//                else if (!FolderUploadConst.MAPPING[user].ContainsKey(type))
//                {
//                    return NotFound();
//                }
//                obj.AdminAccountId = AdminAccountConst.SUPER_ADMIN_ID;
//                obj.FolderUploadId = FolderUploadConst.MAPPING[user][type];
//                var response = await _fileExplorerService.CurrentUserSaveFile(obj, user, type);
//                return Ok(response);
//            }
//            catch (Exception e)
//            {
//                _logger.LogError(e, "Failed to upload file by another user");
//                return BadRequest();
//            }
//        }
//        [HttpPost("delete-file")]
//        public async Task<IActionResult> DeleteFile([FromBody] DeleteFileDTO obj)
//        {
//            try
//            {
//                if (obj.ListPaths != null)
//                {
//                    var happySResponse = await _fileExplorerService.DeleteFile(obj);
//                    return Ok(happySResponse);
//                }
//                else
//                {
//                    return BadRequest();
//                }
//            }
//            catch (Exception e)
//            {
//                _logger.LogError(e, "Failed to get list all folder upload");
//                return BadRequest();
//            }
//        }



//        [HttpGet("list-all-folder-by-account")]
//        public async Task<IActionResult> ListAllFolderByAccount()
//        {
//            try
//            {
//                var accountId = this.GetLoggedInUserId();
//                var response = await _fileExplorerService.GetAllFoldersByAccountId(accountId);
//                return Ok(response);
//            }
//            catch (Exception e)
//            {
//                _logger.LogError(e, "Failed to get list all folder upload");
//                return BadRequest();
//            }
//        }
//        [HttpPost("list-upload-file-by-account")]
//        public async Task<IActionResult> ListUploadFileByAccount([FromBody] PagingUploadFileParameter parameters)
//        {
//            try
//            {
//                int accountId = this.GetLoggedInUserId();
//                var response = await _fileExplorerService.ListPagingFileByAccountId(parameters, accountId);
//                return Ok(response);
//            }
//            catch (Exception e)
//            {
//                _logger.LogError(e, "Failed to get list paging upload file.");
//                return BadRequest();
//            }
//        }


//        //Upload file
//        [HttpPost("upload-file-ck")]
//        public async Task<JsonResult> UploadFileCKEditor([FromForm] ICollection<IFormFile> upload)
//        {
//            try
//            {
//                //var response = await _fileExplorerService.SaveFile(obj);
//                //Xử lý logic
//                InsertUploadFileDTO insertUploadFileDTO = new InsertUploadFileDTO()
//                {
//                    FolderUploadId = 1001,
//                    AdminAccountId = 1001,
//                    Files = upload,
//                };
//                var response = await _fileExplorerService.SaveFile2(insertUploadFileDTO);
//                var ckResponse = new CKFinderResponse()
//                {
//                    Uploaded = 1,
//                    FileName = response[0].Name,
//                    Url = response[0].Path,
//                };
//                return new JsonResult(ckResponse);
//            }
//            catch (Exception e)
//            {
//                _logger.LogError(e, "Failed to upload file to server");
//                return null;
//            }
//        }
//    }
//}
