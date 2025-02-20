$(document).ready(function () {
    loadDetailPost();
    loadPostCategoryOnHomePage();
    loadPostTagOnHomePage();
});

async function loadDetailPost() {
    try {
        const postId = "1000363";
        var result = await httpService.getAsync("post/api/detail-post/" + postId);
        if (result.status == 200) {
            var data = result.data[0];
            var currentValue = data.createdTime
            if (!currentValue.includes("T")) return
            var date = new Date(currentValue);
            var newValue = date.toLocaleDateString('vi-VN');

            var newRow = `
                    <div class="content">
                        <div class="content-title mb-3">
                            ${data.name}
                        </div>

                        <div class="content-img">
                            ${data.text}
                        </div>
                        <strong class="in-vn">

                        </strong>
                        <div class="content-img">
                            
                        </div>
                    </div>
                   `

            $(newRow).appendTo($("#postDetail"));
        }
    } catch (e) {
        console.log(e.message);
    }
}

//DASS - 21 được chứng minh là một công cụ đáng tin cậy và phù hợp để đánh giá các vấn đề sức khỏe tinh thần phổ biến như là trầm cảm và lo âu của thanh thiếu niên Việt Nam(nguồn: <a href="https://pubmed.ncbi.nlm.nih.gov/28723909/">https://pubmed.ncbi.nlm.nih.gov/28723909/</a>)