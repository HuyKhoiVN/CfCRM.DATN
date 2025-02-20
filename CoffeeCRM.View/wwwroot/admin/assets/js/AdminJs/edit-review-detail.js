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

var url = window.location.href.split("/")
errorId = url[url.length - 1]

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
function renderListStaff() {
    var modal = $(".list-group");
    modal.html("");
    getListStaff.forEach(item => {
        if (item.photo == null) {
            item.photo = "https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/User-avatar.svg/2048px-User-avatar.svg.png";
        }
        var renderStaff = `
        <div class="list-group-item list-group-item-action" onClick="selectStaff(${item.zipCode})" style="padding-top: 15px; cursor: pointer">
                        <div class="d-flex justify-content-between">
                        <div class="d-flex gap-3">
                            <img style="object-fit: cover; border-radius: 50%" class="accountPhoto" height="32" width="32" src="${item.photo}" alt="User">
                            <div class="d-flex flex-column">
                                <span style="line-height: 14.7px;" class="fs-14" id="renderName">${item.name}</span>
                                <div class="d-flex gap-3">
                                    <p style="display: inline-block; min-width: 111px; font-size:12px; color: #044688" id="renderRole">${item.roleName}</p>
                             <p style="font-size:12px; color: #044688; margin: 0" id="renderId">MS: ${item.zipCode}</p>
                                </div>
                            </div>
                        </div>
                    </div>
              </button>
        `
        modal.append(renderStaff);
    });
}
async function callEventListStaff() {
    await $.ajax({
        url: systemURL + "reviewdetail/api/ReviewDetailById/" + errorId,
        type: "GET",
        contentType: "application/json",
        success: function (responseData) {
            //console.log(responseData);
            getListStaff = responseData.resources;
            selectedAccountId = getListStaff.accountId;
            //selectStaff(getListStaff.zipCode);
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

async function selectAccount() {
    await $.ajax({
        url: systemURL + "reviewdetail/api/ReviewDetailById/" + errorId,
        type: "GET",
        contentType: "application/json",
        success: function (responseData) {
            //console.log(responseData);
            getListStaff = responseData.resources;
            //console.log(getListStaff);
            selectedAccountId = getListStaff.accountId;
            //console.log(selectedAccountId);
            $("#staffName").html(getListStaff.accountName);
            $("#staffId").html("MS-" + getListStaff.zipCode);
            $("#staffRole").html(getListStaff.accountTypeId = 1002 ? "Nhân viên bán hàng" : "Kế toán")
            //selectStaff(getListStaff.zipCode);
        },
        
    });
}


function addRowTable() {
    idRow++;
    STT++;
    var imgLink = '/admin/assets/icon/info.png';
    var rowCount = `<tr class="idRow" data-value="${idRow}">
                            <td class="text-center stt">
                                ${STT}
                            </td>
                            <td>
                                <div class="typeError" >
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
                                <input type="text" class="numberOfError text-center" value="" id="times-error-`+ idRow + `">
                            </td>
                            <td>
                                <input type="text" class="infoViolate" value="" id="info-error-`+ idRow + `">
                            </td>
                            <td>
                                <img style="margin: 0 10px; cursor: pointer" width="20" height="20" src="${imgLink}" onclick="(openModelDes(${idRow}))" />
                            </td>
                        </tr>`;
    $('#table').append(rowCount);
    loadDataOfRow(idRow);

}

async function LoadDataError() {
    await RefreshOcuredTime();
    if (selectedAccountId != 0) {
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
        var data = await httpService.getAsync(`reviewDetail/api/ReviewDetailById/` + errorId);

        if (data.status == "200") {
            var res = data.resources;
            
            $("#list-error-parent").val(res.errorNameAndType.errorType.id).trigger("change");
            $("#list-error").val(res.errorNameAndType.errorName).trigger("change");
            $("#list-error-detail").val(res.detailError).trigger("change");
            $("#list-error-content").val(res.errorDictionaryId).trigger("change");
            $("#propose-error").val(res.penaltyScore != null ? - res.penaltyScore : "Nhắc nhở");
            $("#times-error").val(res.occuredTime);
            $("#info-error").val(res.info);
            $("#openModelDes").html('<img style="margin: 0 10px; cursor: pointer" width="20" height="20" src="/admin/assets/icon/info.png" onclick="openModelDes(' + errorId + ')" />');
            listDescription.push(res);
        }
    }
}
function updateItem() {
    //debugger;
    var rowIndex = $(".idRow").data("value");
    var obj = {
        name: $(`tr[data-value=${rowIndex}] .list-error-content :selected`).text(),
        errorDictionaryId: parseInt($(`tr[data-value=${rowIndex}] .list-error-content :selected`).val()),
        penaltyOrther: ($(`tr[data-value=${rowIndex}] .valueError`).data("type") != 1006 && $(`tr[data-value=${rowIndex}] .valueError`).data("type") != 1001) ? $(`tr[data-value=${rowIndex}] .valueError`).val() : "",
        penaltyScore: $(`tr[data-value=${rowIndex}] .valueError`).data("type") == 1001 ? $(`tr[data-value=${rowIndex}] .valueError`).val().replaceAll(",", "").replace("-", "") : '',
        penaltyValue: $(`tr[data-value=${rowIndex}] .valueError`).data("type") == 1006 ? $(`tr[data-value=${rowIndex}] .valueError`).val().replaceAll(",", "").replace("-", "") : '',
        accountId: selectedAccountId,
        info: $(`tr[data-value=${rowIndex}] .infoViolate`).val(),
        description: $("#description").val(),
        photo: $("#kt_dropzonejs_upload").val(),
        Active: "true",
        reviewId: listDescription != undefined ? parseInt(listDescription[0].reviewId) : '',
        CreatedTime: listDescription != undefined ? listDescription[0].createdTime : '',
        ErrorPenaltyId: listDescription != undefined ? parseInt(listDescription[0].errorPenaltyId) : '',
        Id: parseInt(errorId)
    }
    addObj(obj);
}
function addObj(listObj) {
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
                url: systemURL + "reviewdetail/api/updateinfo",
                type: "POST",
                contentType: "application/json",
                data: JSON.stringify(listObj),
                success: function (responseData) {
                    // debugger;
                    if (responseData.status == 200 && responseData.message === "SUCCESS") {
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
async function openModelDes(id) {
    //debugger;
    $("#descriptionModal").modal('show');
    $(".infoError").attr("data-rowId", id);
    $("#btn-submit").attr("onclick", `submitDescription(${id})`);
    var obj = await getElementDescription(id);
    $('.dz-preview').remove();
    if (obj == null) {
        $("#description").val("");
        $(".dz-clickable").removeClass("dz-started");
    }
    else {
        $("#description").val(obj.description);
        var dataPhoto = JSON.parse(obj.photo);
        
        if (dataPhoto.length > 0) {
            $(".dz-clickable").addClass("dz-started");
            dataPhoto.forEach(function (item) {
                var file = myDropzone.files.find(x => x.name == item);
                $(".dropzone").append(file.previewElement);
            });
        }
    }
}
async function getElementDescription(errorId) {
    return listDescription.find(x => x.id == errorId);
}
async function getElemenByErrorId(errorId) {
    await $.ajax({
        url: systemURL + "reviewdetail/api/ReviewDetailById/" + errorId,
        type: "GET",
        contentType: "application/json",
        success: function (responseData) {
            getList = responseData.resources;
            listDescription.push(getList)
        },

    });
}
async function submitDescription(id) {
    debugger;
    $("#descriptionModal").modal('hide');
    var listPhoto = [];
    var listPhotoName = [];
    $(".dz-image img").each(function () {
        listPhoto.push($(this).attr('src'));
        listPhotoName.push($(this).attr('alt'));
    });
    updateItem();
}
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
    await selectAccount();
    await getElemenByErrorId(errorId);
    await LoadDataError();

    $('#list-error-parent').select2("enable", false)
    $('#list-error').select2("enable", false)
    $('#list-error-detail').select2("enable", false)
    $('#list-error-content').select2("enable", false)

 
    
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

