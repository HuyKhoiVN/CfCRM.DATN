const profile = JSON.parse(localStorage.profile);
var tableData;
var photoStaff;
var listUpdateError = [];
var listChildrend = [];
var getListStaff = [];
var listDescription = [];
var selectedAccountId = 0;
var idRow = 0;
var STT = 1;
var ListSelectedErrorDictionary = [];
var item;
var myDropzone;
function GroupErrorDictionary() {
    let seen = {};
    ListSelectedErrorDictionary = ListSelectedErrorDictionary.filter(function (item) {
        if (item.errorDictionaryId !== "") {
            return seen.hasOwnProperty(JSON.stringify(item)) ? false : (seen[JSON.stringify(item)] = true);
        }
    });
}
function RefreshOcuredTime() {
    var occurrenceDict = {};
    ListSelectedErrorDictionary = $.map(ListSelectedErrorDictionary, function (item) {
        var errorId = item.errorDictionaryId;
        if (!occurrenceDict[errorId]) {
            occurrenceDict[errorId] = 0;
        }
        occurrenceDict[errorId] += 1;
        return {
            row: item.row,
            errorDictionaryId: item.errorDictionaryId,
            occuredTime: occurrenceDict[errorId]
        };
    });
}
//function renderListStaff() {
//    var modal = $(".list-group");
//    modal.html("");
//    getListStaff.forEach(item => {
//        if (item.photo == null) {
//            item.photo = "/images/userdefault.jpg";
//        }
//        var renderStaff = `
//        <div class="list-group-item list-group-item-action" onClick="selectStaff(${item.id})" style="padding-top: 15px; cursor: pointer">
//                        <div class="d-flex justify-content-between">
//                        <div class="d-flex gap-3">
//                            <img style="object-fit: cover; border-radius: 50%" class="accountPhoto" height="32" width="32" src="${item.photo}" alt="User">
//                            <div class="d-flex flex-column">
//                                <span style="line-height: 14.7px;" class="fs-14" id="renderName">${item.fullName}</span>
//                                <div class="d-flex gap-3">
//                                    <p style="display: inline-block; min-width: 111px; font-size:12px; color: #044688" id="renderRole">${item.roleName}</p>
//                             <p style="font-size:12px; color: #044688; margin: 0" id="renderId">MS: ${item.zipCode}</p>
//                                </div>
//                            </div>
//                        </div>
//                    </div>
//              </button>
//        `
//        modal.append(renderStaff);
//    });
//}
async function callEventListStaff() {
    await $.ajax({
        url: systemURL + "account/api/ListStaff",
        type: "GET",
        contentType: "application/json",
        success: function (responseData) {
            getListStaff = responseData.data;
            selectedAccountId = idStaff != '' ? idStaff : getListStaff[0].accountId;
            selectStaff(idStaff != '' ? idStaff : getListStaff[0].id);
        },
        error: function (e) {
            toastr.error(
                'Đã xảy ra lỗi, vui lòng thử lại',
                'Lỗi!',
                { timeOut: 0, extendedTimeOut: 0, closeButton: true, closeDuration: 0 }
            );
        }
    });
   
}
async function selectStaff(id) {
    var staff = await getListStaff.find(x => x.id == id);
    $("#accountPhoto").src = staff.photo == null ? "/images/userdefault.jpg" : staff.photo;
    $("#staffName").text(staff.fullName);
    $("#staffRole").text(staff.roleName);
    $("#staffId").text("MS " + staff.zipCode).attr("value", staff.id);
    $("#exampleModal").modal('hide');
    $(".list-group").html("");
    selectedAccountId = staff.id;
    $(".list-error-parent").each(function () {
        var rowId = $(this).parents("tr").data("value");
        if (rowId != 0) {
            $(`tr[data-value=${rowId}]`).remove();
        }
    });
    ListSelectedErrorDictionary = [];
    STT = $('.idRow').length;
    $(`tr[data-value=0] .list-error-parent`).val($(`tr[data-value=0] .list-error-parent :selected`).val()).trigger("change");
}
$("#searchStaff").on("keyup", function () {
    const searchTerm = $(this).val().toLowerCase();
    $(".list-group-item").each(function () {
        const staffName = $(this).find("#renderName").text().toLowerCase();
        if (staffName.includes(searchTerm)) {
            $(this).show();
        } else {
            $(this).hide();
        }
    });
});
async function addRowTable() {
    idRow++;
    STT++;
    var rowCount = `<tr class="idRow" data-value="${idRow}">
                             <td class="text-center">
                                <input type="checkbox" id="check-row-${idRow}" class="check-row" data-value="${idRow}" name="" value="${idRow}">
                            </td>
                            <td class="text-center stt">
                                ${STT}
                            </td>
                            <td>
                                <div class="typeError">
                                    <select class="form-select rounded-8 dataSelect list-error-parent" id="list-error-parent-`+ idRow + `" data-control="select2">
                                    </select>
                                </div>
                            </td>
                            <td>
                                <div class="errorName">
                                    <select class="form-select rounded-8 dataSelect list-error" id="list-error-`+ idRow + `" data-control="select2">
                                    </select>
                                </div>
                            </td>
                            <td>
                                <div class="errorDetail">
                                    <select class="form-select rounded-8 dataSelect list-error-detail" id="list-error-detail-`+ idRow + `" data-control="select2">
                                    </select>
                                </div>
                            </td>
                            <td>
                                <div class="errorDetail">
                                    <select class="form-select rounded-8 dataSelect list-error-content" id="list-error-content-`+ idRow + `" data-control="select2">
                                    </select>
                                </div>
                            </td>
                            <td>
                                <textarea type="text" class="valueError text-center" value="" id="propose-error-`+ idRow + `"></textarea>
                            </td>
                            <td>
                                <input type="text" class="numberOfError text-center" value="" id="times-error-`+ idRow + `">
                            </td>
                            <td>
                                <textarea type="text" class="infoViolate" value="" id="info-error-`+ idRow + `"></textarea>
                            </td>
                            <td class="text-center">
                                <span class="ms-2 lh-0" data-bs-toggle="tooltip" data-bs-placement="top" title="Nhập nội dung mô tả" onclick="(openModelDes(${idRow}))">
                                    <i class="ki-duotone ki-information text-primary fs-2x"><span class="path1"></span><span class="path2"></span><span class="path3"></span></i>
                                </span>
                            </td>
                        </tr>`;
    $('#table').append(rowCount);
    await loadDataOfRow(idRow);
   
}
function loadDataOfRow(idRow) {
    $(`tr[data-value=${idRow}] .list-error-parent`).html("");
    listErrorParent.forEach(function (item) {
        $(`tr.idRow[data-value=${idRow}] .list-error-parent`).append(new Option(item.name, item.id, false, false));
    });
    $(`tr[data-value=${idRow}] .list-error-parent`).val($(`tr[data-value=${idRow}] .list-error-parent option:eq(0)`).val()).trigger("change");

    $(`tr[data-value=${idRow}] .list-error`).html("");
    let error = listError.filter(x => x.parentId == $(`tr[data-value=${idRow}] .list-error-parent :selected`).val());
    error.forEach(function (item) {
        $(`tr.idRow[data-value=${idRow}] .list-error`).append(new Option(item.name, item.id, false, false));
    });
    $(`tr[data-value=${idRow}] .list-error`).val($(`tr[data-value=${idRow}] .list-error option:eq(0)`).val()).trigger("change");

    $(`tr[data-value=${idRow}] .list-error-detail`).html("");
    let errorDetail = listErrorDetail.filter(x => x.parentId == $(`tr[data-value=${idRow}] .list-error :selected`).val());
    errorDetail.forEach(function (item) {
        $(`tr.idRow[data-value=${idRow}] .list-error-detail`).append(new Option(item.name, item.id, false, false));
    });
    $(`tr[data-value=${idRow}] .list-error-detail`).val($(`tr[data-value=${idRow}] .list-error-detail option:eq(0)`).val()).trigger("change");

    $(`tr[data-value=${idRow}] .list-error-content`).html("");
    let errorContent = ListErrorContent.filter(x => x.errorDictionaryCategoryId == $(`tr[data-value=${idRow}] .list-error-detail :selected`).val());
    errorContent.forEach(function (item) {
        $(`tr.idRow[data-value=${idRow}] .list-error-content`).append(new Option(item.name, item.id, false, false));
    });
    $(`tr[data-value=${idRow}] .list-error-content`).val($(`tr[data-value=${idRow}] .list-error-content option:eq(0)`).val()).trigger("change");
    $('.dataSelect').select2();
}
async function LoadDataError() {
    await RefreshOcuredTime();
    if (ListSelectedErrorDictionary.length > 0 && selectedAccountId != 0) {
        let objs = [];
        ListSelectedErrorDictionary.forEach(async function (item) {
            let obj = {
                accountId: selectedAccountId,
                errorDictionaryId: item.errorDictionaryId,
                occuredTime: item.occuredTime,
                rowId: item.row
            }
            objs.push(obj);
        });
        var data = await httpService.postAsync(`reviewDetail/api/list-error-by-user`, objs);
        if (data.status == "200") {
            var res = data.resources;
            if (res != null) {
                res.forEach(function (item) {
                    var text = '';
                    if (!isNaN(item.penaltyText)) {
                        text = `-${formatNumberCurrency(item.penaltyText)}`
                    }
                    else {
                        text = item.penaltyText;
                    }
                    $(`tr[data-value=${item.rowId}] .valueError`).val(text).attr("data-type", item.penaltyTypeId);
                    $(`tr[data-value=${item.rowId}] .numberOfError `).val(item.occuredTime);
                });
            }
        }
    }
}
function updateItem() {
    var ListObj = [];
    $(".idRow").each(function (index) {
        var rowIndex = $(this).data("value");
        var objDescription = listDescription.find(x => x.row == rowIndex);
        var obj = {
            name: $(`tr[data-value=${rowIndex}] .list-error-content :selected`).text(),
            errorDictionaryId: $(`tr[data-value=${rowIndex}] .list-error-content :selected`).val(),
            penaltyOrther: ($(`tr[data-value=${rowIndex}] .valueError`).data("type") != 1006 && $(`tr[data-value=${rowIndex}] .valueError`).data("type") != 1001) ? $(`tr[data-value=${rowIndex}] .valueError`).val() : "",
            penaltyScore: $(`tr[data-value=${rowIndex}] .valueError`).data("type") == 1001 ? $(`tr[data-value=${rowIndex}] .valueError`).val().replaceAll(",", "").replaceAll(".", "").replace("-","") : '',
            penaltyValue: $(`tr[data-value=${rowIndex}] .valueError`).data("type") == 1006 ? $(`tr[data-value=${rowIndex}] .valueError`).val().replaceAll(",", "").replaceAll(".", "").replace("-", "") : '',
            accountId: selectedAccountId,
            info: $(`tr[data-value=${rowIndex}] .infoViolate`).val(),
            description: objDescription != undefined ? objDescription.description : '',
            photo: objDescription != undefined ? objDescription.photo : '',
            occuredTime: $(`tr[data-value=${rowIndex}] .numberOfError`).val(),
            accountantId: accountId,
            reviewerId: profile.id,
            url: "reviewDetail/admin/list/" + selectedAccountId
        }
        ListObj.push(obj);
    });
    addObj(ListObj);
}
function addObj(ListObj) {
    Swal.fire({
        title: 'Xác nhận thay đổi?',
        text: "Bạn có muốn gửi thông tin vi phạm",
        icon: 'info',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#443',
        confirmButtonText: 'Xác nhận',
        cancelButtonText: 'Huỷ'
    }).then((result) => {
        if (result.value) {
            $.ajax({
                url: systemURL + "reviewdetail/api/AddRange",
                type: "POST",
                contentType: "application/json",
                data: JSON.stringify(ListObj),
                success: function (responseData) {
                    // debugger;
                    if (responseData.status == 201 && responseData.message === "CREATED") {
                        Swal.fire(
                            'Thành công!',
                            'Đã cập nhật dữ liệu',
                            'success'
                        ).then((result) => {
                            if (result.value) {
                                window.location.href = '/review/admin/review-list';
                            }
                        });
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
function openModelDes(id) {
    $("#descriptionModal").modal('show');
    $(".infoError").attr("data-rowId", id);
    $("#btn-submit").attr("onclick", `submitDescription(${id})`);
    var obj = getElementDescription(id);
    $('.dz-preview').remove();
    if (obj == null) {
        $("#description").val("");
        $(".dz-clickable").removeClass("dz-started");
    }
    else {
        $("#description").val(obj.description);
        var dataPhoto = JSON.parse(obj.photoName);
        if (dataPhoto.length > 0) {
            $(".dz-clickable").addClass("dz-started");
            dataPhoto.forEach(function (item) {
                var file = myDropzone.files.find(x => x.name == item);
                if (file != undefined) {
                    $(".dropzone").append(file.previewElement);
                }
                else {
                    $(".dz-clickable").removeClass("dz-started");
                    listDescription.pop(obj);
                }
            });
        }
        else {
            $(".dz-clickable").removeClass("dz-started");
        }
    }
}
function getElementDescription(id) {
    return listDescription.find(x => x.row == id);
}
function submitDescription(id) {
    $("#descriptionModal").modal('hide');
    var listPhoto = [];
    var listPhotoName = [];
    $(".dz-image img").each(function () {
        listPhoto.push($(this).attr('src'));
        listPhotoName.push($(this).attr('alt'));
    });
    var obj = getElementDescription(id);
    if (obj == null) {
        listDescription.push({ row: id, description: $("#description").val(), photoName: JSON.stringify(listPhotoName), photo: JSON.stringify(listPhoto) });
    }
    else {
        listDescription.pop(obj);
        listDescription.push({ row: id, description: $("#description").val(), photoName: JSON.stringify(listPhotoName), photo: JSON.stringify(listPhoto) });
    }
    
}
$("body").on("click", "input[type=checkbox]" ,function () {
    $("#deleteError").hide();
    if ($(this).is(':checked')) {
        $("#deleteError").show().css("display","flex");
    }
});
$("body").on("click", '#check-all', function () {
    if ($(this).is(':checked')) {
        $('.check-row').prop('checked', true);
    }
    else {
        $('.check-row').prop('checked', false);
    }
})
function deleteRow() {
    $("input[type=checkbox].check-row").each(function (index) {
        if ($(this).is(":checked")) {
            var rowChecked = $(this).val();
            if (rowChecked != 0) {
                $(`tr[data-value=${rowChecked}]`).remove();
                var indexOfArray = ListSelectedErrorDictionary.findIndex(c => c.row == rowChecked);
                var indexOfArrayDescription = ListSelectedErrorDictionary.findIndex(c => c.row == rowChecked);
                if (indexOfArray > -1) {
                    ListSelectedErrorDictionary.splice(indexOfArray, 1);
                }
                if (indexOfArrayDescription > -1) {
                    listDescription.splice(indexOfArrayDescription, 1);
                }
            }
        }
    });
    refreshTable();
    STT = $('.idRow').length;
    $("#deleteError").hide();
}
function refreshTable() {
    LoadDataError();
    STT = 1;
    $(".idRow").each(function (index) {
        STT = index;
        rowId = index;
        $(this).find('.stt').text((index + 1));
    });
    $("#check-all").prop("checked", false);
    $(".check-row").prop("checked", false);
}
$(document).ready(async function () {
    await callEventListStaff();
    await renderListStaff();
    $("body").on("change", ".list-error-parent", function () {
        var selectedRow = $($(this).parents("tr")).data("value");
        let error = listError.filter(x => x.parentId == this.value);
        $(`tr[data-value=${selectedRow}] .list-error`).html("");
        error.forEach(function (item) {
            $(`tr[data-value=${selectedRow}] .list-error`).append(new Option(item.name, item.id, false, false));
        });
        $(`tr[data-value=${selectedRow}] .list-error`).val($(`tr[data-value=${selectedRow}] .list-error option:eq(0)`).val()).trigger("change");
        $('.dataSelect').select2();
    });
    $("body").on("change", ".list-error", function () {
        var selectedRow = $($(this).parents("tr")).data("value");
        let error = listErrorDetail.filter(x => x.parentId == this.value);
        $(`tr[data-value=${selectedRow}] .list-error-detail`).html("");
        error.forEach(function (item) {
            $(`tr[data-value=${selectedRow}] .list-error-detail`).append(new Option(item.name, item.id, false, false));
        });
        $(`tr[data-value=${selectedRow}] .list-error-detail`).val($(`tr[data-value=${selectedRow}] .list-error-detail option:eq(0)`).val()).trigger("change");
        $('.dataSelect').select2();
    });
    $("body").on("change", ".list-error-detail", function () {
        var selectedRow = $($(this).parents("tr")).data("value");
        let error = ListErrorContent.filter(x => x.errorDictionaryCategoryId == this.value);
        $(`tr[data-value=${selectedRow}] .list-error-content`).html("");
        error.forEach(function (item) {
            $(`tr[data-value=${selectedRow}] .list-error-content`).append(new Option(item.name, item.id, false, false));
        });
        $(`tr[data-value=${selectedRow}] .list-error-content`).val($(`tr[data-value=${selectedRow}] .list-error-content option:eq(0)`).val()).trigger("change");
        $('.dataSelect').select2();
    });
    $("body").off("change", ".list-error-content").on("change", ".list-error-content", debounce(async function () {
        ListSelectedErrorDictionary = [];
        var selectedRow = $($(this).parents("tr")).data("value");
        $(".list-error-content").each(function () {
            ListSelectedErrorDictionary.push({ row: $($(this).parents("tr")).data("value"), errorDictionaryId: $(this).select().val() });
        });
        await GroupErrorDictionary();
        await LoadDataError();
    }));
    setTimeout(function () {
        $(`tr[data-value=${idRow}] .list-error-parent`).val($(`tr[data-value=${idRow}] .list-error-parent option:eq(0)`).val()).trigger("change");
    }, 500);
    //DropZone
    myDropzone = new Dropzone("#kt_dropzonejs_upload", {
        url: "/api/file-explorer/upload-file", // Set the url for your upload script location
        paramName: "file", // The name that will be used to transfer the file
        maxFilesize: 10, // MB
        addRemoveLinks: true,
        init: function () {
            this.on('sending', function (file, xhr, formData) {
                // Append all form inputs to the formData Dropzone will POST
                formData.append('folderUploadId', 1003);
                formData.append('adminAccountId', accountId);
                formData.append('files', file);
            });
            this.on('success', function (file, response) {
                $(this.element).find(`img[alt='${file.name}']`).attr('src', response.data[0][0].path);
            });
        }
    });
});
function debounce(func, wait) {
    let timeout;
    return function (...args) {
        const context = this;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), wait);
    };
}
$('#search-staff').on("input", function () {
    tableStaff.search($(this).val()).draw();
});
function destroyTableStaff() {
    tableStaff.destroy();
}
const renderListStaff = () => {
    if ($.fn.DataTable.isDataTable('#tableStaffData')) {
        tableStaff.destroy();
    }
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
            { targets: "_all", orderable: false },
            { targets: "no-search", searchable: false }
        ],
        aLengthMenu: [
            [5],
            [5],
        ],
        lengthChange: false,
        dom: 'tipr',
    });
}
