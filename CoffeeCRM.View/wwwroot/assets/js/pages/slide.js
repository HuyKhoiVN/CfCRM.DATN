/**
 * Author: Ha Thanh Nguyen
 * CreatedTime: 07/09/2024
 */


var dataSource = [];
var table, linked1, linked2;
var tableUpdating = 0;
var updatingObj;
var upperIcon = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <rect opacity="0.5" x="13" y="6" width="13" height="2" rx="1" transform="rotate(90 13 6)" fill="currentColor"/>
                                                            <path d="M12.5657 8.56569L16.75 12.75C17.1642 13.1642 17.8358 13.1642 18.25 12.75C18.6642 12.3358 18.6642 11.6642 18.25 11.25L12.7071 5.70711C12.3166 5.31658 11.6834 5.31658 11.2929 5.70711L5.75 11.25C5.33579 11.6642 5.33579 12.3358 5.75 12.75C6.16421 13.1642 6.83579 13.1642 7.25 12.75L11.4343 8.56569C11.7467 8.25327 12.2533 8.25327 12.5657 8.56569Z" fill="currentColor"/>
                                                            </svg>`;
var lowerIcon = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <rect opacity="0.5" x="11" y="18" width="13" height="2" rx="1" transform="rotate(-90 11 18)" fill="currentColor"/>
                                                            <path d="M11.4343 15.4343L7.25 11.25C6.83579 10.8358 6.16421 10.8358 5.75 11.25C5.33579 11.6642 5.33579 12.3358 5.75 12.75L11.2929 18.2929C11.6834 18.6834 12.3166 18.6834 12.7071 18.2929L18.25 12.75C18.6642 12.3358 18.6642 11.6642 18.25 11.25C17.8358 10.8358 17.1642 10.8358 16.75 11.25L12.5657 15.4343C12.2533 15.7467 11.7467 15.7467 11.4343 15.4343Z" fill="currentColor"/>
                                                            </svg>`;
$(document).ready(async function () {
    await loadData();
    $("#btnAddNew").on("click", function () {
        editItem(0);
    })

    $("#tableData").on("click", ".btn-admin-edit", function () {
        var id = parseInt($(this).attr("data-idItem"));
        editItem(id);
    })

    $("#tableData").on("click", ".btn-admin-delete", function () {
        var id = parseInt($(this).attr("data-idItem"));
        deleteItem(id);
    })

    $("#submitButton").on("click", function () {
        validate();
    })

    $("#form-submit-slide").on("submit", function (e) {
        e.preventDefault();
        validate();
    })

    $("#table_search_all").on('keyup', function (e) {
        if (e.keyCode == 13) {
            table.search($(this).val()).draw();
        }
    });
    $("#btnTableSearch").click(function () {
        tableSearch();
    });

    $("#tableData thead:nth-child(2)").find("input").keypress(function (e) {
        let key = e.which;
        if (key == 13) {
            $("#btnTableSearch").click();
        }
    })

    $("#btnTableResetSearch").click(function () {
        $("#fillter_startDate_value").val("");
        $("#fillter_endDate_value").val("");
        $("#searchName").val("");
        $("#searchSort").val("");
        tableSearch();
    });

    const linkedPicker1Element = document.getElementById("fillter_startDate");
    linked1 = new tempusDominus.TempusDominus(linkedPicker1Element, datePickerOption);
    linked2 = new tempusDominus.TempusDominus(document.getElementById("fillter_endDate"), datePickerOption);
    // updateOption
    linked2.updateOptions({
        useCurrent: false,
    });
    //using event listeners
    linkedPicker1Element.addEventListener(tempusDominus.Namespace.events.change, (e) => {
        var minDate = $("#fillter_startDate_value").val() == "" ? undefined : new Date(moment(e.detail.date).add(-1, "d"));
        linked2.updateOptions({
            restrictions: {
                minDate: minDate
            },
        });
    });
    //using subscribe method
    const subscription = linked2.subscribe(tempusDominus.Namespace.events.change, (e) => {
        var maxdate = $("#fillter_endDate_value").val() == "" ? undefined : new Date(moment(e.date).add(1, "d"));
        linked1.updateOptions({
            restrictions: {
                maxDate: maxdate
            },
        });
    });
    
})
$("#slideName").on("keypress", function (e) {
    if (e.keyCode == 13) {

        e.preventDefault();
        validate();

    }
});
$("#slideOrderSort").on("keypress", function (e) {
    if (e.keyCode == 13) {

        e.preventDefault();
        validate();

    }
});
function tableSearch() {
    table.column(2).search($("#searchName").val());
    table.column(3).search($("#searchSort").val());
    table.search($("#table_search_all").val().trim()).draw();
}

