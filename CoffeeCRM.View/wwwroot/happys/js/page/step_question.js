var dataSource = [];
let indexWindow = 0;
let anwserList = $(".anwser");
let arraysScore = [];
var storedArraysPoint = localStorage.getItem('arraysScore');
let processQuyestion = $('#process-question');
var distance;
var totleDistance;
var backClick = $("#btn_question_back");
var completeClick = $("#btn_question_complete");
let preIconClick = $('#pre');
let nextIconClick = $('#next');
let surveyID = 1000001;
const render = async () => {
    let content = `<div class=" header_detail d-flex flex-row justify-content-around align-items-center">
            <div class="icon-click d-flex justify-content-center align-items-center" id="pre">
                <i class="bi bi-caret-left-fill"></i>
            </div>
            <div class="circle_1 d-flex align-items-center justify-content-center" id="progess_survey">
                <div class="circle_2 d-flex align-items-center justify-content-center">
                    <p>`+ (indexWindow + 1) + `/21</p>
                </div>
            </div>
            <div class="icon-click d-flex justify-content-center align-items-center" id="next">
                <i class="bi bi-caret-right-fill"></i>
            </div>
        </div>
        <div class="detail_name" id="question_name" data-value="`+ dataSource[indexWindow].id + `">
            <p id="surveySection_name" class="d-none">`+ dataSource[indexWindow].surveySectionName +`</p>
            <p id="surveySection_description" class="d-none">`+ dataSource[indexWindow].surveySectionDescription +`</p>
            <p>`+ dataSource[indexWindow].name + `</p>
        </div>
        
        <div id="anwer_list" class="list_anwser d-flex flex-column align-items-center">
        
        </div>
     `;

    $("#question_box").html(content);

    var questionIndex = dataSource[indexWindow].listQuestionAnswer

    questionIndex.forEach(function (item, index) {
        let newRow = ` <button class="anwser" data-value="` + item.id +`" data-score="` + item.score + `">` + item.name + `</button>`;
        $("#anwer_list").append(newRow);
    })  
}

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
function DeleteFirework() {
    $(".div-firework").css("display", "none");
}
var arrayQuestion = [
    {
        id: 1000040,
        text: "Trong 1 tuần qua, mình thấy khó mà thoải mái được"
    },
    {
        id: 1000041,
        text: "Trong 1 tuần qua, mình bị khô miệng"
    },
    {
        id: 1000036,
        text: "Trong 1 tuần qua, mình dường như chẳng có chút cảm xúc tích cực nào"
    },
    {
        id: 1000035,
        text: "Trong 1 tuần qua, mình bị rối loạn nhịp thở (thở gấp, khó thở dù chẳng làm việc gì nặng)"
    },
    {
        id: 1000034,
        text: "Trong 1 tuần qua, mình thấy khó bắt tay vào công việc"
    },
    {
        id: 1000033,
        text: "Trong 1 tuần qua, mình có xu hướng phản ứng thái quá với mọi tình huống"
    },
    {
        id: 1000032,
        text: "Trong 1 tuần qua, mình bị ra mồ hôi (chẳng hạn như mồ hôi tay…)"
    },
    {
        id: 1000031,
        text: "Trong 1 tuần qua, mình thấy mình đang suy nghĩ quá nhiều"
    },
    {
        id: 1000030,
        text: "Trong 1 tuần qua, mình lo lắng về những tình huống có thể làm mình hoảng sợ hoặc biến mình thành trò cười"
    },
    {
        id: 1000029,
        text: "Trong 1 tuần qua, mình thấy mình chẳng có gì để mong đợi cả"
    },
    {
        id: 1000028,
        text: "Trong 1 tuần qua, mình thấy bản thân dễ bị kích động"
    },
    {
        id: 1000027,
        text: "Trong 1 tuần qua, mình thấy khó thư giãn được"
    },
    {
        id: 1000026,
        text: "Trong 1 tuần qua, mình cảm thấy chán nản, thất vọng"
    },
    {
        id: 1000025,
        text: "Trong 1 tuần qua, mình không chấp nhận được việc có cái gì đó xen vào cản trở việc mình đang làm"
    },
    {
        id: 1000024,
        text: "Trong 1 tuần qua, mình thấy mình gần như hoảng loạn"
    },
    {
        id: 1000023,
        text: "Trong 1 tuần qua, mình không thấy hăng hái với bất kỳ việc gì nữa"
    },
    {
        id: 1000022,
        text: "Trong 1 tuần qua, mình cảm thấy mình chẳng đáng làm người"
    },
    {
        id: 1000008,
        text: "Trong 1 tuần qua, mình thấy mình khá dễ phật ý, tự ái"
    },
    {
        id: 1000006,
        text: "Trong 1 tuần qua, mình nghe thấy rõ tiếng nhịp tim dù chẳng làm việc gì cả (ví dụ, tiếng nhịp tim tăng, tiếng tim loạn nhịp)"
    },
    {
        id: 1000005,
        text: "Trong 1 tuần qua, mình hay sợ vô cớ"
    },
    {
        id: 1000004,
        text: "Trong 1 tuần qua, mình thấy cuộc sống vô nghĩa"
    },
]
async function getAllQuestion() {
    let result = await httpService.getAsync("survey/api/GetAllQuestion/" + systemConstant.survey_id);
    dataSource = result.data;
    const sortedA = Array.from(dataSource)
        .reduce((acc, item) => {
            acc[arrayQuestion.findIndex(itemB => itemB.id === item.id)] = item;
            return acc;
        }, {});
    dataSource = Object.values(sortedA);
}


