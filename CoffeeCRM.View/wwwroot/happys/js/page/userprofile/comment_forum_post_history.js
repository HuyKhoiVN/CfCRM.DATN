"use strict";

var loadDataCommentForumPost = async function LoadForumPost() {
    var search = $("#searchCommentForumPost").val();
    var result = await httpService.getAsync("forumpost/api/commentForumPostByAccountId?pageIndex=" + pageIndex + "&pageSize=" + pageSize + "&search=" + search + "");
    var html = '';
    //$("#commentForumPost").html('');
    if (result.status == 200 && result.data.length == 0) {
        //var statusAccept = `<i class="icon_check"></i> ` + 0 + ` bài đã duyệt`;
        //var statusAwait = `<i class="icon_clock"></i> ` + 0 + ` bài chờ duyệt`;
        //var statusCancel = `<i class="icon_error-circle_alt"></i>` + 0 + ` bài bị từ chối`;
        //$("#comment-forum-post-status-accept").html(statusAccept);
        //$("#comment-forum-post-status-await").html(statusAwait);
        //$("#comment-forum-post-status-cancel").html(statusCancel);
        html = `<div class="not-found d-flex flex-column align-items-center">
            <img style="width:400px;height:auto;" src="/images/default/not-found.png"/>
            <p>Chưa có dữ liệu hiển thị</p>
        </div>`;
        $("#comment-Forum-Post").html(html);
        $(".pagination_default").hide();
    }
    if (result.status == 200 && result.data.length != 0) {
        var statusAccept = `<i class="icon_check"></i> ` + result.data[0].forumPostStatusCountAccept + ` bài đã duyệt`;
        var statusAwait = `<i class="icon_clock"></i> ` + result.data[0].forumPostStatusCountAwait + ` bài chờ duyệt`;
        var statusCancel = `<i class="icon_error-circle_alt"></i>` + result.data[0].forumPostStatusCountCancel + ` bài bị từ chối`;
        $("#comment-forum-post-status-accept").html(statusAccept);
        $("#comment-forum-post-status-await").html(statusAwait);
        $("#comment-forum-post-status-cancel").html(statusCancel);
        result.data.forEach(function (item) {
            let commentCount = item.commentCount == null ? 0 : item.commentCount
            let viewCount = item.viewCount == null ? 0 : item.viewCount
            //let imageForumPost = item.photo == null ? "/images/default/NoImage.png" : systemURL + item.photo;
            let linkForumPostCategory = systemURL + "danh-sach-thu-muc-dien-dan?id=" + item.forumCategoryId;
            html += `<li>
                    <div class="media">
                        <div class="media-body">
                            <div class="t_title">
                                <a href="dien-dan/chi-tiet-bai-viet/`+ item.parentId +`"
                                    target="_blank">
                                    <h4>`+ item.name + `</h4>
                                </a>
                            </div>

                            <div class="t_title">
                            <a href="`+ linkForumPostCategory +`" target="_blank">
                                <h6>
                                    <i class="icon_document"></i> `+ item.forumCategoryName + `
                                </h6>
                            </a>
                            </div>                            

                            <div class="t_title">
                                <i class="icon_calendar"></i>
                                <h6 style="padding-left: 3px; padding-right: 20px;">
                                    Ngày đăng
                                </h6>`+ moment(item.publishedTime).format("DD-MM-YYYY HH:mm") + ` 
                            </div>
                        </div>
                        <div class="media-right">
                            <a class="count" href="dien-dan/chi-tiet-bai-viet/`+ item.id + `">
                                <i class="icon_chat"></i>`+ commentCount + `
                            </a>
                            <a class="count rate d-none" href="dien-dan/chi-tiet-bai-viet/`+ item.id +`">
                                <i class="fi fi-sr-eye"></i>`+ viewCount + `
                            </a>
                        </div>
                    </div>
                </li>`;
        });
        $("#comment-Forum-Post").html(html);
        $(".pagination_default").show();
    }
}

$("#btnSearchCommentForumPost").click(function () {
    loadDataCommentForumPost.call();
});

$('#searchCommentForumPost').on('keyup', function (e) {
    if (e.key === 'Enter' || e.keyCode === 13) {
        // Thực hiện tìm kiếm khi phím Enter được nhấn
        loadDataCommentForumPost.call();
    }
});