async function editItem(id) {
    if (id > 0) {
        try {
            let result = await httpService.getAsync(`api/Slide/detail/${id}`);
            if (result.isSucceeded) {
                if (result.status == 200) {
                    updatingObj = result.resources;
                    
                }
            }
            else {
                console.error(result);
            }
        }
        catch (e) {
            console.error(e);
        }
    }
    else {
        updatingObj = {};
    }


    $("#slideName").val(id > 0 ? updatingObj.name : "").trigger("change");
    $("#postPhoto").attr("src", id > 0 ?  systemConfig.defaultStorageURL + updatingObj.image : "/assets/media/images/blog/NoImage.png").trigger("change");
    if (id > 0) {
        $("#postPhoto").attr("file-path", updatingObj.image != "" ? systemConfig.defaultStorageURL + updatingObj.image : "").trigger("change");
    }
    else {
        $("#postPhoto").attr("file-path", "");
    }
    $("#slideDescription").val(id > 0 ? updatingObj.description : "").trigger("change");
    $("#slideOrderSort").val(id > 0 ? updatingObj.candidateOrderSort : "").trigger("change");
    $("#createdTime").val(id > 0 ? moment(updatingObj.createdTime).format("DD/MM/YYYY HH:mm:ss") : moment().format("DD/MM/YYYY HH:mm:ss")).trigger("change");
    $("#slideModalTitle").text(id > 0 ? "Cập nhật slide" : "Thêm mới slide");
    $("#loading").removeClass("show");
    $("#slideModal").modal("show");
}


async function loadData() {
    try {
        let res = await httpService.getAsync("api/Slide/list");
        if (res.isSucceeded) {
            dataSource = res.resources;
            
            loadTable();
            initTable();
        }
    } catch (e) {
        dataSource = [];
        loadTable();
        initTable();
        console.error(e);
    }

}

function initTable() {
    table = $('#tableData').DataTable({
        language: systemConfig.languageDataTable,
        searching: {
            regex: true
        },
        columnDefs: [
            { targets: "no-sort", orderable: false },
            { targets: [0, 1,-1,4,5], orderable: false },
            { targets: "no-search", searchable: false },
            {
                targets: "trim",
                render: function (data, type, full, meta) {
                    if (type === "display") {
                        data = strtrunc(data, 10);
                    }

                    return data;
                }
            },
            { targets: "date-type", type: "date-eu" },

        ],

        'order': [
            [3, 'asc']
        ],

        aLengthMenu: [
            [10, 25, 50, 100],
            [10, 25, 50, 100]
        ],
        drawCallback: function () {
            $('#tableData tfoot').html("");
            $("#tableData thead:nth-child(1) tr").clone(true).appendTo("#tableData tfoot");
            $("#rowSearch").removeClass("d-none");
        }
    });

    table.on('order.dt search.dt', function () {
        table.column(0, {
            search: 'applied',
            order: 'applied'
        }).nodes().each(function (cell, i) {
            cell.innerHTML = i + 1;
        });
    }).draw();
}

