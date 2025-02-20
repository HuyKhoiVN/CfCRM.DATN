var currentView = 0; // 0: màn info,   1 : màn change pass

var editButton = document.getElementById('edit-button');

var fullNameInput = document.getElementById('full-name');

editButton.addEventListener('click', function () {
  fullNameInput.style.border = '1px solid #dbdbdb';
  fullNameInput.style.outline = 'none';
  fullNameInput.contentEditable = true;
  fullNameInput.focus();
  let range = document.createRange();
  let sel = window.getSelection();
  range.setStart(fullNameInput.childNodes[0], fullNameInput.textContent.length);
  range.collapse(true);
  sel.removeAllRanges();
  sel.addRange(range);
});

document.addEventListener('click', function (event) {
  let fullNameInput = document.getElementById('full-name');
  var editButton = document.getElementById('edit-button');

  if (
    event.target !== fullNameInput &&
    event.target !== editButton &&
    !editButton.contains(event.target)
  ) {
    fullNameInput.contentEditable = false;
    fullNameInput.style.border = 'none';
  }
});

$(document).ready(function () {
  $('#view-password').click(function () {
    $('#kt_tab_pane_2').removeClass('d-none');
    $('#kt_tab_pane_1').addClass('d-none');
    $('#kt_tab_pane_3').addClass('d-none');
    //if (roleId == @RoleId.LEADER || roleId == @RoleId.TELE_SALES) {
    //    $('#kt_tab_pane_4').addClass("d-none");
    //}
    currentView = 1;
  });
  $('#view-info').click(function () {
    $('#kt_tab_pane_2').addClass('d-none');
    $('#kt_tab_pane_3').addClass('d-none');
    //if (roleId == @RoleId.LEADER || roleId == @RoleId.TELE_SALES) {
    //    $('#kt_tab_pane_4').addClass("d-none");
    //}
    $('#kt_tab_pane_1').removeClass('d-none');
    currentView = 0;
  });
  $('#view-notification').click(function () {
    $('#kt_tab_pane_1').addClass('d-none');
    $('#kt_tab_pane_2').addClass('d-none');
    //if (roleId == @RoleId.LEADER || roleId == @RoleId.TELE_SALES) {
    //    $('#kt_tab_pane_4').addClass("d-none");
    //}
    $('#kt_tab_pane_3').removeClass('d-none');
  });

  $('#view-history-kpi').click(function () {
    $('#kt_tab_pane_1').addClass('d-none');
    $('#kt_tab_pane_2').addClass('d-none');
    $('#kt_tab_pane_3').addClass('d-none');
    $('#kt_tab_pane_4').removeClass('d-none');
    loadHistoryKPIPaging();
  });
  GetInfoProfile();
  loadDataNotification();
});
function GetInfoProfile() {
  $.ajax({
    url: systemURL + 'account/api/get-info-account',
    type: 'GET',
    beforeSend: function (xhr) {
      if (localStorage.token) {
        xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.token);
      }
    },
    success: function (response) {
      if (response.status == 200) {
        var infoProfile = response.resources;
        $('#account-photo').attr('src', infoProfile.photo);
        $('#full-name').text(infoProfile.fullName);
        //$("#full-name-login").text(infoProfile.fullName);
        $('#user-name').text(infoProfile.userName);
        $('#role-name').text(infoProfile.roleName);
        //$("#role-name-login").text(infoProfile.roleName);
        //$("#turnover").text(VND.format(infoProfile.turnover));
        //$("#ratio-return").text(infoProfile.return.toLocaleString('vi-VN') + "%");
        //$("#ratio-combo").text(infoProfile.combo.toLocaleString('vi-VN') + "%");

        //if (roleId == @RoleId.LEADER || roleId == @RoleId.TELE_SALES) {
        //    $("#kpiCompleteValue").text(infoProfile.currentValue.toLocaleString("vi-VN") + "/" + infoProfile.target.toLocaleString("vi-VN"));
        //    $("#kpiCompletePercent").text((infoProfile.target > 0 ? Math.round((infoProfile.currentValue / infoProfile.target) * 100).toLocaleString("vi-VN") : 0) + "%");
        //    $("#kpiCompleteProgress").css("width", "" + ((infoProfile.currentValue / infoProfile.target) * 100) + "%");
        //    $("#kpiCompleteProgress").attr("aria-valuenow", ((infoProfile.currentValue / infoProfile.target) * 100));
        //}
      }
    },
    error: function (request, status, error) {
      //console.error(error);
    },
  });
}
document.getElementById('update-info').addEventListener('click', function (e) {
  e.preventDefault();
  var data = JSON.parse(localStorage.profile);
  data.photo = $('#account-photo').attr('src');
  data.fullName = $('#full-name').text();
  localStorage.setItem('profile', JSON.stringify(data));

  ValidateData();
});
document.getElementById('update-pass').addEventListener('click', function (e) {
  e.preventDefault();
  ValidateData();
});
$('.btn_show_old_pass').on('click', function (e) {
  if ($('#old-pass').attr('type') == 'text') {
    $('#old-pass').attr('type', 'password');
    $(this).html(`<i class="ki-duotone ki-eye fs-3" id="icon-old-pass">
                                                           <span class="path1 ki-uniEC0B"></span>
                                                           <span class="path2 ki-uniEC0B"></span>
                                                           <span class="path3 ki-uniEC0D"></span>
                                                      </i>`);
  } else {
    $('#old-pass').attr('type', 'text');
    $(this).html(`<i class="ki-duotone ki-eye-slash fs-3" id="icon-old-pass">
                                                               <span class="path1 ki-uniEC0B"></span>
                                                               <span class="path2 ki-uniEC0B"></span>
                                                               <span class="path3 ki-uniEC0D"></span>
                                                          </i>`);
  }
});
$('.btn_show_confirm_pass').on('click', function (e) {
  if ($('#confirm-pass').attr('type') == 'text') {
    $('#confirm-pass').attr('type', 'password');
    $(this).html(`<i class="ki-duotone ki-eye fs-3" id="icon-confirm-pass">
                                                               <span class="path1 ki-uniEC0B"></span>
                                                               <span class="path2 ki-uniEC0B"></span>
                                                               <span class="path3 ki-uniEC0D"></span>
                                                          </i>`);
  } else {
    $('#confirm-pass').attr('type', 'text');
    $(this)
      .html(`<i class="ki-duotone ki-eye-slash fs-3" id="icon-confirm-pass">
                                                                   <span class="path1 ki-uniEC0B"></span>
                                                                   <span class="path2 ki-uniEC0B"></span>
                                                                   <span class="path3 ki-uniEC0D"></span>
                                                              </i>`);
  }
});
$('.btn_show_new_pass').on('click', function (e) {
  if ($('#new-pass').attr('type') == 'text') {
    $('#new-pass').attr('type', 'password');
    $(this).html(`<i class="ki-duotone ki-eye fs-3" id="icon-new-pass">
                                                           <span class="path1 ki-uniEC0B"></span>
                                                           <span class="path2 ki-uniEC0B"></span>
                                                           <span class="path3 ki-uniEC0D"></span>
                                                      </i>`);
  } else {
    $('#new-pass').attr('type', 'text');
    $(this).html(`<i class="ki-duotone ki-eye-slash fs-3" id="icon-new-pass">
                                                               <span class="path1 ki-uniEC0B"></span>
                                                               <span class="path2 ki-uniEC0B"></span>
                                                               <span class="path3 ki-uniEC0D"></span>
                                                          </i>`);
  }
});
function ValidateData() {
  var listError = [];
  if (currentView == 0) {
    if ($('#full-name').text().length == 0) {
      listError.push('Họ và tên không được để trống');
    }

    if ($('#full-name').val().length > 255) {
      listError.push('Họ và tên không được nhiều hơn 255 kí tự');
    }
  } else {
    if ($('#old-pass').val().length < 6) {
      listError.push('Mật khẩu hiện phải có ít nhất 6 kí tự');
    }
    if ($('#old-pass').val().length > 255) {
      listError.push('Mật khẩu hiện tại không được nhiều hơn 255 kí tự');
    }
    if ($('#new-pass').val().length < 6) {
      listError.push('Mật khẩu mới phải có ít nhất 6 kí tự');
    }
    if ($('#new-pass').val().length > 255) {
      listError.push('Mật khẩu mới không được nhiều hơn 255 kí tự');
    }
    if ($('#confirm-pass').val().length < 6) {
      listError.push('Xác nhận lại mật khẩu phải có ít nhất 6 kí tự');
    }
    if ($('#confirm-pass').val().length > 255) {
      listError.push('Nhập lại mật khẩu mới không được nhiều hơn 255 kí tự');
    }
    if ($('#new-pass').val() != $('#confirm-pass').val()) {
      listError.push('Mật khẩu mới và nhập lại mật khẩu mới không giống nhau ');
    }
  }
  if (listError.length > 0) {
    contentError = '<ul>';
    listError.forEach(function (item, index) {
      contentError += "<li class='text-start'>" + item + '</li>';
    });
    contentError += '</ul>';
    Swal.fire('Cập nhật không thành công', contentError, 'warning');
  } else {
    UpdateProfile();
  }
}
function UpdateProfile() {
  let filePath = $('#account-photo').attr('file-path') || '';
  var objInfo = {
    photo: $('#account-photo').attr('src'),
    fullName: $('#full-name').text(),
    userName: $('#user-name').text(),
    roleName: $('#role-name').text(),
  };
  var objPassword = {
    newPassword: $('#new-pass').val(),
    oldPassword: $('#old-pass').val(),
    confirm: $('#confirm-pass').val(),
  };
  Swal.fire({
    title: 'Xác nhận thay đổi?',
    text: 'Thay đổi thông tin cá nhân',
    icon: 'info',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#443',
    confirmButtonText: 'Xác nhận',
    cancelButtonText: 'Huỷ',
  }).then((result) => {
    if (result.value) {
      if (currentView == 0) {
        $.ajax({
          url: systemURL + 'account/api/update-info',
          type: 'PUT',
          contentType: 'application/json',
          beforeSend: function (xhr) {
            if (localStorage.token) {
              xhr.setRequestHeader(
                'Authorization',
                'Bearer ' + localStorage.token
              );
            }
          },
          data: JSON.stringify(objInfo),

          success: function (responseData) {
            if (
              responseData.status == 200 &&
              responseData.message === 'SUCCESS'
            ) {
              Swal.fire(
                'Thành Công!',
                'Đã cập nhật thông tin cá nhân',
                'success'
              );
              $('.ac-photo').attr('src', objInfo.photo);
              $('.ac-full-name').text($('#full-name').text());
            }
          },
          error: function (e) {
            Swal.fire('Lỗi!', 'Đã xảy ra lỗi, vui lòng thử lại', 'error');
          },
        });
      } else {
        $.ajax({
          url: systemURL + 'account/api/update-password',
          type: 'PUT',
          contentType: 'application/json',
          data: JSON.stringify(objPassword),
          success: function (responseData) {
            if (
              responseData.status == 200 &&
              responseData.message === 'SUCCESS'
            ) {
              Swal.fire('Thành Công!', 'Đã cập nhật mật khẩu', 'success');
            }
          },
          error: function (e) {
            Swal.fire('Lỗi!', 'Đã xảy ra lỗi, vui lòng thử lại', 'error');
          },
        });
      }
    }
  });
}
//function LoadNotification() {
//    $.ajax({
//        url: "/notification/api/list-by-accountId?pageIndex=" + pageIndex + "&pageSize=" + pageSize,
//        type: "POST",
//        contentType: "application/json",
//        beforeSend: function (xhr) {
//            if (localStorage.token) {
//                xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.token);
//            }
//        },
//        success: function (responseData) {
//            //console.log(responseData);
//            if (responseData.status == 200 && responseData.message === "SUCCESS") {
//                totalPage = responseData.data[0].totalPage;
//                if (totalPage > 0) {
//                    pagination("#pagination", totalPage, pageIndex);
//                    $("#pageInfo-notification").text(responseData.data[0].pageInfo);
//                    let html = "";
//                    responseData.data[0].resourses.forEach(function (row) {
//                        var icon;
//                        var title
//                        if (row.description == "Order_Add") {
//                            icon = `<span class='symbol-label bg-light-primary'>
//                                                                              <i class='ki-duotone ki-abstract-28 fs-2 text-primary'>
//                                                                                   <span class='path1'></span>
//                                                                                     <span class='path2'></span>
//                                                                                </i>
//                                                                             </span>`;
//                            title = "Đơn hàng mới";
//                        }
//                        else if (row.description == "Order_Update") {
//                            icon = `<span class="symbol-label bg-light-danger">
//                                                                                <i class="ki-duotone ki-information fs-2 text-danger"><span class="path1"></span><span class="path2"></span><span class="path3"></span></i>
//                                                                            </span>`
//                            //title = "Cập nhật đơn hàng";
//                        }
//                        html += `
//                                                              <div class="timeline-item">
//                                                                                <div class="timeline-line"></div>
//                                                                                <div class="timeline-icon me-4">
//                                                                                    `+ icon + `
//                                                                                </div>
//                                                                                <div class="timeline-content mb-10 mt-n2">
//                                                                                    <div class="overflow-auto pe-3">
//                                                                            <a href="/Orders/admin/list?orderId=`+ row.senderId + `" target="_blank" class="fs-6 text-gray-800 text-hover-primary fw-bold notification-update-status-newtab ` + (row.notificationStatusId == @NotificationStatusId.Unread ? "unread" : "read") + `" data-id='` + row.id + `'>` + row.name + `
//                                                                                    `+ (row.notificationStatusId == @NotificationStatusId.Unread ? `<span class="badge badge-circle badge-primary h-10px w-10px text-end animation-blink ms-10"></span>` : "") + `

