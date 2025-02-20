/**
 * Author: Nam Anh
 * CreatedTime : 23/08/2024
 */
$(document).ready(function () {
    loadData();
    loadDataJobCategorySelect();
    loadDataJobStatusSelect();
    loadDataJobTypeSelect();
    loadDataCampaignSelect();
    loadDataExperienceSelect();
    loadDataPrimaryJobPositionSelect();
    loadDataSecondaryJobPositionSelect();
    loadDataJobTagSelect();
    loadDataJobSkillSelect();

    $("#btnAddNew").on("click", function () {
        editItem(0);
    })

    $("#tableData").on("click", ".btn-admin-edit", function () {
        var id = parseInt($(this).attr("data-idItem"));
        editItem(id);
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

    $("#searchIsApproved").val("").trigger('change')
    $("#searchIsApproved").select2({
        placeholder: ""
    });
    $("#tableData tbody").on("click", ".checkIsApproved", function () {
        quickIsApproved($(this).is(":checked"), $(this).attr("data-id"));
    })
    $("#btnTableResetSearch").click(function () {
        $("#searchName").val("");
        $("#searchCampaign").val("");
        $("#searchCompany").val("");
        $("#searchJobCategory").val("").trigger('change');
        $("#searchJobType").val("").trigger('change');
        $("#searchJobStatus").val("").trigger('change');
        $("#searchIsApproved").val("").trigger('change');
        $("#fillter_startDate_value").val("");
        $("#fillter_endDate_value").val("");
        linked1.clear();
        linked2.clear();
        //tableSearch();
        reGenTable();
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

async function editItem(id) {
    $("#jobModal").find('.nav-tabs a:first').tab('show');
    autosize.destroy($('#description'));
    autosize($('#description'));
    autosize.destroy($('#benefit'));
    autosize($('#benefit'));
    autosize.destroy($('#requirement'));
    autosize($('#requirement'));

    updatingId = id;

    $("#loading").addClass("show");
    if (id > 0) {
        await getItemById(updatingId);
        //$("#isActiveVerify").removeClass('d-none')
        console.log(updatingObj);
        if (updatingObj != null && updatingObj != undefined) {
            $("#jobName").text(updatingObj.name);
            $("#compaignName").text(updatingObj.recruimentCampaignName);
            $("#benefit").val(updatingObj.benefit);

            const companylabel = document.getElementById("companyName");
            const company = updatingObj.company.map(wp => wp.name).join(", ");
            companylabel.textContent = company;

            // Thêm biểu tượng con mắt
            const eyeIcon = document.createElement("i");
            eyeIcon.classList.add("fas", "fa-eye", "ml-2", "eye-icon");
            companylabel.appendChild(eyeIcon);

            // Thêm sự kiện click cho biểu tượng con mắt
            eyeIcon.addEventListener("click", function () {
                const companyURL = systemConfig.webURL + '/thong-tin-cong-ty/' + updatingObj.company[0].id;
                if (companyURL) {
                    window.open(companyURL, "_blank");
                }
            });

            const applyEndDateLabel = document.getElementById("applyEndDate");
            const applyEndDate = updatingObj.applyEndDate;
            if (applyEndDate != null && applyEndDate != "") {
                const diffDate = new Date(applyEndDate) - new Date();
                const formattedApplyEndDate = moment(applyEndDate, "YYYY-MM-DDTHH:mm:ss").format("DD/MM/YYYY HH:mm:ss");

                if (diffDate > 0) {
                    applyEndDateLabel.innerHTML = `<span class="fa-regular fa-clock icon-class" aria-hidden="true"></span> Hạn nộp hồ sơ: ${formattedApplyEndDate}`;
                    applyEndDateLabel.classList.remove("text-chocolate");
                } else {
                    applyEndDateLabel.innerHTML = `<span class="fa-regular fa-clock icon-class" aria-hidden="true"></span> Đã hết hạn ứng tuyển`;
                    applyEndDateLabel.classList.add("text-chocolate");
                }

                applyEndDateLabel.classList.remove("d-none");
            } else {
                applyEndDateLabel.classList.add("d-none");
            }

            const jobWorkPlaceLabel = document.getElementById("jobWorkPlace");
            const jobWorkPlaceIcon = document.querySelector("#divJobWorkPlace .svg-icon"); // Thay đổi dòng này
            const workPlaces = updatingObj.listJobRequireWorkplace.map(wp => wp.cityName).join(", ");
            if (workPlaces) {
                jobWorkPlaceLabel.textContent = workPlaces;
                jobWorkPlaceIcon.style.display = "block"; // Ẩn icon
            } else {
                jobWorkPlaceLabel.textContent = "";
                jobWorkPlaceIcon.style.display = "none"; // Hiển thị icon
            }

            $("#salary").text(formatSalary(updatingObj.salaryFrom, updatingObj.salaryTo));
            $("#selectJobCategory").val(updatingObj.jobCategoryId).trigger('change');
            $("#selectExperience").val(updatingObj.experienceRangeId).trigger('change');
            $("#selectJobStatus").val(updatingObj.jobStatusId).trigger('change');
            $("#selectJobType").val(updatingObj.jobTypeId).trigger('change');
            $("#receiverEmail").val(updatingObj.receiverEmail);
            $("#candidateName").val(updatingObj.receiverName);
            $("#selectExperience").val(updatingObj.experienceRangeId);
            $("#description").val(updatingObj.description);
            $("#requirement").val(updatingObj.requirement);
            $("#receiverPhone").val(formatPhoneNumber(updatingObj.receiverPhone));
            $("#totalRecruitment").val(updatingObj.totalRecruitment);
            $("#primaryJobPosition").val(updatingObj.primaryJobPositionId).trigger('change');
            $("#jobSecondaryJobPosition").val(updatingObj.listJobSecondaryJobPositions).trigger('change');
            $("#jobTag").val(updatingObj.listTag).trigger('change');
            $("#requireJobSkill").val(updatingObj.listJobRequireJobSkill).trigger('change');

            if (updatingObj.description !== null) {
                const descriptionWithoutTags = stripHtmlTags(updatingObj.description);
                $("#description").val(descriptionWithoutTags);
            }
            if (updatingObj.benefit !== null) {
                const benefitWithoutTags = stripHtmlTags(updatingObj.benefit);
                $("#benefit").val(benefitWithoutTags);
            }
            if (updatingObj.requirement !== null) {
                const requirementWithoutTags = stripHtmlTags(updatingObj.requirement);
                $("#requirement").val(requirementWithoutTags);
            }

            $("#applyEndDate").val(updatingObj.applyEndDate != null && updatingObj.applyEndDate != "" ? moment(updatingObj.applyEndDate, "YYYY-MM-DDTHH:mm:ss").format("DD/MM/YYYY HH:mm:ss") : "");
            $("#createdTime").val(moment(updatingObj.createdTime, "YYYY-MM-DDTHH:mm:ss").format("DD/MM/YYYY HH:mm:ss"))
        }
        else {
            swal.fire(
                'Tin tuyển dụng',
                'Không thể xem chi tiết tin tuyển dụng, hãy kiểm tra lại thông tin.',
                'error'
            );
        }
    }
    $("#jobGender").select2();
    reGenTableCv();
    $("#jobModalTitle").text(id > 0 ? "Chi tiết tin tuyển dụng" : "Thêm mới tin tuyển dụng");
    $("#loading").removeClass("show");
    $("#jobModal").modal("show");
}

function stripHtmlTags(input) {
    return input.replace(/<[^>]*>/g, "").trim();
}

function formatSalary(salaryFrom, salaryTo) {
    if (salaryFrom && salaryTo) {
        return formatNumber(salaryFrom) + " - " + formatNumber(salaryTo);
    } else if (salaryFrom) {
        return "Từ " + formatNumber(salaryFrom);
    } else if (salaryTo) {
        return "Đến " + formatNumber(salaryTo);
    }
    return "Thỏa thuận";
}

if (n == null) {
    return "";
}

n = n.toString();

// format number 1000000 to 1,234,567
return n.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");

$("#jobModal").on('shown.bs.modal', function () {
    $(this).find('.nav-tabs a:first').tab('show');
    autosize.destroy($('#description'));
    autosize($('#description'));
    autosize.destroy($('#benefit'));
    autosize($('#benefit'));
    autosize.destroy($('#requirement'));
    autosize($('#requirement'));

})

$("#jobModal").on('hiden.bs.modal', function () {
    $(this).find('.nav-tabs a:first').tab('show');
    autosize.destroy($('#description'));
    autosize.destroy($('#benefit'));
    autosize.destroy($('#requirement'));
})

function reGenTableCv() {
    if (tableCv) {

        tableCv.destroy();
    }
    $("#tableDataCV tbody").html('');
    loadTableCv();
}
function loadTableCv() {
    $("#tableDataCV tbody").html("");
    if (updatingObj != null && updatingObj.listCvs != null && updatingObj.listCvs.length > 0) {
        updatingObj.listCvs.forEach(function (item, index) {
            var rowContent = "<tr>";
            rowContent += "<td class='column-index' style='text-align: center;'>" + (index + 1) + "</td>";
            rowContent += "<td>" + item.candidateName;
            if (item.isEmployerViewedDisplay) {
                var textColor = item.isEmployerViewedDisplay === "Đã đọc" ? "green" : "red";
                rowContent += "<br><small class='employer-viewed' style='color: " + textColor + "'>" + item.isEmployerViewedDisplay + "</small>";
            }

            rowContent += "</td>";
            //rowContent += "<td>" + item.candidateCvPdfUrl + "</td>";
            // Lấy phần sau của đường dẫn tệp PDF
            var pdfFileName = item.candidateCvPdfUrl.split('/').pop();
            // Tạo thẻ a để bấm vào đường dẫn và mở sang tab mới
            rowContent += `<td><a class='text-nowrap' href="${item.candidateCvPdfUrl}" target="_blank">${pdfFileName}</a></td>`;

            var badgeColor = customBagdeColor(item.candidateApplyJobStatusColor);
            var textColor = item.candidateApplyJobStatusColor;

            rowContent += "<td class='text-center status-column'>" +
                "<span class='status-badge' style='background-color: " + badgeColor + "; color: " + textColor + "'>" +
                (item.candidateApplyJobStatusName != null ? item.candidateApplyJobStatusName : "") +
                "</span></td>";

            //rowContent += "<td class='text-center'>" + item.isEmployerViewedDisplay + "</td>";
            rowContent += "<td style='text-align: center;'>" + moment(item.createdTime, "YYYY-MM-DD hh:mm:ss").format("DD/MM/YYYY hh:mm:ss") + "</td>";
            rowContent += "<td class='text-align: center;'>" +
                `<i class='fas fa-eye eye-icon' style='cursor: pointer;' data-candidate-id='${item.candidateId}'></i>` +
                "</td>";
            rowContent += "</tr>";
            $(rowContent).appendTo($("#tableDataCV tbody"));
        })
    }
    initTableCv()
}

// Thực hiện hành động khi bấm vào biểu tượng con mắt
$("#tableDataCV").on("click", ".eye-icon", function () {
    const candidateId = $(this).data("candidate-id");
    // Chuyển hướng sang trang thông tin ứng viên với candidateId
    window.open(`/thong-tin-ung-vien/${candidateId}`, "_blank");
});


function customBagdeColor(color) {
    //if (!color) {
    //    return "#FFFFFF"; // default color, you can change this.
    //}
    var percent = 90;
    var fontColor = "";
    var backColor = color;
    // strip the leading # if it's there
    color = color.replace(/^\s*#|\s*$/g, '');

    // convert 3 char codes --> 6, e.g. `E0F` --> `EE00FF`
    if (color.length == 3) {
        color = color.replace(/(.)/g, '$1$1');
    }

    var r = parseInt(color.substr(0, 2), 16),
        g = parseInt(color.substr(2, 2), 16),
        b = parseInt(color.substr(4, 2), 16);

    return '#' +
        ((0 | (1 << 8) + r + (256 - r) * percent / 100).toString(16)).substr(1) +
        ((0 | (1 << 8) + g + (256 - g) * percent / 100).toString(16)).substr(1) +
        ((0 | (1 << 8) + b + (256 - b) * percent / 100).toString(16)).substr(1);
}

function initTableCv() {
    tableCv = $('#tableDataCV').DataTable({
        language: systemConfig.languageDataTable,
        searching: {
            regex: true
        },
        autoWidth: false,
        columnDefs: [
            { targets: "no-sort", orderable: false },
            { targets: [0], orderable: false },
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
            [4, 'asc']
        ],

        aLengthMenu: [
            [10, 25, 50, 100],
            [10, 25, 50, 100]
        ],
        drawCallback: function () {
            $('#tableDataCV tfoot').html("");
            $("#tableDataCV thead:nth-child(1) tr").clone(true).appendTo("#tableDataCV tfoot");
        }
    });

    tableCv.on('order.dt search.dt', function () {
        tableCv.column(0, {
            search: 'applied',
            order: 'applied'
        }).nodes().each(function (cell, i) {
            cell.innerHTML = i + 1;
        });
    }).draw();
}

async function getItemById(id) {
    await $.ajax({
        url: systemConfig.defaultAPIURL + "api/job/detail-admin/" + id,
        type: "GET",
        success: function (responseData) {
            updatingObj = responseData.resources;
        },
        error: function (e) {
            swal.fire(
                'Tin tuyển dụng',
                'Đã có lỗi xảy ra, hãy kiểm tra lại thông tin.',
                'error'
            );
        },
    })
}

function loadData() {
    table = $("#tableData").DataTable({
        language: systemConfig.languageDataTable,
        processing: true,
        serverSide: true,
        paging: true,
        searching: { regex: true },
        ajax: {
            url: systemConfig.defaultAPIURL + "api/job/list-recruitment-news-aggregates",
            type: "POST",
            contentType: "application/json",
            dataType: "json",
            data: function (d) {
                return JSON.stringify(d);
            },
        },
        columns: [
            {
                data: "id",
                render: function (data, type, row, meta) {
                    return meta.row + 1;
                }
            },
            {
                data: "name",
                render: function (data, type, row, meta) {
                    return data;
                }
            },
            {
                data: "recruimentCampaignName",
                render: function (data, type, row, meta) {
                    return data;
                }
            },
            {
                data: "companyName",
                render: function (data, type, row, meta) {
                    return data;
                }
            },
            {
                data: "jobCategoryName",
                render: function (data, type, row, meta) {
                    return data;
                }
            },
            {
                data: "jobTypeName",
                render: function (data, type, row, meta) {
                    return data;
                }
            },
            {
                data: "jobStatusName",
                render: function (data, type, row, meta) {
                    return data;
                }
            },
            {
                data: "createdTime",
                render: function (data, type, row, meta) {
                    return `<div class='text-center'>` + moment(data).format("DD/MM/YYYY HH:mm:ss") + `</div>`;
                }
            },
            {
                data: "isApproved",
                render: function (data, type, row, meta) {
                    return `<span id='row` + row.id + `-column-activated'><div class="form-check form-switch form-check-custom form-check-solid justify-content-center column-approve"><input class="form-check-input checkIsApproved" data-id="${row.id}" type="checkbox" value="" ${data ? 'checked=""' : ''}></div></span>`

                        ;
                }
            },
            {
                data: "id",
                render: function (data, type, row, meta) {
                    return `<div class='d-flex justify-content-center'>`
                        + `<button class="btn-admin-edit btn btn-icon" title='Cập nhật' data-idItem='` + data + `'><span class='svg-icon-primary svg-icon  svg-icon-1'> ` + systemConfig.editIcon + ` </span></button></div>`;

                }
            }
        ],
        columnDefs: [

            { targets: [0, -1], orderable: false },

        ],
        'order': [
            [7, 'asc']
        ],
        drawCallback: function () {
            $('#tableData tfoot').html("");
            $("#tableData thead:nth-child(1) tr").clone(true).appendTo("#tableData tfoot");
            $("#rowSearch").removeClass("d-none");
        }

    });
    table.on('draw', function (e) {
        dataExport = table.ajax.json().allData;
    });
}

function tableSearch() {
    table.column(1).search($("#searchName").val());
    table.column(2).search($("#searchCampaign").val());
    table.column(3).search($("#searchCompany").val());
    table.column(4).search($("#searchJobCategory").val().toString());
    table.column(5).search($("#searchJobType").val().toString());
    table.column(6).search($("#searchJobStatus").val().toString());

    if ($("#fillter_startDate_value").val().length > 0 || $("#fillter_endDate_value").val().length > 0) {
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
        table.column(7).search(searchDateArrs.toString());
    }
    else {
        table.column(7).search("")
    }
    table.column(8).search($("#searchIsApproved").val());

    table.draw();
}
function loadDataJobCategorySelect() {
    $.ajax({
        url: systemConfig.defaultAPIURL + "api/job/list-job-category-selected",
        type: "GET",
        contentType: "application/json",
        success: function (response) {
            //dataSource = response.resources;
            response.resources.forEach(function (item, index) {
                //console.log(item);
                $('#searchJobCategory').append(new Option(item.text, item.value, false, false)).trigger('change');
                $('#selectJobCategory').append(new Option(item.text, item.value, false, false)).trigger('change');
            })
            $("#searchJobCategory").val("").trigger('change')
            $("#selectJobCategory").select2();
            $("#searchJobCategory").select2({
                allowClear: true,
                placeholder: ""
            });

        },
        error: function (e) {
        }
    });
}

function loadDataJobTypeSelect() {
    $.ajax({
        url: systemConfig.defaultAPIURL + "api/job/list-job-type-selected",
        type: "GET",
        contentType: "application/json",
        success: function (response) {
            //dataSource = response.resources;
            response.resources.forEach(function (item, index) {
                //console.log(item);
                $('#searchJobType').append(new Option(item.text, item.value, false, false)).trigger('change');
                $('#selectJobType').append(new Option(item.text, item.value, false, false)).trigger('change');
            })
            $("#searchJobType").val("").trigger('change')
            $("#selectJobType").select2();
            $("#searchJobType").select2({
                allowClear: true,
                placeholder: ""
            });

        },
        error: function (e) {
        }
    });
}

function loadDataJobStatusSelect() {
    $.ajax({
        url: systemConfig.defaultAPIURL + "api/job/list-job-status-selected",
        type: "GET",
        contentType: "application/json",
        success: function (response) {
            //dataSource = response.resources;
            response.resources.forEach(function (item, index) {
                //console.log(item);
                $('#searchJobStatus').append(new Option(item.text, item.value, false, false)).trigger('change');
                $('#selectJobStatus').append(new Option(item.text, item.value, false, false)).trigger('change');
            })
            $("#searchJobStatus").val("").trigger('change')
            $("#selectJobStatus").select2();
            $("#searchJobStatus").select2({
                allowClear: true,
                placeholder: ""
            });

        },
        error: function (e) {
        }
    });
}

function loadDataCampaignSelect() {
    $.ajax({
        url: systemConfig.defaultAPIURL + "api/job/list-campaign-selected",
        type: "GET",
        contentType: "application/json",
        success: function (response) {
            //dataSource = response.resources;
            response.resources.forEach(function (item, index) {
                //console.log(item);
                $('#selectCampaign').append(new Option(item.text, item.value, false, false)).trigger('change');
            })
            $("#selectCampaign").val("").trigger('change')
            $("#selectCampaign").select2();
            //$("#selectCampaign").select2({
            //    allowClear: true,
            //    placeholder: ""
            //});

        },
        error: function (e) {
        }
    });
}

function loadDataPrimaryJobPositionSelect() {
    $.ajax({
        url: systemConfig.defaultAPIURL + "api/job/primary-positions-select",
        type: "GET",
        contentType: "application/json",
        success: function (response) {
            //dataSource = response.resources;
            response.resources.forEach(function (position) {
                //console.log(item);
                $('#primaryJobPosition').append(new Option(position.name, position.id, false, false)).trigger('change');
            })
            $("#primaryJobPosition").val("").trigger('change')
            $("#primaryJobPosition").select2();
        },
        error: function (e) {
        }
    });
}

function loadDataSecondaryJobPositionSelect() {
    $.ajax({
        url: systemConfig.defaultAPIURL + "api/job/secondary-positions-select",
        type: "GET",
        contentType: "application/json",
        success: function (response) {
            //dataSource = response.resources;
            response.resources.forEach(function (position) {
                //console.log(item);
                $('#jobSecondaryJobPosition').append(new Option(position.name, position.id, false, false)).trigger('change');
            })
            $("#jobSecondaryJobPosition").val("").trigger('change')
            $("#jobSecondaryJobPosition").select2();
        },
        error: function (e) {
        }
    });
}

function loadDataJobTagSelect() {
    $.ajax({
        url: systemConfig.defaultAPIURL + "api/job/job-tag-select",
        type: "GET",
        contentType: "application/json",
        success: function (response) {
            //dataSource = response.resources;
            response.resources.forEach(function (tag) {
                //console.log(item);
                $('#jobTag').append(new Option(tag.name, tag.id, false, false)).trigger('change');
            })
            $("#jobTag").val("").trigger('change')
            $("#jobTag").select2();
        },
        error: function (e) {
        }
    });
}

function loadDataJobSkillSelect() {
    $.ajax({
        url: systemConfig.defaultAPIURL + "api/job/job-skill-select",
        type: "GET",
        contentType: "application/json",
        success: function (response) {
            //dataSource = response.resources;
            response.resources.forEach(function (skill) {
                //console.log(item);
                $('#requireJobSkill').append(new Option(skill.name, skill.id, false, false)).trigger('change');
            })
            $("#requireJobSkill").val("").trigger('change')
            $("#requireJobSkill").select2();
        },
        error: function (e) {
        }
    });
}

function loadDataExperienceSelect() {
    $.ajax({
        url: systemConfig.defaultAPIURL + "api/job/list-job-experience-selected",
        type: "GET",
        contentType: "application/json",
        success: function (response) {
            //dataSource = response.resources;
            response.resources.forEach(function (item, index) {
                //console.log(item);
                $('#selectExperience').append(new Option(item.text, item.value, false, false)).trigger('change');
            })
            $("#selectExperience").val("").trigger('change')
            $("#selectExperience").select2();
            //$("#selectCampaign").select2({
            //    allowClear: true,
            //    placeholder: ""
            //});

        },
        error: function (e) {
        }
    });
}

async function quickIsApproved(isApproved, id) {
    var titleName = "Quản lý tin tuyển dụng";
    var actionName = isApproved ? "duyệt" : "bỏ duyệt";
    await getItemById(id);
    var obj = { "id": id, "IsApproved": isApproved }
    Swal.fire({
        title: titleName,
        html: "Bạn có chắc chắn muốn " + actionName + " tin tuyển dụng <strong>" + updatingObj.name + "</strong> không?",
        icon: 'info',
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#443',
        cancelButtonText: 'Hủy',
        confirmButtonText: 'Lưu',
        showCancelButton: true
    }).then((result) => {
        if (result.isConfirmed) {
            $("#loading").addClass('show');

            //CALL AJAX TO UPDATE
            $.ajax({
                url: systemConfig.defaultAPIURL + "api/job/quick-isapproved?id=" + id,
                type: "PUT",
                contentType: "application/json",
                success: function (response) {
                    $("#loading").removeClass('show');
                    if (response.isSucceeded) {
                        Swal.fire(
                            'Duyệt tin tuyển dụng',
                            'Tin tuyển dụng <b>' + updatingObj.name + ' </b> đã được ' + actionName + ' thành công.',
                            'success'
                        );
                        reGenTable();
                    }
                    else {
                        if (response.status == 400) {
                            if (response.errors != null) {
                                var contentError = "<ul>";
                                response.errors.forEach(function (item, index) {
                                    contentError += "<li class='text-start pb-2'>" + item + "</li>";
                                })
                                contentError += "</ul>";
                                Swal.fire(
                                    'Tin tuyển dụng <p class="swal__admin__subtitle"> Duyệt không thành công </p>',
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
                    //console.log(e)
                    $("#loading").removeClass('show');
                    if (e.status === 401) {
                        Swal.fire(
                            'Tin tuyển dụng',
                            'Phiên đăng nhập của bạn đã hết hạn, vui lòng đăng nhập để sử dụng tính năng này.',
                            'error'
                        ).then(function () {
                            window.location.href = "/home/login";
                        });
                    }
                    else if (e.status == 403) {
                        Swal.fire(
                            'Tin tuyển dụng',
                            'Bạn không có quyền sử dụng tính năng này.',
                            'error'
                        );
                    }
                    else {
                        Swal.fire(
                            'Tin tuyển dụng',
                            'Kích hoạt nhanh nhà tuyển dụng không thành công, <br> vui lòng thử lại sau!',
                            'error'
                        );
                    }


                }
            });
        }
        else {
            $(".checkIsApproved[data-id=" + id + "]").prop("checked", !isApproved);
        }
    })
}

$("#form-job").on('submit', function (e) {
    e.preventDefault();
})