function loadTable() {
    index = 0;
    $("#tableData tbody").html("");
    dataSource.forEach(function (item, index) {
        var rowContent = "<tr>";
        rowContent += "<td style='text-align: center;' data-id-row='" + item.id + "'>" + (index + 1) + "</td>";
        let pathLogo = systemConfig.defaultStorageURL + item.image;
        rowContent += '<td data-id-row="' + item.id + '"><img src="' + pathLogo + '" alt="Logo" style="width:100px; max-width:100px; height: auto; max-height: 100px;"></td>';
        rowContent += '<td data-id-row="' + item.id + '">' + item.name + '</td>';
        rowContent += "<td>" + item.candidateOrderSort + "-" + item.subOrderSort + "</td>";
        rowContent += '<td class="text-center order-section-change-up" data-id-row="' + item.id + '" data-event="upper-order-' + item.id + '"><span class="svg-icon svg-icon-success svg-icon-2hx">' + upperIcon + '</span></td>';
        rowContent += '<td class="text-center order-section-change-down" data-id-row="' + item.id + '" data-event="lower-order-' + item.id + '"><span class="svg-icon svg-icon-danger svg-icon-2hx">' + lowerIcon + '</span></td>';
        rowContent += "<td>" + moment(item.createdTime, "YYYY-MM-DD hh:mm:ss").format("DD/MM/YYYY hh:mm:ss") + "</td>";
        rowContent += '<td class="row' + item.id + '-column column-" property="" data-id-row="' + item.id + '">'
            + '<div class="d-flex justify-content-center">';
        rowContent += "<button  type='button' class='btn btn-icon btn-admin-edit' data-idItem='" + item.id + "' data-id-row='" + item.id + "'><span class='svg-icon-primary svg-icon  svg-icon-1'> " + systemConfig.editIcon + " </span></button>"

        rowContent += "<button type='button' class='btn btn-icon btn-admin-delete' data-idItem='" + item.id + "' data-id-row='" + item.id + "' ><span class='svg-icon-danger svg-icon  svg-icon-1'>" + systemConfig.deleteIcon + "</span></button></div>";

        rowContent += "</div></td ></tr>";
        $(rowContent).appendTo($("#tableData tbody"));
    })

}

function refreshTable() {
    reGenDataTable(table, function () {
        $("#table_search_all").val(null).trigger("change");
        $("#tableData .tableHeaderFilter").val(null).trigger("change");
        linked1.clear();
        linked2.clear();
        loadData();
    })
}
async function deleteItem(id) {
    let item = dataSource.find(c => c.id == id);
    swal.fire({
        title: 'Xóa slide',
        html: 'Bạn có chắc chắn muốn xóa slide <b>' + item.name + '</b>',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        cancelButtonText: 'Hủy',
        confirmButtonText: 'Xóa'
    }).then(async (result) => {
        if (result.isConfirmed) {
            $("#loading").addClass("show");
            try {
                let result = await httpService.deleteAsync(`api/Slide/delete/${id}`)
                if (result.isSucceeded) {
                    if (result.status == 200) {
                        Swal.fire(
                            'slide',
                            'slide <b>' + item.name + ' </b> đã được xóa thành công.',
                            'success'
                        );
                        refreshTable();
                    }
                }
                else {
                    Swal.fire(
                        'slide',
                        'Xóa slide không thành công, <b> vui lòng thử lại sau.',
                        'error'
                    );
                }
                $("#loading").removeClass("show");
            } catch (e) {
                if (e.status === 401) {
                    Swal.fire(
                        'slide',
                        'Phiên đăng nhập của bạn đã hết hạn, vui lòng đăng nhập để sử dụng tính năng này.',
                        'error'
                    ).then(function () {
                        window.location.href = "/home/login";
                    });
                }
                else if (e.status == 403) {
                    Swal.fire(
                        'slide',
                        'Bạn không có quyền sử dụng tính năng này.',
                        'error'
                    );
                }
                else {
                    Swal.fire(
                        'slide',
                        'Xóa slide không thành công, <br> vui lòng thử lại sau!',
                        'error'
                    );
                }
                $("#loading").removeClass("show");
            }
        }
    })
}

