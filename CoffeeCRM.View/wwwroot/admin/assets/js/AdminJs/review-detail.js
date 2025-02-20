var updatingItemId = 0;
var editObj;
var tableUpdating = 0;
var table;
var tableStaff;
var staffId = @ViewBag.accountReviewId;
var roleId = @ViewBag.roleId;
var handleContent = "";
var reviewDetailId = 0;
var myDropzone;
var itemReportDetailExplaining;
const submitButton = document.getElementById('btnUpdateItem');
$("#btnTableSearch").click(function () {
    tableSearch();
});
$("#btnTableResetSearch").click(function () {
    $(".tableheaderFillter").val("").trigger("change");
    tableSearch();
});
$('#search-input').on("input", function () {
    table.search($(this).val()).draw();
});
$('#search-staff').on("input", function () {
    tableStaff.search($(this).val()).draw();
});
// Xét chiều rộng cho phần thay đổi nhân viên
var parent = document.querySelector('.info-sale');
var child1 = document.querySelector('.info-sale-avatar');
var child2 = document.querySelector('.info-sale-content');
var remainingWidth = parent.clientWidth - child1.clientWidth;
child2.style.width = remainingWidth + 'px';

// Xét chiều rộng cho phần tổng quan
// var parent_summary = document.querySelector('.parent-info-summary');
// var child1_summary = document.querySelector('.child1-info-summary');
// var child2_summary = document.querySelector('.child2-info-summary');
// var child3_summary = document.querySelector('.child3-info-summary');
// var remainingWidth = parent_summary.clientWidth - child1_summary.clientWidth - child2_summary;
// child3_summary.style.width = remainingWidth + 'px';
function editItem(id) {
    if (id == 0) {
        window.location.href = systemURL + "review/admin/create/" + staffId;
    } else {
        window.location.href = `/reviewDetail/admin/EditReviewDetail/` + id
    }
}
function destroyTableStaff() {
    tableStaff.destroy();
}
const renderListStaff = () => {
    tableStaff = $('#tableStaffData').DataTable({
        processing: true,
        serverSide: true,
        paging: true,
        searching: { regex: true },
        "oLanguage": {
            "sUrl": "/js/Vietnamese.json"
        },
        ajax: {
            url: systemURL + "account/api/staff-list-server-side",
            type: "POST",
            contentType: "application/json",
            dataType: "json",
            data: function (d) {
                d.searchAll = $("#search-staff").val();
                return JSON.stringify(d);
            }
        },
        columns: [
            {
                data: "id",
                render: function (data, type, row, meta) {
                    if (row.photo == null) {
                        row.photo = "/images/userdefault.jpg";
                    }
                    return `
                                    <div class="list-group-item list-group-item-action" onClick="selectStaff(${row.id})" style="padding-top: 15px; cursor: pointer">
                                        <div class="d-flex justify-content-between">
                                            <div class="d-flex gap-3">
                                                <img style="object-fit: cover; border-radius: 50%" class="accountPhoto" height="32" width="32" src="${row.photo}" alt="User">
                                                <div class="d-flex flex-column">
                                                    <span style="line-height: 14.7px;" class="fs-14" id="renderName">${row.fullName}</span>
                                                    <div class="d-flex gap-3">
                                                        <p style="display: inline-block; min-width: 111px; font-size:12px; color: #044688" id="renderRole">${row.roleName}</p>
                                                        <p style="font-size:12px; color: #044688; margin-left:6px;" id="renderId">MS: ${row.zipCode}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>`;
                },
            }
        ],
        columnDefs: [
            { targets: "no-sort", orderable: false },
            { targets: "no-search", searchable: false }
        ],
        aLengthMenu: [
            [5],
            [5]
        ],
        lengthChange: false,
        dom: 'tipr',
    });
}
$(document).ready(function () {
    var currentMonth = new Date().getMonth() + 1;
    var currentYear = new Date().getFullYear();
    $("#fileter-month").val(currentMonth).trigger("change");
    var startYear = 2020;
    for (let year = startYear; year <= currentYear; year++) {
        $('#fileter-year').append(new Option(year, year, false, false));
    }
    $('#fileter-year').val(currentYear).trigger("change");
    accountDetail();
    loadStatus();
    loadErrorType();
    loadData();
    if (roleId != 1003) { // SALER
        $("#staff-write-report").css("display", "none");
    }
    // Datetime picker
    document.querySelectorAll(".datepicker").forEach(function (item) {
        new tempusDominus.TempusDominus(item, datePickerOption);
    })
    $(".datepicker").on('dp.change', function (e) {
        this.value = moment(this.value).format("YYYY-MM-DD HH:mm:ss");
    });
    //Flat pickr format
    $("#filterCreatedTime_input").flatpickr({
        dateFormat: "d/m/Y",
        mode: "range",
    });
    $("#created-open-flatpickr").click(function () {
        $("#filterCreatedTime_input").click();
    });
    $("#created-clear-flatpickr").click(function () {
        $("#filterCreatedTime_input").val("");
        tableSearch();
    });

    $("#filterApproved_input").flatpickr({
        dateFormat: "d/m/Y",
        mode: "range",
    });
    $("#approved-open-flatpickr").click(function () {
        $("#filterApproved_input").click();
    });
    $("#approved-clear-flatpickr").click(function () {
        $("#filterApproved_input").val("");
        tableSearch();
    });

    $('.dataSelect').select2();

    $("#tableData thead:nth-child(2) tr th input").keypress(function (e) {
        let key = e.which;
        if (key == 13) {
            tableSearch();
        }
    });
    $("#btnTableResetSearch").click(function () {
        $(".tableheaderFillter").val("").trigger("change");
        tableSearch();
    });

    $("#errorType").on("change", function () {
        tableSearch();
    });
    $("#reviewDetailStatus").on("change", function () {
        tableSearch();
    });
    $("#filterCreatedTime_input").on("change", function () {
        tableSearch();
    });
    $("#filterApproved_input").on("change", function () {
        tableSearch();
    });
    $("#fileter-month, #fileter-year").on('change', function () {
        table.draw();
        loadSummaryReviewDetailError();
    });
    myDropzone = new Dropzone("#kt_dropzonejs_upload", {
        url: "/api/file-explorer/upload-file", // Set the url for your upload script location
        paramName: "file", // The name that will be used to transfer the file
        maxFilesize: 10, // MB
        addRemoveLinks: true,
        init: function () {
            this.on('sending', function (file, xhr, formData) {
                // Append all form inputs to the formData Dropzone will POST
                formData.append('folderUploadId', 1003);
                formData.append('adminAccountId', 1000);
                formData.append('files', file);
            });
            this.on('success', function (file, response) {
                $(this.element).find(`img[alt='${file.name}']`).attr('src', response.data[0][0].path);
            });
        }
    });
});
function loadData() {
    initTable();
    loadSummaryReviewDetailError();
}
function accountDetail() {
    $.ajax({
        url: systemURL + "account/api/account-detail/" + staffId,
        type: "GET",
        contentType: "application/json",
        success: function (responseData) {
            if (responseData.status == 200 && responseData.message === "SUCCESS") {
                $("#staff-name").text(responseData.data[0].fullName);
                $("#staff-role-name").text(responseData.data[0].roleName);
            }
        },
        error: function (e) {

        }
    });
}
function initTable() {
    table = $('#tableData').DataTable({
        processing: true,
        serverSide: true,
        paging: true,
        searching: { regex: true },
        order: [9, 'desc'],
        "oLanguage": {
            "sUrl": "/js/Vietnamese.json"
        },
        ajax: {
            url: systemURL + "reviewDetail/api/list-server-side",
            type: "POST",
            contentType: "application/json",
            dataType: "json",
            data: function (d) {
                d.searchAll = $("#search-input").val();
                d.accountReviewId = staffId;
                d.errorPenaltyIds = $("#filterErrorPenaltyId").val();
                d.month = $("#fileter-month").val();
                d.year = $("#fileter-year").val();
                return JSON.stringify(d);
            }
        },
        columns: [
            {
                data: 'id',
                render: function (data, type, row, meta) {
                    var info = table.page.info();
                    var stt = meta.row + 1 + info.page * info.length;
                    return stt;
                }
            },

            {
                data: "userReview",
                render: function (data, type, row, meta) {
                    return ` <div style='display: flex; flex-direction: row; gap: 10px; align-content: center'>
                                         <div>
                                                     <img class='accountPhoto' height='32' width='32' src='${row.photo != null && row.photo != "" ? row.photo : '/images/userdefault.jpg'}' alt='User'>
                                         </div>
                                         <div style= 'display: flex; flex-direction:column; gap: 4px;'>
                                             <span style='line-height: 14.7px;' class='fs-14' id='row1001-column-id'>${row.userReview}</span>
                                             <p style='font-size:12px;line-height: 12.6px; color: #044688;'>
                                               <span style='display: inline-block; font-size:12px; color: #044688; text-transform: capitalize'>${row.roleName}</span>
                                               <span>MS:${row.zipCode}</span>
                                             </p>
                                         </div>
                                     </div>`;
                },
            },

            {
                data: "errorType",
                render: function (data, type, row, meta) {
                    return "<span id='row" + row.id + "-column-id'>" + row.errorNameAndType.errorType.name + "<span>";
                },
            },
            {
                data: "errorName",
                render: function (data, type, row, meta) {
                    return "<span id='row" + row.id + "-column-id'>" + row.errorNameAndType.errorName + "<span>";
                },
            },
            {
                data: "detailError",
                render: function (data, type, row, meta) {
                    return "<span id='row" + row.id + "-column-id'>" + row.detailError + "<span>";
                },
            },

            {
                data: "contentRequest",
                render: function (data, type, row, meta) {
                    return "<span id='row" + row.id + "-column-id'>" + row.contentRequest + "<span>";
                },
            },

            {
                data: "penaltyScore",
                render: function (data, type, row, meta) {
                    row.penaltyScore = row.penaltyScore ?? 0;
                    if (row.penaltyTypeId == @PenaltyTypeConst.MINUS_MONEY) {
                        return "<span id='row" + row.id + "-column-id' style='color: #FA3F3F;'>" + (0 - (row.penaltyValue * row.occuredTime)).toLocaleString('vi', { style: 'currency', currency: 'VND' }) + "<span>";
                    }
                    else if (row.penaltyTypeId == @PenaltyTypeConst.MINUS_POINT && row.penaltyScore >= 5) {
                        return "<span id='row" + row.id + "-column-id' style='color: #FA3F3F;'>" + (0 - ((row.penaltyScore - 4) * 50000)).toLocaleString('vi', { style: 'currency', currency: 'VND' }) + "<span>";
                    }
                    else {
                        return "<span id='row" + row.id + "-column-id' style='color: #FA3F3F;'>" + (0 - row.penaltyScore) + "<span>";
                    }

                },
            },
            {
                data: "occuredTime",
                render: function (data, type, row, meta) {
                    return "<span id='row" + row.id + "-column-id'>" + row.occuredTime + "<span>";
                },
            },
            {
                data: "processing",
                render: function (data, type, row, meta) {
                    return "<span id='row" + row.id + "-column-id'>" + row.processing + "<span>";
                },
            },

            {
                data: "createdTime",
                render: function (data) {
                    var tempDate = new Date(data);
                    var displayValue = moment(data).format("DD/MM/YYYY HH:mm");
                    return displayValue;
                }
            },
            {
                data: "approveTime",
                render: function (data) {
                    var tempDate = new Date(data);
                    var displayValue = data != null ? moment(data).format("DD/MM/YYYY HH:mm") : "---";
                    return displayValue;
                }
            },
            {
                data: "reviewDetailStatusName",
                render: function (data, type, row, meta) {
                    if (row.reviewDetailStatusId == @ReviewDetailStatusConst.NOTIFICATIONED) {
                        return "<span id='row" + row.id + "-column-id' class='badge py-3 px-4' style='color:#f5b50a; background-color: #f5f2bd; font-size: 13px'>" + row.reviewDetailStatusName + "<span>";
                    }
                    else if (row.reviewDetailStatusId == @ReviewDetailStatusConst.NOTED) {
                        return "<span id='row" + row.id + "-column-id' class='badge py-3 px-4' style='color:#04B440; background-color: #cdf0d9; font-size: 13px'>" + row.reviewDetailStatusName + "<span>";
                    }
                },
            },
            {
                data: 'id',
                render: function (data, type, row, meta) {
                    return "<div class='d-flex justify-content-center gap-2 cursor-pointer' onclick='infoReport(" + row.id + ")'><i class='ki-duotone ki-information-2 fs-2x text-primary'><span class='path1'></span><span class='path2'></span><span class='path3'> </span></i></div>";
                }
            },
            {
                data: 'id',
                render: function (data, type, row, meta) {
                    return "<div class='d-flex justify-content-center gap-2'>"
                        + "<div title='Xóa' onclick='deleteItem(" + row.id + ")' class='me-2 btn_manage cursor-pointer'><i class='ki-duotone ki-trash-square fs-2x text-danger'><span class='path1'></span><span class='path2'> </span><span class='path3'></span><span class='path4'> </span></i></div>"
                        + (row.reviewDetailStatusId == @ReviewDetailStatusConst.NOTIFICATIONED ? "<div title='Cập nhật' onclick='editItem(" + row.id + ")' class='me-2 btn_manage cursor-pointer'><i class='ki-duotone ki-notepad-edit fs-2x text-primary'><span class='path1'> </span><span class='path2'></span></i></div>" : "")
                        + "</div>";
                }
            }

        ],
        columnDefs: [
            { targets: "no-sort", orderable: false },
            { targets: "no-search", searchable: false },
            { orderable: false, targets: [-1, 0] },
        ],
        aLengthMenu: [
            [10, 25, 50, 100],
            [10, 25, 50, 100]
        ],
        drawCallback: function () {
            if (roleId != @RoleId.ACCOUNTANT && roleId != @RoleId.ADMIN) {
                $('#tableData tbody tr td:nth-child(14)').addClass('d-none');
            }
            $('#tableData tfoot').html("");
            $('#tableData tfoot tr').addClass("border-top");
        }
    });
}
function infoReport(id) {
    reviewDetailId = id;
    $("#modal-detail-report").modal("show");
    $("#list_error_img").html("");  // danh sách ảnh của kế toán tạo
    $("#list-info-report").html("");
    $.ajax({
        url: systemURL + "reviewDetail/api/detail-report/" + id,
        type: "GET",
        contentType: "application/json",
        success: function (responseData) {
            if (responseData.status == 200 && responseData.message === "SUCCESS") {
                let data = responseData.data[0];
                let listItemExplaining = [];
                let discriptionError = data.reviewDetail.description != "" ? data.reviewDetail.description : "Không có dữ liệu";
                let itemInfoError = `
                            <div class="d-flex flex-column gap-3 interface-detail-report">
                                <h4>Mô tả lỗi</h4>
                                <div class="form-floating">
                                    <textarea class="form-control" placeholder="Chưa có thông tin mô tả lỗi" id="detail-report" style="height: 80px;resize:none" readonly>${discriptionError}</textarea>
                                </div>
                                <h4>Hình ảnh</h4>
                                <div class="dropzone image_report_error" id="list_error_img">
                                </div>
                            </div>`;
                document.getElementById('list-info-report').innerHTML = itemInfoError;
                if (data.reviewDetail.photo != "") {
                    let listImg = JSON.parse(data.reviewDetail.photo);
                    if (listImg.length > 0) {
                        listImg.forEach(item => {
                            let img = document.createElement('img');
                            img.src = item;
                            img.width = 200;
                            img.height = 200;
                            document.getElementById('list_error_img').appendChild(img);
                        });
                    }
                } else {
                    let noData = document.createElement('p');
                    noData.textContent = "Không có dữ liệu";
                    document.getElementById('list_error_img').appendChild(noData);
                }
                if (data.listReviewDetailExplaining.length > 0) {
                    if (data.listReviewDetailExplaining.length >= 5) {
                        $("#staff-write-report").css("display", "none");
                        $("#submit-report").css("display", "none");
                    }
                    else {
                        $("#staff-write-report").css("display", "inline");
                        $("#submit-report").css("display", "inline");
                    }
                    data.listReviewDetailExplaining.forEach(item => {
                        $("#list_error_img_report_" + item.id).html("");
                        item.text = item.text != "" ? item.text : "Không có dữ liệu";
                        let itemExplaining = `
                                        <div class="d-flex flex-column gap-3 interface-detail-report">
                                            <h4>Phản hồi của nhân sự</h4>
                                            <div class="form-floating">
                                                <textarea class="form-control" id="detail-report" style="height: 80px;resize:none" readonly>${item.text}</textarea>
                                            </div>
                                            <h4>Hình ảnh</h4>
                                            <div class="dropzone image_report_error" id="list_error_img_report_${item.id}">
                                            </div>
                                        </div>
                                `;
                        listItemExplaining.push({ id: item.id, itemExplaining: itemExplaining, photo: item.photo });
                    });
                    if (listItemExplaining.length > 0) {
                        listItemExplaining.forEach(item => {
                            document.getElementById('list-info-report').innerHTML += item.itemExplaining;
                            let listImgReport = JSON.parse(item.photo);
                            if (listImgReport.length > 0) {
                                listImgReport.forEach(item1 => {
                                    let imgReport = document.createElement('img');
                                    imgReport.src = item1;
                                    imgReport.width = 200;
                                    imgReport.height = 200;
                                    document.getElementById('list_error_img_report_' + item.id).appendChild(imgReport);
                                });
                            } else {
                                let noData = document.createElement('p');
                                noData.textContent = "Không có dữ liệu";
                                document.getElementById('list_error_img_report_' + item.id).appendChild(noData);
                            }
                        })

                    }
                }

            }
        },
        error: function (e) {
            Swal.fire(
                'Lỗi!',
                'Đã xảy ra lỗi, vui lòng thử lại',
                'error'
            );
        }
    });
}
function writeReport() {
    $("#modal-detail-report").modal("hide");
    $("#modal-write-report").modal("show");
}
function submitDescription() {
    var listPhoto = [];
    var listPhotoName = [];
    $(".dz-image img").each(function () {
        listPhoto.push($(this).attr('src'));
        listPhotoName.push($(this).attr('alt'));
    });
    itemReportDetailExplaining = {
        reviewDetailId: reviewDetailId,
        text: $("#description-report").val(), // Nội dung phản hồi
        description: JSON.stringify(listPhotoName), // tên ảnh upload
        photo: JSON.stringify(listPhoto), // ảnh upload
        info: "reviewDetail/admin/list/" + staffId
    };
    Swal.fire({
        title: 'Xác nhận thay đổi?',
        text: "Bạn có muốn gửi phản hồi",
        icon: 'info',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#443',
        confirmButtonText: 'Xác nhận',
        cancelButtonText: 'Huỷ'
    }).then((result) => {
        if (result.value) {
            $.ajax({
                url: systemURL + "reviewDetailExplaining/api/staff-add-report",
                type: "POST",
                contentType: "application/json",
                data: JSON.stringify(itemReportDetailExplaining),
                success: function (responseData) {
                    if (responseData.status == 201 && responseData.message === "CREATED") {
                        reGenTable();
                        $("#modal-write-report").modal("hide");
                        infoReport(reviewDetailId);
                    }
                },
                error: function (e) {
                    toastr.error(
                        'Đã xảy ra lỗi, vui lòng thử lại',
                        'Lỗi!',
                        { timeOut: 0, extendedTimeOut: 0, closeButton: true, closeDuration: 0 }
                    );
                }
            })

        }
    });
}
function selectStaff(id) {
    let urlNew = systemURL + "reviewDetail/admin/list/" + id;
    window.history.pushState(null, null, urlNew);
    staffId = id;
    tableStaff.destroy();
    $("#exampleModal").modal('hide');
    reGenTable();
    accountDetail();
    loadStatus();
    loadErrorType();
}
function showErrorLog() {
    $("#modal-error").modal("show");
    $("#modal-error-body").text(handleContent);
}
async function deleteItem(id) {
    updatingObj = table.ajax.json().data.find(c => c.id == id);
    let objName = id > 0 ? updatingObj.errorNameAndType.errorName : "item";
    Swal.fire({
        title: 'Xác nhận thay đổi?',
        text: "Xóa " + objName + "",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Xóa',
        cancelButtonText: 'Huỷ'
    }).then((result) => {
        if (result.value) {
            $.ajax({
                url: systemURL + "reviewDetail/api/delete",
                type: "POST",
                contentType: "application/json",
                data: JSON.stringify({
                    "id": id,
                    "info": "reviewDetail/admin/list/" + staffId
                }),
                success: function (responseData) {
                    if (responseData.status == 200 && responseData.message === "SUCCESS") {
                        Swal.fire(
                            'Thành công!',
                            'Đã xóa ' + updatingObj.errorNameAndType.errorName + '.',
                            'success'
                        );
                        reGenTable();
                    }
                },
                error: function (e) {
                    Swal.fire(
                        'Lỗi!',
                        'Đã xảy ra lỗi, vui lòng thử lại',
                        'error'
                    );
                }
            });

        }
    });
}
async function getItemById(id) {
    var data;
    await $.ajax({
        url: systemURL + "reviewDetail/api/detail/" + id,
        method: "GET",
        success: function (responseData) {
            data = responseData.data[0];
        },
        error: function (e) {
        },
    });
    return data;
}
function reGenTable() {
    tableUpdating = 0;
    table.destroy();
    $(".tableHeaderFilter").val(null).trigger("change");
    $("#tableData tbody").html('');
    loadData();
}
function loadErrorType() {
    $.ajax({
        url: systemURL + "errorDictionaryCategory/api/error-types",
        method: "GET",
        success: function (responseData) {
            responseData.data.forEach(item => {
                $('#errorType').append(new Option(item.name, item.id, false, false));
            });
            $("#errorType").select2();
        },
        error: function (e) {
        },
    });
}
function loadStatus() {
    $.ajax({
        url: systemURL + "reviewDetailStatus/api/list",
        method: "GET",
        success: function (responseData) {
            responseData.data.forEach(item => {
                $('#reviewDetailStatus').append(new Option(item.name, item.id, false, false));
            });
            $("#reviewDetailStatus").select2();
        },
        error: function (e) {
        },
    });
}
function loadSummaryReviewDetailError() {
    var obj = {
        id: staffId,
        month: parseInt($("#fileter-month").val()),
        year: parseInt($("#fileter-year").val())
    }
    $.ajax({
        url: systemURL + "reviewDetail/api/summary-review-detail/" + staffId,
        type: "GET",
        contentType: "application/json",
        data: obj,
        success: function (responseData) {
            if (responseData.status == 200 && responseData.message === "SUCCESS") {
                var data = responseData.data[0];
                $("#count-violate").text(data.countError);
                $("#minus-point").text(0 - data.minusPoint);
                $("#minus-amount").text((0 - data.minusMoney).toLocaleString('vi', { style: 'currency', currency: 'VND' }));
                $("#handle-error").text(data.description);
            }
        },
        error: function () {
            $("#count-violate").text(0);
            $("#minus-point").text(0);
            $("#minus-amount").text(0);
            $("#handle-content").text("");
            handleContent = "";
        }
    });
}

function tableSearch() {
    table.column(1).search($("#tableData thead:nth-child(2) tr th:nth-child(2) input").val());
    table.column(2).search($("#errorType").val().join(','));
    table.column(3).search($("#tableData thead:nth-child(2) tr th:nth-child(4) input").val());
    table.column(4).search($("#tableData thead:nth-child(2) tr th:nth-child(5) input").val());
    table.column(5).search($("#tableData thead:nth-child(2) tr th:nth-child(6) input").val());
    table.column(6).search($("#tableData thead:nth-child(2) tr th:nth-child(7) input").val());
    table.column(7).search($("#tableData thead:nth-child(2) tr th:nth-child(8) input").val());
    table.column(8).search($("#tableData thead:nth-child(2) tr th:nth-child(9) input").val());
    table.column(9).search($("#tableData thead:nth-child(2) tr th:nth-child(10) input").val());
    table.column(10).search($("#tableData thead:nth-child(2) tr th:nth-child(11) input").val());
    table.column(11).search($("#reviewDetailStatus").val().join(','));
    table.draw();
}