$(document).on("click", ".anwser", function (e) {
    const value = this.getAttribute('data-score');
    const idAnswer = this.getAttribute('data-value');
    const idQuestion = $("#question_name").data('value');
    const surveySectionName = $('#surveySection_name').text();
    const surveySectionDescription = $('#surveySection_description').text();

    if (indexWindow < dataSource.length - 1) {
        if (!arraysScore[indexWindow]) {
            arraysScore[indexWindow] = {
                surveySectionId: dataSource[indexWindow].surveySectionId,
                surveySectionAccountId: 0,
                questionId: idQuestion,
                name: surveySectionName,
                description: surveySectionDescription,
                answerId: idAnswer,
                score: value,
                active: 1
            }
        }
        else {
            arraysScore[indexWindow].score = Number(value)
        }
        localStorage.setItem('arraysScore', JSON.stringify(arraysScore));

        indexWindow++;

        //nếu mà từ câu số 2 đi thì hiển thị nút quay lại
        if (indexWindow > 0 && indexWindow < dataSource.length - 1) {
            $("#btn_question_back").removeClass("d-none");
        }
        else if (indexWindow == dataSource.length) {
            $("#btn_question_complete").removeClass("d-none");
            $("#btn_question_homepage").removeClass("d-none");
        }

        for (const btnRemove of anwserList) {
            btnRemove.classList.remove('selected')
        }

        //tăng thanh quá trình
        

        render()

        totleDistance = totleDistance + distance;
        $("#progess_survey").css("background", `conic-gradient(rgb(20, 112, 245) ${totleDistance}deg, #fff 0deg)`);

        let score = arraysScore[indexWindow] ? arraysScore[indexWindow].score : undefined

        if (score || score == 0) {
            let btns = $('.anwser');
            for (var btn of btns) {
                var $btn = $(btn)
                if (Number(btn.getAttribute('data-score')) == score) {
                    let btnElement = $('.anwser[data-score="' + score + '"]')
                    btnElement.addClass('selected')
                }
                else {
                    $btn.removeClass('selected');
                }
            }
        }
    }
    
    else if (indexWindow == dataSource.length - 1) {
        Swal.fire({
            icon: 'success',
            title: 'Hoàn thành bài trắc nghiệm',
            text: 'Bấm nút hoàn thành để xem kết quả',
            timer: 5000,
            showConfirmButton: false,
            willClose: () => {
                DeleteFirework();
            }
        });
        $(".div-firework").css("display", "block");
        if (!arraysScore[indexWindow]) {
            arraysScore[indexWindow] = {
                surveySectionId: dataSource[indexWindow].surveySectionId,
                surveySectionAccountId: 0,
                questionId: idQuestion,
                name: surveySectionName,
                description: surveySectionDescription,
                answerId: idAnswer,
                score: value,
                active: 1
            }
        }
        else {
            arraysScore[indexWindow].score = Number(value)
        }

        localStorage.setItem('arraysScore', JSON.stringify(arraysScore));

        if (indexWindow > 0 && indexWindow < dataSource.length - 1) {
            $("#btn_question_back").removeClass("d-none");
        }
        else if (indexWindow == dataSource.length - 1) {
            $("#btn_question_complete").removeClass("d-none");
            $("#btn_question_homepage").removeClass("d-none");
        }

        for (const btnRemove of anwserList) {
            btnRemove.classList.remove('selected')
        }

        render()
        totleDistance = (distance * (indexWindow + 1)) + 4;
        $("#progess_survey").css("background", `conic-gradient(rgb(20, 112, 245) ${totleDistance}deg, #fff 0deg)`);
        let score = arraysScore[indexWindow] ? arraysScore[indexWindow].score : undefined

        if (score || score == 0) {
            let btns = $('.anwser');
            for (var btn of btns) {
                var $btn = $(btn)
                if (Number(btn.getAttribute('data-score')) == score) {
                    let btnElement = $('.anwser[data-score="' + score + '"]')
                    btnElement.addClass('selected')
                }
                else {
                    $btn.removeClass('selected');
                }
            }

        }
    }

})

