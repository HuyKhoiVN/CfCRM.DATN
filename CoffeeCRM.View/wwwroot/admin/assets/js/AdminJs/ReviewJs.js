// begin:Base load data
var showItem = ['id', 'name', 'accountId', 'templateId', 'penaltyScore', 'penaltyValue', 'penaltyOrther', 'createdTime'];
var dataSource = [];
var updatingItemId = 0;
var editObj;
var tableUpdating = 0;
var table;
const submitButton = document.getElementById('btnUpdateItem');
submitButton.addEventListener('click', function (e) {
    e.preventDefault();
    submitButton.setAttribute('data-kt-indicator', 'on');
    // Disable button to avoid multiple click
    submitButton.disabled = true;
    // Simulate form submission. For more info check the plugin's official documentation: https://sweetalert2.github.io/
    updateItem(updatingItemId);
});
$('#search-input').on("input", function () {
    table.search($(this).val()).draw();
});
$(document).ready(function () {
    var currentMonth = new Date().getMonth() + 1;
    var currentYear = new Date().getFullYear();
    $("#fileter-month").val(currentMonth).trigger("change");
    var startYear = 2020;
    for (let year = startYear; year <= currentYear; year++) {
        $('#fileter-year').append(new Option(year, year, false, false));
    }
    $('#fileter-year').val(currentYear).trigger("change");
    // Load data
    loadData();

    // Datetime picker
    document.querySelectorAll(".datepicker").forEach(function (item) {
        new tempusDominus.TempusDominus(item, datePickerOption);
    })
    $(".datepicker").on('dp.change', function (e) {
        // console.log(this.value);
        this.value = moment(this.value).format("YYYY-MM-DD HH:mm:ss");
        // console.log(this.value);
    });
    //Flat pickr format
    $("#filterCreatedTime_input").flatpickr({
        dateFormat: "d/m/Y",
        mode: "range",
    });
    $("#open-flatpickr").click(function () {
        $("#filterCreatedTime_input").click();
    });
    $("#clear-flatpickr").click(function () {
        $("#filterCreatedTime_input").val("");
    });

    $('.dataSelect').select2();


    $("#btnTableSearch").click(function () {
        tableSearch();
    });

    $("#tableData thead:nth-child(2) tr th input").keypress(function (e) {
        let key = e.which;
        if (key == 13) {
            $("#btnTableSearch").click();
        }
    });
    $("#btnTableResetSearch").click(function () {
        $(".tableheaderFillter").val("").trigger("change");
        tableSearch();
    });
    $("#fileter-month, #fileter-year").on('change', function () {
        table.draw();
    });
});
function loadData() {
    initTable();
}
function initTable() {
   
    table = $('#tableData').DataTable({
        processing: true,
        serverSide: true,
        paging: true,
        searching: { regex: true },
        order: [1, 'desc'],
        "oLanguage": {
            "sUrl": "/js/Vietnamese.json"
        },
        ajax: {
            url: systemURL + "review/api/list-server-side",
            type: "POST",
            contentType: "application/json",
            dataType: "json",
            data: function (d) {
                d.searchAll = $("#search-input").val();
                d.accountIds = $("#filterAccountId").val();
                d.penaltyTypeIds = $("#filterErrorDictionaryId").val();
                d.month = $("#fileter-month").val();
                d.year = $("#fileter-year").val();
                return JSON.stringify(d);
            }
        },
        columns: [
            //{
            //    data: 'id',
            //    render: function (data, type, row, meta) {
            //        var checkBox = ` <input type='checkbox'' id='${data}' name='' value=''>`;
            //        return checkBox; // This contains the row index
            //    }
            //},
            {
                data: 'id',
                render: function (data, type, row, meta) {
                    var info = table.page.info();
                    var stt = meta.row + 1 + info.page * info.length;
                    return `<span style=' font-size:14px;'>${stt}</span>`; // This contains the row index
                    //return `<span style=' font-size:14px;'>${data}</span>`; // This contains the row index

                }
            },

            //{
            //    data: "id",
            //    render: function (data, type, row, meta) {
            //        return "<span id='row" + row.id + "-column-id'>" + data + "<span>";
            //    },
            //},

            {
                data: "fullName",
                render: function (data, type, row, meta) {
                    //return "<span id='row" + row.id + "-column-id'>" + row.fullName + "<span>";
                    return ` <div style='display: flex; flex-direction: row; gap: 10px; align-content: center'>
                                 <div>
                                     <img class='accountPhoto' height='32' width='32' src='${row.photo != null && row.photo != "" ? row.photo : '/images/userdefault.jpg'}' alt='User'>
                                 </div>
                                 <div style= 'display: flex; flex-direction:column; gap: 4px; width: 100%'>
                                     <span style='line-height: 14.7px;' class='fs-14' id='row1001-column-id'>${row.fullName}</span>
                                        <strong>
                                     <p style='display: flex;flex-direction: row;justify-content: space-between;width: 100%;font-size:12px;line-height: 12.6px; color: #044688; margin: 0;text-wrap: nowrap;'>
                                     <span style='display: inline-block; min-width: 111px; font-size:12px; color: #044688; text-wrap:wrap;'>${row.accountTypeName}</span> MS: ${row.idStaff}
                                     </p>
                                     </strong>
                                 </div>
                             </div>`;
                },
            },

            //{
            //    data: "accountId",
            //    render: function (data, type, row, meta) {
            //        return "<span id='row" + row.id + "-column-id'>" + data + "<span>";
            //    },
            //},

            //{
            //    data: "templateId",
            //    render: function (data, type, row, meta) {
            //        return "<span id='row" + row.id + "-column-id'>" + data + "<span>";
            //    },
            //},

            {
                data: "penaltyScore",
                render: function (data, type, row, meta) {
                    //return "<span id='row" + row.id + "-column-id'>" + data + "<span>";
                    return `<div style='display: flex; flex-direction:column; gap: 4px;'>
                                <span style='line-height: 14.7px; padding-left: 5px' class='fs-14' id='row1001-column-id'>${data != null ? (0 - data) : 0}</span>
                            </div>`;
                },
            },

            {
                data: "totalPenaltyValue",
                render: function (data, type, row, meta) {
                    //return "<span id='row" + row.id + "-column-id'>" + data.toLocaleString('vi', { style: 'currency', currency: 'VND' }) + "<span>";
                    return `<div style='display: flex; flex-direction:column; gap: 4px;align-items: flex-end;text-align:right'>
                                <span style='line-height: 14.7px; padding-left: 5px; color: #FA3F3F; ' class='fs-14' id='row1001-column-id'>-${data != null ? data.toLocaleString('vi', { style: 'currency', currency: 'VND' }) : ''}</span>
                            </div>`;
                },
            },

            {
                data: "reviewInfo",
                render: function (data, type, row, meta) {
                    let isShow = true;
                    if (data.length == 0) {
                        isShow = false;
                    }
                    return ` <div><span class='ellipsis2' style='font-size:12px;line-height: 18px; color: #044688; margin: 0; white-space:normal;'>${data}</span><a class='show-more' onclick='showErrorLog(${row.id})' style="display:${(isShow ? "block" : "none")}">Xem thêm</a></div>`;
                },
            },
            {
                data: "reviewInfoList",
                render: function (data, type, row, meta) {
                    var option = '';
                    option += `<option value="0">Chưa quyết định</option>`;
                    data.forEach(function (item) {
                        option += `<option value="${item.id}" ${row.penaltyDecisionId === item.id ? 'selected' : ''}>${item.name}</option>`;
                    });
                    var selectElement = `<select class="form-select form-select-solid dataSelect" id="selectError-${row.id}" data-control="select2" disabled>
                                ${option}
                             </select>`;
                    return selectElement;
                },
            },
            {
                data: "totalNewError",
                render: function (data, type, row, meta) {
                    //return "<span id='row" + row.id + "-column-id'>" + data + "<span>";
                    return data != null ? `<div>
                                <span class='fs-14 error-background' id='row${row.id}-column-id'>${data}</span>
                            </div>` : '';
                },
            },
            //{
            //    data: "penaltyOrther",
            //    render: function (data, type, row, meta) {
            //        return "<span id='row" + row.id + "-column-id'>" + data + "<span>";
            //    },
            //},

            //{
            //    data: "print",
            //    render: function () {
            //        return `<td>
            //                    <a style="font-size:14px; color: #044688" href="#">in</a>
            //                </td>`;
            //    }
            //},

            {
                data: 'id',
                render: function (data, type, row, meta) {
                    return "<div class='d-flex justify-content-center gap-2'>"
                        + "<a title='Cập nhật' onclick='editItem(" + row.accountId + ")' class='me-2 btn_manage'><span class='svg-icon-success svg-icon  svg-icon-1 svg_teh009'><span class='svg-icon-primary svg-icon  svg-icon-1'> <svg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'><path opacity='0.3' fill-rule='evenodd' clip-rule='evenodd' d='M2 4.63158C2 3.1782 3.1782 2 4.63158 2H13.47C14.0155 2 14.278 2.66919 13.8778 3.04006L12.4556 4.35821C11.9009 4.87228 11.1726 5.15789 10.4163 5.15789H7.1579C6.05333 5.15789 5.15789 6.05333 5.15789 7.1579V16.8421C5.15789 17.9467 6.05333 18.8421 7.1579 18.8421H16.8421C17.9467 18.8421 18.8421 17.9467 18.8421 16.8421V13.7518C18.8421 12.927 19.1817 12.1387 19.7809 11.572L20.9878 10.4308C21.3703 10.0691 22 10.3403 22 10.8668V19.3684C22 20.8218 20.8218 22 19.3684 22H4.63158C3.1782 22 2 20.8218 2 19.3684V4.63158Z' fill='currentColor'></path><path d='M10.9256 11.1882C10.5351 10.7977 10.5351 10.1645 10.9256 9.77397L18.0669 2.6327C18.8479 1.85165 20.1143 1.85165 20.8953 2.6327L21.3665 3.10391C22.1476 3.88496 22.1476 5.15129 21.3665 5.93234L14.2252 13.0736C13.8347 13.4641 13.2016 13.4641 12.811 13.0736L10.9256 11.1882Z' fill='currentColor'></path><path d='M8.82343 12.0064L8.08852 14.3348C7.8655 15.0414 8.46151 15.7366 9.19388 15.6242L11.8974 15.2092C12.4642 15.1222 12.6916 14.4278 12.2861 14.0223L9.98595 11.7221C9.61452 11.3507 8.98154 11.5055 8.82343 12.0064Z' fill='currentColor'></path></svg></span></span></a>"

                    /*+ "<a title='Cập nhật' onclick='deleteItem(" + row.id + ")' class='me-2 btn_manage'><span class='svg-icon-success svg-icon  svg-icon-1 svg_teh009'><span class='svg-icon-danger svg-icon  svg-icon-1'><svg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M5 9C5 8.44772 5.44772 8 6 8H18C18.5523 8 19 8.44772 19 9V18C19 19.6569 17.6569 21 16 21H8C6.34315 21 5 19.6569 5 18V9Z' fill='currentColor'></path><path opacity='0.5' d='M5 5C5 4.44772 5.44772 4 6 4H18C18.5523 4 19 4.44772 19 5V5C19 5.55228 18.5523 6 18 6H6C5.44772 6 5 5.55228 5 5V5Z' fill='currentColor'></path><path opacity='0.5' d='M9 4C9 3.44772 9.44772 3 10 3H14C14.5523 3 15 3.44772 15 4V4H9V4Z' fill='currentColor'></path></svg></span></a>"*/
                    //return `<div class='d-flex gap-2'>
                    //            <a style='font-size:14px; color: #044688' href='#'>Xem chi tiết</a>
                    //        </div>`;

                }
            },

        ],
        columnDefs: [
            { targets: "no-sort", orderable: false },
            { targets: "no-search", searchable: false },
            { orderable: false, targets: [-1, 0, 4] },
        ],
        aLengthMenu: [
            [10, 25, 50, 100],
            [10, 25, 50, 100]
        ],
        drawCallback: function () {
            $('#tableData tfoot').html("");
            $("#tableData thead:nth-child(1) tr").clone(true).appendTo("#tableData tfoot");
            $('#tableData tfoot tr').addClass("border-top");
            $('.dataSelect').select2();
        }
    });
}
async function editItem(id) {
    var redirect = (id > 0 ? '/reviewDetail/admin/list/' + id : '/review/admin/create');
    window.location.href = redirect;
}

