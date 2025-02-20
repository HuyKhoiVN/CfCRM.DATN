var listUpdateError = [];
var tableData;
var listChildrend = [];
var getListStaff = [];
var photoStaff;
var listDescription = [];
$(document).ready(function () {
    searchStaff();
    $(".idRow").attr("value", idRow)
    getStaffForId(idStaff);
    $("#list-error-parent").on("change", async (e) => {
        var id = $("#list-error-parent").val();
        let error = listError.filter(x => x.parentId == id);
        $("#list-error").html("");
        error.forEach(function (item) {
            $('#list-error').append(new Option(item.name, item.id, false, false)).trigger('change');
        })
    })
    $("#list-error").on("change", async (e) => {
        var id = $("#list-error").val();
        $("#list-error-detail").html("");
        let error = listErrorDetail.filter(x => x.parentId == id);
        error.forEach(function (item) {
            $('#list-error-detail').append(new Option(item.name, item.id, false, false)).trigger('change');
        })
    })
    $("#list-error-detail").on("change", async (e) => {
        var id = $("#list-error-detail").val();
        $("#list-error-content").html("");
        let error = ListErrorContent.filter(x => x.errorDictionaryCategoryId == id);
        error.forEach(function (item) {
            $('#list-error-content').append(new Option(item.name, item.id, false, false)).trigger('change');
        })
    })
})
var idRow = 0;
var STT = 1
const addRowTable = () => {
    idRow++;
    STT++;
    var imgLink = '/admin/assets/icon/info.png';
    var rowCount = `<tr class="idRow" value="${idRow}">
                            <td class="text-center">
                                ${STT}
                            </td>
                            <td>
                                <div class="typeError">
                                    <select class="form-select rounded-8 dataSelect" id="list-error-parent-`+ idRow + `" data-control="select2">
                                    </select>
                                </div>
                            </td>
                            <td>
                                <div class="errorName">
                                    <select class="form-select rounded-8 dataSelect" id="list-error-`+ idRow + `" data-control="select2">
                                    </select>
                                </div>
                            </td>
                            <td>
                                <div class="errorDetail">
                                    <select class="form-select rounded-8 dataSelect" id="list-error-detail-`+ idRow + `" data-control="select2">
                                    </select>
                                </div>
                            </td>
                            <td>
                                <input type="text" class="valueError text-center" value="" id="propose-error-`+ idRow + `">
                            </td>
                            <td>
                                <input type="text" class="numberOfError text-center" value="" id="times-error-`+ idRow + `">
                            </td>
                            <td>
                                <div class="errorDetail">
                                    <select class="form-select rounded-8 dataSelect" id="list-error-content-`+ idRow + `" data-control="select2">
                                    </select>
                                </div>
                            </td>
                            <td>
                                <input type="text" class="infoViolate" value="" id="info-error-`+ idRow + `">
                            </td>
                            <td>
                                <img style="margin: 0 10px; cursor: pointer" width="20" height="20" src="${imgLink}" onclick="(openModelDes(${idRow}))" />
                            </td>
                        </tr>`;
    $('#table').append(rowCount);
    listErrorParent.forEach(function (item) {
        $(`#list-error-parent-${idRow}`).append(new Option(item.name, item.id, false, false)).trigger('change');
    })
    listError.forEach(function (item) {
        $(`#list-error-${idRow}`).append(new Option(item.name, item.id, false, false)).trigger('change');
    })
    listErrorDetail.forEach(function (item) {
        $(`#list-error-detail-${idRow}`).append(new Option(item.name, item.id, false, false)).trigger('change');
    })
    ListErrorContent.forEach(function (item) {
        $(`#list-error-content-${idRow}`).append(new Option(item.name, item.id, false, false)).trigger('change');
    })
    $('.dataSelect').select2();
    $(`#list-error-parent-${idRow}`).on("change", async (e) => {
        var id = $(`#list-error-parent-${idRow}`).val();
        let error = listError.filter(x => x.parentId == id);
        $(`#list-error-${idRow}`).html("");
        error.forEach(function (item) {
            $(`#list-error-${idRow}`).append(new Option(item.name, item.id, false, false)).trigger("change");
        })
    })
    $(`#list-error-${idRow}`).on("change", async (e) => {
        var id = $(`#list-error-${idRow}`).val();
        $(`#list-error-detail-${idRow}`).html("");
        let error = listErrorDetail.filter(x => x.parentId == id);
        error.forEach(function (item) {
            $(`#list-error-detail-${idRow}`).append(new Option(item.name, item.id, false, false)).trigger("change");
        })
    })
    $(`#list-error-detail-${idRow}`).on("change", async (e) => {
        var id = $(`#list-error-detail-${idRow}`).val();
        $(`#list-error-content-${idRow}`).html("");
        let error = ListErrorContent.filter(x => x.errorDictionaryCategoryId == id);
        error.forEach(function (item) {
            $(`#list-error-content-${idRow}`).append(new Option(item.name, item.id, false, false)).trigger("change");
        })
    })
}
var item;
const updateItem = async () => {
    const tbody = document.querySelector('#errorBox'); // Lấy phần tử tbody
    const rows = tbody.querySelectorAll('tr'); // Lấy tất cả các hàng trong tbody

    const data = []; // Mảng để lưu trữ dữ liệu

    // Duyệt qua từng hàng
    rows.forEach(row => {
        // Khởi tạo mảng rỗng để lưu trữ giá trị của 1 hàng
        const rowValues = [];
        rowValues.push(row.attributes.value.value);
        // Lấy tất cả các phần tử con trong hàng hiện tại
        const cells = row.querySelectorAll('td');

        // Duyệt qua từng phần tử con
        cells.forEach(cell => {
            // Lấy giá trị của phần tử con hiện tại
            let value = '';
            
            // Kiểm tra checkbox
            const checkbox = cell.querySelector('input[type="checkbox"]');
            if (checkbox) {
                value = checkbox.checked; // Lấy trạng thái checked
            } else {
                // Kiểm tra select elements trong divs
                const select = cell.querySelector('select');
                if (select) {
                    // Giả định giá trị được lưu trữ trong tùy chọn đã chọn
                    value = select.options[select.selectedIndex].value; // Lấy giá trị được chọn
                } else {
                    // Kiểm tra input elements
                    const input = cell.querySelector('input[type="text"]');
                    if (input) {
                        value = input.value; // Lấy giá trị của input
                    } else {
                        // Lấy nội dung văn bản cho các phần tử khác
                        value = cell.textContent.trim(); // Cắt bớt khoảng trắng
                    }
                }
            }

            // Thêm giá trị vào mảng của hàng hiện tại
            rowValues.push(value);
        });

        // Thêm mảng giá trị của hàng hiện tại vào mảng dữ liệu
        data.push(rowValues);
    });
    for (i = 0; i < data.length; i++) {
        if (data[i][5] == "") {
            Swal.fire(
                "Lỗi",
                "Đề xuất trừ lỗi không được để trống",
                'warning'
            );
        }
        else if (data[i][6] == "")
        {
            Swal.fire(
                "Lỗi",
                "Số lần vi phạm không được để trống",
                'warning'
            );
        }
        else if (data[i][8] == "") {
            Swal.fire(
                "Lỗi",
                "Nội dung yêu cầu không được để trống",
                'warning'
            );
        }
        else {
            addObj(data);
        }
    }
   
}
const addObj = (value) => {
    var data = value
    var listObjError = [];
    var obj;
    data.forEach(datas => {
        obj = {
            "errorPenaltyId": 1,
            "name": ListErrorContent.find(x => x.id == datas[7]).name,
            "description": listDescription.length == 0 ? "" : listDescription.find(x => x.id == datas[0]).description,
            "info": listDescription.length == 0 ? "" : listDescription.find(x => x.id == datas[0]).info,
            "penaltyOrther": datas[8],
            "penaltyScore": datas[5],
            "penaltyValue": 1,
            "active": 1,
            "errorDictionaryId": datas[7],
            "accountId": $("#staffId").attr("value")
        };
        listObjError.push(obj);
    });
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
                data: JSON.stringify(listObjError),
                success: function (responseData) {
                    // debugger;
                    if (responseData.status == 201 && responseData.message === "CREATED") {
                        Swal.fire(
                            'Thành công!',
                            'Đã cập nhật dữ liệu',
                            'success'
                        );
                        location.reload()
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
    }
    )
}