$(document).on("click", "#btn_question_back", function (e) {
    let storedArraysPoint = localStorage.getItem('arraysScore');

    if (storedArraysPoint) {
        // Chuyển đổi chuỗi JSON thành đối tượng JavaScript và lưu vào biến toàn cục
        arraysScore = JSON.parse(storedArraysPoint);
        let indexMax = arraysScore.length - 1;
    } else {
        // Nếu giá trị không tồn tại trong Local Storage, tạo một mảng mới và lưu vào biến toàn cục
        arraysScore = [];
    }
    let indexMax = arraysScore.length - 1;
    
    if (indexWindow <= dataSource.length - 1) {

        if (indexWindow >= 1) {
            indexWindow--;
        }

        $("#btn_question_complete").addClass("d-none");
        $("#btn_question_homepage").addClass("d-none");
        render()
        totleDistance = 4 + (distance * (indexMax + 1));
        $("#progess_survey").css("background", `conic-gradient(rgb(20, 112, 245) ${totleDistance}deg, #fff 0deg)`);
        if (indexWindow == 0) {
            $("#btn_question_back").addClass("d-none");
        }

        for (const btnRemove of anwserList) {
            btnRemove.classList.remove('selected')
        }

        let score = arraysScore[indexWindow] ? arraysScore[indexWindow].score : undefined
        if (score || score == 0) {
            let btns = $('.anwser');
            for (var btn of btns) {
                var $btn = $(btn)
                if (Number(btn.getAttribute('data-score')) == score) {
                    let btnElement = $('.anwser[data-score="' + score + '"]')
                    btnElement.addClass('selected')
                }
                else {
                    $btn.removeClass('selected');
                }
            }
        }
    }
});
$("#btn_question_homepage").on("click", function () {
    window.location.href = "/";
});
$(document).on("click", "#pre", function (e) {
    let storedArraysPoint = localStorage.getItem('arraysScore');
    if (storedArraysPoint) {
        // Chuyển đổi chuỗi JSON thành đối tượng JavaScript và lưu vào biến toàn cục
        arraysScore = JSON.parse(storedArraysPoint);
    } else {
        // Nếu giá trị không tồn tại trong Local Storage, tạo một mảng mới và lưu vào biến toàn cục
        arraysScore = [];
    }
    let indexMax = arraysScore.length - 1;
    
    if (indexWindow <= dataSource.length - 1) {

        if (indexWindow >= 1) {
            indexWindow--;
        }
        

        $("#btn_question_complete").addClass("d-none");
        $("#btn_question_homepage").addClass("d-none");
        for (const btnRemove of anwserList) {
            btnRemove.classList.remove('selected')
        }

        render()
        totleDistance = 4 + (distance * (indexMax + 1));
        $("#progess_survey").css("background", `conic-gradient(rgb(20, 112, 245) ${totleDistance}deg, #fff 0deg)`);
        if (indexWindow == 0) {
            $("#btn_question_back").addClass("d-none");
        }

        let score = arraysScore[indexWindow] ? arraysScore[indexWindow].score : undefined
        if (score || score == 0) {
            let btns = $('.anwser');
            for (var btn of btns) {
                var $btn = $(btn)
                if (Number(btn.getAttribute('data-score')) == score) {
                    let btnElement = $('.anwser[data-score="' + score + '"]')
                    btnElement.addClass('selected')
                }
                else {
                    $btn.removeClass('selected');
                }
            }

        }
    }

})


