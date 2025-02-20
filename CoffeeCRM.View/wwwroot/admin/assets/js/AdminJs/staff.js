var showItem = [
  'id',
  'accountStatusId',
  'accountTypeId',
  'username',
  'password',
  'fullName',
  'firstName',
  'middleName',
  'lastName',
  'photo',
  'idCardNumber',
  'googleId',
  'facebookId',
  'idCardNumberPhoto1',
  'idCardNumberPhoto2',
  'doB',
  'zipCode',
  'addressCity',
  'addressDistrictt',
  'addressWard',
  'addressDetail',
  'accessFailedCount',
  'lockoutEnabled',
  'lockoutEndDate',
  'createdTime',
  'search',
  'roleId',
];
const enableBtnSubmit = () => {
  submitButton.setAttribute('data-kt-indicator', 'off');
  submitButton.disabled = false;
};
var onChangePassword = false;
var dataSource = [];
var updatingItemId = 0;
var editObj;
var tableUpdating = 0;
var table;
let regexPhone = /^((84|0)[3|5|7|8|9])\d{8}\b/;
let regexUserName = /^(?=.*[a-zA-Z])[a-zA-Z0-9_.]+$/;
let regexFullName = /^[a-zA-ZÀ-Ỹà-ỹ\s']+$/;
let regexEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
const submitButton = document.getElementById('btnUpdateItem');
submitButton.addEventListener('click', function (e) {
  e.preventDefault();
  submitButton.setAttribute('data-kt-indicator', 'on');
  // Disable button to avoid multiple click
  submitButton.disabled = true;
  // Simulate form submission. For more info check the plugin's official documentation: https://sweetalert2.github.io/
  updateItem(updatingItemId);
});
$('#search-input').on('input', function () {
  table.search($(this).val()).draw();
});
function formatPhoneNumber(phoneNumberString) {
  var cleaned = ('' + phoneNumberString).replace(/\D/g, '');
  var match = cleaned.match(/^(\d{4})(\d{3})(\d{3})$/);
  if (match) {
    return match[1] + ' ' + match[2] + ' ' + match[3];
  }
  return '';
}
function getListWard() {
  return new Promise(function (resolve, reject) {
    $('#account-addressWard').empty();
    let districtId = $('#account-addressDistrictt').val();
    $.ajax({
      url: systemURL + `ward/api/listbyparentid/${districtId}`,
      type: 'GET',
      async: true,
      contentType: 'application/json',
      success: function (responseData) {
        // debugger;
        if (responseData.status == 200 && responseData.message === 'SUCCESS') {
          let wardData = responseData.data;
          wardData.forEach(function (item) {
            $('#account-addressWard').append(
              new Option(item.name, item.id, false, false)
            );
          });
          resolve(); // Giải quyết promise khi dữ liệu đã được tải thành công
        } else {
          reject('Không thể lấy dữ liệu phường/xã.'); // Từ chối promise nếu có lỗi
        }
      },
      error: function (e) {
        reject('Lỗi khi gọi API lấy dữ liệu phường/xã.'); // Từ chối promise nếu có lỗi
      },
    });
  });
}

function getListDistrict() {
  return new Promise(function (resolve, reject) {
    let provinceId = $('#account-addressCity').val();
    $('#account-addressDistrictt').empty();
    $('#account-addressWard').empty();
    $.ajax({
      url: systemURL + `district/api/listbyparentid/${provinceId}`,
      type: 'GET',
      async: true,
      contentType: 'application/json',
      success: function (responseData) {
        // debugger;
        if (responseData.status == 200 && responseData.message === 'SUCCESS') {
          let districtData = responseData.data;
          districtData.forEach(function (item, index) {
            if (index == districtData.length - 1) {
              $('#account-addressDistrictt')
                .append(new Option(item.name, item.id, false, false))
                .trigger('change');
            } else {
              $('#account-addressDistrictt').append(
                new Option(item.name, item.id, false, false)
              );
            }
          });
          resolve(); // Giải quyết promise khi dữ liệu đã được tải thành công
        } else {
          reject('Không thể lấy dữ liệu quận/huyện.'); // Từ chối promise nếu có lỗi
        }
      },
      error: function (e) {
        reject('Lỗi khi gọi API lấy dữ liệu quận/huyện.'); // Từ chối promise nếu có lỗi
      },
    });
  });
}
function getProvince() {
  var provinceData = [];
  $.ajax({
    url: systemURL + 'province/api/list',
    type: 'GET',
    async: 'true',
    contentType: 'application/json',
    success: function (responseData) {
      // debugger;
      var data = responseData.data;
      provinceData = data;
      provinceData.forEach(function (item) {
        $('#account-addressCity').append(
          new Option(item.name, item.id, false, false)
        );
      });
    },
    error: function (e) {
      //console.log(e.message);
    },
  });
}

$(document).ready(function () {
  // Load data

  loadData();
  getProvince();
  getListDistrict();
  getListWard();
  $('#account-addressCity').change(() => {
    getListDistrict();
  });
  $('#account-addressDistrictt').change(() => {
    getListWard();
  });

  //getListDistrict();
  // Datetime picker
  document.querySelectorAll('.datepicker').forEach(function (item) {
    new tempusDominus.TempusDominus(item, datePickerOption);
  });
  $('.datepicker').on('dp.change', function (e) {
    // console.log(this.value);
    this.value = moment(this.value).format('YYYY-MM-DD HH:mm:ss');
    // console.log(this.value);
  });
  //Flat pickr format
  $('#filterCreatedTime_input').flatpickr({
    dateFormat: 'd/m/Y',
    mode: 'range',
  });
  $('#open-flatpickr').click(function () {
    $('#filterCreatedTime_input').click();
  });
  $('#clear-flatpickr').click(function () {
    $('#filterCreatedTime_input').val('');
  });

  $('#filterDoB_input').flatpickr({
    dateFormat: 'd/m/Y',
    mode: 'range',
  });
  $('#account-doB').flatpickr({
    dateFormat: 'd/m/Y',
  });
  $('#open-flatpickr-DoB').click(function () {
    $('#filterDoB_input').click();
  });
  $('#clear-flatpickr-DoB').click(function () {
    $('#filterDoB_input').val('');
  });

  $('#filterLockoutEndDate_input').flatpickr({
    dateFormat: 'd/m/Y',
    mode: 'range',
  });
  $('#open-flatpickr-LockoutEndDate').click(function () {
    $('#filterLockoutEndDate_input').click();
  });
  $('#clear-flatpickr-LockoutEndDate').click(function () {
    $('#filterLockoutEndDate_input').val('');
  });

  $('.dataSelect').select2();

  $('#btnTableSearch').click(function () {
    tableSearch();
  });

  $('#tableData thead:nth-child(2) tr th input').keypress(function (e) {
    let key = e.which;
    if (key == 13) {
      $('#btnTableSearch').click();
    }
  });
  $('#btnTableResetSearch').click(function () {
    $('.tableheaderFillter').val('').trigger('change');
    tableSearch();
  });
  $('#reset_Password').click(() => {
    $('#account-password').prop('disabled', false);
    onChangePassword = true;
  });
  $('#account-roleId').on('change', function () {
    if ($('#account-roleId').val() == 1003) {
      // 1003 - SALER
      $('#account-warehouse-box').css('display', 'none');
    } else {
      $('#account-warehouse-box').css('display', 'block');
    }
  });
});

function loadData() {
  initTable();
}
function customBagdeColor(color) {
  var percent = 80;
  var fontColor = '';
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

  return (
    '#' +
    (0 | ((1 << 8) + r + ((256 - r) * percent) / 100)).toString(16).substr(1) +
    (0 | ((1 << 8) + g + ((256 - g) * percent) / 100)).toString(16).substr(1) +
    (0 | ((1 << 8) + b + ((256 - b) * percent) / 100)).toString(16).substr(1)
  );
}
function initTable() {
  table = $('#tableData').DataTable({
    processing: true,
    serverSide: true,
    paging: true,
    searching: { regex: true },
    order: [5, 'desc'],
    oLanguage: {
      sUrl: '/js/Vietnamese.json',
    },
    ajax: {
      url: systemURL + 'account/api/list-server-side',
      type: 'POST',
      contentType: 'application/json',
      dataType: 'json',
      data: function (d) {
        d.searchAll = $('#search-input').val();
        d.accountStatusIds = $('#filterAccountStatusId').val();
        d.accountTypeIds = $('#filterAccountTypeId').val();
        d.roleIds = $('#filterRoleId').val();
        return JSON.stringify(d);
      },
    },
    columns: [
      {
        data: 'id',
        render: function (data, type, row, meta) {
          var info = table.page.info();
          var stt = meta.row + 1 + info.page * info.length;
          return stt; // This contains the row index
        },
      },
      {
        data: 'fullName',
        render: function (data, type, row, meta) {
          return ` <div style='display: flex; flex-direction: row; gap: 10px; align-content: center'>
                                 <div>
                                     <img class='accountPhoto' height='32' width='32' src='${
                                       row.photo != null && row.photo != ''
                                         ? row.photo
                                         : '/images/userdefault.jpg'
                                     }' alt='User'>
                                 </div>
                                 <div style= 'display: flex; flex-direction:column; gap: 4px;width: 100%;'>
                                     <span style='line-height: 14.7px;' class='fs-14' id='row1001-column-id'>${
                                       row.fullName
                                     }</span>
                                     <strong>
                                     <p style='display: flex;flex-direction: row;justify-content: space-between;width: 100%;font-size:12px;line-height: 12.6px; color: #044688; margin: 0;text-wrap: nowrap;'>
                                     <span style='display: inline-block; min-width: 111px; font-size:12px; color: #044688; text-wrap:wrap;'>${
                                       row.roleName
                                     }</span> MS: ${row.zipCode}
                                     </p>
                                     </strong>
                                 </div>
                             </div>`;
        },
      },
      //mb-7 fv-plugins-icon-container
      //fw-semibold fs-6 mb-2
      {
        data: 'phone',
        render: function (data, type, row, meta) {
          return (
            "<span id='row" +
            row.id +
            "-column-id'>" +
            formatPhoneNumber(data) +
            '<span>'
          );
        },
      },
      {
        data: 'username',
        render: function (data, type, row, meta) {
          return "<span id='row" + row.id + "-column-id'>" + data + '<span>';
        },
      },
      {
        data: 'accountStatusId',
        render: function (data, type, row, meta) {
          return `<span id="row${
            row.id
          }-column-id" class="badge py-3 px-4" style="color:${
            row.accountStatusColor
          }; background-color:${customBagdeColor(
            row.accountStatusColor
          )}; font-size: 13px">${row.accountStatusName}<span></span></span>`;
        },
      },
      {
        data: 'createdTime',
        render: function (data) {
          var tempDate = new Date(data);
          var displayValue = moment(data).format('DD/MM/YYYY HH:mm:ss');
          return displayValue;
        },
      },
      {
        data: 'id',
        render: function (data, type, row, meta) {
          return (
            "<div class='d-flex justify-content-center gap-2'>" +
            "<a title='Cập nhật' onclick='editItem(" +
            row.id +
            ")' class='me-2 btn_manage'><span class='svg-icon-success svg-icon  svg-icon-1 svg_teh009'><span class='svg-icon-primary svg-icon  svg-icon-1'> <svg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'><path opacity='0.3' fill-rule='evenodd' clip-rule='evenodd' d='M2 4.63158C2 3.1782 3.1782 2 4.63158 2H13.47C14.0155 2 14.278 2.66919 13.8778 3.04006L12.4556 4.35821C11.9009 4.87228 11.1726 5.15789 10.4163 5.15789H7.1579C6.05333 5.15789 5.15789 6.05333 5.15789 7.1579V16.8421C5.15789 17.9467 6.05333 18.8421 7.1579 18.8421H16.8421C17.9467 18.8421 18.8421 17.9467 18.8421 16.8421V13.7518C18.8421 12.927 19.1817 12.1387 19.7809 11.572L20.9878 10.4308C21.3703 10.0691 22 10.3403 22 10.8668V19.3684C22 20.8218 20.8218 22 19.3684 22H4.63158C3.1782 22 2 20.8218 2 19.3684V4.63158Z' fill='currentColor'></path><path d='M10.9256 11.1882C10.5351 10.7977 10.5351 10.1645 10.9256 9.77397L18.0669 2.6327C18.8479 1.85165 20.1143 1.85165 20.8953 2.6327L21.3665 3.10391C22.1476 3.88496 22.1476 5.15129 21.3665 5.93234L14.2252 13.0736C13.8347 13.4641 13.2016 13.4641 12.811 13.0736L10.9256 11.1882Z' fill='currentColor'></path><path d='M8.82343 12.0064L8.08852 14.3348C7.8655 15.0414 8.46151 15.7366 9.19388 15.6242L11.8974 15.2092C12.4642 15.1222 12.6916 14.4278 12.2861 14.0223L9.98595 11.7221C9.61452 11.3507 8.98154 11.5055 8.82343 12.0064Z' fill='currentColor'></path></svg></span></span></a>" +
            "<a title='Cập nhật' onclick='deleteItem(" +
            row.id +
            ")' class='me-2 btn_manage'><span class='svg-icon-success svg-icon  svg-icon-1 svg_teh009'><span class='svg-icon-danger svg-icon  svg-icon-1'><svg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M5 9C5 8.44772 5.44772 8 6 8H18C18.5523 8 19 8.44772 19 9V18C19 19.6569 17.6569 21 16 21H8C6.34315 21 5 19.6569 5 18V9Z' fill='currentColor'></path><path opacity='0.5' d='M5 5C5 4.44772 5.44772 4 6 4H18C18.5523 4 19 4.44772 19 5V5C19 5.55228 18.5523 6 18 6H6C5.44772 6 5 5.55228 5 5V5Z' fill='currentColor'></path><path opacity='0.5' d='M9 4C9 3.44772 9.44772 3 10 3H14C14.5523 3 15 3.44772 15 4V4H9V4Z' fill='currentColor'></path></svg></span></a>"
          );
        },
      },
    ],
    error: function (error) {
      debugger;
      self.notFound = true;
    },
    columnDefs: [
      { targets: 'no-sort', orderable: false },
      { targets: 'no-search', searchable: false },
      { orderable: false, targets: [-1, 0] },
    ],
    //order: [[5, 'desc']],
    aLengthMenu: [
      [10, 25, 50, 100],
      [10, 25, 50, 100],
    ],
    drawCallback: function () {
      $('#tableData tfoot').html('');
      $('#tableData thead:nth-child(1) tr')
        .clone(true)
        .appendTo('#tableData tfoot');
      $('#tableData tfoot tr').addClass('border-top');
    },
  });
}

async function editItem(id) {
  onChangePassword = false;
  updatingItemId = id;
  $('#modal-id').modal('show');
  $('#account-addressDistrictt').empty();
  $('#account-addressWard').empty();
  $('#account-password').val('');
  if (id > 0) {
    editObj = await getItemById(id);
    $('#reset_Password').removeClass('d-none');
    $('#account-password').prop('disabled', true);
    //$("#account-password").attr('type', 'password')
    $('#account-accountTypeId')
      .val(id > 0 ? editObj.accountTypeId : '')
      .trigger('change');
    $('#modal-title-edit').html('Cập nhật nhân sự');
  } else if (id == 0) {
    $('#modal-title-edit').html('Tạo mới nhân sự');
    $('#account-accountTypeId').val(1002).trigger('change');
    $('#account-addressDistrictt').empty();
    $('#account-password').prop('disabled', false);
    //$("#account-password").attr('type', 'text')
    $('#account-addressWard').empty();
    $('#reset_Password').addClass('d-none');
  }
  $('#account-id').val(id > 0 ? editObj.id : '0');
  $('#account-accountStatusId')
    .val(id > 0 ? editObj.accountStatusId : '')
    .trigger('change');
  $('#account-username').val(id > 0 ? editObj.username : '');
  //$("#account-password").val(id > 0 ? editObj.password : "");
  $('#account-fullName').val(id > 0 ? editObj.fullName : '');
  $('#account-firstName').val(id > 0 ? editObj.firstName : '');
  $('#account-middleName').val(id > 0 ? editObj.middleName : '');
  $('#account-lastName').val(id > 0 ? editObj.lastName : '');
  $('#account-photo').val(id > 0 ? editObj.photo : '');
  $('#account-description').val(id > 0 ? editObj.description : '');
  $('#account-info').val(id > 0 ? editObj.info : '');
  $('#account-idCardNumber').val(id > 0 ? editObj.idCardNumber : '');
  $('#account-googleId').val(id > 0 ? editObj.googleId : '');
  $('#account-facebookId').val(id > 0 ? editObj.facebookId : '');
  $('#account-idCardNumberPhoto1').val(
    id > 0 ? editObj.idCardNumberPhoto1 : ''
  );
  $('#account-idCardNumberPhoto2').val(
    id > 0 ? editObj.idCardNumberPhoto2 : ''
  );
  $('#account-doB').val(
    id > 0
      ? moment(editObj.doB).format('DD/MM/YYYY')
      : moment(new Date()).format('DD/MM/YYYY')
  );
  $('#account-zipCode').val(id > 0 ? editObj.zipCode : '');
  $('#account-warehouse')
    .val(id > 0 ? editObj.warehouseId : '')
    .trigger('change');
  $('#account-addressCity')
    .val(id > 0 ? editObj.addressCity : '')
    .trigger('change');
  if (id > 0 && editObj.addressDistrict && editObj.addressWard) {
    $.when(getListDistrict()).done(async function () {
      $('#account-addressDistrictt')
        .val(editObj.addressDistrict)
        .trigger('change');
      $.when(getListWard()).done(async function () {
        $('#account-addressWard').val(editObj.addressWard).trigger('change');
      });
    });
  }
  $('#account-addressDetail').val(id > 0 ? editObj.addressDetail : '');
  $('#account-active').val(id > 0 ? editObj.active : '');
  $('#account-accessFailedCount').val(id > 0 ? editObj.accessFailedCount : '');
  $('#account-lockoutEnabled').val(id > 0 ? editObj.lockoutEnabled : '');
  $('#account-lockoutEndDate').val(
    id > 0
      ? moment(editObj.lockoutEndDate).format('DD/MM/YYYY HH:mm:ss')
      : moment(new Date()).format('DD/MM/YYYY HH:mm:ss')
  );
  $('#account-createdTime').val(
    id > 0
      ? moment(editObj.createdTime).format('DD/MM/YYYY HH:mm:ss')
      : moment(new Date()).format('DD/MM/YYYY HH:mm:ss')
  );
  $('#account-search').val(id > 0 ? editObj.search : '');
  $('#account-roleId')
    .val(id > 0 ? editObj.roleId : '')
    .trigger('change');
  $('#account-phone').val(id > 0 ? editObj.phone : '');
  $('#account-photo').attr('file-path', id > 0 ? editObj.photo : '');
  $('#account-email').val(id > 0 ? editObj.email : '');

  $('#account-photo')
    .attr(
      'src',
      id > 0 && editObj.photo != undefined && editObj.photo.trim() != ''
        ? editObj.photo
        : '/assets/media/images/blog/NoImage.png'
    )
    .trigger('change');
}
function validateInput(id) {
  let updatingItemId = id;
  let idStatus = $('#account-accountStatusId').val();
  let idType = $('#account-accountTypeId').val();
  let idRole = $('#account-roleId').val();
  let idStaff = $('#account-zipCode').val();
  let userName = $('#account-username').val();
  let password = $('#account-password').val();
  let fullName = $('#account-fullName').val();
  let phone = $('#account-phone').val();
  let wareHouse = $('#account-warehouse').val();
  let email = $('#account-email').val();
  var errorList = [];
  if (idStaff == '') {
    errorList.push('Mã nhân viên không được để trống.');
  }
  if (idStatus == null) {
    errorList.push('Trạng thái tài khoản không được để trống.');
  }
  if (idType == null) {
    errorList.push('Loại tài khoản không được để trống.');
  }
  if (idRole == null) {
    errorList.push('Quyền không được để trống.');
  }
  if (wareHouse == null && idRole != 1003) {
    errorList.push('Kho làm việc không được để trống.');
  }
  if (userName == '') {
    errorList.push('Tên tài khoản không được để trống.');
  } else if (!userName.match(regexUserName)) {
    errorList.push('Tên tài khoản không được chứa kí tự đặc biệt.');
  }
  if (password == '' && id == 0) {
    errorList.push('Mật khẩu không được để trống.');
  } else if (
    (password.length < 6 && id == 0) ||
    (onChangePassword && password.length < 6)
  ) {
    errorList.push('Mật khẩu phải có ít nhất 6 kí tự.');
  }
  if (fullName == '') {
    errorList.push('Họ và tên không được để trống.');
  } else if (!fullName.match(regexFullName)) {
    errorList.push('Họ và tên không được chứa kí tự đặc biệt.');
  }
  if (fullName.length > 255) {
    errorList.push('Họ và tên có độ dài tối đa là 255 ký tự.');
  }
  if (email == '') {
    errorList.push('Email không được để trống.');
  } else if (!email.match(regexEmail)) {
    errorList.push('Email không hợp lệ.');
  }
  if (phone == '') {
    errorList.push('Số điện thoại được để trống.');
  } else if (!phone.match(regexPhone)) {
    errorList.push('Số điện thoại không hợp lệ.');
  }

  if (errorList.length > 0) {
    var contentError = '<ul>';
    errorList.forEach(function (item, index) {
      contentError += "<li class='text-start'>" + item + '</li>';
    });
    contentError += '</ul>';
    var swalSubTitle =
      "<p class='swal__admin__subtitle'>" +
      (updatingItemId > 0 ? 'Cập nhật' : 'Thêm mới') +
      ' không thành công</p>';

    Swal.fire('Quản lý nhân sự' + swalSubTitle, contentError, 'warning');
    enableBtnSubmit();
    return false;
  } else {
    return true;
  }
}

function convertDateFormat(dateString) {
  const [day, month, year] = dateString.split('/');
  return `${year}-${month}-${day}`;
}
async function updateItem(id) {
  var actionName = id == 0 ? 'Bạn muốn tạo mới' : 'Cập nhật';
  var obj;
  if (id > 0) {
    obj = await getItemById(id);
  }
  let filePath = $('#account-photo').attr('file-path') || '';
  let objName = id > 0 ? obj.fullName : 'nhân viên';
  //validateInputNumber(id);
  let formattedDob = convertDateFormat($('#account-doB').val());
  var updatingObj =
    id == 0
      ? {
          accountStatusId: Number($('#account-accountStatusId').val()),
          accountTypeId: Number($('#account-accountTypeId').val()),
          username: $('#account-username').val(),
          password: $('#account-password').val(),
          fullName: $('#account-fullName').val(),
          photo: filePath,
          firstName: $('#account-firstName').val(),
          middleName: $('#account-middleName').val(),
          lastName: $('#account-lastName').val(),
          photo: $('#account-photo').val(),
          description: $('#account-description').val(),
          info: $('#account-info').val(),
          idCardNumber: $('#account-idCardNumber').val(),
          googleId: $('#account-googleId').val(),
          facebookId: $('#account-facebookId').val(),
          idCardNumberPhoto1: $('#account-idCardNumberPhoto1').val(),
          idCardNumberPhoto2: $('#account-idCardNumberPhoto2').val(),
          doB: formattedDob,
          //"doB": $("#account-doB").val(),
          zipCode: $('#account-zipCode').val(),
          addressCity: $('#account-addressCity').val(),
          addressDistrict: $('#account-addressDistrictt').val(),
          addressWard: $('#account-addressWard').val(),
          addressDetail: $('#account-addressDetail').val(),
          email: $('#account-email').val(),
          active: 1,
          accessFailedCount: $('#account-accessFailedCount').val(),
          lockoutEnabled: $('#account-lockoutEnabled').val(),
          lockoutEndDate: $('#account-lockoutEndDate').val(),
          createdTime: $('#account-createdTime').val(),
          search: $('#account-search').val(),
          roleId: Number($('#account-roleId').val()),
          phone: $('#account-phone').val(),
          warehouseId:
            $('#account-warehouse').val() != null &&
            Number($('#account-roleId').val()) != 1003
              ? Number($('#account-warehouse').val())
              : 0,
        }
      : {
          id: $('#account-id').val(),
          accountStatusId: Number($('#account-accountStatusId').val()),
          accountTypeId: Number($('#account-accountTypeId').val()),
          username: $('#account-username').val(),
          password: $('#account-password').val(),
          fullName: $('#account-fullName').val(),
          firstName: $('#account-firstName').val(),
          middleName: $('#account-middleName').val(),
          lastName: $('#account-lastName').val(),
          photo: filePath,
          description: $('#account-description').val(),
          info: $('#account-info').val(),
          idCardNumber: $('#account-idCardNumber').val(),
          googleId: $('#account-googleId').val(),
          facebookId: $('#account-facebookId').val(),
          idCardNumberPhoto1: $('#account-idCardNumberPhoto1').val(),
          idCardNumberPhoto2: $('#account-idCardNumberPhoto2').val(),
          doB: formattedDob,
          //"doB": $("#account-doB").val(),
          zipCode: $('#account-zipCode').val(),
          addressCity: $('#account-addressCity').val(),
          addressDistrict: $('#account-addressDistrictt').val(),
          addressWard: $('#account-addressWard').val(),
          addressDetail: $('#account-addressDetail').val(),
          email: $('#account-email').val(),
          active: 1,
          accessFailedCount: $('#account-accessFailedCount').val(),
          lockoutEnabled: $('#account-lockoutEnabled').val(),
          lockoutEndDate: $('#account-lockoutEndDate').val(),
          search: $('#account-search').val(),
          roleId: Number($('#account-roleId').val()),
          phone: $('#account-phone').val(),
          warehouseId:
            $('#account-warehouse').val() != null &&
            Number($('#account-roleId').val()) != 1003
              ? Number($('#account-warehouse').val())
              : 0,
          warehouseAccountActive:
            $('#account-warehouse').val() != null &&
            Number($('#account-roleId').val()) != 1003, // Nếu role là saler thì active = false trong bảng WarehouseAccount - Không làm việc tại kho nào
        };
  console.log(updatingObj);
  if (validateInput(id)) {
    Swal.fire({
      title: 'Xác nhận thay đổi?',
      text: '' + actionName + ' ' + objName + '',
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#443',
      confirmButtonText: 'Xác nhận',
      cancelButtonText: 'Huỷ',
    }).then((result) => {
      if (result.value) {
        //CALL AJAX TO UPDATE
        if (id > 0) {
          $.ajax({
            url: systemURL + 'account/api/update',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(updatingObj),
            success: function (responseData) {
              // debugger;
              if (
                responseData.status == 200 &&
                responseData.message === 'SUCCESS'
              ) {
                Swal.fire(
                  'Thành Công!',
                  'Đã cập nhật "' + objName + '" ',
                  'success'
                );
                reGenTable();
                // Remove loading indication
                $('#modal-id').modal('hide');
                submitButton.removeAttribute('data-kt-indicator');
                // Enable button
                submitButton.disabled = false;
              } else if (
                responseData.status == 207 &&
                responseData.message === 'IS_EXIST_PHONE_NUMBER'
              ) {
                Swal.fire(
                  'Thất bại!',
                  'Số điện thoại đã được sử dụng',
                  'warning'
                );
                enableBtnSubmit();
              } else if (
                responseData.status == 205 &&
                responseData.message === 'IS_EXIST_USERNAME'
              ) {
                Swal.fire('Thất bại!', 'Tên tài khoản đã tồn tại', 'warning');
                enableBtnSubmit();
              } else if (
                responseData.status == 206 &&
                responseData.message === 'IS_EXIST_IDSTAFF'
              ) {
                Swal.fire('Thất bại!', 'Mã nhân viên đã tồn tại', 'warning');
                enableBtnSubmit();
              }
            },
            error: function (e) {
              //console.log(e.message);
              Swal.fire('Lỗi!', 'Đã xảy ra lỗi, vui lòng thử lại', 'error');
              // Remove loading indication
              submitButton.removeAttribute('data-kt-indicator');
              // Enable button
              submitButton.disabled = false;
            },
          });
        }
        //CALL AJAX TO CREATE
        if (id == 0) {
          //updatingObj.id = 1;
          delete updatingObj['id'];
          updatingObj.active = true;
          updatingObj.createdTime = new Date();
          $.ajax({
            url: systemURL + 'account/api/add',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(updatingObj),
            success: function (responseData) {
              // debugger;

              if (
                responseData.status == 201 &&
                responseData.message === 'CREATED'
              ) {
                Swal.fire(
                  'Thành công!',
                  'Đã tạo mới ' + objName + '',
                  'success'
                );
                $('#modal-id').modal('hide');
                updatingObj = responseData.data;
                reGenTable();
                // Remove loading indication
                enableBtnSubmit();
              } else if (
                responseData.status == 207 &&
                responseData.message === 'IS_EXIST_PHONE_NUMBER'
              ) {
                Swal.fire(
                  'Thất bại!',
                  'Số điện thoại đã được sử dụng',
                  'warning'
                );
                enableBtnSubmit();
              } else if (
                responseData.status == 205 &&
                responseData.message === 'IS_EXIST_USERNAME'
              ) {
                Swal.fire('Thất bại!', 'Tên người dùng đã tồn tại', 'warning');
                enableBtnSubmit();
              } else if (
                responseData.status == 206 &&
                responseData.message === 'IS_EXIST_IDSTAFF'
              ) {
                Swal.fire('Thất bại!', 'Mã nhân viên đã tồn tại', 'warning');
                enableBtnSubmit();
              }
            },
            error: function (e) {
              //console.log(e.message);
              Swal.fire('Lỗi!', 'Đã xảy ra lỗi, vui lòng thử lại', 'error');
              // Remove loading indication
              submitButton.removeAttribute('data-kt-indicator');
              // Enable button
              submitButton.disabled = false;
            },
          });
        }
      } else {
        // Remove loading indication
        submitButton.removeAttribute('data-kt-indicator');
        // Enable button
        submitButton.disabled = false;
      }
    });
  }
}
async function deleteItem(id) {
  updatingObj = table.ajax.json().data.find((c) => c.id == id);
  let objName = id > 0 ? updatingObj.fullName : 'item';
  Swal.fire({
    title: 'Xác nhận thay đổi?',
    text: 'Xóa ' + objName + '',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Xoá',
    cancelButtonText: 'Huỷ',
  }).then((result) => {
    if (result.value) {
      //CALL AJAX TO DELETE
      $.ajax({
        url: systemURL + 'account/api/delete',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ id: id }),
        success: function (responseData) {
          // debugger;
          if (
            responseData.status == 200 &&
            responseData.message === 'SUCCESS'
          ) {
            Swal.fire('Thành công!', 'Đã xoá ' + objName + '.', 'success');
            reGenTable();
          }
        },
        error: function (e) {
          //console.log(e.message);
          Swal.fire('Lỗi!', 'Đã xảy ra lỗi, vui lòng thử lại', 'error');
        },
      });
    } else {
      // Remove loading indication
      submitButton.removeAttribute('data-kt-indicator');
      // Enable button
      submitButton.disabled = false;
    }
  });
}
async function getItemById(id) {
  var data;
  await $.ajax({
    url: systemURL + 'account/api/detailviewmodel/' + id,
    method: 'GET',
    success: function (responseData) {
      data = responseData.data[0];
    },
    error: function (e) {},
  });
  return data;
}
function reGenTable() {
  tableUpdating = 0;
  table.destroy();
  $('.tableHeaderFilter').val(null).trigger('change');
  $('#tableData tbody').html('');
  loadData();
}
function tableSearch() {
  table
    .column(1)
    .search($('#tableData thead:nth-child(2) tr th:nth-child(2) input').val());
  table
    .column(2)
    .search($('#tableData thead:nth-child(2) tr th:nth-child(3) input').val());
  table
    .column(3)
    .search($('#tableData thead:nth-child(2) tr th:nth-child(4) input').val());
  table
    .column(4)
    .search($('#tableData thead:nth-child(2) tr th:nth-child(5) input').val());
  table
    .column(5)
    .search($('#tableData thead:nth-child(2) tr th:nth-child(6) input').val());

  table.draw();
}
