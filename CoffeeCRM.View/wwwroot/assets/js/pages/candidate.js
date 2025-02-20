/**
 * Author: ThanhND
 * CreatedTime : 01/08/2024
 */
$(document).ready(function () {
    loadData();
    loadDataCandidateLevel();
    loadDataAccountStatus();
    loadDataExperienceRange();
    loadDataSalaryRange();
    loadDataJobCategory();
    loadDataJobPosition();
    loadDataJobSkill();
    loadDataWorkPlace();
    loadDataSkillLevel();
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
        validateCouponType();
    })

    $("#form-submit-coupon-type").on("submit", function (e) {
        e.preventDefault();
        validateCouponType();
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

    $("#searchActivated").val("").trigger('change')
    $("#searchActivated").select2({
        placeholder: ""
    });
    $("#tableData tbody").on("click", ".checkIsApproved", function () {
        quickActivated($(this).is(":checked"), $(this).attr("data-id"));
    })
    $("#btnTableResetSearch").click(function () {
        $("#searchFullName").val("");
        $("#searchUserName").val("");
        $("#searchLevel").val("").trigger('change');
        $("#searchStatus").val("").trigger('change');
        $("#searchActivated").val("").trigger('change');
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

    $(".advanced-search-form").on("change", function () {
        if ($(this).val().length != 0) {
            $(this).attr('is-count', true)
        }
        else {
            $(this).attr('is-count', false)

        }
        let index = $(".advanced-search-form[is-count='true']").length;
        if (index > 0) {
            $("#advanced-search-text").text(`Lọc nâng cao (${index})`)
        }
        else {
            $("#advanced-search-text").text(`Lọc nâng cao`)

        }
        reGenTable();
    })


    $("#advanced-candidate-skill").on("keypress keyup keydown", function () {
        if ($(this).val().length != 0) {
            $("#advanced-skill-level").parent().removeClass('d-none')
        }
        else {
            $("#advanced-skill-level").parent().addClass('d-none')
            $("#advanced-skill-level").val('').trigger('change');
        }
    })

})
async function editItem(id) {
    $("#candidateModal").find('.nav-tabs a:first').tab('show');

    autosize.destroy($('#candidateObjective'));
    autosize.destroy($('#candidateInterests'));
    autosize.destroy($('#candidateInfoReferences'));
    autosize($('#candidateObjective'));
    autosize($('#candidateInterests'));
    autosize($('#candidateInfoReferences'));
    updatingId = id;
    $("#divCandidateJobPosition").removeClass('d-none')
    $("#divCandidateDoB").removeClass('d-none')
    $("#divCandidateAddress").removeClass('d-none')
    $("#divCandidatePhone").removeClass("d-none")
    $("#divCandidateEmail").removeClass("d-none")

    $("#loading").addClass("show");
    if (id > 0) {
        await getItemById(updatingId);
        $("#isActiveVerify").removeClass('d-none')
        if (updatingObj != null && updatingObj != undefined) {
            $("#CandidateName").text(updatingObj.fullName)
            //hiển thị nghề nghiệp
            if (updatingObj.jobPosition != null) {
                $("#CandidateJobPosition").text(updatingObj.jobPosition);
            }
            else {
                $("#divCandidateJobPosition").addClass("d-none")
            }
            //hiển thị địa chỉ
            if (updatingObj.addressDetail != null) {
                $("#CandidateAddress").text(updatingObj.addressDetail);
            }
            else {
                $("#divCandidateAddress").addClass("d-none")
            }
            //hiển thị ngày sinh
            if (updatingObj.doB != null) {
                $("#CandidateDoB").text(moment(updatingObj.doB, "YYYY-MM-DDTHH:mm:ss").format("DD/MM/YYYY"));
            }
            else {
                $("#divCandidateDoB").addClass("d-none")
            }
            //hiển thị sđt
            if (updatingObj.phone != null && updatingObj.phone != "") {
                $("#CandidatePhone").text(formatPhoneNumber(updatingObj.phone));
            }
            else {
                $("#divCandidatePhone").addClass("d-none")
            }
            //hiển thị email
            if (updatingObj.email != null && updatingObj.email != "") {
                $("#CandidateEmail").text(updatingObj.email);
            }
            else {
                $("#divCandidateEmail").addClass("d-none")
            }

            //hiển thị quốc tịch
            if (updatingObj.nationality != null && updatingObj.nationality != "") {
                $("#CandidateNationality").text(updatingObj.nationality);
            }
            else {
                $("#divCandidateNationality").addClass("d-none")
            }
            //mật khẩu
            $("#accountPassword").val('');
            $("#accountConfirmPassword").val('');
            $("#spanNewPass").addClass('d-none');
            $("#spanConfirmNewPass").addClass('d-none');
            //thông tin xung quanh
            //$("#CandidateEmail").text(updatingObj.email)
            //$("#CandidatePhone").text(formatPhoneNumber(updatingObj.phone));
            $("#candidatePhoto").prop("src", updatingObj.photo != null ? systemConfig.defaultStorageURL + updatingObj.photo : systemConfig.defaultStorageURL +  "/assets/media/images/avatar1.jpg")
            $("#isActiveVerify").addClass(updatingObj.isActivated ? " " : "d-none");
            $("#selectCandidateStatus").val(updatingObj.candidateStatusId).trigger('change');
            $("#selectCandidateLevel").val(updatingObj.candidateLevelId).trigger('change');
            $("#candidateGender").val(updatingObj.gender).trigger('change');
            $("#candidateMaritalStatus").val(updatingObj.maritalStatus);
            //$("#candidateLocked").prop("checked", updatingObj.lockEnabled);
            //$("#candidateDoB").val(updatingObj.doB != null ? moment(updatingObj.doB, "YYYY-MM-DDTHH:mm:ss").format("DD/MM/YYYY") : "");
            $("#selectSuggestionExperienceRangeId").val(updatingObj.suggestionExperienceRangeId).trigger('change');
            $("#selectSuggestionSalaryRangeId").val(updatingObj.suggestionSalaryRangeId).trigger('change');
            $("#createdTime").val(moment(updatingObj.createdTime, "YYYY-MM-DDTHH:mm:ss").format("DD/MM/YYYY HH:mm:ss"))
            $("#candidateInterests").val(updatingObj.interests);
            $("#candidateObjective").val(updatingObj.objective);
            $("#candidateInfoReferences").val(updatingObj.references);
            //kiểm tra checked
            $("#IsSubcribeEmailImportantSystemUpdate").prop("checked", updatingObj.isSubcribeEmailImportantSystemUpdate);
            $("#IsSubcribeEmailEmployerViewCV").prop("checked", updatingObj.isSubcribeEmailEmployerViewCV);
            $("#IsSubcribeEmailNewFeatureUpdate").prop("checked", updatingObj.isSubcribeEmailNewFeatureUpdate);
            $("#IsSubcribeEmailOtherSystemNotification").prop("checked", updatingObj.isSubcribeEmailOtherSystemNotification);
            $("#IsSubcribeEmailJobSuggestion").prop("checked", updatingObj.isSubcribeEmailJobSuggestion);
            $("#IsSubcribeEmailEmployerInviteJob").prop("checked", updatingObj.isSubcribeEmailEmployerInviteJob);
            $("#IsSubcribeEmailServiceIntro").prop("checked", updatingObj.isSubcribeEmailServiceIntro);
            $("#IsSubcribeEmailProgramEventIntro").prop("checked", updatingObj.isSubcribeEmailProgramEventIntro);
            $("#IsSubcribeEmailGiftCoupon").prop("checked", updatingObj.isSubcribeEmailGiftCoupon);
            $("#IsCheckOnJobWatting").prop("checked", updatingObj.isCheckOnJobWatting);
            $("#IsCheckJobOffers").prop("checked", updatingObj.isCheckJobOffers);
            $("#IsCheckViewCV").prop("checked", updatingObj.isCheckViewCV);
            $("#IsCheckTopCVReview").prop("checked", updatingObj.isCheckTopCVReview);

            //mong muốn công việc
            //ngành nghề
            if (updatingObj.listCandidateSuggestionJobCategory.length > 0) {
                var jobCategoryId = [];
                updatingObj.listCandidateSuggestionJobCategory.forEach(function (item) {
                    jobCategoryId.push(item.jobCategoryId);
                })
                $("#selectSuggestionJobCategory").val(jobCategoryId).trigger('change');
            }
            else {
                $("#selectSuggestionJobCategory").val("").trigger('change');

            }

            //vị trí
            if (updatingObj.listCandidateSuggestionJobPosition.length > 0) {
                var jobPositionId = [];
                updatingObj.listCandidateSuggestionJobPosition.forEach(function (item) {
                    jobPositionId.push(item.jobPositionId);
                })
                $("#selectSuggestionJobPosition").val(jobPositionId).trigger('change');
            }
            else {
                $("#selectSuggestionJobPosition").val("").trigger('change');

            }

            //kỹ năng
            if (updatingObj.listCandidateSuggestionJobSkill.length > 0) {
                var jobSkillId = [];
                updatingObj.listCandidateSuggestionJobSkill.forEach(function (item) {
                    jobSkillId.push(item.jobSkillId);
                })
                $("#selectSuggestionJobSkill").val(jobSkillId).trigger('change');
            }
            else {
                $("#selectSuggestionJobSkill").val("").trigger('change');

            }

            //địa điểm
            if (updatingObj.candidateSuggestionWorkPlaces.length > 0) {
                var workplaceId = [];
                updatingObj.candidateSuggestionWorkPlaces.forEach(function (item) {
                    workplaceId.push(item.workPlaceId);
                })
                $("#selectSuggestionWorkPlace").val(workplaceId).trigger('change');
            }
            else {
                $("#selectSuggestionWorkPlace").val("").trigger('change');
            }

            $("#candidateGender").select2();
            reGenTableJobSkill();
            reGenTableWorkExperience();
            reGenTableEducation();
            reGenTableCertificate();
            $("#candidateModalTitle").text(id > 0 ? "Chi tiết ứng viên" : "Thêm mới ứng viên");
            $("#loading").removeClass("show");
            $("#candidateModal").modal("show");
        }
        else {
            $("#loading").removeClass("show");
            swal.fire(
                'Ứng viên',
                'Không thể xem chi tiết ứng viên, hãy kiểm tra lại thông tin.',
                'error'
            );
        }
    }
   
}
$("#candidateModal").on('shown.bs.modal', function () {
    $(this).find('.nav-tabs a:first').tab('show');
    autosize.destroy($('#candidateInterests'));
    autosize.destroy($('#candidateObjective'));
    autosize.destroy($('#candidateInfo'));

    autosize($('#candidateInterests'));
    autosize($('#candidateObjective'));
    autosize($('#candidateInfo'));

})
$("#candidateModal").on('hiden.bs.modal', function () {
    $(this).find('.nav-tabs a:first').tab('show');
    autosize.destroy($('#candidateInfo'));
    autosize.destroy($('#candidateInterests'));
    autosize.destroy($('#candidateObjective'));

})
async function getItemById(id) {
    //return (await $.ajax({
    //    url: systemConfig.defaultAPIURL + "api/candidate/detail/" + id,
    //    type: "GET",
    //    success: function (responseData) {
    //    },
    //    error: function (e) {
    //    },
    //})).resources;

    await $.ajax({
        url: systemConfig.defaultAPIURL + "api/candidate/detail/" + id,
        type: "GET",
        success: function (responseData) {
            updatingObj = responseData.resources;
        },
        error: function (e) {
            $("#loading").removeClass("show");

            swal.fire(
                'Ứng viên',
                'Đã có lỗi xảy ra, hãy kiểm tra lại thông tin.',
                'error'
            );
        },
    })
}
function reGenTableJobSkill() {

    if (tableJobSkill != null) { 
        tableJobSkill.destroy();
    }
    $("#tableJobSkill tbody").html('');
    loadTableJobSkill();
}
function loadTableJobSkill() {
    $("#tableJobSkill tbody").html("");
    if (updatingObj!=null && updatingObj.listCandidateSkill.length > 0) {
        updatingObj.listCandidateSkill.forEach(function (item, index) {
            var rowContent = "<tr>";
            rowContent += "<td class='column-index' style='text-align: center;'>" + (index + 1) + "</td>";
            rowContent += "<td>" + item.name + "</td>";
            rowContent += "<td>" + (item.description != null ? item.description : "") + "</td>";

            rowContent += "</tr>";
            $(rowContent).appendTo($("#tableJobSkill tbody"));
        })
    }
    
    initTableJobSkill();
}
function initTableJobSkill() {
    tableJobSkill = $('#tableJobSkill').DataTable({
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
            [1, 'asc']
        ],

        aLengthMenu: [
            [10, 25, 50, 100],
            [10, 25, 50, 100]
        ],
        drawCallback: function () {
            $('#tableJobSkill tfoot').html("");
            $("#tableJobSkill thead:nth-child(1) tr").clone(true).appendTo("#tableJobSkill tfoot");
        }
    });

    tableJobSkill.on('order.dt search.dt', function () {
        tableJobSkill.column(0, {
            search: 'applied',
            order: 'applied'
        }).nodes().each(function (cell, i) {
            cell.innerHTML = i + 1;
        });
    }).draw();
}
function reGenTableWorkExperience() {
    if (tableWorkExperience != null) { 
        tableWorkExperience.destroy();
    }
    $("#tableWorkExperience tbody").html('');
    loadTableWorkExperience();
    initTableWorkExperience();

}
function loadTableWorkExperience() {
    $("#tableWorkExperience tbody").html("");
    if (updatingObj != null &&updatingObj.listCandidateWorkExperiences.length > 0) {
        updatingObj.listCandidateWorkExperiences.forEach(function (item, index) {
            var rowContent = "<tr>";
            rowContent += "<td style='text-align: center;'>" + (index + 1) + "</td>";
            rowContent += "<td>" + item.jobTitle + "</td>";
            rowContent += "<td>" + item.company + "</td>";
            rowContent += "<td class='column-dateTime'>" + item.timePeriod + "</td>";

            rowContent += "</tr>";
            $(rowContent).appendTo($("#tableWorkExperience tbody"));
        })
    }

}
function initTableWorkExperience() {
    tableWorkExperience = $('#tableWorkExperience').DataTable({
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
            [1, 'asc']
        ],

        aLengthMenu: [
            [10, 25, 50, 100],
            [10, 25, 50, 100]
        ],
        drawCallback: function () {
            $('#tableWorkExperience tfoot').html("");
            $("#tableWorkExperience thead:nth-child(1) tr").clone(true).appendTo("#tableWorkExperience tfoot");
        }
    });

    tableWorkExperience.on('order.dt search.dt', function () {
        tableWorkExperience.column(0, {
            search: 'applied',
            order: 'applied'
        }).nodes().each(function (cell, i) {
            cell.innerHTML = i + 1;
        });
    }).draw();
}
function reGenTableEducation() {
    if (tableEducation) { 

    tableEducation.destroy();
    }
    $("#tableEducation tbody").html('');
    loadTableEducation();
}
function loadTableEducation() {
    $("#tableEducation tbody").html("");
    if (updatingObj != null &&updatingObj.listCandidateEducation.length > 0) {
        updatingObj.listCandidateEducation.forEach(function (item, index) {
            var rowContent = "<tr>";
            rowContent += "<td class='column-index' style='text-align: center;'>" + (index + 1) + "</td>";
            rowContent += "<td>" + item.title + "</td>";
            rowContent += "<td>" + item.school + "</td>";
            rowContent += "<td class='column-dateTime'>" + item.timePeriod + "</td>";
            rowContent += "<td>" + (item.description != null ? item.description : "") + "</td>";

            rowContent += "</tr>";
            $(rowContent).appendTo($("#tableEducation tbody"));
        })
    }
    
    initTableEducation()
}
function initTableEducation() {
    tableEducation = $('#tableEducation').DataTable({
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
            [1, 'asc']
        ],

        aLengthMenu: [
            [10, 25, 50, 100],
            [10, 25, 50, 100]
        ],
        drawCallback: function () {
            $('#tableEducation tfoot').html("");
            $("#tableEducation thead:nth-child(1) tr").clone(true).appendTo("#tableEducation tfoot");
        }
    });

    tableEducation.on('order.dt search.dt', function () {
        tableEducation.column(0, {
            search: 'applied',
            order: 'applied'
        }).nodes().each(function (cell, i) {
            cell.innerHTML = i + 1;
        });
    }).draw();
}
function reGenTableCertificate() {
    if (tableCertificate) {

        tableCertificate.destroy();
    }
    $("#tableCertificate tbody").html('');
    loadTableCertificate();
}
function loadTableCertificate() {
    $("#tableCertificate tbody").html("");
    if (updatingObj != null && updatingObj.listCandidateCertificates.length > 0) {
        updatingObj.listCandidateCertificates.forEach(function (item, index) {
            var rowContent = "<tr>";
            rowContent += "<td class='column-index' style='text-align: center;'>" + (index + 1) + "</td>";
            rowContent += "<td>" + item.name + "</td>";
            rowContent += "<td>" + item.issueBy + "</td>";
            rowContent += "<td class='column-dateTime'>" + item.timePeriod + "</td>";
            rowContent += "<td>" + (item.description != null ? item.description : "") + "</td>";

            rowContent += "</tr>";
            $(rowContent).appendTo($("#tableCertificate tbody"));
        })
    }

    initTableCertificate()
}
function initTableCertificate() {
    tableCertificate = $('#tableCertificate').DataTable({
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
            [1, 'asc']
        ],

        aLengthMenu: [
            [10, 25, 50, 100],
            [10, 25, 50, 100]
        ],
        drawCallback: function () {
            $('#tableCertificate tfoot').html("");
            $("#tableCertificate thead:nth-child(1) tr").clone(true).appendTo("#tableCertificate tfoot");
        }
    });

    tableCertificate.on('order.dt search.dt', function () {
        tableCertificate.column(0, {
            search: 'applied',
            order: 'applied'
        }).nodes().each(function (cell, i) {
            cell.innerHTML = i + 1;
        });
    }).draw();
}
function loadData() {
    table = $("#tableData").DataTable({
        language: systemConfig.languageDataTable,
        processing: true,
        serverSide: true,
        paging: true,
        searching: { regex: true },
        ajax: {
            url: systemConfig.defaultAPIURL + "api/candidate/list-candidate-aggregates",
            type: "POST",
            contentType: "application/json",
            dataType: "json",
            data: function (d) {
                d.searchCategory = $("#advanced-suggest-job-category").val().toString();
                d.searchExperience = $("#advanced-experience-range").val().toString();
                d.searchPosition = $("#advanced-position").val().toString();
                d.searchSuggestSkill = $("#advanced-skill").val().toString();
                d.searchCity = $("#advanced-job-city").val().toString();
                d.searchSalaryRange = $("#advanced-salary-range").val().toString();
                d.searchEducation = $("#advanced-education").val().toString();
                d.searchCertificate = $("#advanced-certificate").val().toString();
                d.searchCandidateSkill = $("#advanced-candidate-skill").val().toString();
                d.searchCandidateSkillLevel = $("#advanced-skill-level").val().toString();
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
                data: "fullName",
                render: function (data, type, row, meta) {
                    return data;
                }
            },
            {
                data: "username",
                render: function (data, type, row, meta) {
                    return data;
                }
            },
            //{
            //    data: "candidateLevelName",
            //    render: function (data, type, row, meta) {
            //        return data;
            //    }
            //},
            {
                data: "candidateStatusName",
                render: function (data, type, row, meta) {
                    return `<span id='row` + row.id + `-column-name' class='badge py-3 px-4 fs-7' style='color:` + row.candidateStatusColor + `;background-color:` + customBagdeColor(row.candidateStatusColor) + `'>` + data + `</span>`;
                }
            },


            {
                data: "createdTime",
                render: function (data, type, row, meta) {
                    return `<div class='text-center'>` + moment(data).format("DD/MM/YYYY HH:mm:ss") + `</div>`;
                }
            },
            {
                data: "isActivated",
                render: function (data, type, row, meta) {
                    return `<span id='row` + row.id + `-column-activated'><div class="form-check form-switch form-check-custom form-check-solid justify-content-center column-approve"><input class="form-check-input checkIsApproved" data-id="${row.id}" type="checkbox" value="" ${data ? 'checked=""' : ''}></div></span>`

                        ;
                }
            },
            {
                data: "id",
                render: function (data, type, row, meta) {
                    return `<div class='d-flex justify-content-center'>`
                        + `<button class="btn-admin-edit btn btn-icon" title='Cập nhật' data-idItem='` + data + `'><span class='svg-icon-primary svg-icon  svg-icon-1'> ` + systemConfig.editIcon + ` </span></button>`;
                        /*+ `<button class="btn-admin-delete btn btn-icon"  title='Xóa' data-idItem='` + data + `' ><span class='svg-icon-danger svg-icon  svg-icon-1'>` + systemConfig.deleteIcon + `</span></button></div>`;*/
                }
            }
        ],
        columnDefs: [

            { targets: [0, -1], orderable: false },

        ],
        'order': [
            [4, 'desc']
        ],
        drawCallback: function () {
            $('#tableData tfoot').html("");
            $("#tableData thead:nth-child(1) tr").clone(true).appendTo("#tableData tfoot");
            //$("#rowSearch").append(`<tr>
            //                        <th colspan="8" style='height: 39px; min-height: 39px; max-height: 39px'>
            //                            <div class="accordion accordion-icon-collapse" id="kt_accordion_3">
            //                                <!--begin::Item-->
            //                                <div class="">
            //                                    <!--begin::Header-->
            //                                    <div class="accordion-header py-3 d-flex align-items-center" data-bs-toggle="collapse" data-bs-target="#kt_accordion_3_item_1">
            //                                        <h3 class="fs-4 fw-semibold mb-0 ms-4 text-success">Tìm kiếm nâng cao</h3>
            //                                        <span class="svg-icon svg-icon-muted">
            //                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            //                                                <path d="M11.4343 12.7344L7.25 8.55005C6.83579 8.13583 6.16421 8.13584 5.75 8.55005C5.33579 8.96426 5.33579 9.63583 5.75 10.05L11.2929 15.5929C11.6834 15.9835 12.3166 15.9835 12.7071 15.5929L18.25 10.05C18.6642 9.63584 18.6642 8.96426 18.25 8.55005C17.8358 8.13584 17.1642 8.13584 16.75 8.55005L12.5657 12.7344C12.2533 13.0468 11.7467 13.0468 11.4343 12.7344Z" fill="currentColor" />
            //                                            </svg>
            //                                        </span>
            //                                    </div>
            //                                    <!--end::Header-->
            //                                    <!--begin::Body-->
            //                                    <div id="kt_accordion_3_item_1" class="fs-6 collapse ps-10" data-bs-parent="#kt_accordion_3">
            //                                        <div class="row">
            //                                            <div class="col-md-3 mb-7 fv-plugins-icon-container d-flex flex-column align-items-start">
            //                                                <label class="fw-semibold fs-6 mb-2">Trạng thái tài khoản</label>
            //                                                <input type="text" id="" class="form-control tableHeaderFilter" />
            //                                            </div>
            //                                            <div class="col-md-3 mb-7 fv-plugins-icon-container d-flex flex-column align-items-start">
            //                                               <label class="fw-semibold fs-6 mb-2">Trạng thái tài khoản</label>
            //                                                <input type="text" id="" class="form-control tableHeaderFilter" />
            //                                            </div>
            //                                            <div class="col-md-3 mb-7 fv-plugins-icon-container d-flex flex-column align-items-start">
            //                                                <label class="fw-semibold fs-6 mb-2">Trạng thái tài khoản</label>
            //                                                <input type="text" id="" class="form-control tableHeaderFilter" />
            //                                            </div>
            //                                            <div class="col-md-3 mb-7 fv-plugins-icon-container d-flex flex-column align-items-start">
            //                                                <label class="fw-semibold fs-6 mb-2">Trạng thái tài khoản</label>
            //                                                <input type="text" id="" class="form-control tableHeaderFilter" />
            //                                            </div>
            //                                            <div class="col-md-3 mb-7 fv-plugins-icon-container d-flex flex-column align-items-start">
            //                                                <label class="fw-semibold fs-6 mb-2">Trạng thái tài khoản</label>
            //                                                <input type="text" id="" class="form-control tableHeaderFilter" />
            //                                            </div>
            //                                            <div class="col-md-3 mb-7 fv-plugins-icon-container d-flex flex-column align-items-start">
            //                                                <label class="fw-semibold fs-6 mb-2">Trạng thái tài khoản</label>
            //                                                <input type="text" id="" class="form-control tableHeaderFilter" />
            //                                            </div>
            //                                            <div class="col-md-3 mb-7 fv-plugins-icon-container d-flex flex-column align-items-start">
            //                                                <label class="fw-semibold fs-6 mb-2">Trạng thái tài khoản</label>
            //                                                <input type="text" id="" class="form-control tableHeaderFilter" />
            //                                            </div>
            //                                            <div class="col-md-3 mb-7 fv-plugins-icon-container d-flex flex-column align-items-start">
            //                                                <label class="fw-semibold fs-6 mb-2">Trạng thái tài khoản</label>
            //                                                <input type="text" id="" class="form-control tableHeaderFilter" />
            //                                            </div>
            //                                        </div>
            //                                    </div>
            //                                    <!--end::Body-->
            //                                </div>
            //                                <!--end::Item-->

            //                            </div>

            //                        </th>
            //                    </tr>`);
            $("#rowSearch").removeClass("d-none");

        }

    });

    table.on('draw', function (e) {
        dataExport = table.ajax.json().allData;
    });
}
//function customBagdeColor(color) {
//    var percent = 90;
//    var fontColor = "";
//    var backColor = color;
//    // strip the leading # if it's there
//    color = color.replace(/^\s*#|\s*$/g, '');

