/**
 * Author: Ha Thanh Nguyen
 * Created: 02/08/2024
 * Description: Layout footer javascript
 */
"use strict";

var currentUser = {};
var roles = [];
var dataSource = [];
var VIlocalization = {
    today: 'Hôm nay',
    clear: 'Xóa',
    close: 'Đóng',
    selectMonth: 'Chọn tháng',
    previousMonth: 'Thánh trước',
    nextMonth: 'Tháng tiếp theo',
    selectYear: 'Chọn năm',
    previousYear: 'Năm trước',
    nextYear: 'Năm tiếp theo',
    selectDecade: 'Chọn thập kỷ',
    previousDecade: 'Thập kỷ trước',
    nextDecade: 'Thập kỷ tiếp theo',
    previousCentury: 'Thế kỷ trước',
    nextCentury: 'Thế kỷ tiếp theo',
    pickHour: 'Chon giờ',
    incrementHour: 'Tăng giờ',
    decrementHour: 'Giảm giờ',
    pickMinute: 'Chọn phút',
    incrementMinute: 'Tăng phút',
    decrementMinute: 'Giảm phút',
    pickSecond: 'Chọn giây',
    incrementSecond: 'Tăng giây',
    decrementSecond: 'Giảm giây',
    toggleMeridiem: 'Thay đổi AM-PM',
    selectTime: 'Lựa chọn giờ',
    selectDate: 'Lựa chọn ngày',
    dayViewHeaderFormat: { month: 'long', year: 'numeric' },
    locale: 'vi',
    startOfTheWeek: 1,
    dateFormats: {
        LT: 'HH:mm',
        LTS: 'HH:mm:ss',
        L: 'dd/MM/yyyy',
        LL: 'd MMMM yyyy',
        LLL: 'd MMMM yyyy HH:mm',
        LLLL: 'dddd, d MMMM yyyy HH:mm',
    },
    ordinal: (n) => `${n}.`,
    format: 'L LTS',
}
var datePickerOption = {
    display: {
        buttons: {
            today: true,
            clear: true,
            close: true,
        },
        components: {
            decades: true,
            year: true,
            month: true,
            date: true,
            hours: false,
            minutes: false,
            seconds: false
        }
    },
    localization: VIlocalization
};
var dateTimePickerOption = {
    display: {
        buttons: {
            today: true,
            clear: true,
            close: true,
        },
        components: {
            decades: true,
            year: true,
            month: true,
            date: true,
            hours: true,
            minutes: true,
            seconds: true
        }
    },
    localization: VIlocalization
};
var hourPickerOption = {
    display: {
        buttons: {
            clear: true,
            close: true,
        },
        components: {
            decades: false,
            year: false,
            month: false,
            date: false,
            hours: true,
            minutes: false,
            seconds: false
        }
    },
    localization: VIlocalization
};
String.prototype.escape = function () {
    var tagsToReplace = {
        '<': '&lt;',
        '>': '&gt;'
    };
    return this.replace(/[&<>]/g, function (tag) {
        return tagsToReplace[tag] || tag;
    });
};
/**
 * Author: Ha Thanh Nguyen
 * Created: 02/08/2024
 * Description: Extension phone number string
 * @returns
 */
String.prototype.toPhoneNumber = function () {
    let cleaned = ('' + this).replace(/\D/g, '');
    let match = cleaned.match(/^(\d{4})(\d{3})(\d{3})$/);
    if (match) {
        return match[1] + ' ' + match[2] + ' ' + match[3];
    }
    return "";
}
/**
 * Author: Ha Thanh Nguyen
 * Created: 02/08/2024
 * Description: format phone number string
 * @param {string} phoneNumberString
 * @returns
 */
function formatPhoneNumber(phoneNumberString) {
    var cleaned = ('' + phoneNumberString).replace(/\D/g, '');
    var match = cleaned.match(/^(\d{4})(\d{3})(\d{3})$/);
    if (match) {
        return match[1] + ' ' + match[2] + ' ' + match[3];
    }
    return "";
}
//Viet hoa select2
$.fn.select2.defaults.set('language', 'vi');
///add class text_editor to textarea to use CK Editor 4
for (var i = 0; i < $(".text_editor").length; i++) {
    var editor = CKEDITOR.replace($(".text_editor")[i]);
    $(editor.element).on("change", function (e) {
        //debugger;
        editor.setData($(this).val());//set data
    })
}

$(".btn_show_pass").on("click", function (e) {
    var target = $($(this).attr("data-target"));
    if (target.attr("type") == "password") {
        target.attr("type", "text");
        $(this).html(`<i class="ki-duotone ki-eye-slash fs-3">
                                            <span class="path1 ki-uniEC07"></span>
                                            <span class="path2 ki-uniEC08"></span>
                                            <span class="path3 ki-uniEC09"></span>
                                            <span class="path4 ki-uniEC0A"></span>
                                        </i>`);
    }
    else {
        target.attr("type", "password");
        $(this).html(`<i class="ki-duotone ki-eye fs-3">
                                            <span class="path1 ki-uniEC0B"></span>
                                            <span class="path2 ki-uniEC0B"></span>
                                            <span class="path3 ki-uniEC0D"></span>
                                        </i>`);
    }
});
$(".form_input").on("blur", function () {
    let text = $(this).val().trim() || "";
    $(this).val(text);
})
setTimeout(function () {
    $(".page-loader").addClass('hide');
}, 500)

