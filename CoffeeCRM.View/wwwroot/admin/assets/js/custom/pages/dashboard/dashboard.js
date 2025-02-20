$(document).ready(function () {
    // Cấu hình Moment.js để sử dụng ngôn ngữ tiếng Việt
    moment.locale('vi');
    document.querySelectorAll(".datepicker").forEach(function (item) {
        new tempusDominus.TempusDominus(item, datePickerOption);
    })
    $("body").on('click', '[data-range-key="Custom Range"]', function (e) {
        $(".cancelBtn").html("Hủy");
        $(".applyBtn").html("Áp dụng");
    });
    // KTChartsWidget38.init(loadBooking);
    var loadChart = [{
        payLoad: loadBooking,
        target: 'kt_charts_widget_38_chart_1',
        option: {
            title: 'Biểu đồ thống kê về đặt lịch phỏng vấn',
            serieName: 'Tổng số lịch hẹn được đặt',
            format: "lần",
        }
    },
    {
        payLoad: loadPost,
        target: 'kt_charts_widget_38_chart_2',
        option: {
            title: 'Biểu đồ thống kê về đặt lịch phỏng vấn',
            serieName: 'Tổng số bài viết',
            format: "bài",
        }
    }
    ];

    loadChart.forEach(function (item) {
        KTChartsWidget38.init(item.payLoad, item.target, item.option);
    });
    loadDataAccount();
    loadLogAccount.init();
    loadDataBookingStatusChart.init();
    loadChartSurvey.init();
    loadPopular.init();
    loadAllStaticChart.init();

    var img = document.getElementsByTagName('img');
    img.forEach(function (item) {
        item.src = item.src;
        item.onerror = function (e) {
            item.src = '/upload/admin/system/logo/BotLogo.png';
        };
    })
});
"use strict";
// Class definition
var KTChartsWidget38 = function () {
    // Private methods
    var initChart = async function (loadData, selector, customOption) {
        // lấy chuỗi thời gian hiển thị trên biểu đồ
        var time = $("#timeFilter[data-target=" + selector + "] #timeToFilter").html();
        var datesArray = [];
        if (time.indexOf(" - ") !== -1) {
            var rangeTime = ($("#timeFilter[data-target=" + selector + "] #timeToFilter").html()).split(' - ');

            var startDate = moment(rangeTime[0], 'DD/MM/YYYY');
            var endDate = moment(rangeTime[1], 'DD/MM/YYYY');

            var currentDate = startDate.clone();

            while (currentDate.isSameOrBefore(endDate)) {
                datesArray.push(currentDate.format('DD/MM/YYYY'));
                currentDate.add(1, 'days');
            }
        } else {
            var oneTime = moment(time, 'DD/MM/YYYY')
            datesArray.push(oneTime.format('DD/MM/YYYY'));
        }
        var valuesArray = [];
        await loadData.call().then(result => {
            if (result.length != 0) {//trường hợp có data
                datesArray.forEach(function (itemTime, index) {
                    var count = 0;
                    result.forEach(function (itemValue) {
                        if (moment(itemValue.createdTime).format("DD/MM/YYYY") == itemTime) {
                            count++;
                        }
                    });
                    valuesArray.push(count);
                })
            } else {
                datesArray.forEach(function () {
                    valuesArray.push(0);
                });
            }
        }).catch(error => {
            //debugger;
            datesArray = [];
            valuesArray = [];
        });
        var hideValuesArray = valuesArray.map((e, i) => e == 0 ? i : undefined).filter(x => x);
        if (hideValuesArray.length > 0) {
            datesArray = datesArray.filter((_, index) => hideValuesArray.indexOf(index) === -1);
            valuesArray = valuesArray.filter((_, index) => hideValuesArray.indexOf(index) === -1);
        }
        else {
            valuesArray = valuesArray.filter(x => x != 0);
        }
        var chart = {
            self: null,
            rendered: false
        };
        var element = document.getElementById(selector);

        if (!element) {
            return;
        }

        var height = parseInt(KTUtil.css(element, 'height'));
        var labelColor = KTUtil.getCssVariableValue('--bs-gray-900');
        var borderColor = KTUtil.getCssVariableValue('--bs-border-dashed-color');

        var options = {
            series: [{
                name: customOption.serieName,
                data: valuesArray
            }],
            chart: {
                fontFamily: 'inherit',
                type: 'bar',
                height: height,
                toolbar: {
                    show: false
                }
            },
            plotOptions: {
                bar: {
                    horizontal: false,
                    columnWidth: ['30%'],
                    borderRadius: 5,
                    dataLabels: {
                        position: "top" // top, center, bottom
                    },
                    startingShape: 'flat'
                },
            },
            legend: {
                show: false
            },
            dataLabels: {
                enabled: true,
                offsetY: -28,
                style: {
                    fontSize: '13px',
                    colors: [labelColor]
                },
                formatter: function (val) {
                    return val;// + "H";
                }
            },
            stroke: {
                show: true,
                width: 2,
                colors: ['transparent']
            },
            xaxis: {
                categories: datesArray,
                axisBorder: {
                    show: false,
                },
                axisTicks: {
                    show: false
                },
                labels: {
                    style: {
                        colors: KTUtil.getCssVariableValue('--bs-gray-500'),
                        fontSize: '13px'
                    }
                },
                crosshairs: {
                    fill: {
                        gradient: {
                            opacityFrom: 0,
                            opacityTo: 0
                        }
                    }
                }
            },
            yaxis: {
                labels: {
                    style: {
                        colors: KTUtil.getCssVariableValue('--bs-gray-500'),
                        fontSize: '13px'
                    },
                    formatter: function (val) {
                        return val + " " + customOption.format;
                    }
                }
            },
            fill: {
                opacity: 1
            },
            states: {
                normal: {
                    filter: {
                        type: 'none',
                        value: 0
                    }
                },
                hover: {
                    filter: {
                        type: 'none',
                        value: 0
                    }
                },
                active: {
                    allowMultipleDataPointsSelection: false,
                    filter: {
                        type: 'none',
                        value: 0
                    }
                }
            },
            tooltip: {
                style: {
                    fontSize: '12px'
                },
                y: {
                    formatter: function (val) {
                        return + val + ' ' + customOption.format;
                    }
                }
            },
            noData: {
                text: 'Không có dữ liệu',
                align: 'center',
                verticalAlign: 'middle',
                offsetX: 0,
                offsetY: 0,
                style: {
                    color: KTUtil.getCssVariableValue('--bs-gray-500'),
                    fontSize: '14px',
                    fontFamily: undefined,
                }
            },
            colors: [KTUtil.getCssVariableValue('--bs-primary'), KTUtil.getCssVariableValue('--bs-primary-light')],
            grid: {
                borderColor: borderColor,
                strokeDashArray: 4,
                yaxis: {
                    lines: {
                        show: true
                    }
                }
            }
        };

        chart.self = new ApexCharts(element, options);

        // Set timeout to properly get the parent elements width
        // setTimeout(function () {
        //     chart.self.render();
        //     chart.rendered = true;
        // }, 200);
        chart.self.render();
        chart.rendered = true;
    }
    var createDateRangePickers = function (loadData, selector, customOption) {
        // Check if jQuery included
        if (typeof jQuery == 'undefined') {
            return;
        }

        // Check if daterangepicker included
        if (typeof $.fn.daterangepicker === 'undefined') {
            return;
        }
        var elements = [].slice.call(document.querySelectorAll('#timeFilter[data-target=' + selector + ']'));
        var start = moment();
        var end = moment();

        elements.map(function (element) {
            if (element.getAttribute("data-kt-initialized") === "1") {
                return;
            }

            var display = element.querySelector('div');
            var attrOpens = element.hasAttribute('data-kt-daterangepicker-opens') ? element.getAttribute('data-kt-daterangepicker-opens') : 'left';
            var range = element.getAttribute('data-kt-daterangepicker-range');

            var cb = function (start, end) {
                var current = moment();

                if (display) {
                    if (current.isSame(start, "day") && current.isSame(end, "day")) {
                        display.innerHTML = start.format('DD/MM/YYYY');
                    } else {
                        display.innerHTML = start.format('DD/MM/YYYY') + ' - ' + end.format('DD/MM/YYYY');
                    }
                }


                // sau khi chọn thời gian filer thì xóa bảng cũ
                $("#" + selector).html("")
                // xóa xong gọi lại bảng mới
                initChart(loadData, selector, customOption);
            }

            if (range === "Hôm nay") {
                start = moment();
                end = moment();
            }

            $(element).daterangepicker({
                startDate: start,
                endDate: end,
                opens: attrOpens,
                ranges: {
                    'Hôm nay': [moment(), moment()],
                    'Hôm qua': [moment().subtract(1, 'day'), moment().subtract(1, 'day')],
                    '7 ngày gần đây': [moment().subtract(6, 'days'), moment()],
                    '30 ngày gần đây': [moment().subtract(29, 'days'), moment()],
                    'Tháng này': [moment().startOf('month'), moment().endOf('month')],
                    'Tháng trước': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
                }
            }, cb);

            cb(start, end);

            element.setAttribute("data-kt-initialized", "1");
        });
    }
    // Public methods
    return {
        init: async function (loadData, selector, customOption) {
            await createDateRangePickers(loadData, selector, customOption);
            //// Update chart on theme mode change
            //KTThemeMode.on("kt.thememode.change", function () {
            //    if (chart.rendered) {
            //        chart.self.destroy();
            //    }
            //    await createDateRangePickers(loadData, selector, customOption);
            //});
        },
    }
}();
// Webpack support
if (typeof module !== 'undefined') {
    module.exports = KTChartsWidget38;
}

