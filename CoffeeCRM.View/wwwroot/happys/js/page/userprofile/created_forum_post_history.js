"use strict";

var loadDataCreateForumPost = async function LoadForumPost() {
    try {
        var search = $("#searchCreatedForumPost").val();
        var result = await httpService.getAsync("forumpost/api/createdForumPostByAccountId?pageIndex=" + pageIndex + "&pageSize=" + pageSize + "&search=" + search + "");
        var html = '';
        $("#createdForumPost").html('');
        if (result.status == 200 && result.data.length == 0) {
            var statusAccept = `<i class="icon_check"></i> ` + 0 + ` bài đã duyệt`;
            var statusAwait = `<i class="icon_clock"></i> ` + 0 + ` bài chờ duyệt`;
            var statusCancel = `<i class="icon_error-circle_alt"></i>` + 0 + ` bài bị từ chối`;
            $("#forum-post-status-accept").html(statusAccept);
            $("#forum-post-status-await").html(statusAwait);
            $("#forum-post-status-cancel").html(statusCancel);
            html = `<div class="not-found d-flex flex-column align-items-center">
            <img style="width:400px;height:auto;" src="/images/default/not-found.png"/>
            <p>Chưa có dữ liệu hiển thị</p>
        </div>`;
            $("#createdForumPost").html(html);
            $(".pagination_default").hide();
        }
        if (result.status == 200 && result.data.length != 0) {
            var statusAccept = `<i class="icon_check"></i> ` + result.data[0].forumPostStatusCountAccept + ` bài đã duyệt`;
            var statusAwait = `<i class="icon_clock"></i> ` + result.data[0].forumPostStatusCountAwait + ` bài chờ duyệt`;
            var statusCancel = `<i class="icon_error-circle_alt"></i>` + result.data[0].forumPostStatusCountCancel + ` bài bị từ chối`;
            $("#forum-post-status-accept").html(statusAccept);
            $("#forum-post-status-await").html(statusAwait);
            $("#forum-post-status-cancel").html(statusCancel);
            result.data.forEach(function (item) {
                let status = '';
                if (item.forumPostStatusId == systemConstant.forumPostStatus_confirm) {
                    status = `<i class="icon_check"></i>`
                } if (item.forumPostStatusId == systemConstant.forumPostStatus_cancel) {
                    status = `<i class="icon_error-circle_alt"></i>`
                } if (item.forumPostStatusId == systemConstant.forumPostStatus_wait) {
                    status = `<i class="icon_clock"></i>`
                }
                let commentCount = item.commentCount == null ? 0 : item.commentCount
                let viewCount = item.viewCount == null ? 0 : item.viewCount
                let imageForumPost = item.photo == null ? "/images/default/NoImage.png" : systemURL + item.photo;
                html += `<li>
                    <div class="media">
                        <div class="media-body">
                            <div class="t_title">
                                <a href="dien-dan/chi-tiet-bai-viet/`+ item.id + `"
                                    target="_blank">
                                    <h4>`+ item.name + `</h4>
                                </a>
                            </div>
                            <a href="`+ systemURL + `list-forum-by-category?id=` + item.forumCategoryId + `" target="_blank">
                                <h6>
                                    <i class="icon_document"></i> `+ item.forumCategoryName + `
                                </h6>
                            </a>
                            
                            <div class="t_title">
                                <i class="icon_calendar"></i>
                                <h6 style="padding-left: 3px; padding-right: 20px;">
                                    Ngày đăng
                                </h6>`+ moment(item.publishedTime).format("DD-MM-YYYY HH:mm") + ` 
                            </div>
                        </div>
                        <div class="media-right">
                            <a class="count " href="dien-dan/chi-tiet-bai-viet/`+ item.id + `">
                                ${status}
                            </a>
                            <a class="count " href="dien-dan/chi-tiet-bai-viet/`+ item.id + `">
                                <i class="icon_chat"></i>`+ commentCount + `
                            </a>
                            <a class="count d-none" href="dien-dan/chi-tiet-bai-viet/`+ item.id + `">
                                <i class="fi fi-sr-eye"></i>`+ viewCount + `
                            </a>
                        </div>
                    </div>
                </li>`;
            });
            $("#createdForumPost").html(html);
            $(".pagination_default").show();
        }
    } catch (e) {
        $("#createdForumPostHistory").html(`<div class="not-found d-flex flex-column align-items-center">
            <img style="width:400px;height:auto;" src="/images/default/not-found.png"/>
            <p>Chưa có dữ liệu hiển thị</p>
        </div>`);
    }
    
}


$("#btnSearchCreatedForumPost").click(function () {
    loadDataCreateForumPost.call();
});

$('#searchCreatedForumPost').on('keyup', function (e) {
    if (e.key === 'Enter' || e.keyCode === 13) {
        // Thực hiện tìm kiếm khi phím Enter được nhấn
        loadDataCreateForumPost.call();
    }
});