var currentURL = window.location.href;

// Tạo đối tượng URL từ URL hiện tại
var urlObject = new URL(currentURL);

// Lấy giá trị của tham số "id"
var forumCategoryId = urlObject.searchParams.get("id");
var formCategoryName;


$(document).ready(function () {
    LoadDataFeaturedAccount();
    LoadDataTypicalCategory();
    LoadDataListForumPost();
    $(".forum-banner").addClass("d-none");
    $("#typical-category").removeClass("d-none");
})

async function myFunction() {
    window.location.href = '/tao-moi-bai-viet';
}

async function LoadDataTypicalCategory() {
    var result = await httpService.getAsync("forumcategory/api/typical-category");
    $("#typical-category").html('');
    if (result.status == "200") {
        var query = result.data
        query.forEach(function (item) {
            if (item.lastedPost == null) {
                $("#typical-category").append(`
                    <li class="d-flex justify-content-between">
                        <div class="d-flex">
                            <img src=`+ item.photo + ` alt="category">
                            <a href="/danh-sach-dien-dan?id=${item.id}">` + item.name + `</a> 
                        </div>
                        
                    </li>
                `
                )
            }
        })
    }
}


var currentCategory = [];
async function LoadDataListForumPost() {
    var result = await httpService.getAsync("forumCategory/api/list-forum-category");
    $("#list-forum-category").html('');
    if (result.status == "200") {
        var query = result.data
        currentCategory = query.find(x => x.id == forumCategoryId);
        console.log(currentCategory);

        //console.log(result);
        //currentCategory.forEach(function (item) {
        $("#list-category").append(`
                <div class="post-header forums-header">
                        <div class="col-md-6 col-sm-6 support-info">
                            <span> `+ currentCategory.name + ` </span>
                        </div>
                        <!-- /.support-info -->
                        <div class="col-md-6 col-sm-6 support-category-menus">
                            <ul class="forum-titles">
                                <li class="forum-topic-count"><b>Bài viết</b></li>
                                <li class="forum-reply-count"><b>Bình luận</b></li>
                                <li class="forum-freshness"><b>Bài viết mới</b></li>
                            </ul>
                        </div>
                        <!-- /.support-category-menus -->
                    </div>
                    
                       
                                `)
        currentCategory.forumCategories.forEach(function (data) {
            $("#list-category").append(`
                <div class="community-posts-wrapper bb-radius">
                 <div class="community-post style-two forum-item bug">
                            <div class="col-md-6 post-content">
                <div class="author-avatar forum-icon">
                 <img src=`+ data.photo + ` alt="community post">
                                </div>
                                <div class="entry-content">
                                    <a href="danh-sach-thu-muc-dien-dan?id=`+ data.id + `"> <h3 class="post-title"> ` + data.name + ` </h3> </a>
                                    <p></p>
                                </div>

                            </div>
                            <div class="col-md-6 post-meta-wrapper" id="related-forum-posts">
                                <ul class="forum-titles">
                                    <li class="forum-topic-count">`+ data.countPost + `</li>
                                    <li class="forum-reply-count">`+ data.countComment + `</li>
                                    <li class="forum-freshness">
                                        <div class="freshness-box">
                                            <div class="freshness-top">
                                                <div class="freshness-link">
                                                    <a href="#" title="">`+ moment(data.lastedPost.createdTime).fromNow() + `</a>
                                                </div>
                                            </div>
                                            <div class="freshness-btm">
                                                <a href="#" title="" class="bbp-author-link">
                                                    <div class="freshness-name">
                                                        <a href="#" title="" class="bbp-author-link">
                                                            <span class="bbp-author-name">`+ data.lastedPost.name + `</span>
                                                        </a>
                                                    </div>
                                                    <span class="bbp-author-avatar">
                                                        <img src=`+ data.lastedPost.photo + ` class="avatar photo">
                                                    </span>
                                                </a>
                                            </div>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                `)
            })
    }
}

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
                            <a href="${window.origin}/thong-tin-ca-nhan/` + item.username + `">` + item.authorName + `</a>
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