var loadBooking = async function loadDataBooking() {
    var timeToFilter = $("#timeFilter[data-target='kt_charts_widget_38_chart_1'] #timeToFilter").html().split('-');
    var startDate = timeToFilter[0];
    var endDate = timeToFilter[1];
    if (endDate == undefined) {
        endDate = startDate
    }
    //startDate = formatDatetime(startDate.trim());
    //endDate = formatDatetime(endDate.trim());
    var dataListBooking;
    var totalBooking = 0;
    var countBooking = 0;
    await $.ajax({
        url: systemURL + 'booking/api/FilterReport?startDate=' + startDate + '&endDate=' + endDate,
        type: 'GET',
        async: 'true',
        contentType: 'application/json',
        beforeSend: function (xhr) {
            if (localStorage.token) {
                xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.token);
            }
        },
        success: function (responseData) {
            var data = responseData.data;
            dataListBooking = data;
        },
        error: function (e) {
        }
    });
    await $.ajax({
        url: systemURL + 'booking/api/Count',
        type: 'GET',
        async: 'true',
        contentType: 'application/json',
        beforeSend: function (xhr) {
            if (localStorage.token) {
                xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.token);
            }
        },
        success: function (responseData) {
            countBooking = responseData;
        },
        error: function (e) {
        }
    });
    totalBooking = dataListBooking.length;
    $('#total-booking').text(totalBooking);
    $('#total-booking-all').text(countBooking);
    return dataListBooking;
}
var loadPost = async function loadDataPost() {
    var timeToFilter = $("#timeFilter[data-target='kt_charts_widget_38_chart_2'] #timeToFilter").html().split('-');
    var startDate = timeToFilter[0];
    var endDate = timeToFilter[1];
    var dataListPost;
    var totalPost = 0;
    var countPost = 0;
    if (endDate == undefined) {
        endDate = startDate
    }
    //startDate = formatDatetime(startDate.trim());
    //endDate = formatDatetime(endDate.trim());
    await $.ajax({
        url: systemURL + 'post/api/FilterReport?startDate=' + startDate + '&endDate=' + endDate,
        type: 'GET',
        async: 'true',
        contentType: 'application/json',
        beforeSend: function (xhr) {
            if (localStorage.token) {
                xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.token);
            }
        },
        success: function (responseData) {
            var data = responseData.data;
            dataListPost = data;
        },
        error: function (ex) {
            console.log(ex.message);
        }
    });
    await $.ajax({
        url: systemURL + 'post/api/Count',
        type: 'GET',
        async: 'true',
        contentType: 'application/json',
        beforeSend: function (xhr) {
            if (localStorage.token) {
                xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.token);
            }
        },
        success: function (responseData) {
            var data = responseData;
            countPost = data;
        },
        error: function (ex) {
            console.log(ex.message);
        }
    });
    totalPost = dataListPost.length;
    $('#total-post').text(totalPost);
    $('#total-post-all').text(countPost);
    return dataListPost;
}