$(document).on("click", "#next", function (e) {

    let storedArraysPoint = localStorage.getItem('arraysScore');
    if (storedArraysPoint) {
        // Chuyển đổi chuỗi JSON thành đối tượng JavaScript và lưu vào biến toàn cục
        arraysScore = JSON.parse(storedArraysPoint);
    } else {
        // Nếu giá trị không tồn tại trong Local Storage, tạo một mảng mới và lưu vào biến toàn cục
        arraysScore = [];
    }

    if (arraysScore[indexWindow] == undefined) {
        Swal.fire({
            icon: 'warning',
            title: 'Mời bạn chọn đáp án!!!',

        });
    }
    else {
        if (indexWindow < dataSource.length - 1) {

            indexWindow++;

            render()

            let indexMax = arraysScore.length;
            totleDistance = 4 + (distance * (indexMax + 1));
            $("#progess_survey").css("background", `conic-gradient(rgb(20, 112, 245) ${totleDistance}deg, #fff 0deg)`);

            if (indexWindow > 0) {
                $("#btn_question_back").removeClass("d-none");
            }
            if (indexWindow == dataSource.length - 1) {
                $("#btn_question_complete").removeClass("d-none");
                $("#btn_question_homepage").removeClass("d-none");
            }

            for (const btnRemove of anwserList) {
                btnRemove.classList.remove('selected')
            }

            let score = arraysScore[indexWindow] ? arraysScore[indexWindow].score : undefined

            if (score || score == 0) {
                let btns = $('.anwser');
                for (var btn of btns) {
                    var $btn = $(btn)
                    if (Number(btn.getAttribute('data-score')) == score) {
                        let btnElement = $('.anwser[data-score="' + score + '"]')
                        btnElement.addClass('selected')
                    }
                    else {
                        $btn.removeClass('selected');
                    }
                }

            }
        }
        
    }
})

function removeVietnameseTones(str) {
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
    str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
    str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
    str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
    str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
    str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
    str = str.replace(/Đ/g, "D");
    // Some system encode vietnamese combining accent as individual utf-8 characters
    // Một vài bộ encode coi các dấu mũ, dấu chữ như một kí tự riêng biệt nên thêm hai dòng này
    str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // ̀ ́ ̃ ̉ ̣  huyền, sắc, ngã, hỏi, nặng
    str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // ˆ ̆ ̛  Â, Ê, Ă, Ơ, Ư
    // Remove extra spaces
    // Bỏ các khoảng trắng liền nhau
    str = str.replace(/ + /g, " ");
    str = str.trim();
    // Remove punctuations
    // Bỏ dấu câu, kí tự đặc biệt
    str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g, " ");
    return str;
}