//    // convert 3 char codes --> 6, e.g. `E0F` --> `EE00FF`
//    if (color.length == 3) {
//        color = color.replace(/(.)/g, '$1$1');
//    }

//    var r = parseInt(color.substr(0, 2), 16),
//        g = parseInt(color.substr(2, 2), 16),
//        b = parseInt(color.substr(4, 2), 16);

//    return '#' +
//        ((0 | (1 << 8) + r + (256 - r) * percent / 100).toString(16)).substr(1) +
//        ((0 | (1 << 8) + g + (256 - g) * percent / 100).toString(16)).substr(1) +
//        ((0 | (1 << 8) + b + (256 - b) * percent / 100).toString(16)).substr(1);
//}
function componentToHex(c) {
    var hex = c.toString(16);
    //console.log(hex)
    return hex.length == 1 ? "0" + hex + "10" : hex + "10";
}
function colorToHex(color) {
    return color + "10";
}
async function deleteItem(id) {
    await getItemById(id);
    swal.fire({
        title: 'Xóa  mã coupon',
        html: 'Bạn có chắc chắn muốn xóa mã coupon <b>' + updatingObj.code + '</b>?',
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
                url: systemConfig.defaultAPIURL + "api/coupon/delete?id=" + id,
                type: "DELETE",
                success: function (response) {
                    $("#loading").removeClass("show");
                    if (response.isSucceeded) {
                        Swal.fire(
                            'Xóa mã coupon',
                            'Mã coupon <b>' + updatingObj.code + ' </b> đã được xóa thành công.',
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
                                    'Mã coupon <p class="swal__admin__subtitle"> Xóa không thành công </p>',
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
                            'Mã coupon',
                            'Phiên đăng nhập của bạn đã hết hạn, vui lòng đăng nhập để sử dụng tính năng này.',
                            'error'
                        ).then(function () {
                            window.location.href = "/home/login";
                        });
                    }
                    else if (e.status == 403) {
                        Swal.fire(
                            'Mã coupon',
                            'Bạn không có quyền sử dụng tính năng này.',
                            'error'
                        );
                    }
                    else {
                        Swal.fire(
                            'Xóa mã coupon',
                            'Xóa mã coupon không thành công, <br> vui lòng thử lại sau!',
                            'error'
                        );
                    }

                }
            })
        }
    })
}
function validateCouponType() {
    var errorList = [];
    if ($("#couponName").val().length == 0) {
        errorList.push("Code không được bỏ trống.");
    } else if ($("#couponName").val().length > 50) {
        errorList.push("Code không được dài quá 50 ký tự.");
    }

    if ($("#couponEffiencyTime").val().length == 0) {
        errorList.push("Thời hạn không được bỏ trống.");

    }
    else if ($("#couponEffiencyTime").val() == 0) {
        errorList.push("Thời hạn không thể bằng 0.");

    }
    if (errorList.length > 0) {
        var contentError = "<ul>";
        errorList.forEach(function (item, index) {
            contentError += "<li class='text-start'>" + item + "</li>";
        })
        contentError += "</ul>";
        var actionName = (updatingId > 0 ? "Cập nhật" : "Thêm mới");
        var swalSubTitle = "<p class='swal__admin__subtitle'>" + actionName + " không thành công</p>";
        Swal.fire(
            'Mã coupon' + swalSubTitle,
            contentError,
            'warning'
        );
    } else {
        submit();
    }
}
function submit() {
    var obj = {
        code: ($("#couponName").val() != '' ? $("#couponName").val().trim() : ""),
        couponTypeId: $("#searchCouponTypeId").val(),
        efficiencyTime: $("#couponEffiencyTime").val(),
    }

    if (updatingId > 0) {
        obj.id = updatingId;
    }

    var actionName = (updatingId > 0 ? "Cập nhật" : "Thêm mới");

    swal.fire({
        title: actionName + " mã coupon",
        html: "Bạn có chắc chắn muốn " + actionName.toLowerCase() + " mã coupon <b>" + $("#couponName").val() + '</b>?',
        icon: 'info',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#443',
        cancelButtonText: 'Hủy',
        confirmButtonText: 'Lưu'
    }).then((result) => {
        if (result.isConfirmed) {
            $("#loading").addClass("show");

            //CALL AJAX TO UPDATE
            if (updatingId > 0) {
                $.ajax({
                    url: systemConfig.defaultAPIURL + "api/coupon/update",
                    type: "PUT",
                    contentType: "application/json",
                    data: JSON.stringify(obj),
                    success: function (response) {
                        $("#loading").removeClass("show");

                        // debugger;
                        if (response.isSucceeded) {
                            Swal.fire(
                                'Cập nhật mã coupon',
                                'Mã coupon <b>' + $("#couponName").val() + '</b> đã được cập nhật thành công.',
                                'success'
                            ).then((result) => {
                                $("#couponModal").modal("hide");
                                reGenTable();

                            });
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
                                        'Mã coupon <p class="swal__admin__subtitle"> Cập nhật không thành công </p>',
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
                                'Mã coupon',
                                'Phiên đăng nhập của bạn đã hết hạn, vui lòng đăng nhập để sử dụng tính năng này.',
                                'error'
                            ).then(function () {
                                window.location.href = "/home/login";
                            });
                        }
                        else if (e.status == 403) {
                            Swal.fire(
                                'Mã coupon',
                                'Bạn không có quyền sử dụng tính năng này.',
                                'error'
                            );
                        }
                        else {
                            swal.fire(
                                'Mã coupon',
                                'không thể cập nhật mã coupon, hãy kiểm tra lại thông tin.',
                                'error'
                            );
                        }

                    }
                });
            };

            //CALL AJAX TO CREATE
            if (updatingId == 0) {
                $.ajax({
                    url: systemConfig.defaultAPIURL + "api/coupon/add",
                    type: "POST",
                    contentType: "application/json",
                    data: JSON.stringify(obj),
                    success: function (response) {
                        $("#loading").removeClass("show");

                        if (response.isSucceeded) {
                            Swal.fire(
                                'Thêm mới mã coupon',
                                'Mã coupon <b>' + $("#couponName").val() + '</b> đã được thêm mới thành công.',
                                'success'
                            ).then(function () {
                                $("#couponModal").modal("hide");
                                //window.location.reload();
                                reGenTable();

                            });
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
                                        'Mã coupon <p class="swal__admin__subtitle"> Thêm mới không thành công </p>',
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
                                'Quản lý mã coupon',
                                'Phiên đăng nhập của bạn đã hết hạn, vui lòng đăng nhập để sử dụng tính năng này.',
                                'error'
                            ).then(function () {
                                window.location.href = "/home/login";
                            });
                        }
                        else if (e.status == 403) {
                            Swal.fire(
                                'Quản lý mã coupon',
                                'Bạn không có quyền sử dụng tính năng này.',
                                'error'
                            );
                        }
                        else {

                            Swal.fire(
                                'Quản lý mã coupon',
                                'Không thể thêm mới mã coupon, hãy kiểm tra lại thông tin.',
                                'error'
                            );
                        }
                    }
                });
            }
        }
    });

}
function tableSearch() {
    table.column(1).search($("#searchFullName").val());
    table.column(2).search($("#searchUserName").val());
    //table.column(3).search($("#searchLevel").val().toString());
    table.column(3).search($("#searchStatus").val().toString());

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
        table.column(4).search(searchDateArrs.toString());
    }
    else {
        table.column(4).search("")
    }
    table.column(5).search($("#searchActivated").val());

    table.draw();
}
function loadDataCandidateLevel() {
    $.ajax({
        url: systemConfig.defaultAPIURL + "api/candidate-level/list",
        type: "GET",
        contentType: "application/json",
        success: function (response) {
            //dataSource = response.resources;
            response.resources.forEach(function (item, index) {
                //console.log(item);
                $('#searchLevel').append(new Option(item.name, item.id, false, false)).trigger('change');
                $('#selectCandidateLevel').append(new Option(item.name, item.id, false, false)).trigger('change');
            })
            $("#selectCandidateLevel").select2();
            $("#searchLevel").val("").trigger('change')
            $("#searchLevel").select2({
                allowClear: true,
                placeholder: ""
            });

        },
        error: function (e) {
        }
    });
}
function loadDataAccountStatus() {
    $.ajax({
        url: systemConfig.defaultAPIURL + "api/account-status/list",
        type: "GET",
        contentType: "application/json",
        success: function (response) {
            //dataSource = response.resources;
            response.resources.forEach(function (item, index) {
                //console.log(item);
                $('#searchStatus').append(new Option(item.name, item.id, false, false)).trigger('change');
                $('#selectCandidateStatus').append(new Option(item.name, item.id, false, false)).trigger('change');
               
            })
            $("#selectCandidateStatus").select2();
            $("#searchStatus").val("").trigger('change')
            $("#searchStatus").select2({
                allowClear: true,
                placeholder: ""
            });

        },
        error: function (e) {
        }
    });
}
function loadDataExperienceRange() {
    $.ajax({
        url: systemConfig.defaultAPIURL + "api/experience-range/list",
        type: "GET",
        contentType: "application/json",
        success: function (response) {
            //dataSource = response.resources;
            //$('#advanced-experience-range').append(new Option("Tất cả kinh nghiệm", 0, false, false)).trigger('change');

            response.resources.forEach(function (item, index) {
                //console.log(item);
                
                $('#selectSuggestionExperienceRangeId').append(new Option(item.name, item.id, false, false)).trigger('change');
                $('#selectSuggestionExperience').append(new Option(item.name, item.id, false, false)).trigger('change');
                $('#advanced-experience-range').append(new Option(item.name, item.id, false, false));

            })
            $("#selectSuggestionExperienceRangeId").select2();
            $("#selectSuggestionExperience").select2({
                placeholder: ""
            });
            $("#advanced-experience-range").select2({
                placeholder: "Kinh nghiệm làm việc",
                allowClear: true,

            });

        },
        error: function (e) {
        }
    });
}
function loadDataSalaryRange() {
    $.ajax({
        url: systemConfig.defaultAPIURL + "api/salary-range/list",
        type: "GET",
        contentType: "application/json",
        success: function (response) {
            //$('#advanced-salary-range').append(new Option("Tất cả mức lương", 0, false, false)).trigger('change');
            //dataSource = response.resources;
            response.resources.forEach(function (item, index) {
                //console.log(item);

                $('#selectSuggestionSalaryRange').append(new Option(item.name, item.id, false, false)).trigger('change');
                $('#advanced-salary-range').append(new Option(item.name, item.id, false, false));

            })
            $("#selectSuggestionSalaryRange").select2();
            $("#advanced-salary-range").select2({
                placeholder: "Mức lương mong muốn",
                allowClear: true,

            });

        },
        error: function (e) {
        }
    });
}
async function quickActivated(isApproved, id) {
    var titleName = "Quản lý ứng viên";
    var actionName = isApproved ? "kích hoạt" : "bỏ kích hoạt";
    await getItemById(id);
    var obj = { "id": id, "IsApproved": isApproved }
    Swal.fire({
        title: titleName,
        html: "Bạn có chắc chắn muốn " + actionName + " ứng viên <strong>" + updatingObj.fullName + "</strong> không?",
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
                url: systemConfig.defaultAPIURL + "api/candidate/quick-activated?id=" + id,
                type: "PUT",
                contentType: "application/json",
                success: function (response) {
                    $("#loading").removeClass('show');
                    if (response.isSucceeded) {
                        Swal.fire(
                            'Kích hoạt ứng viên',
                            'Ứng viên <b>' + updatingObj.fullName + ' </b> đã được ' + actionName +' thành công.',
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
                                    'Ứng viên <p class="swal__admin__subtitle"> Kích hoạt không thành công </p>',
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
                            'Ứng viên',
                            'Phiên đăng nhập của bạn đã hết hạn, vui lòng đăng nhập để sử dụng tính năng này.',
                            'error'
                        ).then(function () {
                            window.location.href = "/home/login";
                        });
                    }
                    else if (e.status == 403) {
                        Swal.fire(
                            'Ứng viên',
                            'Bạn không có quyền sử dụng tính năng này.',
                            'error'
                        );
                    }
                    else {
                        Swal.fire(
                            'Ứng viên',
                            'Kích hoạt nhanh ứng viên không thành công, <br> vui lòng thử lại sau!',
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
$("#couponEffiencyTime").on("keypress keyup", function (e) {
    $(this).attr('type', 'text');

    // skip for arrow keys
    if (e.which >= 37 && e.which <= 40) return;

    // format number
    $(this).val(function (index, value) {
        return value
            .replace(/\D/g, '')
            .replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    });
})
$("#exportExcel").click(function (e) {
    e.preventDefault();
    $("#loading").addClass("show");
    $.ajax({
        url: systemConfig.defaultAPIURL + "api/candidate/export-excel",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(dataExport),
        success: function (res) {
            $("#loading").removeClass("show");
            //console.log(res);
            //debugger;
            if (!res.isSucceeded) {
                Swal.fire(
                    'Danh sách ứng viên!',
                    'Không có dữ liệu để xuất Excel.',
                    'warning'
                );
            }
            else {
                window.location = systemConfig.defaultAPIURL + "api/Candidate/download-excel?fileGuid=" + res.resources.fileGuid + "&fileName=" + res.resources.fileName;
            }
        },
        error: function (e) {
            $("#loading").removeClass("show");
            Swal.fire(
                'Danh sách ứng viên!',
                'Không có dữ liệu để xuất Excel.',
                'warning'
            );
        }
    })
})
$("#accountPassword").on('keyup keypress', function (e) {
    if (e.keyCode == 13) {
        e.preventDefault();
    }
    if ($(this).val().length > 0) {
        $("#spanNewPass").removeClass('d-none')
    }
    else {
        $("#spanNewPass").addClass('d-none')

    }
})
$("#accountConfirmPassword").on('keyup keypress', function (e) {
    if (e.keyCode == 13) {
        e.preventDefault();
    }
    if ($(this).val().length > 0) {
        $("#spanConfirmNewPass").removeClass('d-none')
    }
    else {
        $("#spanConfirmNewPass").addClass('d-none')

    }
})
$("#changePassword").click(function (e) {
    e.preventDefault();
    var listErr = [];
    if ($("#accountPassword").val().length == 0) {
        listErr.push("Mật khẩu không được để trống")
    }
    else {
        if ($("#accountPassword").val().length < 8) {
            listErr.push("Mật khẩu phải lớn hơn 8 ký tự")
        }
    }

    if ($("#accountConfirmPassword").val() != $("#accountPassword").val()) {
        listErr.push("Nhập lại mật khẩu phải trùng khớp với mật khẩu mới")
    }

    if (listErr.length > 0) {
        var content = "<ul>";
        listErr.forEach(function (item) {
            content += "<li class='text-start'>" + item + "</li>";
        })
        content += "</ul>";
        swal.fire({
            title: "Cập nhật mật khẩu",
            html: content,
            icon : "warning",
        })
    }
    else {
        $("#loading").addClass("show");

        var obj = {
            id: updatingId,
            newPassword: $("#accountPassword").val(),
            confirmPassword: $("#accountConfirmPassword").val(),
            oldPassword: "000"
        }
        $.ajax({
            url: systemConfig.defaultAPIURL + "api/candidate/change-password",
            type: "PUT",
            contentType: "application/json",
            data: JSON.stringify(obj),
            success: function (res) {
                $("#loading").removeClass("show");
                if (!res.isSucceeded) {
                    if (res.status == 400) {
                        if (res.errors != null) {
                            var contentError = "<ul>";
                            res.errors.forEach(function (item, index) {
                                contentError += "<li class='text-start pb-2'>" + item + "</li>";
                            })
                            contentError += "</ul>";
                            Swal.fire(
                                'Ứng viên <p class="swal__admin__subtitle"> Kích hoạt không thành công </p>',
                                contentError,
                                'warning'
                            );
                        } else {
                            Swal.fire(
                                'Lưu ý',
                                res.message,
                                'warning'
                            )
                        }
                    }
                    else {
                        Swal.fire(
                            'Lưu ý',
                            res.message,
                            'warning'
                        )
                    }
                }
                else {
                    Swal.fire(
                        'Cập nhật mật khẩu!',
                        'Cập nhật mật khẩu cho ứng viên ' + updatingObj.fullName + ' thành công!',
                        'success'
                    );
                    $("#accountPassword").val('');
                    $("#accountConfirmPassword").val('');
                }
            },
            error: function (e) {
                $("#loading").removeClass("show");
                Swal.fire(
                    'Cập nhật mật khẩu!',
                    'Đã có lỗi xảy ra khi cập nhật mật khẩu.',
                    'warning'
                );
            }
        })
    }
})
$("#form-candidate").on('submit', function (e) {
    e.preventDefault();
})
async function loadDataJobCategory() {
    try {
        let res = await httpService.getAsync('api/job-category/list');
        if (res.isSucceeded) {
            //dataSource = response.resources;
            //$('#advanced-suggest-job-category').append(new Option("Tất cả danh mục", 0, false, false)).trigger('change');

            res.resources.forEach(function (item, index) {
                //console.log(item);
                $('#selectSuggestionJobCategory').append(new Option(item.name, item.id, false, false)).trigger('change');
                $('#advanced-suggest-job-category').append(new Option(item.name, item.id, false, false));

            })
            $("#selectSuggestionJobCategory").select2({
                placeholder : "",
            });
            $("#advanced-suggest-job-category").select2({
                placeholder: "Danh mục quan tâm",
                allowClear: true,

            });
        }
        else {
            console.error(res);

        }
    } catch (e) {
        console.error(e);
    }
}
async function loadDataJobPosition() {
    try {
        let res = await httpService.getAsync('api/job-position/list');
        if (res.isSucceeded) {
            //dataSource = response.resources;
            //$('#advanced-position').append(new Option("Tất cả vị trí", 0, false, false)).trigger('change');

            res.resources.forEach(function (item, index) {
                //console.log(item);
                $('#selectSuggestionJobPosition').append(new Option(item.name, item.id, false, false)).trigger('change');
                $('#advanced-position').append(new Option(item.name, item.id, false, false));

            })
            $("#selectSuggestionJobPosition").select2({
                placeholder: "",
            });
            $("#advanced-position").select2({
                placeholder: "Vị trí quan tâm",
                allowClear: true,

            });
        }
        else {
            console.error(res);

        }
    } catch (e) {
        console.error(e);
    }
}
async function loadDataJobSkill() {
    try {
        let res = await httpService.getAsync('api/job-skill/list');
        if (res.isSucceeded) {
            //dataSource = response.resources;
            //$('#advanced-skill').append(new Option("Tất cả kỹ năng", 0, false, false)).trigger('change');

            res.resources.forEach(function (item, index) {
                //console.log(item);
                $('#selectSuggestionJobSkill').append(new Option(item.name, item.id, false, false)).trigger('change');
                $('#advanced-skill').append(new Option(item.name, item.id, false, false));

            })
            $("#selectSuggestionJobSkill").select2({
                placeholder: "",
            });
            $("#advanced-skill").select2({
                placeholder: "Gợi ý kỹ năng",
                allowClear: true,

            });
        }
        else {
            console.error(res);

        }
    } catch (e) {
        console.error(e);
    }
}
async function loadDataWorkPlace() {
    try {
        let res = await httpService.getAsync('api/workplace/list');
        if (res.isSucceeded) {
            //dataSource = response.resources;
            //$('#advanced-job-city').append(new Option("Tất cả vị trí", 0, false, false)).trigger('change');

            res.resources.forEach(function (item, index) {
                //console.log(item);
                $('#selectSuggestionWorkPlace').append(new Option(item.name, item.id, false, false)).trigger('change');
                $('#advanced-job-city').append(new Option(item.name, item.id, false, false));

            })
            $("#selectSuggestionWorkPlace").select2({
                placeholder: "",
            });
            $("#advanced-job-city").select2({
                placeholder: "Địa điểm làm việc",
                allowClear: true,

            });
        }
        else {
            console.error(res);

        }
    } catch (e) {
        console.error(e);
    }
}

async function loadDataSkillLevel() {
    try {
        let res = await httpService.getAsync('api/skill-level/list');
        if (res.isSucceeded) {
            //dataSource = response.resources;
            //$('#advanced-job-city').append(new Option("Tất cả vị trí", 0, false, false)).trigger('change');

            res.resources.forEach(function (item, index) {
                //console.log(item);
                $('#advanced-skill-level').append(new Option(item.name, item.id, false, false));

            })
            $("#advanced-skill-level").select2({
                placeholder: "Mức độ thành thạo",
                allowClear: true,
            });
        }
        else {
            console.error(res);

        }
    } catch (e) {
        console.error(e);
    }
}

