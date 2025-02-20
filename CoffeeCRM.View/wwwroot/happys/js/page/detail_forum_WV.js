

// Lấy URL từ địa chỉ hiện tại
var currentURL = window.location.href;

// Tạo đối tượng URL từ URL hiện tại
var urlObject = new URL(currentURL);
var editor;

// Lấy giá trị của tham số "1000001"
var id = forumId;
var textWithDashes;



$('#show-option-item-' + idHover).mouseleave(function () {
    $(this).attr('display', 'none');
})
//function convertToSlug(input) {

//    var slug = input.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9\s]/g, '');

//    slug = slug.replace(/\s+/g, '-').toLowerCase();

//    return slug;
//}
//hàm load trang chi tiết forum
var url = new URL(window.location.href);
var token = url.searchParams.get("token");
async function loadDetailForum() {
    var dataSourse = await httpService.getAsync("forumpost/api/DetailForumEndUser/" + forumId);
    var data = dataSourse.data[0];
    console.log(data)
    var img = data.forumPostAuthorPhoto ? data.forumPostAuthorPhoto : "/images/default/NoImage.png";
    var content = `
        <div class="row">
            <div class="col-lg-12 ">
                <div class="forum-post-top">
                    
                    <div class="top-post-author d-flex flex-column">
                        <div class="forum-author-meta d-flex">

                        <!--
                            <a href="/app/danh-sach-thu-muc-dien-dan?id=${data.forumCategoryId}"><span>` + data.forumCategoryName + `</span></a>
                        -->

                            <span class="forum-post-name">` + data.name + `</span>
                            
                        </div>
                        <div class="forum-author-extra " >
                            <div class="author">
                            <a class="author-avatar" >
                                <img src="${data.forumPostTypeId == systemConstant.forum_post_type_incognito_id ? `/images/default/authdefaultimage.png` : img}" alt="">
                            </a>
                            <a class="author-name" href="${(data.forumPostTypeId == systemConstant.forum_post_type_incognito_id ? `/app/thong-tin-ca-nhan/demo111?token=`+token : `/app/thong-tin-ca-nhan/` + data.forumPostAccountId + `?token=` + `${token}`)}">
                                ${data.forumPostTypeId == systemConstant.forum_post_type_incognito_id ? `Ẩn danh` : data.forumPostAuthorName} 
                            </a>
                            
                            </div>
                            <span class="forum-post-published-time">`+ moment(data.publishedTime).fromNow() + `</span>
                        </div>
                </div>
            </div>
            </div>
        </div>

        <!-- Forum post content -->
        <!-- Comment tên bài viết
        <div class="q-title">
            <h1>`+ data.name + `</h1>
        </div>
        -->
        <div class="forum-post-content">
            <div class="content">
                `+ data.text + `
            </div>
            <div class="forum-post-btm d-flex flex-column">
                <div class=" col-12 justify-content-between p-0 d-none">
                    <div class="taxonomy forum-post-tags g-10 ">
                        <div class="icon_tag">
                            <a><img class="mr-0" src="/happys/img/detail_forum/icon_tag.svg" /></a>
                        </div>

                        <div class="tag_list_forum d-flex g-10">
                            <button class="btn btnHS2 tag_item">Swagger</button>
                            <button class="btn btnHS2 tag_item">Docy</button>
                            <button class="btn btnHS2 tag_item">Business</button>
                        </div>
                    </div>
                    <div class="taxonomy forum-post-cat d-flex forum_social">
                        <div class="icon_like_forum d-flex align-items-center">
                            <img src="/happys/img/detail_forum/icon_like.svg" />
                            <div class="content_like">
                                <div class="content_like"><p>`+ data.likeCount + ` Yêu thích</p></div>
                            </div>
                        </div>
                        <div class="icon_comment_forum d-flex align-items-center">
                            <img src="/happys/img/detail_forum/icon_cmt.svg" />
                            <div class="content_comment"><p>`+ data.commentCount + ` Bình luận</p></div>
                        </div>
                    </div>
                </div>

            </div>

            <div class="action-button-container action-btns">
                <div class="heade_cmt" id="heade_cmt">Tất cả bình luận</div>
            </div>
       </div>
    `;
    let contentCmtText = parseInt(accountId) > 0 ? `
                <div class="col-lg-12 mt-3 p-0">
                    <textarea id="postContent" rows="50" style="display: none; visibility: hidden;" class="form-control form-control mb-3 mb-lg-0 text_editor"></textarea>
                    <input type="file" class="d-none" id="postUpload"/>
                </div>
                <div class="btn_comment d-flex flex-row justify-content-between">
                    <label for="confirm" class="d-flex flex-row align-items-center justify-content-center mt-2">
                        <input class="input_checkbox" name="hideaccount" id="confirm" type="checkbox" value="1000002">
                        <span>Ẩn thông tin của bạn với người dùng khác</span>
                    </label>
                    <button class="btn btnHS2" onclick="updateComment()" id="btn_cmt">Bình luận</button>
                </div>`: `<a class="btn btnHS2" href = "/dang-nhap">Đăng nhập để bình luận</a>`
        ;

    $("#detail_forum_header").append(content);
    $("#comment_text").append(contentCmtText);
}
// load toàn bộ bình luận
var loadCmt = async function loadAllComent() {
    try {
        var dataComment = await httpService.getAsync("forumpost/api/AllCommentPaggingEndUser?id=" + id + "&pageIndex=" + pageIndex + "&pageSize=" + pageSize);
        let dataCmt = dataComment.data;
        let contentComt = ``;
        $.each(dataCmt, function (index, element) {
            let imgCmt = element.forumPostCmtPhoto ? element.forumPostCmtPhoto : "/images/default/authdefaultimage.png";
            contentComt += `
            <div class="forum-post-top">
                <div class="d-flex justify-content-between aligsn-item-center">
                    <a class="author-avatar" href="#">
                        <img src="`+ (element.forumPostTypeId == systemConstant.notification_status_read ? imgCmt : '/images/default/authdefaultimage.png') + `" alt="author avatar">
                    </a>
                   
                </div>
                
                <div class="forum-post-author">
                    <div class="head-post-top d-flex justify-content-between">
                        <div class="left-post d-flex">
                            <a class="author-name" href="${(element.forumPostTypeId == systemConstant.notification_status_read ? `/thong-tin-ca-nhan/` + element.forumAccountUserName + `` : '')}">` + (element.forumPostTypeId == systemConstant.notification_status_read ? (element.forumAccountNickName != null ? element.forumAccountNickName : element.forumPostAccountName) : 'Ẩn Danh') + `</a>
                            <span>`+ moment(element.createdTime).fromNow() + `</span>
                        </div>
                        <div class="right-post d-flex">
                            ${accountID == element.forumPostAccountId ? `<a onclick="editItem(${element.id})"><img src="/happys/img/detail_forum/icon_comment.svg" /><span>Chỉnh sửa<span></a>
                            <a onclick="deleteComment(${element.id})"><img src="/happys/img/detail_forum/icon_delete.svg" /><span>Thu hồi<span></a>` : ``}
                        </div>
                    </div>
                    <div class="author_description" >
                        <p>`+ element.text + `</p>
                    </div>        
                </div>
                  ${accountID == element.forumPostAccountId ? `<div class="option-forum">
                        <i onclick="showOption(${element.id})" class="bi bi-three-dots-vertical"></i>
                        <div class="option-item" id="show-option-item-${element.id}">
                            <button type="button" onclick="closeModalId(${element.id})" class="close" data-dismiss="modal" aria-label="Close">
                              <span aria-hidden="true">&times;</span>
                            </button>
                            <button class="btn_commemt" onclick="editItem(${element.id})"><img src="/happys/img/detail_forum/icon_comment.svg" />Chỉnh sửa</button>
                            <button class="btn_commemt" onclick="deleteComment(${element.id})"><img src="/happys/img/detail_forum/icon_delete.svg" />Thu hồi</button>
                        </div>
                    </div>
                    ` : ``}
            </div>
        `;
        })
        $("#list_cmt_forum").html(contentComt);
    }
    catch (e) {

        $("#heade_cmt").text("Chưa có bình luận");
        $("#navigation").addClass("navigationHide");
    }

}
var modalVisible = false;
var idHover;
function showOption(id) {
    idHover = id;
    $(".option-item").hide();
    $("#show-option-item-" + id).show();
    modalVisible = true;
}

