/// <reference path="companysize.js" />
/*
Author: Ha Thanh Nguyen
Created: 28/07/2024
Description: file explorer js
*/
"use strict";

var FILE_EXPLORER = {
    option: {
        maximum: 26214400,
        folderUploadId: 1000019,
        defaultFolderUploadId: 1000019
    },
    elements: {
        loading: "#",
        upload: "#",
        delete: "#",
        search: "#",//search id
        fileContent: "#",
        treeFolder: "#",//tree folder id
        folderName: "#",//folder name id
        editFolder: "#",//edit folder id
        parent: "#",//parent id
    },
    buttons: {
        btnRefresh: "#",//btn refresh id
        btnUploadFile: "#",//btn upload file id
        btnChooseFile: "#btnChooseFile",
        btnDeleteFile: "#btnDeleteFile",
    },
    ajax: {
        uploadURL: `${systemURL}api/file-explorer/upload-file`,
        uploadLagreFileURL: `${systemURL}api/file-explorer/upload-large-file`,
        fileSourceURL: `${systemURL}api/file-explorer/list-upload-file`,
        folderSourseURL: `${systemURL}api/file-explorer/list-all-folder`,
        addFolderURL: `${systemURL}api/file-explorer/add-folder`,
        deleteFile: `${systemURL}api/file-explorer/delete-file`
    },
    paths: {
        folderThumb: "https",
        file: "https",
        folder: "https"
    },
    hosts: {
        storage: systemURL || "",
        api: systemURL || ""
    },
    isShowFolderId: 1000019,
    images: {
        empty: "https"
    },
    paging: {
        pageIndex: 1,
        pageLength: 1
    },
    dataSource: {
        data: undefined,
        files: [],
        folders: [],
        cache: []
    },
    extensions: {
        mcrsWord: [".doc", ".docx"],
        mcrsExcel: [".xls", ".xlsx", ".xlsm", ".xlsb "],
        PDF: [".pdf"],
        img: [".bmp", ".emf", ".exif", ".gif", ".icon", ".jpeg", ".memorybmp", ".png", ".tiff", ".tiff", ".ico", ".jpg"]
    },
    instantFolder: {
        uploads: 1001
    },
    acceptType: "*",
    multiple: false,
    btnTarget: undefined,
    imgElement: undefined,
    hideBtnChooseFile: function () {
        var t = this;
        $(t.buttons.btnChooseFile).addClass("d-none");
    },
    showBtnChooseFile: function () {
        var t = this;
        $(t.buttons.btnChooseFile).removeClass("d-none");
    },
    hideBtnDeleteFile: function () {
        var t = this;
        $(t.buttons.btnDeleteFile).addClass("d-none");
    },
    showBtnDeleteFile: function () {
        var t = this;
        $(t.buttons.btnDeleteFile).removeClass("d-none");
    },
    getData: function () {
        var t = this;
        if (t.option.multiple) {
            return t.dataSource.cache[0];
        }
        return t.dataSource.cache;
    },
    setData: function (data) {
        this.dataSource.cache = data;
    },
    clear: function () {
        this.dataSource.cache = [];
    },
    uploadFile: function (files) {
        debugger;
        var t = this;
        var formData = new FormData();
        var formData2 = new FormData();
        var lengthLagreFile = 0;
        formData.append('folderUploadId', this.isShowFolderId);
        for (const file of files) {
            if (file.size > t.option.maximum || (!file.type.startsWith("image"))) {
                formData2.append('files', file);
                lengthLagreFile++;
            }
            else {
                formData.append('files', file);//only upload file image has size less than maximum
            }
        }
        $("#loading").addClass("show");
        if (lengthLagreFile != files.length) {
            $.ajax({
                url: t.ajax.uploadURL,
                type: 'post',
                processData: false,
                contentType: false,
                data: formData,
                success: function (res) {
                    
                    if (res.status == "200") {
                        if (lengthLagreFile == 0) {
                            //$('#loading').removeClass("show");
                            //$(t.elements.upload).val("");
                            //Swal.fire({
                            //    icon: 'success',
                            //    title: 'Quản lý tệp tin',
                            //    text: 'Tải lên tệp tin thành công.',
                            //}).then((result) => {
                            //    if (result) {
                            //        $(t.elements.search).val("");
                            //        $("#loading").addClass("show");
                            //        t.loadFileFormSever();
                            //    }
                            //});
                            CKEDITOR.dialog.getCurrent().getContentElement('info', 'txtUrl').setValue(res.data[0][0].thumbnailPath);
                        }
                    }
                    else {
                        if (lengthLagreFile == 0) {
                            $(t.elements.upload).val('');
                            $('#loading').removeClass("show");
                        };
                        Swal.fire({
                            icon: 'success',
                            title: 'Quản lý tệp tin',
                            text: 'Tải lên tệp tin thành công.',
                        });
                    }
                },
                error: function (res) {
                    
                    t.elements.upload.val('');
                    if (lengthLagreFile == 0) {
                        $(t.elements.upload).val('');
                        $('#loading').removeClass("show");
                    };
                    Swal.fire({
                        icon: 'error',
                        title: 'Đã có lỗi xảy ra',
                        text: 'Tải lên tệp tin không thành công.',
                    });
                }
            });
        }
        if (lengthLagreFile > 0) {
            $.ajax({
                url: `${t.ajax.uploadLagreFileURL}/${t.isShowFolderId}`,
                type: 'post',
                processData: false,
                contentType: false,
                data: formData2,
                success: function (res) {
                    
                    $('#loading').removeClass("show");
                    $(t.elements.upload).val("");
                    if (res.status == "200") {
                        //Swal.fire({
                        //    icon: 'success',
                        //    title: 'Quản lý tệp tin',
                        //    text: 'Tải lên tệp tin thành công.',
                        //}).then((result) => {
                        //    if (result) {
                        //        $(t.elements.search).val("");
                        //        $("#loading").addClass("show");
                        //        t.loadFileFormSever();
                        //    }
                        //});
                        CKEDITOR.dialog.getCurrent().getContentElement('info', 'txtUrl').setValue(res.data[0][0].thumbnailPath);
                    }
                    else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Đã có lỗi xảy ra',
                            text: 'Tải lên tệp tin không thành công.',
                        });
                    }

                },
                error: function (res) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Đã có lỗi xảy ra',
                        text: 'Tải lên tệp tin không thành công.',
                    });
                    $('#loading').removeClass("show");
                    $(t.elements.upload).val('');
                }
            })
        }
    },
    deleteFile: function (files) {
        ;
        var t = this;
        var arrayListPath = [];
        files.forEach(function (item) {
            arrayListPath.push({
                id: item.id,
                path: item.path,
                thumbnailPath: item.thumbnailPath
            });
        });
        var data = { listPaths: arrayListPath };
        $("#loading").addClass("show");
        $.ajax({
            url: t.ajax.deleteFile,
            type: 'post',
            processData: false,
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: function (res) {
                ;
                if (res.status == "200") {
                    Swal.fire({
                        icon: 'success',
                        title: 'Quản lý tệp tin',
                        text: 'Xóa tệp tin thành công.',
                    }).then((result) => {
                        if (result) {
                            $(t.elements.search).val("");
                            $("#loading").addClass("show");
                            t.loadFileFormSever();
                        }
                    });
                }
                else {
                    Swal.fire({
                        icon: 'success',
                        title: 'Quản lý tệp tin',
                        text: 'Xóa tệp tin thành công.',
                    });
                }
            },
            error: function (res) {
                Swal.fire({
                    icon: 'error',
                    title: 'Đã có lỗi xảy ra',
                    text: 'Tải lên tệp tin không thành công.',
                });
            }
        });
    },
    initPagination: function () {
        //;
        var t = this;
        let idTarget = "#file_pagination .pagination";
        let totalPage = t.dataSource.data.totalPages;
        let pageIndex = t.dataSource.data.currentPage;
        if (totalPage >= 0 && t.dataSource.files.length > 0) {
            let html = "";
            let startPage;
            if (totalPage <= 3) {
                startPage = 1;
            }
            else {
                if (totalPage == pageIndex) {
                    startPage = totalPage - 2;
                }
                else {
                    startPage = pageIndex == 1 ? 1 : pageIndex - 1;
                }

            }
            let endPage = startPage + 2 <= totalPage ? startPage + 2 : totalPage;
            if (pageIndex > 1) {
                html += `<li class="page-item paging-number paging-first-item" paging-data="0"><a class="page-link" href="#!" aria-label="Previous"><i class="feather-chevrons-left"></i></a></li>
                                    <li class="page-item previous paging-number" paging-data="${pageIndex - 1}"><a class="page-link" href="#!" aria-label="Previous"><i class="feather-chevron-left"></i></a></li>`;
            }
            for (var i = startPage; i <= endPage; i++) {
                if (i > 0) {
                    html += `<li class="page-item paging-number ${i == pageIndex ? 'active' : ''}" paging-data="${i - 1}"> <a class="paging-index page-link" href="#!">${i}</a></li>`
                }
            }
            if (pageIndex < totalPage) {
                html += `<li class="page-item paging-number paging-next" paging-data="${pageIndex + 1}"><a class="page-link" href="#!" aria-label="Next"><i class="feather-chevron-right"></i></a></li>
                                    <li class="page-item paging-number paging-last-item" paging-data="${totalPage - 1}"><a class="page-link" href="#!" aria-label="Next"><i class="feather-chevrons-right"></i></a></li>`;
            }
            $(idTarget).html(html);
        }
        else {
            $(idTarget).html("");
        }
    },
    loadFileFormSever: function () {
        var t = this;
        t.dataSource.cache = [];
        t.hideBtnChooseFile();
        t.hideBtnDeleteFile();
        var obj = {
            fodlderUploadId: t.isShowFolderId,
            keyword: $(t.elements.search).val() || "",
            pageIndex: t.paging.pageIndex,
            pageSize: 30,
            contentType: t.acceptType || "",
        };
        $.ajax({
            url: t.ajax.fileSourceURL,
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(obj),
            success: function (res) {
                //;
                $("#loading").removeClass("show");
                if (res.status == "200") {
                    t.dataSource.data = res.data[0];
                    t.dataSource.files = res.data[0].dataSource;
                    let html = '';
                    if (t.dataSource.files.length == 0) {
                        html += '<div class="d-flex flex-column flex-center h-100">' +
                            `<img src= "/assets/media/images/BlankDirectory.png" class="mw-400px" >` +
                            '<div class="fs-1 fw-bolder text-dark mb-4" > Thư mục này trống!</div>' +
                            '<div class="fs-6" >Tạo thư mục mới hoặc tải tệp tin! </div>' +
                            '</div>';
                    }
                    else {
                        html += `<div class="file_gallery" role="grid" tabindex="-1" style="--file-gallery-size: 140px;">`;
                        t.dataSource.files.forEach(function (item, index) {
                            let fileThumbPath = t.hosts.storage + item.thumbnailPath
                            var thumbContent = ``;
                            let mime = item.mimeType;
                            let createdTime = moment(item.createdTime).format("DD/MM/YYYY HH:mm:ss");
                            if (mime.includes("image")) {
                                thumbContent = `<img class="item_img" alt="alt" src="${fileThumbPath}" />
											<a class="overlay-layer bg-dark bg-opacity-25 align-items-center justify-content-center " data-fslightbox="file_gallery" href="${t.hosts.storage + item.path}">
												<span>
													<i class="ki-duotone ki-eye fs-2 text-primary">
														<span class="path1 ki-uniEC0B"></span>
														<span class="path2 ki-uniEC0C"></span>
														<span class="path3 ki-uniEC0D"></span>
													</i>
												</span>
											</a>`;
                            }
                            else if (mime.includes("video")) {
                                thumbContent = `<div class="d-flex thumb-icon d-block overlay">
                                                                                                            <span ><i class="fa-solid fa-video text-primary"></i></span>
                                                                                                                <a data-fslightbox="gallery-file" href="${fileFullPath}" class="overlay-layer card-rounded bg-dark bg-opacity-25">
                                                                                                            <i class="fa fa-eye  text-primary"></i>
                                                                                                                </a>
                                                                                        </div>`;
                            }
                            else if (mime.includes("audio")) {
                                thumbContent = `<div class="d-flex thumb-icon d-block overlay">
                                                                                                                    <span><i class="fa-solid fa-headphones text-primary"></i></span>
                                                                                                                        <a data-fslightbox="gallery-file" href="${fileFullPath}" class="overlay-layer card-rounded bg-dark bg-opacity-25">
                                                                                                            <i class="fa fa-eye  text-primary"></i>
                                                                                                                </a>
                                                                                            </div>`;
                            }
                            else if (mime.includes("text")) {
                                thumbContent = `<div class="d-flex thumb-icon">
                                                                                                                <span><i class="fa-solid fa-file-lines text-primary" > </i></span>
                                                                                            </div>`;
                            }
                            else if (t.extensions.mcrsWord.includes(item.extension)) {
                                thumbContent = `<div class="d-flex thumb-icon">
                                                                                                                                <span><i class="fa-solid fa-file-word text-primary" > </i></span>
                                                                                                    </div>`;
                            }
                            else if (t.extensions.mcrsExcel.includes(item.extension)) {
                                thumbContent = `<div class="d-flex thumb-icon">
                                                                                                                                <span><i class="fa-solid fa-file-excel text-success" > </i></span>
                                                                                                    </div>`;
                            }
                            else if (t.extensions.PDF.includes(item.extension)) {
                                thumbContent = `<div class="d-flex thumb-icon">
                                                                                                                                    <span><i class="fa-solid fa-file-pdf text-danger" > </i></span>
                                                                                                        </div>`;
                            }
                            else {
                                thumbContent = `<div class="d-flex thumb-icon">
                                                                                                                        <span><i class="fa-solid fa-file text-primary" > </i></span>
                                                                                                </div>`;
                            }
                            html += `<div class="file_gallery_item position-relative" file-id="${item.id}" title="${item.name + ` Kích cỡ: ` + t.byteConverter(item.size) + ` Ngày tạo: ` + createdTime}">
										<div class="overlay overflow-hidden">
                                            ${thumbContent}
										</div>
										<div class="bg-dark-inverse position-absolute start-0 top-0 px-2">${item.extension.toUpperCase()}</div>
										<div class="item_title px-2 py-2">
											${item.name.split(".")[0]}
											<span class="file_check ki-duotone ki-check ki-uniEABC position-absolute end-0 bottom-0 fs-3 me-2 mb-2">
											</span>
										</div>
									</div>`;
                        })
                    }
                    html += "</div>";//end tag
                    $(t.elements.fileContent).html(html);
                    refreshFsLightbox();
                    t.initPagination();
                    $("#loading").removeClass("show");
                }
            },
            error: function (res) {
                t.dataSource.data = undefined;
                t.dataSource.files = [];
                t.initPagination();
                $("#loading").removeClass("show");
            }
        });
    },
    getFileExtension: function (fileName) {
        return fileName.split('.').pop();
    },
    refreshFiles: function () {
        var t = this;
        $(t.option.elements.search).val("");///clear value
        this.option.pageIndex = 1;
        this.loadFileFormSever();
    },
    reloadFolder: function () {
        var t = this;
        let folderSidebar = $("#file_explorer_sidebar_menu");
        folderSidebar.html("");
        t.dataSource.folders.forEach(function (item) {
            if (item.id != t.instantFolder.uploads) {//no show folder upload
                let childern = t.dataSource.folders.find(c => c.parentId == item.id);
                let menuItem = `<div ${item.parentId == t.instantFolder.uploads || childern ? `data-kt-menu-trigger="click"` : ``} folder-id="${item.id}" class="menu-item menu-accordion">
										<span class="menu-link position-relative" folder-id="${item.id}">
                                            <div class="menu_line"></div>
											<span class="menu-icon">
												<i class="ki-duotone ki-folder fs-3 text-warning">
													<span class="path1 ki-uniEC5E"></span>
													<span class="path2 ki-uniEC5F"></span>
												</i>
											</span>
											<span class="menu-title">${item.name}</span>
                                            <span class="menu-arrow ${childern ? `` : `d-none`}"></span>
										</span>
                                        <div class="menu-sub menu-sub-accordion">
                                        </div>
									</div>`;
                if (item.parentId == t.instantFolder.uploads) {
                    folderSidebar.append(menuItem).trigger("change");
                    let arrow = folderSidebar.find(`.menu-link[folder-id=${item.parentId}] .menu-arrow`);
                }
                else {
                    $(folderSidebar.find(`.menu-item[folder-id=${item.parentId}] .menu-sub-accordion`)[0]).append(menuItem).trigger("change");
                }
            }
        });
        $("#loading").removeClass("show");
        $(folderSidebar.find(".menu-link")[0]).click();
        $(t.elements.upload).val('');
    },
    getFolderData: function () {
        var t = this;
        $("#loading").addClass("show");
        $(t.elements.search).val("");
        t.paging.pageIndex = 0;
        $.ajax({
            url: t.ajax.folderSourseURL,
            type: "GET",
            success: function (res) {
                if (res.status == "200") {
                    t.dataSource.folders = res.data[0];
                }
                else {
                    t.dataSource.folders = [];
                }
                t.reloadFolder();
            },
            error: function (e) {
                t.dataSource.folders = [];
                t.reloadFolder();
            }
        });
    },
    addFolderToServer: function () {
        var t = this;
        let folder = {
            parentId: t.isShowFolderId || t.instantFolder.uploads,
            name: $('#modal_add_folder .folder_name').val().trim() || "",
            description: ""
        };
        $("#loading").addClass("show");
        $.ajax({
            url: t.ajax.addFolderURL,
            type: "POST",
            data: JSON.stringify(folder),
            contentType: "application/json",
            success: function (res) {
                setTimeout(function () {
                    $("#loading").removeClass("show");
                    if (res.status == "200") {
                        if (res.status == 200) {
                            Swal.fire({
                                icon: "success",
                                title: "Quản lý tệp tin",
                                html: `Thư mục <strong>${folder.name}</strong> đã được thêm mới thành công.`,
                            }).then((result) => {
                                $("#modal_add_folder").modal("hide");
                                t.getFolderData();
                            })
                        }
                    }
                }, 500);
            },
            error: function (e) {
                setTimeout(function () {
                    $("#loading").removeClass("show");
                    Swal.fire(
                        'Quản lý tệp tin',
                        'Thêm mới thư mục không thành công, <br> vui lòng thử lại sau!',
                        'error'
                    );
                }, 500);
            }
        })
    },
    byteConverter: function (bytes, decimals, only) {
        const K_UNIT = 1024;
        const SIZES = ["Bytes", "KB", "MB", "GB", "TB", "PB"];
        if (bytes == 0) return "0 Byte";
        if (only === "MB") return (bytes / (K_UNIT * K_UNIT)).toFixed(decimals) + " MB";
        let i = Math.floor(Math.log(bytes) / Math.log(K_UNIT));
        let resp = parseFloat((bytes / Math.pow(K_UNIT, i)).toFixed(decimals)) + " " + SIZES[i];
        return resp;
    },
    init: function () {
        var t = this;
        t.option = config.option;
        t.elements = config.elements;
        t.buttons = config.buttons;
        t.paths = config.paths;
        t.images = config.images;
        t.instantFolder = config.instantFolder;


        $(t.buttons.btnRefresh).click(function (e) {
            e.preventDefault();
            t.refreshFiles();
        });
        $(t.elements.search).keyup(function (e) {
            e.preventDefault();
            if (e.keyCode === 13) {
                t.paging.pageIndex = 0;
                $("#loading").addClass("show");
                t.loadFileFormSever();
            }
        });


        $(document).on("click", ".choseFile", function () {
            $("#postUpload").click();
        });
        $('#file_explorer_sidebar_menu').on("click", ".menu-link", function (e) {
            e.preventDefault();
            let element = $(this);
            let parent = element.parents('.menu-accordion');
            t.isShowFolderId = parseInt(element.attr("folder-id"));
            if (element.hasClass("active")) {
                return;
            }
            else {
                $('#file_explorer_sidebar_menu .menu-link.active').removeClass("active");
                $('#file_explorer_sidebar_menu .menu-accordion.active').removeClass("active");
                element.addClass("active");
                parent.addClass("active");
                $("#loading").addClass("show");
                t.loadFileFormSever();
            }
        })
        $("#file-explorer-content .btn_add_folder").on("click", function (e) {
            $('#modal_add_folder .folder_name').val("");
            $("#modal_add_folder").modal("show");
        });

        $("#modal_add_folder .btn_submit").on("click", function () {
            let text = $('#modal_add_folder .folder_name').val();
            if (text == "") {
                Swal.fire({
                    icon: "warning",
                    title: "Quản lý tệp tin",
                    text: "Tên thư mục không được để trống"
                })
            }
            else {
                Swal.fire({
                    icon: "info",
                    title: "Quản lý tệp tin",
                    html: `Bạn có chắc chắn muốn thêm mới thư mục <strong>${text}</strong> ?`,
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#443',
                    cancelButtonText: 'Hủy',
                    confirmButtonText: 'Lưu'
                }).then((result) => {
                    if (result.isConfirmed) {
                        t.addFolderToServer();
                    }
                })
            }
        })
        $('#file_pagination').on("click", ".page-link", function (e) {
            e.preventDefault();
        });
        $(t.elements.parent).on("click", ".file_gallery_item", function (e) {
            let element = $(this);
            let fileId = parseInt(element.attr("file-id"));
            if (element.hasClass("active")) {
                if (fileId) {
                    let fileIndex = t.dataSource.files.findIndex(c => c.id == fileId);
                    element.removeClass("active");
                    t.dataSource.cache.splice(fileIndex, 1);
                }
            }
            else {
                if (fileId) {
                    let file = t.dataSource.files.find(c => c.id == fileId);
                    if (file) {
                        if (!t.multiple) {
                            $(t.elements.parent).find(".file_gallery_item").removeClass("active");
                            t.dataSource.cache = [];
                        }
                        element.addClass("active");
                        t.dataSource.cache.push(file);
                    }
                }
            }
            if (t.dataSource.cache.length > 0) {
                t.showBtnChooseFile();
                t.showBtnDeleteFile();
            }
            else {
                t.hideBtnChooseFile();
                t.hideBtnDeleteFile();
            }
        });

        $(t.buttons.btnUploadFile).click(function (e) {
            e.preventDefault();
            $(t.elements.upload).click();
        });
        $(t.elements.upload).change(function (e) {//Upload file
            if ($(this).val().length > 0) {
                let listFiles = e.target.files;
                if (listFiles.length > 0) {
                    let listFileTooLarge = [];
                    for (let file of listFiles) {
                        let fileExtension = t.getFileExtension(file.name);
                        if (file.size > t.option.maximum) {
                            listFileTooLarge.push(file.name);
                        }
                    }
                    if (listFileTooLarge.length > 0) {
                        var content = '<ul>';
                        for (var file of listFileTooLarge) {
                            content += `<li class='text-start'>${file}</li>`;
                        }
                        content += "</ul>";
                        html = (listFileTooLarge.length === 1 ? '<div style="text-align:left;">Tệp: </div>' : '<div style="text-align:left;">Các tệp:</div>') + content
                            + `mà bạn đã chọn quá lớn. Kích thước tối đa là <strong>${t.byteConverter(t.option.maximum)}</strong>.`;
                        $(document).off('focusin.modal');
                        Swal.fire({
                            title: 'Lưu ý',
                            icon: 'warning',
                            html: html
                        })
                        $(t.elements.upload).val('');
                    }
                    else {
                        t.uploadFile(listFiles);
                    }
                }
            }
        });
        $("#file_pagination .pagination").on("click", ".paging-number", function () {
            let element = $(this);
            if (element.hasClass("active")) {
                return;
            }
            else {
                let pageIndex = element.attr("paging-data");
                if (pageIndex) {
                    t.paging.pageIndex = parseInt(pageIndex);
                    $("#loading").addClass("show");
                    t.loadFileFormSever();
                }
            }
        });
        $("#modalFileExplorer .btn_refresh").on("click", function (e) {
            $(t.elements.search).val("");
            t.paging.pageIndex = 0;
            $("#loading").addClass("show");
            t.loadFileFormSever();
        });
    }
}



