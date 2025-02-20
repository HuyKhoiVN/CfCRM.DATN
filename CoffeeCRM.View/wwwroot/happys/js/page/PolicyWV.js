$(document).ready(function () {
    loadDetailPost();
});

async function loadDetailPost() {
    try {
        const postId = "1000157"
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
                    </div>`

            $(newRow).appendTo($("#postDetail"));
        }
    } catch (e) {
        console.log(e.message);
    }
}