//load danh mục diễn đàn
async function loadCategorySideBar() {
    var result = await httpService.getAsync("forumcategory/api/typical-category");
    $("#typical-category").html('');
    if (result.status == "200") {
        var query = result.data
        query.forEach(function (item) {
            if (item.lastedPost == null) {
                $("#typical-category").append(`
                    <li class="d-flex cate_item">
                        <img src="`+ item.photo + `" class="photo_cte_sidebar" alt="category">
                        <a href="/app/danh-sach-dien-dan?id=`+ item.id + `&&token= `+ token +`">` + item.name + `</a> 
                    </li>
                `
                )
            }
        })
    }
}

var back_bottom_btn = $("#back-to-bottom");
$(window).scroll(function () {
    if ($(window).scrollTop() < 300) {
        back_bottom_btn.removeClass("d-none")
    } else {
        back_bottom_btn.addClass("d-none")
    }
});

back_bottom_btn.on("click", function (e) {
    e.preventDefault();
    var scrollBottom = $(document).height() - $(window).height() - $(window).scrollTop();
    $("html, body").animate({ scrollTop: scrollBottom }, "800");
});

var updateItemId = 0;
var editObj;
async function editItem(id) {
    $("#show-option-item-" + id).hide();
    var postContentOffsetTop = $('#btn_cmt').offset().top;

    // Scroll đến vị trí nhập bình luận
    $("html, body").animate({ scrollTop: postContentOffsetTop - 450 }, "slow");

    updateItemId = id;

    if (id > 0) {
        editObj = await getItemById(id);
    }
    if (editObj != null) {
        if (editor.getData() == "" && editObj.text != "") {
            editor.setData(editObj.text);

        } else if (editor.getData() != "") {
            editor.setData("");
        }
    }
    $(window).animate({ scrollTop: $(document).height() + $(window).height() });
}
async function getItemById(id) {
    var data;
    await $.ajax({
        url: systemURL + "forumpost/api/DetailForumEndUser/" + id,
        method: "GET",
        success: function (responseData) {
            data = responseData.data[0];
        },
        error: function (e) {
        },
    });
    return data;
}
async function updateComment() {

    if (editor.getData() != "" && editor.getData() != null) {
        let parentId = id;
        let forumPostType = $(".input_checkbox[name=hideaccount]:checked").val()
        var forumElement = await httpService.getAsync("forumPost/api/detail/" + id);

        var updatingObj = {
            "id": updateItemId,
            "parentId": id,
            "active": 1,
            "forumPostTypeId": forumPostType ? forumPostType : systemConstant.notification_status_read,
            "forumPostStatusId": forumElement.data[0].forumPostStatusId,
            "forumCategoryId": forumElement.data[0].forumCategoryId,
            "forumPostAccountId": 0,
            "photo": null,
            "video": null,
            "commentCount": null,
            "likeCount": null,
            "url": "",
            "name": forumElement.data[0].name,
            "description": null,
            "downloadLink": null,
            "text": editor.getData(),
            "publishedTime": formatDatetimeUpdate(moment(new Date()).format("DD/MM/YYYY HH:mm:ss")),
            "createdTime": formatDatetimeUpdate(moment(new Date()).format("DD/MM/YYYY HH:mm:ss"))
        }


        if (updateItemId == 0) {

            updatingObj.id = 1;
            delete updatingObj["id"];

            var result = await httpService.postAsync("forumPost/api/addcmt", updatingObj)
            if (result.status == '201' && result.message == 'CREATED') {
                renderConfetti();
                Swal.fire(
                    "Thành công",
                    "Đã comment",
                    "success"
                );

                let element = $(".pagination_default")
                $("#heade_cmt").text("Tất cả bình luận");
                LoadPagingPage("forumpost/api/countCmt?id=" + id, element, loadCmt, 6);
            }
            else if (result.status == '401') {
                window.href('/dang-nhap')
            }
            editor.setData("");
        }
        else {
            updatingObj.forumPostAccountId = accountID;
            var result = await httpService.postAsync("forumPost/api/UpdateCmt", updatingObj);

            if (result.status == '200' && result.message == 'SUCCESS') {
                renderConfetti();
                Swal.fire(
                    "Thành công",
                    "Sửa comment",
                    "success"
                );

                let element = $(".pagination_default")
                $("#heade_cmt").text("Tất cả bình luận");
                LoadPagingPage("forumpost/api/countCmt?id=" + id, element, loadCmt, 6);
            }
            else if (result.status == '401') {
                window.href('/dang-nhap')
            }
            editor.setData("");
        }
    }
    else {
        Swal.fire({
            icon: "error",
            title: "Xin mời nhập thông tin bình luận!",
        });
    }
}
async function deleteComment(id) {
    $("#show-option-item-" + id).hide();
    Swal.fire({
        title: 'Thu hồi bình luận?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Xoá',
        cancelButtonText: 'Huỷ'
    }).then(async (res) => {
        if (res.isConfirmed) {
            var updatingObj = {
                "id": id,
                "parentId": id,
                "active": 1,
                "forumPostTypeId": 0,
                "forumPostStatusId": 0,
                "forumCategoryId": 0,
                "forumPostAccountId": 0,
                "photo": null,
                "video": null,
                "commentCount": null,
                "likeCount": null,
                "url": "",
                "name": "",
                "description": null,
                "downloadLink": null,
                "text": editor.getData(),
                "publishedTime": formatDatetimeUpdate(moment(new Date()).format("DD/MM/YYYY HH:mm:ss")),
                "createdTime": formatDatetimeUpdate(moment(new Date()).format("DD/MM/YYYY HH:mm:ss"))
            }
            var result = await httpService.postAsync("forumPost/api/DeletePermanently", updatingObj);

            if (result.status == '200' && result.message == 'SUCCESS') {
                renderConfetti();
                Swal.fire(
                    "Thành công",
                    "Đã xóa comment",
                    "success"
                );

                let element = $(".pagination_default")
                $("#heade_cmt").text("Tất cả bình luận");
                LoadPagingPage("forumpost/api/countCmt?id=" + id, element, loadCmt, 6);
            } else if (result.status == '401') {
                window.href('/dang-nhap')
            }
        }
    })
}
function formatDatetimeUpdate(dateStr) {
    //debugger;
    var [date, time] = dateStr.split(" ");
    var [day, month, year] = date.split("/");
    var localISOTime = year + "-" + month + "-" + day + "T" + time;
    return localISOTime;
}