$('.bs_max_length').maxlength({
    warningClass: "badge badge-primary",
    limitReachedClass: "badge badge-success"
});//bs max length

function setupCKUploadFile() {
    var inputElement = $(".cke_dialog_image_url .cke_dialog_ui_hbox_first input");
    var buttonFileElement = $(".cke_dialog_image_url .cke_dialog_ui_hbox_last a");
    buttonFileElement.addClass("choseFile");
    buttonFileElement.attr("data-fm-target", "#" + inputElement.attr("id"));
    buttonFileElement.attr("control-type", "ckeditor4");
    buttonFileElement.css("display", "block");
    //$(".cke_dialog_body .cke_dialog_tabs a:nth-child(4)").remove();khi xóa sẽ bị bug
    //$(".cke_dialog_contents .cke_dialog_contents_body div:nth-child(4)").remove();
}

/**
 * Author: TUNG
 * Created: 02/08/2024jobi
 * Description: regen datatable
 * @param {any} t table 
 * @param {Function} f function 
 */
function reGenDataTable(t, f) {
    t.destroy();
    f();
}
function reGenTable() {
    tableUpdating = 0;
    table.destroy();
    $(".tableHeaderFilter").val(null).trigger("change");
    $("#tableData tbody").html('');
    loadData();
}
/**
 * Author: Ha Thanh Nguyen
 * Created: 02/08/2024
 * Description: format string number
 * @param {any} value
 * @param {any} number
 * @param {any} char
 * @returns
 */
function customFormatValue(value, number, char) {
    if (number == undefined || number == null) {
        number = 3;
    }
    if (char == undefined || char == null) {
        char = '.';
    }
    value = value != null ? value.toString() : "";
    var pattern = new RegExp(`\\B(?=(\\d{${number}})+(?!\\d))`, 'g');
    return value
        .replace(/\D{-}/g, '')
        .replace(pattern, char);
}
$(".input-number").on("change input", function () {
    var inputType = $(this).attr("input-type");
    var input = $(this);
    var min = $(this).attr("min");
    var max = $(this).attr("max");
    var value = 0;
    if (input.val().trim().length == 0) {
        return;
    }
    if (inputType) {
        switch (inputType) {
            case "int":
                value = parseInt($(this).val());
                if (max != undefined && value != undefined && value > max) {
                    value = max;
                }
                else if (min != undefined && value != undefined && value < min) {
                    value = min;
                }
                $(this).val(value);
                break;
            case "money":
                formatCurrency(input);
                break;
        };

    }
});
$(".input-search-number").on("change patse keyup keydown keypress", function () {
    var e = $(this);
    var text = e.val();
    e.val(text.replace(/\D/g, ""));
});
$("input").on("blur", function () {
    var min = $(this).attr("min");
    var value = $(this).val()
    if (min != undefined && value == "") {
        $(this).val(min);
    }
})
/**
 * Format number string
 * @param {any} n number
 * @returns
 */
