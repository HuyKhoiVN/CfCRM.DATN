/*!
  * Tempus Dominus v6.2.10 (https://getdatepicker.com/)
  * Copyright 2013-2022 Jonathan Peterson
  * Licensed under MIT (https://github.com/Eonasdan/tempus-dominus/blob/master/LICENSE)
  */
(function(g,f){typeof exports==='object'&&typeof module!=='undefined'?f(exports):typeof define==='function'&&define.amd?define(['exports'],f):(g=typeof globalThis!=='undefined'?globalThis:g||self,f((g.tempusDominus=g.tempusDominus||{},g.tempusDominus.locales=g.tempusDominus.locales||{},g.tempusDominus.locales.vi={})));})(this,(function(exports){'use strict';const name = 'vi';
const localization = {
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
        L: 'dd.MM.yyyy',
        LL: 'd MMMM yyyy',
        LLL: 'd MMMM yyyy HH:mm',
        LLLL: 'dddd, d MMMM yyyy HH:mm',
    },
    ordinal: (n) => `${n}.`,
    format: 'L LT',
};exports.localization=localization;exports.name=name;Object.defineProperty(exports,'__esModule',{value:true});}));