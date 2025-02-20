
var dataSource = [];
var idSurvey;
function formatDate(dateObject) {
    var d = new Date(dateObject);
    var day = d.getDate();
    var month = d.getMonth() + 1;
    var year = d.getFullYear();
    if (day < 10) {
        day = "0" + day;
    }
    if (month < 10) {
        month = "0" + month;
    }
    var date = day + "/" + month + "/" + year;

    return date;
};
async function showSurvey() {
    var result = await httpService.getAsync("survey/api/GetSurvey/" + systemConstant.survey_id);
    dataSource = result.data[0];
    idSurvey = dataSource.id;
    var detail_survey = $("#detail_survey");
    var newRow = `
        <div class="img_detail"><img src="/happys/img/survey/img_detail_survey.png"></div>
        <div class="instruct">
            <p>Chào em! Em có biết việc chăm sóc sức khỏe thể chất và sức khỏe tinh thần (hay còn được gọi là sức khỏe tâm thần) đều quan trọng như nhau không? Sức khỏe tinh thần tốt sẽ giúp em vui hơn trong quá trình chơi-học-chill với các bạn, với gia đình, và cũng giúp sức khỏe thể chất của em tốt hơn.
            </p>
            <p>Bản trắc nghiệm sức khỏe tinh thần dưới đây sẽ giúp em kiểm tra xem trong <span style="color:#EF4B7D;font-weight: 700;"> trong một tuần qua</span> sức khỏe tinh thần của mình thế nào. Không có câu trả lời đúng/sai trong bản trắc nghiệm này. Em hãy chọn ý đúng nhất với cảm nhận của em trong 1 tuần qua ở mỗi câu hỏi nhé!</p>
            <p>Thông tin về bản trắc nghiệm sức khỏe tinh thần có <a style="color:#007bff !important;font-weight: 700;" href="https://happy-s.vn/thong-tin-chi-tiet-ve-DASS-21"> ở đây </a> em nhé!</p>
        </div>
        <div class="btn_detail">
            <button class="btn btnHS2" id="begin_survey">Bắt đầu làm trắc nghiệm</button>
        </div>
       `;
    detail_survey.append(newRow);
}


 $(document).ready(async function () {
    await showSurvey();
    $('#begin_survey').click(function () {
        //KH bắt đầu lại thì xóa toàn bộ kết quả câu trả lời đã làm
        if (localStorage.getItem('arraysScore')) {
            localStorage.removeItem('arraysScore')
        }
        // Chuyển hướng đến liên kết mong muốn
        window.location.href = `/danh-sach-cau-hoi/` + idSurvey;
    });
})