var loadDataAccount = () => {
    var element = document.getElementById('chartAccount');
    var height = parseInt(KTUtil.css(element, 'height'));
    var options = {
        series: [accountReport.adolescentsTotal, accountReport.counselorTotal],
        chart: {
            type: 'donut',
            width: '90%',
            height: height,
        },
        labels: ["Thanh thiếu niên: " + accountReport.adolescentsTotal, "Tư vấn viên: " + accountReport.counselorTotal],
        dataLabels: {
            enabled: false
        },
        legend: {
            position: "right",
            verticalAlign: "top",
            containerMargin: {
                left: 35,
                right: 60,
            }
        },
        responsive: [
            {
                breakpoint: 1300,
                options: {
                    chart: {
                        width: '100%',
                        height: 150,
                    },
                    legend: {
                        position: "bottom",
                        fontSize: '10px',
                    }
                }
            }
        ]
    };

    var chart = new ApexCharts(document.querySelector("#chartAccount"), options);
    chart.render();
}

var loadDataBookingStatus = async function loadDataBookingStatus() {
    var timeToFilter = $("#timeFilter[data-target='chartBookingStatus'] #timeToFilter").html().split('-');
    var startDate = timeToFilter[0];
    var endDate = timeToFilter[1];
    if (endDate == undefined) {
        endDate = startDate
    }
    //startDate = formatDatetime(startDate.trim());
    //endDate = formatDatetime(endDate.trim());
    var dataListBooking;
    await $.ajax({
        url: systemURL + 'booking/api/FilterStatusReport?startDate=' + startDate + '&endDate=' + endDate,
        type: 'GET',
        async: 'true',
        contentType: 'application/json',
        beforeSend: function (xhr) {
            if (localStorage.token) {
                xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.token);
            }
        },
        success: function (responseData) {
            var data = responseData.data;
            dataListBooking = data;
        },
        error: function (e) {
        }
    });
    return dataListBooking;
}

var loadDataBookingStatusChart = function () {
    var chart = {
        self: null,
        rendered: false
    };
    var createDateRangePickers = function (selector) {
        // Check if jQuery included
        if (typeof jQuery == 'undefined') {
            return;
        }

        // Check if daterangepicker included
        if (typeof $.fn.daterangepicker === 'undefined') {
            return;
        }
        var elements = [].slice.call(document.querySelectorAll('#timeFilter[data-target=' + selector + ']'));
        var start = moment();
        var end = moment();

        elements.map(function (element) {
            if (element.getAttribute("data-kt-initialized") === "1") {
                return;
            }
            var display = element.querySelector('div');
            var attrOpens = element.hasAttribute('data-kt-daterangepicker-opens') ? element.getAttribute('data-kt-daterangepicker-opens') : 'left';
            var range = element.getAttribute('data-kt-daterangepicker-range');

            var cb = function (start, end) {
                var current = moment();

                if (display) {
                    if (current.isSame(start, "day") && current.isSame(end, "day")) {
                        display.innerHTML = start.format('DD/MM/YYYY');
                    } else {
                        display.innerHTML = start.format('DD/MM/YYYY') + ' - ' + end.format('DD/MM/YYYY');
                    }
                }


                // sau khi chọn thời gian filer thì xóa bảng cũ
                $("#" + selector).html("");
                // xóa xong gọi lại bảng mới
                initChart(chart);
            }

            if (range === "Hôm nay") {
                start = moment();
                end = moment();
            }

            $(element).daterangepicker({
                startDate: start,
                endDate: end,
                opens: attrOpens,
                ranges: {
                    'Hôm nay': [moment(), moment()],
                    'Hôm qua': [moment().subtract(1, 'day'), moment().subtract(1, 'day')],
                    '7 ngày gần đây': [moment().subtract(6, 'days'), moment()],
                    '30 ngày gần đây': [moment().subtract(29, 'days'), moment()],
                    'Tháng này': [moment().startOf('month'), moment().endOf('month')],
                    'Tháng trước': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
                }
            }, cb);

            cb(start, end);

            element.setAttribute("data-kt-initialized", "1");
        });
    }
    var initChart = async function (chart) {
        var dataArray = await loadDataBookingStatus();
        var serriesArray = [];
        var serriesArrayName = [];
        if (dataArray.length > 0) {
            $("#totalBooking").text(dataArray[0].bookingTotal);
            dataArray.forEach(function (item) {
                if (item.bookingWaitTotal == 0 && item.bookingSuccessTotal == 0 && item.bookingCancelTotal == 0) {
                    serriesArray = [];
                    serriesArrayName = [];
                }
                else {
                    serriesArray.push(item.bookingSuccessTotal);
                    serriesArray.push(item.bookingWaitTotal);
                    serriesArray.push(item.bookingCancelTotal);
                    serriesArrayName.push("Đã tư vấn: " + item.bookingSuccessTotal);
                    serriesArrayName.push("Chờ tư vấn: " + item.bookingWaitTotal);
                    serriesArrayName.push("Hủy tư vấn: " + item.bookingCancelTotal);
                }
            });


        }
        var element = document.getElementById('chartBookingStatus');
        var height = parseInt(KTUtil.css(element, 'height'));
        if (!element) {
            return;
        }

        var options = {
            labels: serriesArrayName,
            series: serriesArray,
            chart: {
                type: 'donut',
                width: '90%',
                height: height,
            },
            dataLabels: {
                enabled: false
            },
            legend: {
                position: "right",
                verticalAlign: "top",
                floating: false,
                containerMargin: {
                    left: 35,
                    right: 60,
                }
            },
            noData: {
                text: 'Không có dữ liệu',
                align: 'center',
                verticalAlign: 'middle',
                offsetX: 0,
                offsetY: 0,
                style: {
                    color: KTUtil.getCssVariableValue('--bs-gray-500'),
                    fontSize: '14px',
                    fontFamily: undefined,
                }
            },
            responsive: [
                {
                    breakpoint: 1300,
                    options: {
                        chart: {
                            width: '100%',
                            height: 150,
                        },
                        legend: {
                            position: "bottom",
                            fontSize: '10px',
                        }
                    }
                }
            ]
        };
        chart.self = new ApexCharts(element, options);
        chart.self.render();
    }

    return {
        init: function () {
            createDateRangePickers("chartBookingStatus");

            // Update chart on theme mode change
            KTThemeMode.on("kt.thememode.change", function () {
                debugger;
                if (chart.rendered) {
                    chart.self.destroy();
                }
                createDateRangePickers("chartBookingStatus");
            });
        }
    }
}();