function submit() {

    updatingObj.name = $("#slideName").val().trim();
    updatingObj.description = $("#slideDescription").val();
    updatingObj.candidateordersort = $("#slideOrderSort").val();
   
    var urlImgPost;

    if ($("#postPhoto").attr("file-path") != undefined && $("#postPhoto").attr("file-path") != "") {
        urlImgPost = $("#postPhoto").attr("file-path").replace(systemConfig.defaultStorageURL, "");
        
    }
    updatingObj.image = urlImgPost;
    
   

    let actionName = updatingObj.id != undefined ? "Cập nhật" : "Thêm mới";

    Swal.fire({
        title: actionName + " slide",
        html: "Bạn có chắc chắn muốn " + actionName.toLowerCase() + " slide <b>" + $("#slideName").val() + '</b>?',
        icon: 'info',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#443',
        confirmButtonText: 'Lưu',
        cancelButtonText: 'Hủy'
    }).then(async (result) => {
        if (result.isConfirmed) {
            $("#loading").addClass("show");
            //CALL AJAX TO CREATE
            if (updatingObj) {
                try {
                    let result;
                    if (updatingObj.id > 0) {
                        result = await httpService.putAsync("api/Slide/update", updatingObj);
                    } else {
                        result = await httpService.postAsync("api/Slide/add", updatingObj);
                    }

                    if (result.isSucceeded) {
                        Swal.fire(
                            'slide',
                            'slide <b>' + updatingObj.name + `</b> đã được ${actionName.toLowerCase()} thành công.`,
                            'success'
                        ).then((result) => {
                            $("#slideModal").modal("hide");
                            refreshTable();
                        });
                    } else {
                        if (result.status == 400) {
                            let swalSubTitle = "<p class='swal__admin__subtitle'>" + actionName.toLowerCase() + " không thành công</p>";
                            if (result.errors != null) {
                                let contentError = "<ul>";
                                result.errors.forEach(function (item, index) {
                                    contentError += "<li class='text-start'>" + item + "</li>";
                                })
                                contentError += "</ul>";
                                Swal.fire(
                                    'slide' + swalSubTitle,
                                    contentError,
                                    'warning'
                                );

                            } else {
                                let contentError = `<ul>
                                                <li class='text-start'>`+ result.message + `</li>
                                </ul>`;
                                Swal.fire(
                                    'slide' + swalSubTitle,
                                    contentError,
                                    'warning'
                                );
                            }
                        }
                        else {
                            Swal.fire(
                                'Slide',
                                `${actionName} loại không thành công, <br> vui lòng thử lại sau!`,
                                'error'
                            );
                        }
                    }
                    $("#loading").removeClass("show");
                } catch (e) {
                    console.error(e);
                    if (e.status === 401) {
                        Swal.fire(
                            'Slide',
                            'Phiên đăng nhập của bạn đã hết hạn, vui lòng đăng nhập để sử dụng tính năng này.',
                            'error'
                        ).then(function () {
                            window.location.href = "/home/login";
                        });
                    }
                    else if (e.status == 403) {
                        Swal.fire(
                            'Slide',
                            'Bạn không có slide sử dụng tính năng này.',
                            'error'
                        );
                    }
                    else {
                        swal.fire(
                            'Slide',
                            `${actionName} slide không thành công, <br> vui lòng thử lại sau!`,
                            'error'
                        );
                    }
                    $("#loading").removeClass("show");
                }
            }
            $("#loading").removeClass("show");
        }
    });
}
var objSectionOrderUp = [];
var objSectionOrderDown = [];
$("#tableData").on('click', '.order-section-change-up', function () {

    var clickedElementId = $(this).attr('data-id-row');
    

    // Sử dụng findIndex để tìm index của phần tử trong mảng dataSource dựa trên giá trị id
    var index = dataSource.findIndex(x => x.id == clickedElementId);
    
    if (index != 0) {
        objSectionOrderUp = dataSource[index];
        objSectionOrderDown = dataSource[index - 1];

        var obj = {
            slideUp: objSectionOrderUp,
            slideDown: objSectionOrderDown,
        }
        
        swal.fire({
            title: "Thay đổi thứ tự slide",
            html: "Bạn có chắc chắn muốn thay đổi thứ tự slide này",
            icon: 'info',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#443',
            cancelButtonText: 'Hủy',
            confirmButtonText: 'Lưu'
        }).then(async (result) => {
            if (result.isConfirmed) {
                $("#loading").addClass("show");
                //CALL AJAX TO CREATE
                if (obj) {
                    try {
                        let result;
                        result = await httpService.postAsync("api/Slide/change-order-slide", obj);
                        

                        if (result.isSucceeded) {
                            Swal.fire(
                                'Thay đổi thứ tự slide',
                                'Thay đổi thứ tự slide  thành công.',
                                'success'
                            ).then((result) => {

                                refreshTable();
                            });
                        } else {
                            if (result.status == 400) {
                                Swal.fire(
                                    'Thay đổi thứ tự slide',
                                    `Thay đổi thứ tự slide không thành công, <br> vui lòng thử lại sau!`,
                                    'error'
                                );
                            }
                            else {
                                Swal.fire(
                                    'Thay đổi thứ tự slide',
                                    `Thay đổi thứ tự slide không thành công, <br> vui lòng thử lại sau!`,
                                    'error'
                                );
                            }
                        }
                        $("#loading").removeClass("show");
                    } catch (e) {
                        console.error(e);
                        if (e.status === 401) {
                            Swal.fire(
                                'Thay đổi thứ tự slide',
                                'Phiên đăng nhập của bạn đã hết hạn, vui lòng đăng nhập để sử dụng tính năng này.',
                                'error'
                            ).then(function () {
                                window.location.href = "/home/login";
                            });
                        }
                        else if (e.status == 403) {
                            Swal.fire(
                                'Thay đổi thứ tự slide',
                                'Bạn không có quyền sử dụng tính năng này.',
                                'error'
                            );
                        }
                        else {
                            swal.fire(
                                'Thay đổi thứ tự slide',
                                `Thay đổi thứ tự slide không thành công, <br> vui lòng thử lại sau!`,
                                'error'
                            );
                        }
                        $("#loading").removeClass("show");
                    }
                }
                $("#loading").removeClass("show");
            }
        });
    }
    else {
        swal.fire({
            title: "Thay đổi thứ tự slide",
            html: "Học phần này đã ở vị trí đầu tiên, không thể thay đổi lên trên được",
            icon: 'info',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'Đồng ý'
        })
    }
})
$("#tableData").on('click', '.order-section-change-down', function () {

    var clickedElementId = $(this).attr('data-id-row');


    // Sử dụng findIndex để tìm index của phần tử trong mảng dataSource dựa trên giá trị id
    var index = dataSource.findIndex(x => x.id == clickedElementId);

    if (index != dataSource.length - 1 ) {
        objSectionOrderUp = dataSource[index];
        objSectionOrderDown = dataSource[index + 1];

        var obj = {
            slideUp: objSectionOrderUp,
            slideDown: objSectionOrderDown,
        }
        
        swal.fire({
            title: "Thay đổi thứ tự slide",
            html: "Bạn có chắc chắn muốn thay đổi thứ tự slide này",
            icon: 'info',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#443',
            cancelButtonText: 'Hủy',
            confirmButtonText: 'Lưu'
        }).then(async (result) => {
            if (result.isConfirmed) {
                $("#loading").addClass("show");
                //CALL AJAX TO CREATE
                if (obj) {
                    try {
                        let result;
                        result = await httpService.postAsync("api/Slide/change-order-slide", obj);


                        if (result.isSucceeded) {
                            Swal.fire(
                                'Thay đổi thứ tự slide',
                                'Thay đổi thứ tự slide  thành công.',
                                'success'
                            ).then((result) => {

                                refreshTable();
                            });
                        } else {
                            if (result.status == 400) {
                                Swal.fire(
                                    'Thay đổi thứ tự slide',
                                    `Thay đổi thứ tự slide không thành công, <br> vui lòng thử lại sau!`,
                                    'error'
                                );
                            }
                            else {
                                Swal.fire(
                                    'Thay đổi thứ tự slide',
                                    `Thay đổi thứ tự slide không thành công, <br> vui lòng thử lại sau!`,
                                    'error'
                                );
                            }
                        }
                        $("#loading").removeClass("show");
                    } catch (e) {
                        console.error(e);
                        if (e.status === 401) {
                            Swal.fire(
                                'Thay đổi thứ tự slide',
                                'Phiên đăng nhập của bạn đã hết hạn, vui lòng đăng nhập để sử dụng tính năng này.',
                                'error'
                            ).then(function () {
                                window.location.href = "/home/login";
                            });
                        }
                        else if (e.status == 403) {
                            Swal.fire(
                                'Thay đổi thứ tự slide',
                                'Bạn không có quyền sử dụng tính năng này.',
                                'error'
                            );
                        }
                        else {
                            swal.fire(
                                'Thay đổi thứ tự slide',
                                `Thay đổi thứ tự slide không thành công, <br> vui lòng thử lại sau!`,
                                'error'
                            );
                        }
                        $("#loading").removeClass("show");
                    }
                }
                $("#loading").removeClass("show");
            }
        });
    }
    else {
        swal.fire({
            title: "Thay đổi thứ tự slide",
            html: "Học phần này đã ở vị trí cuối cùng, không thể thay đổi xuống dưới được",
            icon: 'info',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'Đồng ý'
        })
    }
})
function validate(obj) {
    var errorList = [];
    if ($("#postPhoto").attr("file-path") == "" || $("#postPhoto").attr("file-path") == undefined ) {
        errorList.push("Ảnh không được để trống.");
    }
    if ($("#slideOrderSort").val().length === 0) {
        errorList.push("Thứ tự không được để trống.");
    }
    if ($("#slideName").val().length === 0) {
        errorList.push("Tên không được để trống.");
    } else if ($("#slideName").val().length > 255) {
        errorList.push("Tên không được dài quá 255 ký tự.");
    }

    //if ($("#slideValue").val().length === 0) {
    //    errorList.push("Giá trị không được để trống.");
    //} else if ($("#slideValue").val().length > 255) {
    //    errorList.push("Giá trị không được dài quá 255 ký tự.");
    //}

    //if ($("#slideDescription").val().length > 500) {
    //    errorList.push("Mô tả không được dài quá 500 ký tự.");
    //}

    if (errorList.length > 0) {
        var contentError = "<ul>";
        errorList.forEach(function (item, index) {
            contentError += "<li class='text-start'>" + item + "</li>";
        })
        contentError += "</ul>";
        var actionName = (updatingObj.id > 0 ? "Cập nhật" : "Thêm mới");
        var swalSubTitle = "<p class='swal__admin__subtitle'>" + actionName + "không thành công</p>";
        Swal.fire(
            'slide ' + swalSubTitle,
            contentError,
            'warning'
        );
    } else {
        submit();
    }
}

$.fn.dataTable.ext.search.push(
    function (settings, data, dataIndex) {
        var date = new Date(moment(data[6], "DD/MM/YYYY HH:mm:ss"));
        var startDate = $("#fillter_startDate_value").val();
        var endDate = $("#fillter_endDate_value").val();
        var min = startDate != "" ? new Date(moment(startDate, "DD/MM/YYYY ").format("YYYY-MM-DD 00:00:00")) : null;
        var max = endDate != "" ? new Date(moment(endDate, "DD/MM/YYYY").format("YYYY-MM-DD 23:59:59")) : null;
        if (
            (min === null && max === null) ||
            (min === null && date <= max) ||
            (min <= date && max === null) ||
            (min <= date && date <= max)
        ) {
            return true;
        }
        return false;
    }
);