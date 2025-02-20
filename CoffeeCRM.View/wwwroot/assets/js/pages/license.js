$(document).ready(function () {
    loadLicenseType();
    loadData();

    $('#licenseIsApprovedTable').val("").trigger("change");
    $("#licenseIsApprovedTable").select2({
        language: "vi",
        allowClear: true,
        placeholder: "",
        language: "vi"
    });

    $("#tableData").on("click", ".btn-admin-delete", function () {
        var id = parseInt($(this).attr("data-idItem"));
        deleteItem(id);
    })

    $("#table_search_all").on('keyup', function (e) {
        if (e.keyCode == 13) {
            table.search($(this).val()).draw();
        }
    });
    $("#btnTableSearch").click(function () {
        tableSearch();
    });


    $("#tableData thead:nth-child(2) thead:nth-child(3)").find("input").keypress(function (e) {
        let key = e.which;
        if (key == 13) {
            tableSearch();
        }
    })


    $("#btnTableResetSearch").click(function () {
        //$("#searchPath").val("");
        $("#searchCompanyName").val("");
        $("#searchLicenseType").val("");
        $("#fillter_startDate_value").val("");
        $("#fillter_endDate_value").val("");
        $(".tableHeaderFilter").val("").trigger("change");
        linked1.clear();
        linked2.clear();
        tableSearch();
    });

    $("#tableData").on("change", ".checkboxIsApproved", function () {
        var id = parseInt($(this).attr("data-approved-id"));
        //console.log(id);
        var actionName = $(this).is(":checked") ? "Duyệt" : "Bỏ duyệt";
        let objName = $("#row" + id + "-column-name").text();
        var obj = {
            id: id,
            isApproved: $(this).is(":checked"),
        }

        swal.fire({
            title: "Quản lý giầy tờ",
            html: "Bạn có chắc chắn muốn " + actionName.toLowerCase() + " giầy tờ <strong>" + objName + "</strong> không?",
            icon: 'info',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#443',
            cancelButtonText: 'Hủy',
            confirmButtonText: 'Lưu'
        }).then((result) => {
            if (result.isConfirmed) {
                $("#loading").addClass("show");

                $.ajax({
                    url: systemConfig.defaultAPIURL + "api/license/approved",
                    type: "PUT",
                    contentType: "application/json",
                    data: JSON.stringify(obj),
                    success: function (response) {
                        // debugger;

                        if (response.isSucceeded) {
                            Swal.fire(
                                'Quản lý giầy tờ',
                                'Giầy tờ <b>' + objName + '</b> đã được cập nhật thành công.',
                                'success'
                            );
                        } else {

                            var swalSubTitle = "<p class='swal__admin__subtitle'>" + actionName.toLowerCase() + " không thành công</p>";

                            if (response.errors != null) {
                                var contentError = "<ul>";
                                response.errors.forEach(function (item, index) {
                                    contentError += "<li class='text-start'>" + item + "</li>";
                                })
                                contentError += "</ul>";


                                Swal.fire(
                                    'Giầy tờ' + swalSubTitle,
                                    contentError,
                                    'warning'
                                );

                            } else {
                                var contentError = `<ul>
                                                <li class='text-start'>`+ response.message + `</li>
                                </ul>`;


                                Swal.fire(
                                    'Giầy tờ' + swalSubTitle,
                                    contentError,
                                    'warning'
                                );
                            }

                            $(this).prop('checked', !obj.isApproved);


                        }
                        $("#loading").removeClass("show");


                    },
                    error: function (e) {
                        //console.log(e.message);
                        $("#loading").removeClass("show");

                        if (e.status === 401) {
                            Swal.fire(
                                'Quản lý giầy tờ',
                                'Phiên đăng nhập của bạn đã hết hạn, vui lòng đăng nhập để sử dụng tính năng này.',
                                'error'
                            ).then(function () {
                                window.location.href = "";
                            });
                        }
                        else if (e.status == 403) {
                            Swal.fire(
                                'Quản lý giầy tờ',
                                'Bạn không có quyền sử dụng tính năng này.',
                                'error'
                            );
                        }
                        else {
                            Swal.fire({
                                title: "Quản lý giầy tờ",
                                html: $(this).is(":checked") ? "Duyệt" : "Bỏ duyệt" + ' giầy tờ không thành công, vui lòng thử lại sau !',
                                icon: 'error'
                            });

                        }
                        $(this).prop('checked', !obj.isApproved);
                    }
                });


            } else {
                $(this).prop('checked', !obj.isApproved);

            }
        })
    })

    $("#tableData").on("change", ".checkboxIsApproved", function () {
    })


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


async function getItemById(id) {
    return (await $.ajax({
        url: systemConfig.defaultAPIURL + "api/license/detail/" + id,
        type: "GET",
        success: function (responseData) {
        },
        error: function (e) {
        },
    })).resources;
}

async function deleteItem(id) {
    updatingObj = await getItemById(id);
    var file = updatingObj.path.split('/');
    swal.fire({
        title: 'Xóa giầy tờ',
        html: 'Bạn có chắc chắn muốn xóa giầy tờ <b>' + file[file.length - 1] + '</b>?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        cancelButtonText: 'Hủy',
        confirmButtonText: 'Xóa'
    }).then((result) => {
        if (result.isConfirmed) {
            $("#loading").addClass("show");
            $.ajax({
                url: systemConfig.defaultAPIURL + "api/license/delete/" + id,
                type: "DELETE",
                success: function (response) {
                    $("#loading").removeClass("show");
                    if (response.isSucceeded) {
                        Swal.fire(
                            'Xóa giầy tờ',
                            'Giầy tờ <b>' + file[file.length - 1] + ' </b> đã được xóa thành công.',
                            'success'
                        );

                        regenTableServerSide();

                    } else {
                        if (response.status == 400) {
                            if (response.errors != null) {
                                var contentError = "<ul>";
                                response.errors.forEach(function (item, index) {
                                    contentError += "<li class='text-start pb-2'>" + item + "</li>";
                                })
                                contentError += "</ul>";
                                Swal.fire(
                                    'Giầy tờ <p class="swal__admin__subtitle"> Xóa không thành công </p>',
                                    contentError,
                                    'warning'
                                );
                            } else {
                                Swal.fire(
                                    'Lưu ý',
                                    response.message,
                                    'warning'
                                )
                            }
                        }
                        else {
                            Swal.fire(
                                'Lưu ý',
                                response.message,
                                'warning'
                            )
                        }
                    }
                },
                error: function (e) {
                    $("#loading").removeClass("show");
                    if (e.status === 401) {
                        Swal.fire(
                            'Quản lý giầy tờ',
                            'Phiên đăng nhập của bạn đã hết hạn, vui lòng đăng nhập để sử dụng tính năng này.',
                            'error'
                        ).then(function () {
                            window.location.href = "/home/login";
                        });
                    }
                    else if (e.status == 403) {
                        Swal.fire(
                            'Quản lý giầy tờ',
                            'Bạn không có quyền sử dụng tính năng này.',
                            'error'
                        );
                    }
                    else {
                        Swal.fire(
                            'Xóa giầy tờ',
                            'Xóa giầy tờ không thành công, <br> vui lòng thử lại sau!',
                            'error'
                        );
                    }

                }
            })
        }
    })
}

function loadLicenseType() {
    $.ajax({
        url: systemConfig.defaultAPIURL + "api/license-type/list",
        type: "GET",
        contentType: "application/json",
        success: function (response) {
            //console.log(response);
            var data = response.resources;
            data.forEach(function (item, index) {
                var data = {
                    id: item.id,
                    text: item.name
                };
                var newOption = new Option(data.text, data.id, false, false);
                $('#searchLicenseType').append(newOption);


                //$("#loading").removeClass("show");

            });
            $('#searchLicenseType').val("").trigger("change");
            $('#searchLicenseType').select2({
                allowClear: true,
                placeholder: "",
                language: "vi"
            });

        },
        error: function (e) {
            if (e.status === 401) {
                Swal.fire(
                    'Quản lý giầy tờ',
                    'Phiên đăng nhập của bạn đã hết hạn, vui lòng đăng nhập để sử dụng tính năng này.',
                    'error'
                ).then(function () {
                    window.location.href = "/home/login";
                });
            }
            else if (e.status == 403) {
                Swal.fire(
                    'Quản lý giầy tờ',
                    'Bạn không có quyền sử dụng tính năng này.',
                    'error'
                );
            }
            else {
                Swal.fire(
                    'Quản lý giầy tờ',
                    'Không thể hiển thị loại giầy tờ, hãy kiểm tra lại thông tin.',
                    'error'
                );
            }
        }
    });
}

function tableSearch() {
    //table.column(1).search($("#searchPath").val().trim());
    table.column(1).search($("#searchCompanyName").val().trim());
    table.column(2).search($("#searchLicenseType").val().toString());
    if ($("#fillter_startDate_value").val().length > 0 || $("#fillter_endDate_value").val().length > 0) {
        //debugger;
        var minDate = $("#fillter_startDate_value").val();
        var maxDate = $("#fillter_endDate_value").val();
        let searchDateArrs = [];

        if (minDate.length > 0) {
            searchDateArrs.push(moment(minDate, "DD/MM/YYYY").format("YYYY-MM-DD 00:00:00"))

        }
        else {
            searchDateArrs.push("")
        }
        if (maxDate.length > 0) {
            searchDateArrs.push(moment(maxDate, "DD/MM/YYYY").format("YYYY-MM-DD 23:59:59"))
        }
        else {
            searchDateArrs.push("")
        }
        table.column(4).search(searchDateArrs.toString());
    }
    else {
        table.column(4).search("")
    }
    table.column(5).search($("#licenseIsApprovedTable").val());

    table.search($("#table_search_all").val());

    table.draw();
}
function loadData() {
    table = $("#tableData").DataTable({
        language: systemConfig.languageDataTable,
        processing: true,
        serverSide: true,
        paging: true,
        searching: { regex: true },
        ajax: {
            url: systemConfig.defaultAPIURL + "api/license/list-license-aggregates",
            type: "POST",
            contentType: "application/json",
            dataType: "json",
            data: function (d) {
                return JSON.stringify(d);
            },

        },
        columns: [
            {
                className: "column-index",
                data: 'id',
                render: function (data, type, row, meta) {
                    var info = table.page.info();
                    return meta.row + 1 + info.page * info.length;
                }
            },
            {
                data: "companyName",
                render: function (data, type, row, meta) {
                    return `<span id='row` + row.id + `-column-name'>` + data + `</span>`;
                }
            },

            {
                data: "licenseTypeName",
                render: function (data, type, row, meta) {
                    return `<span id='row` + row.id + `-column-name'>` + data + `</span>`;;
                }
            },
            {
                data: "path",
                render: function (data, type, row, meta) {
                    var file = data.split('.');
                    var content = "";
                    if (file[file.length - 1] == "pdf") {
                        //Dùng đoạn này thay cho content bên dưới
                        content = `<div class="d-none">
                                      <button id="prev">Previous</button>
                                      <button id="next">Next</button>
                                      &nbsp; &nbsp;
                                      <span>Page: <span id="page_num"></span> / <span id="page_count"></span></span>
                                    </div>
                                    <div id="${row.id}" class="canvas-pdf">
                                        <a href="` + (systemConfig.defaultStorageURL + data) + `" target="_blank">
                                            <canvas id="the-canvas"></canvas>
                                        <a/>
                                        <div id="a-` + (row.id) + `" class="d-none">${data}</div>
                                    </div>`;
                        return content;

                        
                    } else {
                        content = `<div class='symbol symbol-100px symbol-lg-160px symbol-fixed position-relative imgPost'>
                                        <a href="` + (systemConfig.defaultStorageURL + data) + `" target="_blank"> 
                                            <img src='` + (systemConfig.defaultStorageURL + data) + `' alt='image' style='width: 160px;'> 
                                        <a/>
                                   </div>`;
                        return content;    
                    }
                    
                }
            },
            {
                data: "createdTime",
                render: function (data, type, row, meta) {
                    return moment(data).format("DD/MM/YYYY HH:mm:ss");
                }
            },
            {
                data: "isApproved",
                render: function (data, type, row, meta) {
                    let isChecked;
                    if (data) {
                        isChecked = "checked";
                    }
                    else {
                        isChecked = "";
                    }
                    let content = `<div class="form-check form-switch switch_custom text-center form-check-solid d-flex justify-content-center">
											<input data-approved-id= "`+ row.id + `" class="form-check-input checkboxIsApproved" type="checkbox" value=""  ` + isChecked + ` />
			
		                            </div>`;
                    return content;
                }
            },
            {
                data: "id",
                render: function (data, type, row, meta) {
                    return `<div class='d-flex justify-content-center'>`
                        + `<button class="btn btn-icon ms-2 btn-admin-delete"  title='Xóa' data-idItem='` + data + `' ><span class='svg-icon-danger svg-icon  svg-icon-1'>` + systemConfig.deleteIcon + `</span></button></div>`;
                }
            }
        ],
        columnDefs: [

            { targets: [0, -1, 2], orderable: false },

        ],
        'order': [
            [5, 'desc']
        ],
        drawCallback: function () {
            $('#tableData tfoot').html("");
            $("#tableData thead:nth-child(1) tr").clone(true).appendTo("#tableData tfoot");
            $("#rowSearch").removeClass("d-none");
        }

    });
}

function regenTableServerSide() {
    table.destroy();
    $(".tableHeaderFilter").val(null).trigger("change");
    loadData();
}

// Thêm một sự kiện draw.dt vào table để chạy sau khi DataTables đã được vẽ
$('#tableData').on('draw.dt', function () {
    // Lặp qua từng dòng trong DataTable
    $('#tableData tbody tr').each(function () {
        var row = table.row(this).data(); // Lấy dữ liệu của dòng hiện tại
        var canvasDiv = $(this).find('.canvas-pdf'); // Tìm phần tử có class "canvas-pdf"

        // Kiểm tra nếu có class "canvas-pdf"
        if (canvasDiv.length > 0) {
            var pdfUrl = systemConfig.defaultStorageURL + row.data;
            var canvas = canvasDiv.find('canvas')[0]; // Tìm thẻ canvas bên trong phần tử "canvas-pdf"
            var context = canvas.getContext('2d'); // Lấy context 2D của canvas

            // Tải tệp PDF từ máy chủ
            fetch(pdfUrl)
                .then(function (response) {
                    return response.blob();
                })
                .then(function (pdfBlob) {
                    // Tạo một đối tượng URL cho tệp PDF
                    var pdfObjectUrl = URL.createObjectURL(pdfBlob);

                    // Tạo một đối tượng PDFJS
                    pdfjsLib.getDocument(pdfObjectUrl).promise.then(function (pdfDoc) {
                        // Lấy trang đầu tiên của tệp PDF
                        return pdfDoc.getPage(1);
                    }).then(function (page) {
                        // Đặt kích thước canvas phù hợp với kích thước trang PDF
                        var viewport = page.getViewport({ scale: 1 });
                        canvas.width = viewport.width;
                        canvas.height = viewport.height;

                        // Lấy hình ảnh từ trang PDF và vẽ nó lên canvas
                        var renderContext = {
                            canvasContext: context,
                            viewport: viewport
                        };
                        page.render(renderContext);
                    }).catch(function (error) {
                        console.error('Xảy ra lỗi khi tải và hiển thị tệp PDF:', error);
                    });
                });
        }
    });
});