var loadDataSurveyAccount = async function loadDataSurveyAccount() {
    var timeToFilter = $("#timeFilter[data-target='chartSurvey'] #timeToFilter").html().split('-');
    var startDate = timeToFilter[0];
    var endDate = timeToFilter[1];
    if (endDate == undefined) {
        endDate = startDate
    }
    
    var dataListSurvey;
    await $.ajax({
        url: systemURL + 'surveySectionAccount/api/FilterReport?startDate=' + startDate + '&endDate=' + endDate,
        type: 'GET',
        async: 'true',
        contentType: 'application/json',
        beforeSend: function (xhr) {
            if (localStorage.token) {
                xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.token);
            }
        },
        success: function (responseData) {
            var data = responseData.data[0].surveySectionAccountVMs;
            var totalSurveyAccount = responseData.data[0].totalSurveyAccount;
            $("#total-survey-account").text(totalSurveyAccount);
            dataListSurvey = data;
        },
        error: function (e) {
        }
    });
    return dataListSurvey;
}

var loadDataLogAccount = async function loadDataLogAccount() {
    var timeToFilter = $("#timeFilter[data-target='chartActivity'] #timeToFilter").html().split('-');
    var startDate = timeToFilter[0];
    var endDate = timeToFilter[1];
    if (endDate == undefined) {
        endDate = startDate
    }
    //startDate = formatDatetime(startDate.trim());
    //endDate = formatDatetime(endDate.trim());
    var dataListLog;
    await $.ajax({
        url: systemURL + 'activityLog/api/FilterReport?startDate=' + startDate + '&endDate=' + endDate,
        type: 'GET',
        async: 'true',
        contentType: 'application/json',
        beforeSend: function (xhr) {
            if (localStorage.token) {
                xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.token);
            }
        },
        success: function (responseData) {
            var data = responseData.data;
            dataListLog = data;
        },
        error: function (e) {
        }
    });
    return dataListLog;
}

var loadTitle = async () => {
    var timeToFilter = $("#timeFilter[data-target='chartTitle'] #timeToFilter").html().split('-');
    var startDate = timeToFilter[0];
    var endDate = timeToFilter[1];
    if (endDate == undefined) {
        endDate = startDate
    }
    var dataList;
    await $.ajax({
        url: systemURL + 'forumcategory/api/category-popular?startDate=' + startDate + '&endDate=' + endDate,
        type: 'GET',
        async: 'true',
        contentType: 'application/json',
        beforeSend: function (xhr) {
            if (localStorage.token) {
                xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.token);
            }
        },
        success: function (responseData) {
            var data = responseData.data;
            dataList = data;
        },
        error: function (e) {
        }
    });
    return dataList;
}

var loadPopular = function () {
    var chart = {
        self: null,
        rendered: false
    };
    // Private methods
    var initChart = async function (chart) {
        var dataArray = await loadTitle();
        var arrayValue = [];
        var totalPost = 0;
        var arrayName = [];
        if (dataArray.length > 0) {
            dataArray.forEach((item) => {
                arrayValue.push(item.countPost);
                arrayName.push(item.name);
                totalPost += item.countPost
            })
            $(".totalPost").text(totalPost)
        }
        var element = document.getElementById("chartTitle");
        if (!element) {
            return;
        }

        var labelColor = KTUtil.getCssVariableValue('--bs-gray-800');
        var borderColor = KTUtil.getCssVariableValue('--bs-border-dashed-color');
        var maxValue = 18;

        var options = {
            series: [{
                name: 'bài viết',
                data: arrayValue
            }],
            chart: {
                fontFamily: 'inherit',
                type: 'bar',
                height: 150,
                toolbar: {
                    show: false
                }
            },
            plotOptions: {
                bar: {
                    borderRadius: 8,
                    horizontal: true,
                    distributed: true,
                    barHeight: 50,
                    dataLabels: {
                        position: 'bottom' // use 'bottom' for left and 'top' for right align(textAnchor)
                    }
                }
            },
            dataLabels: {  // Docs: https://apexcharts.com/docs/options/datalabels/
                enabled: true,
                textAnchor: 'start',
                offsetX: 0,
                formatter: function (val, opts) {
                    var val = val;
                    var Format = wNumb({
                        //prefix: '$',
                        //suffix: ',-',
                        thousand: ','
                    });

                    return Format.to(val);
                },
                style: {
                    fontSize: '12px',
                    fontWeight: '600',
                    align: 'left',
                }
            },
            legend: {
                show: false
            },
            xaxis: {
                categories: arrayName,
                labels: {
                    formatter: function (val) {
                        return val
                    },
                    style: {
                        colors: labelColor,
                        fontSize: '11px',
                        fontWeight: '600',
                        align: 'left'
                    }
                },
                axisBorder: {
                    show: false
                }
            },
            yaxis: {
                labels: {
                    formatter: function (val, opt) {
                        if (Number.isInteger(val)) {
                            var percentage = parseInt(val * 100 / maxValue).toString();
                            return val + ' - ' + percentage + '%';
                        } else {
                            return val;
                        }
                    },
                    style: {
                        colors: labelColor,
                        fontSize: '11px',
                        fontWeight: '600'
                    },
                    offsetY: 2,
                    align: 'left'
                }
            },
            grid: {
                borderColor: borderColor,
                xaxis: {
                    lines: {
                        show: true
                    }
                },
                yaxis: {
                    lines: {
                        show: false
                    }
                },
                strokeDashArray: 4
            },
            tooltip: {
                style: {
                    fontSize: '12px'
                },
                y: {
                    formatter: function (val) {
                        return val;
                    }
                }
            }
        };

        chart.self = new ApexCharts(element, options);

        // Set timeout to properly get the parent elements width
        setTimeout(function () {
            chart.self.render();
            chart.rendered = true;
        }, 200);
    }
    var createDateRangePickers = function (selector) {
        // Check if jQuery included
        if (typeof jQuery == 'undefined') {
            return;
        }

        // Check if daterangepicker included
        if (typeof $.fn.daterangepicker === 'undefined') {
            return;
        }
        var elements = [].slice.call(document.querySelectorAll('#timeFilter[data-target=' + selector + ']'));
        var start = moment();
        var end = moment();

        elements.map(function (element) {
            if (element.getAttribute("data-kt-initialized") === "1") {
                return;
            }
            var display = element.querySelector('div');
            var attrOpens = element.hasAttribute('data-kt-daterangepicker-opens') ? element.getAttribute('data-kt-daterangepicker-opens') : 'left';
            var range = element.getAttribute('data-kt-daterangepicker-range');

            var cb = function (start, end) {
                var current = moment();

                if (display) {
                    if (current.isSame(start, "day") && current.isSame(end, "day")) {
                        display.innerHTML = start.format('DD/MM/YYYY');
                    } else {
                        display.innerHTML = start.format('DD/MM/YYYY') + ' - ' + end.format('DD/MM/YYYY');
                    }
                }


                // sau khi chọn thời gian filer thì xóa bảng cũ
                $("#" + selector).html("");
                // xóa xong gọi lại bảng mới
                initChart(chart);
            }

            if (range === "Hôm nay") {
                start = moment();
                end = moment();
            }

            $(element).daterangepicker({
                startDate: start,
                endDate: end,
                opens: attrOpens,
                ranges: {
                    'Hôm nay': [moment(), moment()],
                    'Hôm qua': [moment().subtract(1, 'day'), moment().subtract(1, 'day')],
                    '7 ngày gần đây': [moment().subtract(6, 'days'), moment()],
                    '30 ngày gần đây': [moment().subtract(29, 'days'), moment()],
                    'Tháng này': [moment().startOf('month'), moment().endOf('month')],
                    'Tháng trước': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
                }
            }, cb);

            cb(start, end);

            element.setAttribute("data-kt-initialized", "1");
        });
    }
    // Public methods
    return {
        init: function () {
            createDateRangePickers("chartTitle");

            // Update chart on theme mode change
            KTThemeMode.on("kt.thememode.change", function () {
                if (chart.rendered) {
                    chart.self.destroy();
                }

                createDateRangePickers("chartTitle");
            });
        }
    }
}();

