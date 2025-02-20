
/*const accessKey = "Authorization";*/

$(document).ready(function () {
    LoadDataCategory();
    LoadDataTypicalCategory();
})
async function myFunction() {
    window.location.href = '/app/tao-moi-bai-viet';
}
async function LoadDataCategory() {
    var result = await httpService.getAsync("forumcategory/api/list-forum-category");
    $("#list-forum-category").html('');
    if (result.status == "200") {
        var query = result.data
        console.log(query)
        query.forEach(function (item) {
            if (item.lastedPost == null) {
                $("#list-forum-category").append(`
                <div class="forum border mb-3 shadow-sm wow fadeInUp" style="visibility: visible; animation-name: fadeInUp;">
                        <div class="row m-0" style="align-items: center;">
                            <div class="forum-topic col-lg-1 col-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 60 60" fill="none">
                                    <path d="M27.4844 3.25012C23.0454 3.66594 18.7796 5.18002 15.0717 7.65584C11.3638 10.1317 8.33043 13.4914 6.245 17.4321C4.15957 21.3728 3.08769 25.7705 3.12599 30.2288C3.1643 34.6872 4.31159 39.0658 6.46442 42.9701C6.66011 43.3483 6.77212 43.7642 6.79283 44.1896C6.81353 44.6149 6.74245 45.0397 6.58442 45.4351L5.04192 49.5501C4.75326 50.3171 4.68596 51.1498 4.8477 51.9532C5.00944 52.7566 5.39371 53.4984 5.95668 54.094C6.51965 54.6895 7.23867 55.1149 8.03171 55.3215C8.82475 55.5281 9.65991 55.5077 10.4419 55.2626L15.3644 53.7251C16.1233 53.4683 16.9523 53.5158 17.6769 53.8576C21.475 55.8443 25.6981 56.8805 29.9844 56.8776C31.8862 56.8755 33.7827 56.6786 35.6444 56.2901C42.3246 54.8282 48.1967 50.8757 52.0655 45.2371C55.9343 39.5984 57.5091 32.6974 56.4693 25.9386C55.4295 19.1798 51.8532 13.0713 46.4685 8.85625C41.0837 4.64122 34.2951 2.6365 27.4844 3.25012Z" fill="#FFB91D" />
                                    <path d="M30 26.875H20C19.5027 26.875 19.0258 26.6775 18.6742 26.3258C18.3225 25.9742 18.125 25.4973 18.125 25C18.125 24.5027 18.3225 24.0258 18.6742 23.6742C19.0258 23.3225 19.5027 23.125 20 23.125H30C30.4973 23.125 30.9742 23.3225 31.3258 23.6742C31.6775 24.0258 31.875 24.5027 31.875 25C31.875 25.4973 31.6775 25.9742 31.3258 26.3258C30.9742 26.6775 30.4973 26.875 30 26.875Z" fill="white" />
                                    <path d="M40 36.875H20C19.5027 36.875 19.0258 36.6775 18.6742 36.3258C18.3225 35.9742 18.125 35.4973 18.125 35C18.125 34.5027 18.3225 34.0258 18.6742 33.6742C19.0258 33.3225 19.5027 33.125 20 33.125H40C40.4973 33.125 40.9742 33.3225 41.3258 33.6742C41.6775 34.0258 41.875 34.5027 41.875 35C41.875 35.4973 41.6775 35.9742 41.3258 36.3258C40.9742 36.6775 40.4973 36.875 40 36.875Z" fill="white" />
                                    <path d="M29.9787 56.8803C27.2469 56.8817 24.5314 56.4601 21.9287 55.6303C21.4546 55.4791 21.06 55.1458 20.8317 54.7037C20.6034 54.2616 20.56 53.7469 20.7112 53.2728C20.8624 52.7987 21.1957 52.4041 21.6378 52.1758C22.0799 51.9475 22.5946 51.9041 23.0687 52.0553C28.1939 53.6653 33.7197 53.4406 38.6972 51.4196C43.6747 49.3986 47.7931 45.7076 50.3452 40.9804C52.8973 36.2532 53.7238 30.7849 52.6827 25.5147C51.6416 20.2444 48.798 15.5011 44.6401 12.0994C40.4822 8.69772 35.2696 6.84994 29.8975 6.87341C24.5255 6.89689 19.3292 8.79015 15.2012 12.2281C11.0732 15.666 8.27113 20.4339 7.27614 25.7131C6.28115 30.9922 7.1554 36.4531 9.74872 41.1578C10.2079 42.0093 10.477 42.9502 10.5374 43.9157C10.5979 44.8811 10.4482 45.8483 10.0987 46.7503L8.55622 50.8678C8.51151 50.9765 8.5 51.096 8.52314 51.2113C8.54627 51.3265 8.60302 51.4323 8.68622 51.5153C8.7652 51.6023 8.86761 51.6646 8.98114 51.6947C9.09467 51.7249 9.2145 51.7216 9.32622 51.6853L16.3637 49.4853C16.5988 49.4119 16.846 49.3856 17.0913 49.4077C17.3365 49.4299 17.575 49.5002 17.7931 49.6145C18.0112 49.7288 18.2046 49.885 18.3624 50.0741C18.5201 50.2632 18.6391 50.4815 18.7125 50.7166C18.7858 50.9516 18.8122 51.1988 18.79 51.4441C18.7679 51.6894 18.6976 51.9278 18.5833 52.1459C18.469 52.364 18.3128 52.5575 18.1237 52.7152C17.9346 52.873 17.7163 52.9919 17.4812 53.0653L10.4462 55.2628C9.6642 55.5079 8.82905 55.5283 8.03601 55.3217C7.24296 55.115 6.52395 54.6897 5.96098 54.0941C5.39801 53.4986 5.01374 52.7568 4.852 51.9534C4.69026 51.15 4.75755 50.3173 5.04622 49.5503L6.58872 45.4353C6.74675 45.0399 6.81783 44.6151 6.79712 44.1898C6.77642 43.7644 6.66441 43.3485 6.46872 42.9703C3.74468 38.0205 2.64988 32.3381 3.33987 26.7306C4.02986 21.123 6.46955 15.8756 10.3123 11.7338C14.155 7.59202 19.2053 4.76664 24.7455 3.65913C30.2857 2.55161 36.0341 3.21829 41.1738 5.56444C46.3135 7.91058 50.583 11.8169 53.3758 16.7282C56.1686 21.6395 57.3425 27.3061 56.7307 32.9227C56.1189 38.5394 53.7526 43.8203 49.968 48.0153C46.1834 52.2102 41.173 55.1057 35.6487 56.2903C33.7837 56.6796 31.8839 56.8773 29.9787 56.8803Z" fill="#381313" />
                                </svg>
                            </div>
                            <div class="col-lg-4 col-10 p-0">
                                <div class="forum-title">
                                    <a href="/chu-de-dien-dan" class="forum-category">
                                        `+ item.name + `
                                    </a>
                                    <div class="forum-detail">
                                        `+ item.description + `
                                    </div>
                                </div>
                            </div>
                            <div class="forum-topic-detail col-lg-2 d-flex justify-content-end">
                                
                            </div>
                            <div class="forum-topic-detail col-lg-2 d-flex justify-content-end">
                                `+ item.countPost + `
                            </div>
                            <div class="forum-topic-detail col-lg-3 d-flex justify-content-end" style="font-weight: bold;padding-right: 32px;">
                                
                                <div class="forum-author">
                                    <div class="author-name ml-2">
                                        Chưa có bài viết mới
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
            `)
            } else {
                $("#list-forum-category").append(`
                <div class="forum border mb-3 shadow-sm wow fadeInUp" style="visibility: visible; animation-name: fadeInUp;">
                        <div class="row m-0" style="align-items: center;">
                            <div class="forum-topic col-lg-1 col-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 60 60" fill="none">
                                    <path d="M27.4844 3.25012C23.0454 3.66594 18.7796 5.18002 15.0717 7.65584C11.3638 10.1317 8.33043 13.4914 6.245 17.4321C4.15957 21.3728 3.08769 25.7705 3.12599 30.2288C3.1643 34.6872 4.31159 39.0658 6.46442 42.9701C6.66011 43.3483 6.77212 43.7642 6.79283 44.1896C6.81353 44.6149 6.74245 45.0397 6.58442 45.4351L5.04192 49.5501C4.75326 50.3171 4.68596 51.1498 4.8477 51.9532C5.00944 52.7566 5.39371 53.4984 5.95668 54.094C6.51965 54.6895 7.23867 55.1149 8.03171 55.3215C8.82475 55.5281 9.65991 55.5077 10.4419 55.2626L15.3644 53.7251C16.1233 53.4683 16.9523 53.5158 17.6769 53.8576C21.475 55.8443 25.6981 56.8805 29.9844 56.8776C31.8862 56.8755 33.7827 56.6786 35.6444 56.2901C42.3246 54.8282 48.1967 50.8757 52.0655 45.2371C55.9343 39.5984 57.5091 32.6974 56.4693 25.9386C55.4295 19.1798 51.8532 13.0713 46.4685 8.85625C41.0837 4.64122 34.2951 2.6365 27.4844 3.25012Z" fill="#FFB91D" />
                                    <path d="M30 26.875H20C19.5027 26.875 19.0258 26.6775 18.6742 26.3258C18.3225 25.9742 18.125 25.4973 18.125 25C18.125 24.5027 18.3225 24.0258 18.6742 23.6742C19.0258 23.3225 19.5027 23.125 20 23.125H30C30.4973 23.125 30.9742 23.3225 31.3258 23.6742C31.6775 24.0258 31.875 24.5027 31.875 25C31.875 25.4973 31.6775 25.9742 31.3258 26.3258C30.9742 26.6775 30.4973 26.875 30 26.875Z" fill="white" />
                                    <path d="M40 36.875H20C19.5027 36.875 19.0258 36.6775 18.6742 36.3258C18.3225 35.9742 18.125 35.4973 18.125 35C18.125 34.5027 18.3225 34.0258 18.6742 33.6742C19.0258 33.3225 19.5027 33.125 20 33.125H40C40.4973 33.125 40.9742 33.3225 41.3258 33.6742C41.6775 34.0258 41.875 34.5027 41.875 35C41.875 35.4973 41.6775 35.9742 41.3258 36.3258C40.9742 36.6775 40.4973 36.875 40 36.875Z" fill="white" />
                                    <path d="M29.9787 56.8803C27.2469 56.8817 24.5314 56.4601 21.9287 55.6303C21.4546 55.4791 21.06 55.1458 20.8317 54.7037C20.6034 54.2616 20.56 53.7469 20.7112 53.2728C20.8624 52.7987 21.1957 52.4041 21.6378 52.1758C22.0799 51.9475 22.5946 51.9041 23.0687 52.0553C28.1939 53.6653 33.7197 53.4406 38.6972 51.4196C43.6747 49.3986 47.7931 45.7076 50.3452 40.9804C52.8973 36.2532 53.7238 30.7849 52.6827 25.5147C51.6416 20.2444 48.798 15.5011 44.6401 12.0994C40.4822 8.69772 35.2696 6.84994 29.8975 6.87341C24.5255 6.89689 19.3292 8.79015 15.2012 12.2281C11.0732 15.666 8.27113 20.4339 7.27614 25.7131C6.28115 30.9922 7.1554 36.4531 9.74872 41.1578C10.2079 42.0093 10.477 42.9502 10.5374 43.9157C10.5979 44.8811 10.4482 45.8483 10.0987 46.7503L8.55622 50.8678C8.51151 50.9765 8.5 51.096 8.52314 51.2113C8.54627 51.3265 8.60302 51.4323 8.68622 51.5153C8.7652 51.6023 8.86761 51.6646 8.98114 51.6947C9.09467 51.7249 9.2145 51.7216 9.32622 51.6853L16.3637 49.4853C16.5988 49.4119 16.846 49.3856 17.0913 49.4077C17.3365 49.4299 17.575 49.5002 17.7931 49.6145C18.0112 49.7288 18.2046 49.885 18.3624 50.0741C18.5201 50.2632 18.6391 50.4815 18.7125 50.7166C18.7858 50.9516 18.8122 51.1988 18.79 51.4441C18.7679 51.6894 18.6976 51.9278 18.5833 52.1459C18.469 52.364 18.3128 52.5575 18.1237 52.7152C17.9346 52.873 17.7163 52.9919 17.4812 53.0653L10.4462 55.2628C9.6642 55.5079 8.82905 55.5283 8.03601 55.3217C7.24296 55.115 6.52395 54.6897 5.96098 54.0941C5.39801 53.4986 5.01374 52.7568 4.852 51.9534C4.69026 51.15 4.75755 50.3173 5.04622 49.5503L6.58872 45.4353C6.74675 45.0399 6.81783 44.6151 6.79712 44.1898C6.77642 43.7644 6.66441 43.3485 6.46872 42.9703C3.74468 38.0205 2.64988 32.3381 3.33987 26.7306C4.02986 21.123 6.46955 15.8756 10.3123 11.7338C14.155 7.59202 19.2053 4.76664 24.7455 3.65913C30.2857 2.55161 36.0341 3.21829 41.1738 5.56444C46.3135 7.91058 50.583 11.8169 53.3758 16.7282C56.1686 21.6395 57.3425 27.3061 56.7307 32.9227C56.1189 38.5394 53.7526 43.8203 49.968 48.0153C46.1834 52.2102 41.173 55.1057 35.6487 56.2903C33.7837 56.6796 31.8839 56.8773 29.9787 56.8803Z" fill="#381313" />
                                </svg>
                            </div>
                            <div class="col-lg-4 col-10 p-0">
                                <div class="forum-title">
                                    <p class="forum-category">
                                        `+ item.name + `
                                    </p>
                                    <div class="forum-detail">
                                        `+ item.description + `
                                    </div>
                                </div>
                            </div>
                            <div class="forum-topic-detail col-lg-2 d-flex justify-content-end">
                                
                            </div>
                            <div class="forum-topic-detail col-lg-2 d-flex justify-content-end">
                                `+ item.countPost + `
                            </div>
                            <div class="forum-topic-detail col-lg-3 d-flex justify-content-end" style="font-weight: bold;padding-right: 32px;">
                                <div class="publishTime-forum">
                                    `+ moment(item.lastedPost.publishedTime, "YYYY-MM-DD HH:mm:ss").format("DD-MM-YYYY HH:mm:ss") + `
                                </div>
                                <div class="forum-author">
                                    <div class="author-name ml-2">
                                        <b>`+ item.authorName + `</b>
                                    </div>
                                    <a class="image-author ">
                                        <img src="`+ item.photoAccount + `">
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
            `)
            }

        })
    }
}

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

async function LoadDataCategory() {
    var result = await httpService.getAsync("forumcategory/api/list-forum-category");
    $("#list-category").html('');
    if (result.status == "200") {
        var query = result.data
        query.forEach(function (item) {
            $("#list-category").append(`
                <div class="post-header forums-header">
                        <div class="col-md-6 col-sm-6 support-info">
                            <span> `+ item.name + ` </span>
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
            item.forumCategories.forEach(function (data) {
                $("#list-category").append(`
                <div class="community-posts-wrapper bb-radius">

                        <!-- Forum Item -->
                 <div class="community-post style-two forum-item bug">
                            <div class="col-md-6 post-content">
                <div class="author-avatar forum-icon">
                 <img src=`+ data.photo + ` alt="community post">
                                </div>
                                <div class="entry-content">
                                    <a href="/app/danh-sach-thu-muc-dien-dan?id=`+ data.id + `"> <h3 class="post-title"> ` + data.name + ` </h3> </a>
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
        })
    }
}