// load thành viên nổi bật
async function LoadDataFeaturedAccount() {
    var result = await httpService.getAsync("forumpost/api/featured-account");
    $("#featureda-account").html('');
    if (result.status == "200") {
        var query = result.data
        query.forEach(function (item) {
            $("#featureda-account").append(`
                <div class="col-12" style="display: flex;align-items: center;">
                    <div class="featured-member-photo">
                        <img src=`+ (item.photoAccount ? item.photoAccount : "/images/default/NoImage.png") + `>
                    </div>
                    <div class="featured-member-detail">
                        <div class="featured-member-name" style="font-weight: bold;">
                            <a href="/app/thong-tin-thanh-vien/`+ item.username + `">` + item.authorName + ` </a>
                        </div>
                        <div class="forum-post-count">
                            `+ item.totalForumPost + ` bài viết
                        </div>
                    </div>
                </div>
            `
            )
        })
    }
}

$(document).ready(async function () {
    var textComment = `           
            <div class="text-comment">
                Bình Luận
            </div>
            `
    $("#text-comment").append(textComment);
    moment.locale("vi");
    await loadDetailForum();
    await loadCategorySideBar();
    await LoadDataFeaturedAccount();
    CKEDITOR.ClassicEditor.create(document.getElementById("postContent"), {
        toolbar: {
            items: [
                'undo', 'redo',
                '|',
                'insertImage',
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
        placeholder: 'Nhập bình luận',
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

    //editor = CKEDITOR.replace('postContent', {
    //    toolbar: [
    //        { name: 'styles', items: ['Styles', 'Format'] },
    //        { name: 'clipboard', items: ['Cut', 'Copy', 'Paste', 'PasteText', 'PasteFromWord', '-', 'Undo', 'Redo'] },
    //        { name: 'editing', items: ['Find', 'SelectAll'] },
    //        { name: 'insert', items: ['Image', 'Table'] },
    //        { name: 'basicstyles', items: ['Bold', 'Italic', 'Underline'] },
    //        { name: 'paragraph', items: ['JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock', 'NumberedList', 'BulletedList',] },
    //    ]
    //});
    //CKEDITOR.on('dialogDefinition', function (e) {
    //    var dialogName = e.data.name;
    //    var dialog = e.data.definition.dialog;
    //    dialog.on('show', function () {
    //        setupCKUploadFile();
    //    });
    //});

    let element = $(".pagination_default")

    LoadPagingPage("forumpost/api/countCmt?id=" + id, element, loadCmt, 6);

    
    
    

})
function closeModalId(id) {
    $("#show-option-item-" + id).hide();
}