var loadLogAccount = function () {

    var chart = {
        self: null,
        rendered: false
    };
    // Private methods
    var initChart = async function (chart) {
        var dataArray = await loadDataLogAccount();
        var arrayValue = [];
        var arrayName = [];
        if (dataArray.length > 0) {
            $("#totalActivity").text(dataArray[0].totalActivityLog)
            arrayValue.push(dataArray[0].countCouselor);
            arrayValue.push(dataArray[0].countStudent);
            arrayName.push("Tư vấn viên");
            arrayName.push("Học sinh");
        }
        var element = document.getElementById("chartActivity");
        if (!element) {
            return;
        }

        var labelColor = KTUtil.getCssVariableValue('--bs-gray-800');
        var borderColor = KTUtil.getCssVariableValue('--bs-border-dashed-color');
        var maxValue = 18;

        var options = {
            series: [{
                name: 'Lượt',
                data: arrayValue
            }],
            chart: {
                fontFamily: 'inherit',
                type: 'bar',
                height: 150,
                toolbar: {
                    show: false
                }
            },
            plotOptions: {
                bar: {
                    borderRadius: 8,
                    horizontal: true,
                    distributed: true,
                    barHeight: 50,
                    dataLabels: {
                        position: 'bottom' // use 'bottom' for left and 'top' for right align(textAnchor)
                    }
                }
            },
            dataLabels: {  // Docs: https://apexcharts.com/docs/options/datalabels/
                enabled: true,
                textAnchor: 'start',
                offsetX: 0,
                formatter: function (val, opts) {
                    var val = val;
                    var Format = wNumb({
                        //prefix: '$',
                        //suffix: ',-',
                        thousand: ','
                    });

                    return Format.to(val);
                },
                style: {
                    fontSize: '12px',
                    fontWeight: '600',
                    align: 'left',
                }
            },
            legend: {
                show: false
            },
            xaxis: {
                categories: arrayName,
                labels: {
                    formatter: function (val) {
                        return val
                    },
                    style: {
                        colors: labelColor,
                        fontSize: '11px',
                        fontWeight: '600',
                        align: 'left'
                    }
                },
                axisBorder: {
                    show: false
                }
            },
            yaxis: {
                labels: {
                    formatter: function (val, opt) {
                        if (Number.isInteger(val)) {
                            var percentage = parseInt(val * 100 / maxValue).toString();
                            return val + ' - ' + percentage + '%';
                        } else {
                            return val;
                        }
                    },
                    style: {
                        colors: labelColor,
                        fontSize: '11px',
                        fontWeight: '600'
                    },
                    offsetY: 2,
                    align: 'left'
                }
            },
            grid: {
                borderColor: borderColor,
                xaxis: {
                    lines: {
                        show: true
                    }
                },
                yaxis: {
                    lines: {
                        show: false
                    }
                },
                strokeDashArray: 4
            },
            tooltip: {
                style: {
                    fontSize: '12px'
                },
                y: {
                    formatter: function (val) {
                        return val;
                    }
                }
            }
        };

        chart.self = new ApexCharts(element, options);

        // Set timeout to properly get the parent elements width
        setTimeout(function () {
            chart.self.render();
            chart.rendered = true;
        }, 200);
    }
    var createDateRangePickers = function (selector) {
        // Check if jQuery included
        if (typeof jQuery == 'undefined') {
            return;
        }

        // Check if daterangepicker included
        if (typeof $.fn.daterangepicker === 'undefined') {
            return;
        }
        var elements = [].slice.call(document.querySelectorAll('#timeFilter[data-target=' + selector + ']'));
        var start = moment();
        var end = moment();

        elements.map(function (element) {
            if (element.getAttribute("data-kt-initialized") === "1") {
                return;
            }
            var display = element.querySelector('div');
            var attrOpens = element.hasAttribute('data-kt-daterangepicker-opens') ? element.getAttribute('data-kt-daterangepicker-opens') : 'left';
            var range = element.getAttribute('data-kt-daterangepicker-range');

            var cb = function (start, end) {
                var current = moment();

                if (display) {
                    if (current.isSame(start, "day") && current.isSame(end, "day")) {
                        display.innerHTML = start.format('DD/MM/YYYY');
                    } else {
                        display.innerHTML = start.format('DD/MM/YYYY') + ' - ' + end.format('DD/MM/YYYY');
                    }
                }


                // sau khi chọn thời gian filer thì xóa bảng cũ
                $("#" + selector).html("");
                // xóa xong gọi lại bảng mới
                initChart(chart);
            }

            if (range === "Hôm nay") {
                start = moment();
                end = moment();
            }

            $(element).daterangepicker({
                startDate: start,
                endDate: end,
                opens: attrOpens,
                ranges: {
                    'Hôm nay': [moment(), moment()],
                    'Hôm qua': [moment().subtract(1, 'day'), moment().subtract(1, 'day')],
                    '7 ngày gần đây': [moment().subtract(6, 'days'), moment()],
                    '30 ngày gần đây': [moment().subtract(29, 'days'), moment()],
                    'Tháng này': [moment().startOf('month'), moment().endOf('month')],
                    'Tháng trước': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
                }
            }, cb);

            cb(start, end);

            element.setAttribute("data-kt-initialized", "1");
        });
    }
    // Public methods
    return {
        init: function () {
            createDateRangePickers("chartActivity");

            // Update chart on theme mode change
            KTThemeMode.on("kt.thememode.change", function () {
                if (chart.rendered) {
                    chart.self.destroy();
                }

                createDateRangePickers("chartActivity");
            });
        }
    }
}();

