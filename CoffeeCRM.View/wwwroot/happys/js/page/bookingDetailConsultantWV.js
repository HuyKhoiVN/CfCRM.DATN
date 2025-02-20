var star = 0;
var ratingStar = 0;
var dataConsultant;

async function updateItem() {
    var updatingObj = {
        'id': dataConsultant.id,
        'accountId': accountConfirm,
        'counselorsId': dataConsultant.counselorId,
        'reason': dataConsultant.reason,
        'symptom': dataConsultant.symptom,
        'religiorelationship': dataConsultant.religiorelationship,
        'history': dataConsultant.history,
        'assessmentResult': dataConsultant.assessmentResult,
        'target': dataConsultant.target,
        'consultingResults': dataConsultant.consultingResults,
        'consultingPlan': dataConsultant.consultingPlan,
        'religiousNation': dataConsultant.religiousNation,
        'culturalLevel': dataConsultant.culturalLevel,
        'implementation': dataConsultant.implementation,
        'bookingId': dataConsultant.bookingId,
        'consultingTime': dataConsultant.consultingTime,
        'form': dataConsultant.form,
        'review': $("#review").val(),
        'rating': ratingStar,
        'createdTime': dataConsultant.createdTime,
    }

    Swal.fire({
        title: 'Phiếu đánh giá',
        html: "Bạn có chắc chắn muốn xác nhận phiếu đánh giá ?",
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#443',
        cancelButtonText: 'Hủy',
        confirmButtonText: 'Đồng ý',
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                url: systemURL + "consultant/api/update",
                type: "POST",
                contentType: "application/json",
                data: JSON.stringify(updatingObj),
                success: function (responseData) {
                    // debugger;
                    if (responseData.status == 200 && responseData.message === "SUCCESS") {
                        Swal.fire(
                            'Thành Công!',
                            'Đã xác nhận phiếu đánh giá thành công',
                            'success'
                        ).then(() => {
                            location.reload(true);
                        });
                    }
                },
                error: function (e) {
                    //console.log(e.message);
                    Swal.fire(
                        'Lỗi!',
                        'Đã xảy ra lỗi, vui lòng thử lại',
                        'error'
                    );
                }
            });
        }
    })
};

async function getDetailConsultantByBookingId(id) {
    $("#modal-export-consultant").modal('show');
    $("#modal-id-consultant").modal('hide');
    var data;
    await $.ajax({
        url: systemURL + "consultant/api/Consultant/" + id,
        method: "GET",
        success: function (responseData) {
            data = responseData.data[0];
            dataConsultant = data;
            if (data != null) {
                $("#full-name").val(data.accountName);
                $("#dob").val(moment(data.dob).format("DD/MM/YYYY"));
                $("#gender").val(data.gender = 'MALE' ? 'Nam' : 'Nữ');
                $("#religiousNation").val(data.religiousNation);
                $("#culturalLevel").val(data.culturalLevel);
                $("#phone-number").val(data.phone);
                $("#address-detail").val(data.address);
                $("#consultingTime").val(data.consultingTime);
                $("#booking-type").val(data.bookingTypeName);
                $("#conselor-name").val(data.counselorName);
                $("#booking-reason").text(data.reason);
                $("#symptom-user").text(data.symptom);
                $("#religiorelationship").text(data.religiorelationship);
                $("#history").text(data.history);
                $("#assessmentResult").text(data.assessmentResult);
                $("#target").text(data.target);
                $("#consultingResults").text(data.consultingResults);
                $("#consultingPlan").text(data.consultingPlan);
                $('.my-rating').starRating('setRating', data.rating);
                if (!(data.rating == null || data.rating == 0)) {
                    $('.my-rating').starRating('setReadOnly', true);
                    $("#btnSave").hide();
                }
                $("#review").text(data.review);
                if (!(data.review == null || data.review == "")) {
                    $("#review").attr("disabled", true);
                    $("#btnSave").hide();
                }
                if (data.accountId != accountConfirm) {
                    $("#btnSave").hide();
                }
            }
            else {
                $("#note").removeClass('d-none');
                $(".card_rating").css("display", "none");
                $(".consultant_result_header_content").removeClass("d-none");
                $("#btnSave").hide();
            }
        },
        error: function (e) {
        },
    });
    return data;
}


$(document).ready(function () {
    //$(".caption").addClass("d-none");
    //var url = new URL(window.location.href);
    //var pathUrl = url.pathname;
    //var urlArray = pathUrl.split('/')
    //var bookingId = urlArray[urlArray.length - 1];

    getDetailConsultantByBookingId(bookingId);
    $('#btnSave').click(function () {
        updateItem();
    });
    $(".my-rating").starRating({
        useGradient: false,
        starSize: 50,
        readOnly: false,
        disableAfterRate: false,
        starShape: 'rounded',
        callback: function (currentRating, $el) {
            // do something after rating
            //alert(currentRating);
            ratingStar = currentRating;
        }
    });
    if (checkRole == false) {
        $("#btnSave").hide();
    }
});