const getListAccount = async () => {
    await $.ajax({
        url: systemURL + "account/api/ListStaff",
        type: "GET",
        contentType: "application/json",
        success: function (responseData) {
            getListStaff = responseData.data;
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

const renderListStaff = () => {
    var modal = $(".list-group");
    modal.html("")
    getListStaff.forEach(item => {
        if (item.photo == null) {
            item.photo = "/images/userdefault.jpg";
        }
        var renderStaff = `
        <div class="list-group-item list-group-item-action" onClick="selectStaff(${item.zipCode})" style="padding-top: 15px; cursor: pointer">
                        <div class="d-flex justify-content-between">
                        <div class="d-flex gap-3">
                            <img style="object-fit: cover; border-radius: 50%" class="accountPhoto" height="32" width="32" src="${item.photo}" alt="User">
                            <div class="d-flex flex-column">
                                <span style="line-height: 14.7px;" class="fs-14" id="renderName">${item.fullName}</span>
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
    })
}

const selectStaff = async (zipCode) => {
    var staff = await getListStaff.find(x => x.zipCode == zipCode);
    $("#accountPhoto").src = staff.photo == null ? "/images/userdefault.jpg" : staff.photo;
    $("#staffName").text(staff.fullName);
    $("#staffRole").text(staff.roleName);
    $("#staffId").text("MS " + staff.zipCode).attr("value", staff.id);
    $("#exampleModal").modal('hide');
    $(".list-group").html("")
}

const openModelDes = (id) => {
    var findObj = listDescription.find(x => x.id == id);
    if (findObj == undefined) {
        $(".infoError").html("");
    }
    else {
        $(".infoError").html("")
        $(".infoError").append(`
               <div class="d-fex flex-column gap-3" style="background: #EAECF2; border-radius: 10px; padding: 8px;">
                        <p style="color: black; font-size: 18px; font-family: SVN-Gilroy; font-weight: 700;">Mô tả lỗi</p>
                        <p style="color: black; font-size: 16px; font-family: SVN-Gilroy; font-weight: 400;" id="descriptionError">${findObj.description}</p>
                        <p style="color: black; font-size: 18px; font-family: SVN-Gilroy; font-weight: 700;">Hình ảnh</p>
                        <img id="infoError" src="${findObj.info}"/>
                    </div>
        `)
    }
    $("#onpenModalWrite").val(id);
    $("#descriptionModal").modal('show');
}
const openModalError = () => {
    $("#descriptionModal").modal('hide');
    $("#writeError").modal('show');
    $("#errorContent").val("");
    $("#inputId").val($("#onpenModalWrite").val())
}

const changeImage = () => {
    var value = $("#inputGroupFile01").val();
    var convert = value.split("\\").join("/");
    $("#imageError").attr("src", convert);
}
const uploadError = () => {
    var objError = {
        "id": $("#inputId").val(),
        description: $("#errorContent").val(),
        info: $("#imageError").attr("src")
    }
    listDescription.push(objError);
    $("#writeError").modal('hide');
}
const getStaffForId = async (id) => {
    await getListAccount();
    var staffs = getListStaff.find(x => x.id == id);
    if (staffs != undefined) {
        $("#accountPhoto").src = staffs.photo == null ? "/images/userdefault.jpg" : staffs.photo;
        $("#staffName").text(staffs.fullName);
        $("#staffRole").text(staffs.roleName);
        $("#staffId").text("MS " + staffs.zipCode).attr("value", staffs.id);
    }
}

const deleteRow = () => {

}
const searchStaff = () => {
    $("#searchStaff").keyup(function () {
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
}