//async function editItem(id) {
//    updatingItemId = id;
//    $("#modal-id").modal('show');
//    if (id > 0) {
//        editObj = await getItemById(id);
//    }
//    $("#review-id").val(id > 0 ? editObj.id : "0");
//    $("#review-active").val(id > 0 ? editObj.active : "");
//    $("#review-name").val(id > 0 ? editObj.name : "");
//    $("#review-description").val(id > 0 ? editObj.description : "");
//    $("#review-info").val(id > 0 ? editObj.info : "");
//    $("#review-accountId").val(id > 0 ? editObj.accountId : "");
//    $("#review-templateId").val(id > 0 ? editObj.templateId : "");
//    $("#review-penaltyScore").val(id > 0 ? editObj.penaltyScore : "");
//    $("#review-penaltyValue").val(id > 0 ? editObj.penaltyValue : "");
//    $("#review-penaltyOrther").val(id > 0 ? editObj.penaltyOrther : "");
//    $("#review-createdTime").val(id > 0 ? moment(editObj.createdTime).format("DD/MM/YYYY HH:mm:ss") : moment(new Date()).format("DD/MM/YYYY HH:mm:ss"));

//    formatNumber();
//}
//async function updateItem(id) {
//    var actionName = (id == 0 ? "Bạn muốn tạo mới" : "Cập nhật");
//    var obj;
//    if (id > 0) {
//        obj = await getItemById(id);
//    }
//    let objName = id > 0 ? obj.name : "item";
//    validateInputNumber();
//    var updatingObj = {
//        "id": $("#review-id").val(),
//        "active": $("#review-active").val(),
//        "name": $("#review-name").val(),
//        "description": $("#review-description").val(),
//        "info": $("#review-info").val(),
//        "accountId": $("#review-accountId").val(),
//        "templateId": $("#review-templateId").val(),
//        "penaltyScore": $("#review-penaltyScore").val(),
//        "penaltyValue": $("#review-penaltyValue").val(),
//        "penaltyOrther": $("#review-penaltyOrther").val(),
//        "createdTime": formatDatetimeUpdate($("#review-createdTime").val()),