$(document).on("click", "#btn_question_complete", async function (e) {

    let storedArraysPoint = localStorage.getItem('arraysScore');

    if (storedArraysPoint) {
        // Chuyển đổi chuỗi JSON thành đối tượng JavaScript và lưu vào biến toàn cục
        arraysScore = JSON.parse(storedArraysPoint);
    } else {
        // Nếu giá trị không tồn tại trong Local Storage, tạo một mảng mới và lưu vào biến toàn cục
        arraysScore = [];
    }
    let data = {
        "surveyAccount": {},
        "surveySectionAccount": [],
        "sectionAccountDetail": arraysScore
    }
    $("#loading").addClass("show");
    let surveyAccountId = await httpService.postAsync("surveyAccount/api/AddSurveySecctionAccount?surveyID=" + surveyID, data);
   
    
    /*localStorage.setItem('resultSurvey', JSON.stringify(result));*/
    localStorage.removeItem("arraysScore");

    window.location.href = "/ket-qua-trac-nghiem-sktt/" + surveyAccountId.data[0];
    $("#loading").removeClass("show");
})

$(document).ready(async function () {
    
    var url = window.location.href;

    
    var parts = url.split('/');

    
    var idSurvey = parts[parts.length - 1];

    await getAllQuestion(idSurvey);

    if (storedArraysPoint) {
        // Chuyển đổi chuỗi JSON thành đối tượng JavaScript và lưu vào biến toàn cục
        arraysScore = JSON.parse(storedArraysPoint);

        indexWindow = arraysScore.length;
        if (indexWindow > 0 && indexWindow < dataSource.length - 1) {
            $("#btn_question_back").removeClass("d-none");
        }


    } else {
        // Nếu giá trị không tồn tại trong Local Storage, tạo một mảng mới và lưu vào biến toàn cục
        arraysScore = [];
    }

    if (indexWindow > 0) {

        if (indexWindow <= dataSource.length - 1) {

            await render();

            $("#btn_question_back").removeClass("d-none");

            let score = arraysScore[indexWindow] ? arraysScore[indexWindow].score : undefined

            if (score || score == 0) {
                let btns = $('.anwser');
                for (var btn of btns) {
                    var $btn = $(btn)
                    if (Number(btn.getAttribute('data-score')) == score) {
                        let btnElement = $('.anwser[data-score="' + score + '"]')
                        btnElement.addClass('selected')
                    }
                    else {
                        $btn.removeClass('selected');
                    }
                }

            }
        }
        else if (indexWindow == dataSource.length) {
            indexWindow--;

            await render();

            $("#btn_question_back").removeClass("d-none");
            $("#btn_question_complete").removeClass("d-none");
            $("#btn_question_homepage").removeClass("d-none");
            let score = arraysScore[indexWindow] ? arraysScore[indexWindow].score : undefined

            if (score || score == 0) {
                let btns = $('.anwser');
                for (var btn of btns) {
                    var $btn = $(btn)
                    if (Number(btn.getAttribute('data-score')) == score) {
                        let btnElement = $('.anwser[data-score="' + score + '"]')
                        btnElement.addClass('selected')
                    }
                    else {
                        $btn.removeClass('selected');
                    }
                }

            }
        }
    }
    else if (indexWindow == 0) {

        await render();
    }

    distance = (360 / dataSource.length);
    totleDistance = 4;

    if (indexWindow == 0) {
        $("#progess_survey").css("background", `conic-gradient(rgb(20, 112, 245) ${totleDistance}deg, #fff 0deg)`);
        totleDistance = 4
    }
    else {
        totleDistance = 4 + (distance * (indexWindow + 1));
        $("#progess_survey").css("background", `conic-gradient(rgb(20, 112, 245) ${totleDistance}deg, #fff 0deg)`);
    }

});

function convertFirstLetterToLowercase(inputString) {
    if (typeof inputString !== 'string') {
        console.error('Input must be a string');
        return;
    }

    if (inputString.length === 0) {
        console.warn('Input string is empty');
        return '';
    }

    return inputString.charAt(0).toLowerCase() + inputString.slice(1);
}