//                                                                    </a>

//                                                                                        <div class="d-flex align-items-center mt-1 fs-6">
//                                                                                                    <div class="text-muted me-2 fs-7">`+ moment(row.createdTime).fromNow() + `</div>

//                                                                                        </div>
//                                                                                 </div>
//                                                                       </div>
//                                                                 </div>

//                                                        `;
//                    });
//                    $("#list-notification").html(html);
//                }
//                else {
//                    $("#list-notification").html(`<h5>Hiện chưa có thông báo nào</h5>`);
//                }
//            }
//        },
//        error: function (e) {
//            $("#list-notification").html(`<h5>Hiện chưa có thông báo nào</h5>`);
//        }
//    });
//}
function loadDataNotification() {
  initTable();
}
function initTable() {
  table = $('#tableData').DataTable({
    processing: true,
    serverSide: true,
    paging: true,
    searching: { regex: true },
    oLanguage: {
      sUrl: '/js/Vietnamese.json',
    },
    ajax: {
      url: systemURL + 'notification/api/list-server-side',
      type: 'POST',
      contentType: 'application/json',
      dataType: 'json',
      beforeSend: function (xhr) {
        if (localStorage.token) {
          xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.token);
        }
      },
      data: function (d) {
        d.searchAll = $('#search-input').val();
        return JSON.stringify(d);
      },
    },
    columns: [
      {
        data: 'id',
        render: function (data, type, row, meta) {
          let viewApprove = row.approveTime != null ? '' : 'd-none';
          let photo = row.photo ?? '/images/userdefault.jpg';
          return (
            ` 
                  <div onclick="readNotification(${row.id}); window.open('${systemURL}${row.url}', '_blank');" class="d-flex flex-column gap-2 col-md-12" style="cursor: pointer;">
              <div id="list-notifi" onclick="window.location.href='${systemURL}${row.url}'" style="cursor: pointer;" >
                                        <div class="d-flex flex-column gap-2 col-md-12">
                                            <div class="d-flex gap-2 align-items-center">
                                            <h4>${row.name}</h4>` +
            (row.notificationStatusId == 1004
              ? `<span class="badge badge-circle badge-primary h-10px w-10px text-end animation-blink ms-10"></span>`
              : '') +
            `</div>
                                            <div class="d-flex justify-content-between " >
                                                <div class="d-flex flex-row gap-2">
                                                    <img class="rounded-circle" width="50" height="50" src="${photo}"/>
                                                    <div class="d-flex flex-column gap-1">
                                                        <div style="font-size:15px"> Người tạo</div>
                                                        <div style = "font-size:15px"><b>${
                                                          row.userCreate
                                                        }</b></div >
                                                    </div>
                                                </div>
                                                <div class="d-flex flex-column gap-1">
                                                    <div style="font-size:15px"> Ngày gửi </div>
                                                    <div style = "font-size:15px"> <b>${moment(
                                                      row.createdTime
                                                    ).format(
                                                      'DD/MM/YYYY HH:mm'
                                                    )}</b></div >
                                                </div>
                                                <div class="d-flex flex-column gap-1 ${viewApprove}" >
                                                    <div style="font-size:15px">Ngày duyệt</div>
                                                    <div style ="font-size:15px"><b>${moment(
                                                      row.approveTime
                                                    ).format(
                                                      'DD/MM/YYYY HH:mm'
                                                    )}</b></div>
                                                </div>
                                                
                                            </div>
                                            <a class="mt-2 link-primary cursor-pointer" href="${
                                              row.url
                                            }" target="_blank" onclick="readNotification(${
              row.id
            })"> Xem chi tiết </a>
                                        </div>
                                        </div>
                                        </div>
                                        `
          );
        },
      },
    ],
    columnDefs: [
      { targets: 'no-sort', orderable: false },
      { targets: 'no-search', searchable: false },
    ],
    aLengthMenu: [
      [10, 25, 50, 100],
      [10, 25, 50, 100],
    ],
  });
}