function formatNumber(n) {
    if (n == null) {
        return "";
    }

    n = n.toString();

    // format number 1000000 to 1,234,567
    return n.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
function formatNumberToString(n) {
    return n.toString().replace(/(.)(?=(\d{3})+$)/g, '$1,');
}
/**
 * Author: Ha Thanh Nguyen
 * Created: 02/08/2024
 * Description: format currency for string number
 * @param {string} input input string number
 * @param {any} blur event blur
 * @returns
 */
function formatCurrency(input, blur) {
    var input_val = input.val();
    var max = parseInt(input.attr("max"));
    if (input_val === "") { return; }
    var original_len = input_val.length;
    var caret_pos = input.prop("selectionStart");
    if (input_val == "0") {
        return;
    }
    while (input_val.charAt(0) === '0') {
        input_val = input_val.substring(1);
    }
    if (max != undefined) {
        if (parseInt(input_val.replace(/\D/g, "")) > max) {
            input_val = formatNumber(String(max));
        }
    }
    if (input_val.indexOf(".") >= 0) {
        var decimal_pos = input_val.indexOf(".");
        var left_side = input_val.substring(0, decimal_pos);
        var right_side = input_val.substring(decimal_pos);
        left_side = formatNumber(left_side);
        right_side = formatNumber(right_side);
        if (blur === "blur") {
            right_side += "00";
        }
        right_side = right_side.substring(0, 2);
        input_val = left_side + "." + right_side;

    } else {
        input_val = formatNumber(input_val);
        input_val = input_val;
    }
    input.val(input_val);
    var updated_len = input_val.length;
    caret_pos = updated_len - original_len + caret_pos;
    input[0].setSelectionRange(caret_pos, caret_pos);
}

loadDataMenuItem();
async function loadDataMenuItem() {
    $("#sidebar_menu").html('');

    //$.ajax({
    //    url: systemURL + "api/menu/list-menu-admin",
    //    type: "GET",
    //    contentType: "application/json",
    //    success: function (responseData) {
    //        let data = responseData;
    //        dataSource = data.resources;
    //        dataSource.forEach(function (item, index) {
    //            if (item.parentId == null || item.parentId == 0) {
    //                var newRow = `<div data-kt-menu-trigger="click" class="menu-item menu-accordion" id="parent-${item.id}">
    //                                        <span class="menu-link">
    //                                                <span class="menu-icon">
    //                                                    <span class="svg-icon svg-icon-muted svg-icon-2">
    //                                                        ${item.icon}
    //                                                    </span>

    //                                                </span>
    //                                                <span class="menu-title">${item.name}</span>
    //                                                <span class="menu-arrow" id="menu-arrow-${item.id}"></span>
    //                                        </span>

    //                                    </div>`
    //                $(newRow).appendTo($("#sidebar_menu"));
    //                recursionMenuItem(item);
    //            };
    //        })
    //    }
    //})
}
function recursionMenuItem(parent_item) {
    var currenthref = window.location.pathname.toLowerCase();
    var children = dataSource.filter(x => x.parentId == parent_item.id);
    if (children.length < 1) {
        $("#menu-arrow-" + parent_item.id).addClass('d-none');
        return null;
    }
    else {
        children.forEach(function (item, index) {
            var linkItem = (item.link != null && item.link != "") ? item.link.toString().toLowerCase() : "";
            var children1 = dataSource.filter(x => x.parentId == item.id);

            var newRow = "";
            if (children1.length < 1) {
                newRow = `<div class="menu-sub menu-sub-accordion">
                                                        <div class="menu-item" id="sub-menu-${item.parentId}">
                                                                    <a class="menu-link sub-menu-item ${currenthref === linkItem ? "active" : ""}" href="${item.link != null ? item.link : "#!"}"  rootId="${item.parentId}">
                                                        <span class="menu-bullet">
                                                            <span class="bullet bullet-dot"></span>
                                                        </span>
                                                        <span class="menu-title">${item.name}</span>
                                                        </a>
                                                </div>
                                        </div>
                                        `
            }
            else {
                newRow = `<div class="menu-sub menu-sub-accordion"><div data-kt-menu-trigger="click" class="menu-item menu-accordion" id="parent-${item.id}">
                                                            <a class="menu-link">
                                                                            <span class="menu-bullet">
                                                                    <span class="bullet bullet-dot"></span>
                                                                    </span>
                                                                    <span class="menu-title">${item.name}</span>
                                                                    <span class="menu-arrow" id="menu-arrow-${item.id}"></span>
                                                            </a>

                                                        </div></div>`
            }
            $('#parent-' + item.parentId).append(newRow);

            recursionMenuItem(item);
        });
        if ($('a.sub-menu-item').hasClass('active')) {
            var rootId = $("a.active").parent()[0].id.split('-')[2];
            $("#parent-" + rootId).addClass('show');
        }
    };
}

function stringToSlug(str) {
    // remove accents
    var from = "àáãảạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệđùúủũụưừứửữựòóỏõọôồốổỗộơờớởỡợìíỉĩịäëïîöüûñçýỳỹỵỷ",
        to = "aaaaaaaaaaaaaaaaaeeeeeeeeeeeduuuuuuuuuuuoooooooooooooooooiiiiiaeiiouuncyyyyy";
    for (var i = 0, l = from.length; i < l; i++) {
        str = str.replace(RegExp(from[i], "gi"), to[i]);
    }

    str = str.toLowerCase()
        .trim()
        .replace(/[^a-z0-9\-]/g, '-')
        .replace(/-+/g, '-');

    return str;
}

function customBagdeColor(color) {
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

$(document).ready(async function () {
    $(".none-space").on("change input blur", function () {
        let e = $(this);
        let text = e.val().trim();
        e.val(text);
    })
    CKEDITOR.on('dialogDefinition', function (e) {
        var dialogName = e.data.name;
        var dialog = e.data.definition.dialog;
        dialog.on('show', function () {
            setupCKUploadFile();
        });
    });
})
$(document).on("ajaxError", function (event, jqxhr, settings, thrownError) {
    if (settings.url.includes(systemConfig.defaultAPIURL)) {
        switch (jqxhr.status) {
            case 401: {
                Swal.fire(
                    'Quản lý tài khoản quản trị viên',
                    'Phiên đăng nhập của bạn đã hết hạn, vui lòng đăng nhập để sử dụng tính năng này.',
                    'error'
                ).then(function () {
                    window.location.href = "/sign-in";
                });
                break;
            }
            case 403: {
                Swal.fire(
                    'Quản lý tài khoản quản trị viên',
                    'Bạn không có quyền sử dụng tính năng này.',
                    'error'
                );
                break;
            }
            default: {
                console.error(jqxhr);
            }
        }
    }
});