var loadChartSurvey = function () {
    var chart = {
        self: null,
        rendered: false
    };
    // Private methods
    var initChart = async function (chart) {
        var dataArray = await loadDataSurveyAccount();
        var arrayDataLow = [];
        var arrayDataNormal = [];
        var arrayDataSeverity = [];
        var arrayDataMedium = [];
        var arrayDataVerrSeverity = [];
        var arrayCategory = [];
        dataArray.forEach(function (item) {
            arrayDataLow.push(
                Math.floor(item.surveyAccountSectionDetailReport.totalScoreLowLevel)
            );
            arrayDataMedium.push(
                Math.floor(item.surveyAccountSectionDetailReport.totalScoreMediumLevel)
            );
            arrayDataNormal.push(
                Math.floor(item.surveyAccountSectionDetailReport.totalScoreNormalLevel)
            );
            arrayDataSeverity.push(
                Math.floor(item.surveyAccountSectionDetailReport.totalScoreSeverityLevel)
            );
            arrayDataVerrSeverity.push(
                Math.floor(item.surveyAccountSectionDetailReport.totalScoreVerySeverityLevel)
            );
            arrayCategory.push(item.type);
        });
        var element = document.getElementById("chartSurvey");
        var height = parseInt(KTUtil.css(element, 'height'));

        if (!element) {
            return;
        }

        var options = {
            series: [{
                name: 'Nhẹ',
                data: arrayDataLow
            }, {
                name: 'Vừa',
                data: arrayDataMedium
                }, {
                    name: 'Bình Thường',
                    data: arrayDataNormal
                }, {
                name: 'Nặng',
                data: arrayDataSeverity
                }, {
                    name: 'Rất Nặng',
                data: arrayDataVerrSeverity
                },],
            chart: {
                type: 'bar',
                height: height,
                stacked: true,
                stackType: '100%',
                toolbar: {
                    show: false
                }
            },
            tooltip: {
                enabled: true,
                y: {
                    formatter: function (value) {
                        return value;
                    }
                }
            },
            plotOptions: {
                bar: {
                    borderRadius: 18,
                }
            },
            responsive: [{
                breakpoint: 480,
                options: {
                    legend: {
                        position: 'bottom',
                        offsetX: -10,
                        offsetY: 0
                    }
                }
            }],
            xaxis: {
                categories: arrayCategory,
            },
            yaxis: {
                labels: {
                    formatter: function (val) {
                        return val + "%"
                    },
                },
                axisBorder: {
                    show: false
                }
            },
            fill: {
                opacity: 1
            },
        };

        var chart = new ApexCharts(element, options);
        chart.render();
    }
    // Public methods
    var createDateRangePickers = function (selector) {
        // Check if jQuery included
        if (typeof jQuery == 'undefined') {
            return;
        }

        // Check if daterangepicker included
        if (typeof $.fn.daterangepicker === 'undefined') {
            return;
        }
        var elements = [].slice.call(document.querySelectorAll('#timeFilter[data-target=' + selector + ']'));
        var start = moment();
        var end = moment();

        elements.map(function (element) {
            if (element.getAttribute("data-kt-initialized") === "1") {
                return;
            }
            var display = element.querySelector('div');
            var attrOpens = element.hasAttribute('data-kt-daterangepicker-opens') ? element.getAttribute('data-kt-daterangepicker-opens') : 'left';
            var range = element.getAttribute('data-kt-daterangepicker-range');

            var cb = function (start, end) {
                var current = moment();

                if (display) {
                    if (current.isSame(start, "day") && current.isSame(end, "day")) {
                        display.innerHTML = start.format('DD/MM/YYYY');
                    } else {
                        display.innerHTML = start.format('DD/MM/YYYY') + ' - ' + end.format('DD/MM/YYYY');
                    }
                }


                // sau khi chọn thời gian filer thì xóa bảng cũ
                $("#" + selector).html("")
                // xóa xong gọi lại bảng mới
                initChart(selector);
            }

            if (range === "Hôm nay") {
                start = moment();
                end = moment();
            }

            $(element).daterangepicker({
                startDate: start,
                endDate: end,
                opens: attrOpens,
                ranges: {
                    'Hôm nay': [moment(), moment()],
                    'Hôm qua': [moment().subtract(1, 'day'), moment().subtract(1, 'day')],
                    '7 ngày gần đây': [moment().subtract(6, 'days'), moment()],
                    '30 ngày gần đây': [moment().subtract(29, 'days'), moment()],
                    'Tháng này': [moment().startOf('month'), moment().endOf('month')],
                    'Tháng trước': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
                }
            }, cb);

            cb(start, end);

            element.setAttribute("data-kt-initialized", "1");
        });
    }

    return {
        init: function () {
            createDateRangePickers("chartSurvey");

            // Update chart on theme mode change
            KTThemeMode.on("kt.thememode.change", function () {
                if (chart.rendered) {
                    chart.self.destroy();
                }
                createDateRangePickers("chartSurvey");
            });
        }
    }
}();

