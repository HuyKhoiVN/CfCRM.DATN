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
var VIlocalizationHour = {
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
    format: 'LT',
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
            minutes: true,
            seconds: true
        }
    },
    localization: VIlocalization
};

var hourAndMinutePickerOption = {
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
            minutes: true,
            seconds: false
        }
    },
    localization: VIlocalizationHour
};