//    };
//    Swal.fire({
//        title: 'Xác nhận thay đổi?',
//        text: "" + actionName + " " + objName + "",
//        icon: 'info',
//        showCancelButton: true,
//        confirmButtonColor: '#3085d6',
//        cancelButtonColor: '#443',
//        confirmButtonText: 'Xác nhận',
//        cancelButtonText: 'Huỷ'
//    }).then((result) => {
//        if (result.value) {
//            $("#modal-id").modal('hide');
//            //CALL AJAX TO UPDATE
//            if (id > 0) {
//                $.ajax({
//                    url: systemURL + "review/api/update",
//                    type: "POST",
//                    contentType: "application/json",
//                    data: JSON.stringify(updatingObj),
//                    success: function (responseData) {
//                        // debugger;
//                        if (responseData.status == 200 && responseData.message === "SUCCESS") {
//                            Swal.fire(
//                                'Thành Công!',
//                                'Đã cập nhật "' + objName + '" ',
//                                'success'
//                            );
//                            reGenTable();
//                            // Remove loading indication
//                            submitButton.removeAttribute('data-kt-indicator');
//                            // Enable button
//                            submitButton.disabled = false;
//                        }
//                    },
//                    error: function (e) {
//                        //console.log(e.message);
//                        Swal.fire(
//                            'Lỗi!',
//                            'Đã xảy ra lỗi, vui lòng thử lại',
//                            'error'
//                        );
//                        // Remove loading indication
//                        submitButton.removeAttribute('data-kt-indicator');
//                        // Enable button
//                        submitButton.disabled = false;
//                    }
//                });
//            };
//            //CALL AJAX TO CREATE
//            if (id == 0) {
//                updatingObj.id = 1;
//                delete updatingObj["id"]
//                updatingObj.active = 1;
//                updatingObj.createdTime = new Date();
//                console.log(updatingObj);
//                $.ajax({
//                    url: systemURL + "review/api/add",
//                    type: "POST",
//                    contentType: "application/json",
//                    data: JSON.stringify(updatingObj),
//                    success: function (responseData) {
//                        // debugger;
//                        if (responseData.status == 201 && responseData.message === "CREATED") {
//                            Swal.fire(
//                                'Thành công!',
//                                'Đã cập nhật dữ liệu',
//                                'success'
//                            );
//                            updatingObj = responseData.data;
//                            reGenTable();
//                            // Remove loading indication
//                            submitButton.removeAttribute('data-kt-indicator');
//                            // Enable button
//                            submitButton.disabled = false;
//                        }
//                    },
//                    error: function (e) {
//                        //console.log(e.message);
//                        Swal.fire(
//                            'Lỗi!',
//                            'Đã xảy ra lỗi, vui lòng thử lại',
//                            'error'
//                        );
//                        // Remove loading indication
//                        submitButton.removeAttribute('data-kt-indicator');
//                        // Enable button
//                        submitButton.disabled = false;
//                    }
//                });
//            }
//        }
//        else {
//            // Remove loading indication
//            submitButton.removeAttribute('data-kt-indicator');
//            // Enable button
//            submitButton.disabled = false;
//        }
//    })
//}
//async function deleteItem(id) {
//    updatingObj = table.ajax.json().data.find(c => c.id == id);
//    let objName = id > 0 ? updatingObj.name : "item";
//    Swal.fire({
//        title: 'Xác nhận thay đổi?',
//        text: "Xóa " + objName + "",
//        icon: 'warning',
//        showCancelButton: true,
//        confirmButtonColor: '#d33',
//        cancelButtonColor: '#3085d6',
//        confirmButtonText: 'Xoá',
//        cancelButtonText: 'Huỷ'
//    }).then((result) => {
//        if (result.value) {
//            //CALL AJAX TO DELETE
//            $.ajax({
//                url: systemURL + "review/api/delete",
//                type: "POST",
//                contentType: "application/json",
//                data: JSON.stringify({ "id": id }),
//                success: function (responseData) {
//                    // debugger;
//                    if (responseData.status == 200 && responseData.message === "SUCCESS") {
//                        Swal.fire(
//                            'Thành công!',
//                            'Đã xoá ' + updatingObj.name + '.',
//                            'success'
//                        );
//                        reGenTable();
//                    }
//                },
//                error: function (e) {
//                    //console.log(e.message);
//                    Swal.fire(
//                        'Lỗi!',
//                        'Đã xảy ra lỗi, vui lòng thử lại',
//                        'error'
//                    );
//                }
//            });