var LoadSatic = async () => {
    var timeToFilter = $("#timeFilter[data-target='chartAll'] #timeToFilter").html().split('-');
    var startDate = timeToFilter[0];
    var endDate = timeToFilter[1];
    if (endDate == undefined) {
        endDate = startDate
    }
    var dataList;
    await $.ajax({
        url: systemURL + 'activityLog/api/GetStatic?startDate=' + startDate + '&endDate=' + endDate,
        type: 'GET',
        async: 'true',
        contentType: 'application/json',
        beforeSend: function (xhr) {
            if (localStorage.token) {
                xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.token);
            }
        },
        success: function (responseData) {
            var data = responseData.data;
            dataList = data;
        },
        error: function (e) {
        }
    });
    return dataList;
}

var LoadSaticLib = async () => {
    var timeToFilter = $("#timeFilter[data-target='chartAll'] #timeToFilter").html().split('-');
    var startDate = timeToFilter[0];
    var endDate = timeToFilter[1];
    if (endDate == undefined) {
        endDate = startDate
    }
    var dataList;
    await $.ajax({
        url: systemURL + 'activityLog/api/GetStaticLib?startDate=' + startDate + '&endDate=' + endDate,
        type: 'GET',
        async: 'true',
        contentType: 'application/json',
        beforeSend: function (xhr) {
            if (localStorage.token) {
                xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.token);
            }
        },
        success: function (responseData) {
            var data = responseData.data;
            dataList = data;
        },
        error: function (e) {
        }
    });
    return dataList;
}

