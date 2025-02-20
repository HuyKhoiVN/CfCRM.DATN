var filePath = "";
var editor;

$(".post_choose_photo").click(function () {
    $("#photo").click();
});
$("#photo").on("change", function (e) {
    let file = e.target.files[0];
    uploadFile(file);
});
const uploadFile = async (file) => {
    var formData = new FormData();
    formData.append("file", file);
    axios.post("post/api/uploadfile", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
            "Authorization": `Bearer ${localStorage.token}`
        },
    }).then((response) => {
        fnSuccess(response);
    }).catch((error) => {
        fnFail(error);
    });
}
const fnSuccess = (response) => {
    $(".post_choose_photo").css("background-image", "url('" + response.data.data[0] + "')");
    filePath = response.data.data[0];
}
const fnFail = (error) => {
    Swal.fire("Cập nhật thất bại", "Cập nhật ảnh đại diện không thành công.", "error");
}
$(document).ready(function () {
    CKEDITOR.ClassicEditor.create(document.getElementById("postContent"), {
        toolbar: {
            items: [
                'undo', 'redo',
                'heading', '|',
                'bold', 'italic', 'underline',
                'alignment',
                'bulletedList', 'numberedList', 'todoList',
                'outdent', 'indent',
                'link', 'insertImage', 'mediaEmbed', 'blockQuote', 'insertTable',
                'fontSize', 'fontFamily', 'fontColor','fontBackgroundColor',
            ],
            shouldNotGroupWhenFull: false
        },
        // Changing the language of the interface requires loading the language file using the <script> tag.
        language: 'vi',
        ckfinder: {
            uploadUrl: `${systemURL}api/file-explorer/upload-file-ck`,
        },
        list: {
            properties: {
                styles: true,
                startIndex: true,
                reversed: true
            }
        },
        heading: {
            options: [
                { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
                { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
                { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
                { model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3' },
                { model: 'heading4', view: 'h4', title: 'Heading 4', class: 'ck-heading_heading4' },
                { model: 'heading5', view: 'h5', title: 'Heading 5', class: 'ck-heading_heading5' },
                { model: 'heading6', view: 'h6', title: 'Heading 6', class: 'ck-heading_heading6' }
            ]
        },
        placeholder: 'Nhập văn bản',
        // https://ckeditor.com/docs/ckeditor5/latest/features/font.html#configuring-the-font-family-feature
        fontFamily: {
            options: [
                'default',
                'Arial, Helvetica, sans-serif',
                'Courier New, Courier, monospace',
                'Georgia, serif',
                'Lucida Sans Unicode, Lucida Grande, sans-serif',
                'Tahoma, Geneva, sans-serif',
                'Times New Roman, Times, serif',
                'Trebuchet MS, Helvetica, sans-serif',
                'Verdana, Geneva, sans-serif'
            ],
            supportAllValues: true
        },
        fontSize: {
            options: [10, 12, 14, 'default', 18, 20, 22],
            supportAllValues: true
        },
        // Be careful with the setting below. It instructs CKEditor to accept ALL HTML markup.
        // https://ckeditor.com/docs/ckeditor5/latest/features/general-html-support.html#enabling-all-html-features
        htmlSupport: {
            allow: [
                {
                    name: /.*/,
                    attributes: true,
                    classes: true,
                    styles: true
                }
            ]
        },
        htmlEmbed: {
            showPreviews: true
        },
        link: {
            decorators: {
                addTargetToExternalLinks: true,
                defaultProtocol: 'https://',
                toggleDownloadable: {
                    mode: 'manual',
                    label: 'Downloadable',
                    attributes: {
                        download: 'file'
                    }
                }
            }
        },
        mention: {
            feeds: [
                {
                    marker: '@',
                    feed: [
                        '@apple', '@bears', '@brownie', '@cake', '@cake', '@candy', '@canes', '@chocolate', '@cookie', '@cotton', '@cream',
                        '@cupcake', '@danish', '@donut', '@dragée', '@fruitcake', '@gingerbread', '@gummi', '@ice', '@jelly-o',
                        '@liquorice', '@macaroon', '@marzipan', '@oat', '@pie', '@plum', '@pudding', '@sesame', '@snaps', '@soufflé',
                        '@sugar', '@sweet', '@topping', '@wafer'
                    ],
                    minimumCharacters: 1
                }
            ]
        },
        // The "super-build" contains more premium features that require additional configuration, disable them below.
        // Do not turn them on unless you read the documentation and know how to configure them and setup the editor.
        removePlugins: [
            'CKBox',
            'EasyImage',
            'RealTimeCollaborativeComments',
            'RealTimeCollaborativeTrackChanges',
            'RealTimeCollaborativeRevisionHistory',
            'PresenceList',
            'Comments',
            'TrackChanges',
            'TrackChangesData',
            'RevisionHistory',
            'Pagination',
            'WProofreader',
            'MathType'
        ]
    }).then(newEditor => {
        editor = newEditor;
    }).catch(error => {
        console.error(error);
    });
    //ClassicEditor
    //    .create(document.querySelector('#postContent'), {
    //        language: 'vi',
    //        ckfinder: {
    //            uploadUrl: `${systemURL}api/file-explorer/upload-file-ck`,
    //        },
    //        //image: {
    //        //    resizeUnit: "%",
    //        //    resizeOptions: [{
    //        //        name: 'resizeImage:original',
    //        //        value: null
    //        //    },
    //        //    {
    //        //        name: 'resizeImage:50',
    //        //        value: '50'
    //        //    },
    //        //    {
    //        //        name: 'resizeImage:75',
    //        //        value: '75'
    //        //    }]
    //        //},
    //        //toolbar: {
    //        //    items: [
    //        //        'heading',
    //        //        '|',
    //        //        'bold',
    //        //        'italic',
    //        //        'link',
    //        //        'bulletedList',
    //        //        'numberedList',
    //        //        'blockQuote',
    //        //        'imageUpload',
    //        //        'mediaEmbed',
    //        //        'undo',
    //        //        'redo',
    //        //        'resizeImage:50',
    //        //        'resizeImage:75',
    //        //        'resizeImage:original',
    //        //    ]
    //        //},
    //    })
    //    .then(newEditor => {
    //        editor = newEditor;
    //    })
    //    .catch(error => {
    //        console.error(error);
    //    });
    //editor = CKEDITOR.replace('postContent', {
    //    toolbar: [
    //        { name: 'styles', items: ['Styles', 'Format'] },
    //        { name: 'clipboard', items: ['Cut', 'Copy', 'Paste', 'PasteText', 'PasteFromWord', '-', 'Undo', 'Redo'] },
    //        { name: 'editing', items: ['Find', 'SelectAll'] },
    //        { name: 'insert', items: ['Image', 'Embed' ,'Table'] },
    //        { name: 'basicstyles', items: ['Bold', 'Italic', 'Underline'] },
    //        { name: 'paragraph', items: ['JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock','NumberedList', 'BulletedList',] },
    //    ]
    //});
    //CKEDITOR.on('dialogDefinition', function (e) {
    //    var dialogName = e.data.name;
    //    var dialog = e.data.definition.dialog;
    //    dialog.on('show', function () {
    //        setupCKUploadFile();
    //    });
    //});

    $.when(LoadDataHashTag()).done(function () {
        $('#tag').select2({
            tags: true,
            placeholder: "Nhập Hashtag",
        }).on("change", function (e) {
            var isNew = $(this).find('[data-select2-tag="true"]');
            // if (isNew.length && $.inArray(isNew.val(), $(this).val()) !== -1) {
            //     var updatingObj = {
            //         "id": 0,
            //         "active": 1,
            //         "name": isNew.val(),
            //         "name2": isNew.val(),
            //         "slug": isNew.val(),
            //         "slug2": isNew.val(),
            //         "color": '#000000',
            //         "postCount": 0,
            //         "description": isNew.val(),
            //         "createdTime": new Date(),
            //     };
            //     $.ajax({
            //         url: "https://lacvietauction.vn/tag/api/add",
            //         type: "POST",
            //         contentType: "application/json",
            //         data: JSON.stringify(updatingObj),
            //         success: function (responseData) {
            //             if (responseData.status == 201 && responseData.message === "CREATED") {
            //                 isNew.replaceWith('<option selected value="' + responseData.data[0].id + '">' + responseData.data[0].name + '</option>');
            //             }
            //         },
            //         error: function (e) {
            //             //console.log(e.message);
            //             Swal.fire(
            //                 'Lỗi!',
            //                 'Đã xảy ra lỗi, vui lòng thử lại',
            //                 'error'
            //             );
            //         }
            //     });
            // }
        });
        $('.select2-search--inline').append(
            `<div class="btnSend"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="21" viewBox="0 0 20 21" fill="none">
                              <g clip-path="url(#clip0_1871_218689)">
                                <path d="M18.4164 8.82249L2.29277 0.957292C2.15411 0.889651 2.00184 0.854492 1.84755 0.854492C1.2867 0.854492 0.832031 1.30916 0.832031 1.87001V1.89932C0.832031 2.03558 0.84874 2.17134 0.88179 2.30354L2.42843 8.49008C2.47067 8.65908 2.61355 8.78391 2.78665 8.80316L9.58462 9.55849C9.82036 9.58466 9.9987 9.78391 9.9987 10.0212C9.9987 10.2584 9.82036 10.4577 9.58462 10.4838L2.78665 11.2392C2.61355 11.2584 2.47067 11.3832 2.42843 11.5522L0.88179 17.7387C0.84874 17.871 0.832031 18.0067 0.832031 18.143V18.1723C0.832031 18.7332 1.2867 19.1878 1.84755 19.1878C2.00184 19.1878 2.15411 19.1527 2.29277 19.085L18.4164 11.2198C18.8746 10.9963 19.1654 10.5311 19.1654 10.0212C19.1654 9.51124 18.8746 9.04599 18.4164 8.82249Z" fill="white"/>
                              </g>
                              <defs>
                                <clipPath id="clip0_1871_218689">
                                  <rect width="20" height="20" fill="white" transform="translate(0 0.0214844)"/>
                                </clipPath>
                              </defs>
                            </svg></div>`
        );
    });
    LoadPostCateogry();
    LoadForumPostType();
});
function setupCKUploadFile() {
    var inputElement = $(".cke_dialog_image_url .cke_dialog_ui_hbox_first input");
    var buttonFileElement = $(".cke_dialog_image_url .cke_dialog_ui_hbox_last a");
    buttonFileElement.addClass("choseFile");
    buttonFileElement.attr("data-fm-target", "#" + inputElement.attr("id"));
    buttonFileElement.attr("control-type", "ckeditor4");
    buttonFileElement.css("display", "block");
    //$(".cke_dialog_body .cke_dialog_tabs a:nth-child(4)").remove();khi xóa sẽ bị bug
    //$(".cke_dialog_contents .cke_dialog_contents_body div:nth-child(4)").remove();
}
async function LoadDataHashTag() {
    var result = await httpService.getAsync("tag/api/list");
    if (result.status == "200") {
        result.data.forEach(function (item) {
            $('#tag').append(new Option(item.name, item.id, false, false));
        })
    }
}
$("#btnSubmit").on("click", function () {
    Swal.fire({
        title: "Đăng bài viết",
        html: "Bạn xác nhận muốn đăng bài viết?",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#443',
        cancelButtonText: 'Hủy',
        confirmButtonText: 'Xác nhận'
    }).then(async (result) => {
        if (result.isConfirmed) {
            validate();
        }
    });
});

async function CreatedPost() {
    $("#loading").addClass("show");
    let data = {
        "forumCategoryId": $("#category_select :selected").val(),
        // Nếu là công khai thì lấy theo extra, không thì lấy theo ẩn danh
        "forumPostTypeId": $("#forum_post_type_select :selected").val() == 1000001 ? $("#forum_post_type_select_extra :selected").val() : $("#forum_post_type_select :selected").val(),
        //"photo": filePath,
        "name": $("#post-title").val(),
        "text": editor.getData(),
    }
    var result = await httpService.postAsync("forumpost/api/create-forum-post", data);
    if (result.status === "201") {
        $("#loading").removeClass("show");
        renderConfetti();
        Swal.fire({
            title: "Tạo bài viết thành công",
            html: "Đăng tải bài viết thành công",
            icon: 'success',
            //showCancelButton: true,
            confirmButtonColor: '#3085d6',
            //cancelButtonColor: '#443',
            //cancelButtonText: 'Hủy',
            confirmButtonText: 'Xem chi tiết'
        }).then(async (res) => {
            if (res.isConfirmed) {
                location.href = "/dien-dan/chi-tiet-bai-viet/" + result.data[0].id + "-" + result.data[0].url;
            }
            else {
                window.location.reload();
            }
        });
    }
    else {
        $("#loading").removeClass("show");
        Swal.fire({
            html: ' Đăng bài không thành công, vui lòng thử lại sau !',
            icon: 'error'
        });
    }
}
$("#postUpload").on("change", function (e) {
    let file = e.target.files;
    FILE_EXPLORER.uploadFile(file);
});
async function LoadPostCateogry() {
    var result = await httpService.getAsync("forumcategory/api/List-Category");
    if (result.status == "200") {
        result.data.forEach(function (item) {
            $("#category_select").append(new Option(item.name, item.id, false, false)).trigger('change');
        });
        $("#category_select").select2();
        $('.select2-selection__arrow').html(`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M6.41438 9.53151C6.67313 9.20806 7.1451 9.15562 7.46855 9.41438L12 13.0396L16.5315 9.41438C16.855 9.15562 17.3269 9.20806 17.5857 9.53151C17.8444 9.85495 17.792 10.3269 17.4685 10.5857L12.4685 14.5857C12.1946 14.8048 11.8054 14.8048 11.5315 14.5857L6.53151 10.5857C6.20806 10.3269 6.15562 9.85495 6.41438 9.53151Z" fill="#1B1E28"/>
                </svg>`);
    }
}

async function LoadForumPostType() {
    var result = await httpService.getAsync("forumPostType/api/list");
    if (result.status == "200") {
        result.data.forEach(function (item) {
            //Nếu không thuộc hàng công khai
            if (item.description != "1000001") {
                $("#forum_post_type_select").append(new Option(item.name, item.id, false, false)).trigger('change');
            }
            else {
                $("#forum_post_type_select_extra").append(new Option(item.name, item.id, false, false)).trigger('change');
            }
        });
        $("#forum_post_type_select").select2();
        $("#forum_post_type_select_extra").select2();
        //default value là công khai
        $('#forum_post_type_select').on("change", function (e) {
            if ($(this).val() == 1000001) {
                $("#forum-post-type-extra-div").show();
            } else {
                $("#forum-post-type-extra-div").hide();
            }
        });
        $("#forum_post_type_select").val(1000001).trigger('change');
        $('.select2-selection__arrow').html(`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M6.41438 9.53151C6.67313 9.20806 7.1451 9.15562 7.46855 9.41438L12 13.0396L16.5315 9.41438C16.855 9.15562 17.3269 9.20806 17.5857 9.53151C17.8444 9.85495 17.792 10.3269 17.4685 10.5857L12.4685 14.5857C12.1946 14.8048 11.8054 14.8048 11.5315 14.5857L6.53151 10.5857C6.20806 10.3269 6.15562 9.85495 6.41438 9.53151Z" fill="#1B1E28"/>
                </svg>`);
    }
}

async function validate() {
    var errorList = [];
    if ($("#post-title").val().trim() == '') {
        errorList.push("Tên bài viết diễn đàn không được để trống");
    }

    if (errorList.length > 0) {
        var contentError = "<ul>";
        errorList.forEach(function (item, index) {
            contentError += "<li class='text-start'>" + item + "</li>";
        })
        contentError += "</ul>";
        var swalSubTitle = "<p class='swal__admin__subtitle'>" + 'Đăng bài' + " không thành công</p>";
        Swal.fire(
            'Đăng bài ' + swalSubTitle,
            contentError,
            'warning'
        );
    } else {
        await CreatedPost();
    }
}