//        }
//        else {
//            // Remove loading indication
//            submitButton.removeAttribute('data-kt-indicator');
//            // Enable button
//            submitButton.disabled = false;
//        }
//    })
//}
async function getItemById(id) {
    var data;
    await $.ajax({
        url: systemURL + "review/api/detail/" + id,
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
function tableSearch() {
    table.column(1).search($("#tableData thead:nth-child(2) tr th:nth-child(2) input").val());
    table.column(2).search($("#tableData thead:nth-child(2) tr th:nth-child(3) input").val());
    table.column(3).search($("#tableData thead:nth-child(2) tr th:nth-child(4) input").val());
    table.column(4).search($("#tableData thead:nth-child(2) tr th:nth-child(5) input").val());
    table.column(5).search($("#tableData thead:nth-child(2) tr th:nth-child(6) input").val());
    table.column(6).search($("#tableData thead:nth-child(2) tr th:nth-child(7) input").val());
    table.column(7).search($("#tableData thead:nth-child(2) tr th:nth-child(8) input").val());
    table.column(8).search($("#tableData thead:nth-child(2) tr th:nth-child(9) input").val());
    table.column(9).search($("#tableData thead:nth-child(2) tr th:nth-child(10) input").val());
    table.column(10).search($("#tableData thead:nth-child(2) tr th:nth-child(11) input").val());
    table.column(11).search($("#tableData thead:nth-child(2) tr th:nth-child(12) input").val());

    table.draw();
}
function showErrorLog(id) {
    $("#modal-error").modal("show");
    table.rows().every(function (rowIdx, tableLoop, rowLoop) {
        let data = this.data();
        if (data.id == id) {
            $("#modal-error-body").text(data.reviewInfo);
        }
    });
}
//< !--end: setting in data table-- >

var accountData = [];
async function loadDataSelectAccount() {
    await $.ajax({
        url: systemURL + 'account/api/list',
        type: 'GET',
        async: 'true',
        contentType: 'application/json',
        success: function (responseData) {
            console.log(new Date().getSeconds() + ':' + new Date().getMilliseconds() + ' - loaded account');
            // debugger;
            var data = responseData.data;
            accountData = data;
        },
        error: function (e) {
            //console.log(e.message);
        }
    });
}
var errorDictionaryData = [];
async function loadDataSelectErrorDictionary() {
    await $.ajax({
        url: systemURL + 'penaltyType/api/list',
        type: 'GET',
        async: 'true',
        contentType: 'application/json',
        success: function (responseData) {
            console.log(new Date().getSeconds() + ':' + new Date().getMilliseconds() + ' - loaded account');
            // debugger;
            var data = responseData.data;
            errorDictionaryData = data;
        },
        error: function (e) {
            //console.log(e.message);
        }
    });
}
$(document).ready(function () {
    loadDataSelectAccount();
    $.when(loadDataSelectAccount()).done(function () {
        $("#filterAccountId").select2();
        accountData.forEach(function (item) {
            $('#filterAccountId').append(new Option(item.fullName, item.id, false, false));
        })
    });
    loadDataSelectErrorDictionary();
    $.when(loadDataSelectErrorDictionary()).done(function () {
        $("#filterErrorDictionaryId").select2();
        errorDictionaryData.forEach(function (item) {
            $('#filterErrorDictionaryId').append(new Option(item.name, item.id, false, false));
        })
    });
    $('#search-input').on("input", function () {
        table.search($(this).val()).draw();
    });
    $("#btnTableSearch").click(function () {
        tableSearch();
    });
    $("#btnTableResetSearch").click(function () {
        $(".tableheaderFillter").val("").trigger("change");
        tableSearch();
    });
   
});

function tableSearch() {
    table.column(2).search($("#tableData thead:nth-child(2) tr th:nth-child(3) input").val());
    table.column(3).search($("#tableData thead:nth-child(2) tr th:nth-child(4) input").val());
    table.column(4).search($("#tableData thead:nth-child(2) tr th:nth-child(5) input").val());
    table.draw();
}