var loadAllStaticChart = function () {
    var chart = {
        self: null,
        rendered: false
    };
    var chartLib = {
        self: null,
        rendered: false
    };
    // Private methods
    var initChart = async function (chart, chartLib) {
        var dataArray = await LoadSatic();
        var arrayValue = [];
        var arrayName = [];
        if (dataArray.length > 0) {
            dataArray.forEach((item) => {
                arrayValue.push(dataArray[0].countWeb);
                arrayValue.push(dataArray[0].countApp);
                arrayValue.push(dataArray[0].countDass);
                arrayValue.push(dataArray[0].countForumWeb);
                arrayValue.push(dataArray[0].countForumApp)
                arrayName.push("Web");
                arrayName.push("APP");
                arrayName.push("DASS21");
                arrayName.push("Web Diễn Đàn");
                arrayName.push("App Diễn Đàn");
            })
        }
        var element = document.getElementById("chartStatic");
        if (!element) {
            return;
        }

        var labelColor = KTUtil.getCssVariableValue('--bs-gray-800');
        var borderColor = KTUtil.getCssVariableValue('--bs-border-dashed-color');
        var maxValue = 18;

        var options = {
            series: [{
                name: 'lượt',
                data: arrayValue
            }],
            chart: {
                fontFamily: 'inherit',
                type: 'bar',
                height: 150,
                toolbar: {
                    show: false
                }
            },
            plotOptions: {
                bar: {
                    borderRadius: 8,
                    horizontal: true,
                    distributed: true,
                    barHeight: 50,
                    dataLabels: {
                        position: 'bottom' // use 'bottom' for left and 'top' for right align(textAnchor)
                    }
                }
            },
            dataLabels: {  // Docs: https://apexcharts.com/docs/options/datalabels/
                enabled: true,
                textAnchor: 'start',
                offsetX: 0,
                formatter: function (val, opts) {
                    var val = val;
                    var Format = wNumb({
                        //prefix: '$',
                        //suffix: ',-',
                        thousand: ','
                    });

                    return Format.to(val);
                },
                style: {
                    fontSize: '12px',
                    fontWeight: '600',
                    align: 'left',
                }
            },
            legend: {
                show: false
            },
            xaxis: {
                categories: arrayName,
                labels: {
                    formatter: function (val) {
                        return val
                    },
                    style: {
                        colors: labelColor,
                        fontSize: '11px',
                        fontWeight: '600',
                        align: 'left'
                    }
                },
                axisBorder: {
                    show: false
                }
            },
            yaxis: {
                labels: {
                    formatter: function (val, opt) {
                        if (Number.isInteger(val)) {
                            var percentage = parseInt(val * 100 / maxValue).toString();
                            return val + ' - ' + percentage + '%';
                        } else {
                            return val;
                        }
                    },
                    style: {
                        colors: labelColor,
                        fontSize: '11px',
                        fontWeight: '600'
                    },
                    offsetY: 2,
                    align: 'left'
                }
            },
            grid: {
                borderColor: borderColor,
                xaxis: {
                    lines: {
                        show: true
                    }
                },
                yaxis: {
                    lines: {
                        show: false
                    }
                },
                strokeDashArray: 4
            },
            tooltip: {
                style: {
                    fontSize: '12px'
                },
                y: {
                    formatter: function (val) {
                        return val;
                    }
                }
            }
        };

        chart.self = new ApexCharts(element, options);

        // Set timeout to properly get the parent elements width
        setTimeout(function () {
            chart.self.render();
            chart.rendered = true;
        }, 200);
        //ChartLib
        var dataArrayLib = await LoadSaticLib();
        var arrayValueLib = [];
        var arrayNameLib = [];
        if (dataArrayLib.length > 0) {
            dataArrayLib.forEach((item) => {
                arrayValueLib.push(dataArrayLib[0].count30);
                arrayValueLib.push(dataArrayLib[0].countGendel);
                arrayValueLib.push(dataArrayLib[0].countLife)
                arrayValueLib.push(dataArrayLib[0].countSKTT)
                arrayValueLib.push(dataArrayLib[0].countSkill)
                arrayValueLib.push(dataArrayLib[0].countStudy)
                arrayNameLib.push("Thư Viện 30 ngày");
                arrayNameLib.push("Thư Viện Giới Tính");
                arrayNameLib.push("Thư Viện Cuộc Sống Trường Học");
                arrayNameLib.push("Thư Viện SKTT");
                arrayNameLib.push("Thư Viện Kỹ Năng");
                arrayNameLib.push("Thư Viện Tài Liệu Học Tập");
            })
        }
        var elementLib = document.getElementById("chartStaticLib");
        if (!elementLib) {
            return;
        }

        var optionsLib = {
            series: [{
                name: 'lượt',
                data: arrayValueLib
            }],
            chart: {
                fontFamily: 'inherit',
                type: 'bar',
                height: 150,
                toolbar: {
                    show: false
                }
            },
            plotOptions: {
                bar: {
                    borderRadius: 8,
                    horizontal: true,
                    distributed: true,
                    barHeight: 50,
                    dataLabels: {
                        position: 'bottom' // use 'bottom' for left and 'top' for right align(textAnchor)
                    }
                }
            },
            dataLabels: {  // Docs: https://apexcharts.com/docs/options/datalabels/
                enabled: true,
                textAnchor: 'start',
                offsetX: 0,
                formatter: function (val, opts) {
                    var val = val;
                    var Format = wNumb({
                        //prefix: '$',
                        //suffix: ',-',
                        thousand: ','
                    });

                    return Format.to(val);
                },
                style: {
                    fontSize: '12px',
                    fontWeight: '600',
                    align: 'left',
                }
            },
            legend: {
                show: false
            },
            xaxis: {
                categories: arrayNameLib,
                labels: {
                    formatter: function (val) {
                        return val
                    },
                    style: {
                        colors: labelColor,
                        fontSize: '11px',
                        fontWeight: '600',
                        align: 'left'
                    }
                },
                axisBorder: {
                    show: false
                }
            },
            yaxis: {
                labels: {
                    formatter: function (val, opt) {
                        if (Number.isInteger(val)) {
                            var percentage = parseInt(val * 100 / maxValue).toString();
                            return val + ' - ' + percentage + '%';
                        } else {
                            return val;
                        }
                    },
                    style: {
                        colors: labelColor,
                        fontSize: '11px',
                        fontWeight: '600'
                    },
                    offsetY: 2,
                    align: 'left'
                }
            },
            grid: {
                borderColor: borderColor,
                xaxis: {
                    lines: {
                        show: true
                    }
                },
                yaxis: {
                    lines: {
                        show: false
                    }
                },
                strokeDashArray: 4
            },
            tooltip: {
                style: {
                    fontSize: '12px'
                },
                y: {
                    formatter: function (val) {
                        return val;
                    }
                }
            }
        };

        chartLib.self = new ApexCharts(elementLib, optionsLib);

        // Set timeout to properly get the parent elements width
        setTimeout(function () {
            chartLib.self.render();
            chartLib.rendered = true;
        }, 200);

      
    }
    var createDateRangePickers = function (selector) {
        // Check if jQuery included
        if (typeof jQuery == 'undefined') {
            return;
        }

        // Check if daterangepicker included
        if (typeof $.fn.daterangepicker === 'undefined') {
            return;
        }
        var elements = [].slice.call(document.querySelectorAll('#timeFilter[data-target=' + selector + ']'));
        var start = moment();
        var end = moment();

        elements.map(function (element) {
            if (element.getAttribute("data-kt-initialized") === "1") {
                return;
            }
            var display = element.querySelector('div');
            var attrOpens = element.hasAttribute('data-kt-daterangepicker-opens') ? element.getAttribute('data-kt-daterangepicker-opens') : 'left';
            var range = element.getAttribute('data-kt-daterangepicker-range');

            var cb = function (start, end) {
                var current = moment();

                if (display) {
                    if (current.isSame(start, "day") && current.isSame(end, "day")) {
                        display.innerHTML = start.format('DD/MM/YYYY');
                    } else {
                        display.innerHTML = start.format('DD/MM/YYYY') + ' - ' + end.format('DD/MM/YYYY');
                    }
                }


                // sau khi chọn thời gian filer thì xóa bảng cũ
                $("#chartStatic").html("");

                $("#chartStaticLib").html("");

                if (chart.rendered) {
                    chart.self.destroy();
                }
                if (chartLib.rendered) {
                    chartLib.self.destroy();
                }
                // xóa xong gọi lại bảng mới
                initChart(chart, chartLib);
            }

            if (range === "Hôm nay") {
                start = moment();
                end = moment();
            }

            $(element).daterangepicker({
                startDate: start,
                endDate: end,
                opens: attrOpens,
                ranges: {
                    'Hôm nay': [moment(), moment()],
                    'Hôm qua': [moment().subtract(1, 'day'), moment().subtract(1, 'day')],
                    '7 ngày gần đây': [moment().subtract(6, 'days'), moment()],
                    '30 ngày gần đây': [moment().subtract(29, 'days'), moment()],
                    'Tháng này': [moment().startOf('month'), moment().endOf('month')],
                    'Tháng trước': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
                }
            }, cb);

            cb(start, end);

            element.setAttribute("data-kt-initialized", "1");
        });
    }
    // Public methods
    return {
        init: function () {
            createDateRangePickers("chartAll");

            // Update chart on theme mode change
            KTThemeMode.on("kt.thememode.change", function () {
                if (chart.rendered) {
                    chart.self.destroy();
                }
                if (chartLib.rendered) {
                    chartLib.self.destroy();
                }
                createDateRangePickers("chartStatic");
            });
        }
    }
}();

$("#exportExcel").click(async function (e) {
    var timeToFilter = $("#timeFilter[data-target='chartAll'] #timeToFilter").html().split('-');
    var startDate = timeToFilter[0];
    var endDate = timeToFilter[1];
    if (endDate == undefined) {
        endDate = startDate
    }
    $.ajax({
        url: systemURL + 'activityLog/api/export-excel?startDate=' + startDate + '&endDate=' + endDate,
        type: "GET",
        contentType: "application/json",
        success: function (res) {
            if (!res.status == 200) {
                Swal.fire(
                    'Danh sách ứng viên!',
                    'Không có dữ liệu để xuất Excel.',
                    'warning'
                );
            }
            else {
                window.location = systemURL + "activityLog/api/download-excel?fileGuid=" + res.resources.fileGuid + "&fileName=" + res.resources.fileName;
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









