"use strict";
var content = "Là một trong những bác sĩ đầu ngành về khám, điều trị các rối loạn tâm lý, tinh thần. Ngoài công tác khám chữa bệnh và giảng dạy, bác sĩ còn trực tiếp xuất bản các đầu sách chuyên môn, giáo trình giảng dạy về sức khỏe tinh thần.<br>Bác sĩ khám và điều trị hầu hết các rối loạn tinh thần và không hạn chế về độ tuổi.Đặc biệt người bệnh gặp các vấn đề về rối loạn về giấc ngủ: mất ngủ, ngủ nhiều, ác mộng, hoảng sợ khi ngủ, rối loạn nhịp thức ngủ, đi trong giấc ngủ(chứng miên hành),...có thể tham khảo thăm khám với bác sĩ."
const loadData = async () => {
    $(".featured-news-detail").html("")
    $(".doc_community_info").html("")
    $(".counserlors").html("")
    $(".carousel-inner").html("")
    const listPost = await httpService.getAsync("post/api/list_top_3");
    const listForum = await httpService.getAsync("forumPost/api/list-forum-post-top-3");
    const listCounselors = await httpService.getAsync("Account/api/ListCounselor?pageIndex=" + 1 + "&pageSize=" + 4 + "&accountId=" + accountId);
    if (listPost.status == "200") {
        listPost.data.forEach( (item, index) => {
            var indexSlide = index == 0 ? 'active' : ''
            var currentValue = item.publishedTime
            var date = new Date(currentValue);
            var newValue = date.toLocaleDateString('vi-VN') + " " + date.toLocaleTimeString("vi-VN");
            var datePost = newValue.split(" ")

            $(".featured-news-detail").append(`
        <div class="featured-news-first shadow-sm wow fadeInUp" style="visibility: visible; animation-name: fadeInUp;">
                    
                    <div class="featured-news-body">
                    <div class="photo-post">
                        <a href="/chi-tiet-bai-viet/`+ item.id + `"><img src="` + item.photo + `" alt=""></a>
                    </div>
                        <a class="post_name" href="/chi-tiet-bai-viet/`+ item.id + `" style="color: black">
                            `+ item.name + `
                        </a>
                        <a class="post-overview">
                           `+ item.description + `
                        </a>
                    </div>
                    <div class="media post_author">
                            <div class="round_img">
                                <a href="thong-tin-ca-nhan/`+ item.username + `"><img src="` + item.authorImage + `" alt=""></a>
                            </div>
                            <div class="media-body author_text">
                                <a href="thong-tin-ca-nhan/`+ item.username + `" style="color: black;"><b>` + item.authorName + `</b><a/>
                            </div>
                            <div class="post-publish-time">`+ datePost[0] + `</div>
                        </div>
                </div>
        `)
        })
    }
    if (listForum.status == "200") {
        const topPost = listForum.data.slice(0, 3)
        topPost.forEach((item) => {
            var currentValue = item.publishedTime
            var date = new Date(currentValue);
            var newValue = date.toLocaleDateString('vi-VN') + " " + date.toLocaleTimeString("vi-VN");
            var dateForum = newValue.split(" ")
            const comment = item.commentCount == null ? 0 : item.commentCount
            const view = item.viewCount == null ? 0 : item.viewCount
            var img = "/images/default/authdefaultimage.png";
            var account = ``
            item.listAccountCmt.forEach((e) => {
                var link = e.accountForumTypeId == systemConstant.forum_post_type_incognito_id ? "" : "href = 'thong-tin-ca-nhan/" + e.userName + "'"
                    account += `<a ` + link +`><img title="${e.accountForumTypeId == systemConstant.forum_post_type_incognito_id ? "" : e.name}" src="${e.accountForumTypeId == systemConstant.forum_post_type_incognito_id ? img : e.photo}" /></a>`
            })
            const photo = item.photo == "" ? "/upload/admin/pngtree-the-man-cartoon-cartoon-man-man-picking-up-something-png-image_478887.jpg" : item.photo 
            $(".doc_community_info").append(`
             <div class="doc_community_item wow fadeInUp gap-xs-16px" data-wow-delay="0.1s">
                    <div class="doc_community_icon">
                        <img src="`+ photo + `" />
                    </div>
                    <div class="d-flex flex-column align-items-center justify-content-between doc_entry_content-container">
                        <div class="d-flex flex-row flex-xs-column align-items-end align-items-xs-start justify-content-between justify-content-xs-start w-100 gap-xs-10px">
                            <div class="doc_entry_content">
                                <a class="doc-entry-head" href="dien-dan/chi-tiet-bai-viet/`+ item.id + `-` + item.url +`">
                                    <h4>` + item.name + `</h4>
                                </a>
                                <div class="doc-entry-body">
                                    <div class="entry-left">
                                        <div class="info-logo">
                                            <img src="`+ item.photoCategory  +`" />
                                        </div>
                                        <a class="category-forum">
                                            `+ item.forumCategoryName + ` 
                                        </a>
                                        <div class="publish-time">
                                            `+ dateForum[0] + `
                                        </div>
                                    </div>
                                    <div class="entry-middle">
                                            `+ account +`
                                    </div>
                                    <div class="entry-right">
                                        <a href="dien-dan/chi-tiet-bai-viet/`+ item.id + `-` + item.url +`" class="count-comment">
                                            <div class="icon-comment">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="23" viewBox="0 0 22 23" fill="none">
                                                    <g clip-path="url(#clip0_1871_213322)">
                                                        <path d="M11.0073 21.7144C10.571 21.7144 10.1319 21.5604 9.78175 21.2497L6.34608 18.3557H3.66667C1.6445 18.3557 3.83036e-07 16.7112 3.83036e-07 14.6891V3.68815C-0.000916284 1.66598 1.64358 0.0214844 3.66575 0.0214844H18.3324C20.3546 0.0214844 21.9991 1.66598 21.9991 3.68815V14.6882C21.9991 16.7103 20.3546 18.3548 18.3324 18.3548H15.7181L12.1917 21.2698C11.8598 21.565 11.4354 21.7135 11.0064 21.7135L11.0073 21.7144ZM3.66575 1.85482C2.65467 1.85482 1.83242 2.67707 1.83242 3.68815V14.6882C1.83242 15.6992 2.65467 16.5215 3.66575 16.5215H6.68067C6.897 16.5215 7.106 16.5976 7.27192 16.7369L10.9817 19.8627L14.8042 16.7314C14.9692 16.5957 15.1754 16.5215 15.389 16.5215H18.3333C19.3444 16.5215 20.1667 15.6992 20.1667 14.6882V3.68815C20.1667 2.67707 19.3444 1.85482 18.3333 1.85482H3.66575Z" fill="black" />
                                                    </g>
                                                    <defs>
                                                        <clipPath id="clip0_1871_213322">
                                                            <rect width="22" height="22" fill="white" transform="translate(0 0.0214844)" />
                                                        </clipPath>
                                                    </defs>
                                                </svg>
                                            </div>
                                            `+ comment + `
                                        </a>
                                        
                                    </div>
                                </div>

                            </div>
                        </div>

                    </div>
                </div>
            `)
        })


    }
    if (listCounselors.status == "200") {
        const topCounselor = listCounselors.data.slice(0, 2)
        topCounselor.forEach((item) => {
            const description = item.description == null ? content : item.description
            $(".counserlors").append(`
            <div class="psychologist-detail shadow-sm wow fadeInUp" style="visibility: visible; animation-name: fadeInUp;">
                    <div class="psychologist-detail-content">
                        <div class="anh">
                            <img class="one" src="`+ item.photo + `" alt="">
                        </div>
                        <div class="detail-content">
                            <div class="psychologist">
                                <a href="chi-tiet-tu-van-vien?id=`+ item.accountId +`" class="psychologist-name">
                                    `+ item.accountName + `
                                </a>
                                <div class="psychologist-rating my-rating" data-rating="`+ item.totalRating + `">
                                    
                                </div>
                            </div>
                            <label class="psychologist-hospital psychologist-width">
                                `+ item.workingName + `
                            </label>
                            <label class="psychologist-hospital">
                                `+ item.healthFacilityName + `
                            </label>
                            <div class="psychologist-overview">
                                `+ description + `
                            </div>
                        </div>
                    </div>
                    <div class="info-footer">
                        <div class="interact">
                            <div class="interact-count">
                                <div class="number">
                                    `+ item.countInteract + `
                                </div>
                                <div class="count-text">
                                   Tương tác
                                </div>
                            </div>
                            <div>&verbar;</div>
                            <div class="interact-count">
                                <div class="number">
                                     `+ item.countBooking + `
                                </div>
                                <div class="count-text">
                                    Đặt lịch hẹn
                                </div>
                            </div>
                        </div>
                        <div class="click-option">
                            <a href="/thong-tin-ca-nhan?messageTo=`+ item.accountId +`" class="btn btn-primary inbox btn-lg btnHS2 shadow-lg rounded-pill">Nhắn tin</a>
                        </div>
                    </div>
                </div>
            `)
        })
    }

}

$(document).ready(async function () {
    await loadData.call();
});