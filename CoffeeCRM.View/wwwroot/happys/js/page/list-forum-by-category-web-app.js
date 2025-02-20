var currentURL = window.location.href;

// Tạo đối tượng URL từ URL hiện tại
var urlObject = new URL(currentURL);

// Lấy giá trị của tham số "id"
var forumCategoryId = urlObject.searchParams.get("id");
var formCategoryName;
$(document).ready(function () {
    //debugger;
    moment.locale("vi");
    LoadDataTypicalCategory();
    let element = $(".pagination_default")
    LoadPagingPage("forumpost/api/CountByCategory?id=" + forumCategoryId, element, loadPost, 10);
    LoadDataFeaturedAccount();
})

async function myFunction() {
    window.location.href = '/app/tao-moi-bai-viet?token='+localStorage.token;
}
//List danh mục diễn đàn
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
                            <a href="/app/danh-sach-dien-dan?id=${item.id}">` + item.name + `</a> 
                        </div>
                        
                    </li>
                `
                )
            }
        })
    }
}
//List danh sách bài viết diễn đàn 
var url = new URL(window.location.href);
var token = url.searchParams.get("token");
var loadPost = async function LoadDataListForumPost() {
    var result = await httpService.getAsync("forumpost/api/list-by-category?categoryId=" + forumCategoryId + "&pageIndex=" + pageIndex + "&pageSize=" + pageSize);
    $("#list-forum-post").html('');
    if (result.status == "200") {
        var query = result.data
        $("#title_categor_forum").text(query[0].forumCategoryName);
        query.forEach(function (item) {
            let cmtAccount = ``;
            item.listAccountCmt.forEach(function (e) {
                cmtAccount += `<li class="dropdown">
                    <a class="dropdown-toggle" href="#" role="button"
                        id="dropdownMenuLink" data-toggle="dropdown"
                        aria-haspopup="true" aria-expanded="false">
                        <img class="img_cmt" title="${e.accountForumTypeId != systemConstant.forum_post_type_waitting_id ? e.name : ``}" style="width:25px;height:25px;" src="${e.accountForumTypeId != systemConstant.forum_post_type_waitting_id ? e.photo : `/images/default/authdefaultimage.png`}" alt="">
                    </a>
                </li>`;
            })
            $("#list-forum-post").append(`
                <li >
                    <div class="media">
                        <a class="d-flex" href="/app/thong-tin-ca-nhan/${item.forumPostAccountId}?token=${token}">
                            <img class="rounded-circle"  src="${item.photoUser ? item.photoUser : "/images/default/NoImage.png"}" alt="">
                        </a>
                        <div class="media-body">
                            <div class="t_title">
                                <a href="/app/chi-tiet-bai-viet-dien-dan/${item.id}?token=${token}">
                                    <h4>`+ item.name + `</h4>
                                </a>
                            </div>
                                            
                            <h6>
                                <i class="icon_clock_alt"></i> `+ moment(item.publishedTime).fromNow() + `
                            </h6>
                        </div>
                        <div class="media-right">
                            <ul class="nav" >
                                ${cmtAccount}            
                            </ul>
                                            
                            <a class="count" href="#"><ion-icon name="chatbubbles-outline"></ion-icon> `+ (item.commentCount ? item.commentCount : 0) + `</a>
                        </div>
                    </div>
                </li>
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
                            <a href="/app/thong-tin-thanh-vien/` + item.username + `">` + item.authorName + `</a>
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