

$(document).ready(function () {
    //debugger;
    LoadDataTypicalCategory();
    let element = $(".pagination_default")
    LoadPagingPage("forumpost/api/Count", element, loadPost, 10);
})

async function myFunction() {
    window.location.href = '/app/tao-moi-bai-viet';
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
                            <li>
                                <img src=`+ item.photo + ` alt="category">
                                <a href="#">`+ item.name + `</a> <span class="count">` + item.countPost + `</span>
                            </li>
                `
                )
            }
        })
    }
}
//List danh sách bài viết diễn đàn 
var loadPost = async function LoadDataListForumPost() {
    var result = await httpService.getAsync("forumpost/api/list-forum-post?pageIndex=" + pageIndex + "&pageSize=" + pageSize);
    $("#list-forum-post").html('');
    if (result.status == "200") {
        var query = result.data
        query.forEach(function (item) {
            $("#list-forum-post").append(`
                <li >
                                    <div class="media">
                                        <div class="d-flex">
                                            <img class="rounded-circle" src=`+ item.photo + ` alt="">
                                        </div>
                                        <div class="media-body">
                                            <div class="t_title">
                                                <a href="chi-tiet-bai-viet-dien-dan/1000001?token=${localStorage.token}">
                                                    <h4>`+ item.name + `</h4>
                                                </a>
                                            </div>
                                            
                                            <h6>
                                                <i class="icon_clock_alt"></i> `+ moment(item.publishedTime, "YYYY-MM-DD HH:mm:ss").format("DD-MM-YYYY HH:mm:ss") + `
                                            </h6>
                                        </div>
                                        <div class="media-right">
                                            <ul class="nav">
                                                <li class="dropdown">
                                                    <a class="dropdown-toggle" href="#" role="button"
                                                       id="dropdownMenuLink" data-toggle="dropdown"
                                                       aria-haspopup="true" aria-expanded="false">
                                                        <img src="/happys/img/forum/small-u-1.png" alt="">
                                                    </a>
                                                    <div class="dropdown-menu"
                                                         aria-labelledby="dropdownMenuLink">
                                                        <div class="media">
                                                            <div class="d-flex">
                                                                <img src="/happys/img/forum/user-hover-1.png" alt="">
                                                            </div>
                                                            <div class="media-body">
                                                                <a href="#">
                                                                    <h4>Jonah Terry</h4>
                                                                </a>
                                                                <a class="follow_btn" href="#">Follow</a>
                                                            </div>
                                                        </div>
                                                        <div class="row answere_items">
                                                            <div class="col-4">
                                                                <a href="#">
                                                                    <h4>Answers</h4>
                                                                </a>
                                                                <h6>30</h6>
                                                            </div>
                                                            <div class="col-4">
                                                                <a href="#">
                                                                    <h4>Question</h4>
                                                                </a>
                                                                <h6>40</h6>
                                                            </div>
                                                            <div class="col-4">
                                                                <a href="#">
                                                                    <h4>Followers</h4>
                                                                </a>
                                                                <h6>30</h6>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </li>
                                            </ul>
                                            
                                            <a class="count" href="#"><ion-icon name="chatbubbles-outline"></ion-icon> `+ item.commentCount + `</a>
                                            <a class="count" href="#"><ion-icon name="eye-outline"></ion-icon>`+ item.viewCount + ` </a>
                                        </div>
                                    </div>
                                </li>
            `)
        })
    }
}