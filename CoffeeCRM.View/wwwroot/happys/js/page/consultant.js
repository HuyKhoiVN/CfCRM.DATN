"use strict";

     
    const accessKey = "Authorization";
    const params = new URL(document.location).searchParams;
    const id = params.get("id");

    const load = async () => {
        var result = await httpService.getAsync("Consultant/api/DetailConsultantId/" + id)
    console.log(result)
    $(".consultant").html('')
    if (result.status == "200") {
        result.data.forEach(function (item, index) {
            `
                    <div class="card consultant" style="margin: 8px;">
                    <div class="text-center">
                        <b>PHIẾU ĐÁNH GIÁ TƯ VẤN</b>
                    </div>
                    <div style="margin-bottom: 16px; margin-left: 8px;">
                        <label style="margin-bottom: 16px">
                            <b>
                                1.  	Thông tin cá nhân [phần này lấy tự động từ hồ sơ của học sinh]
                            </b>
                        </label>
                        <div class="d-flex flex-column align-items-center">
                            <div class="row witdh-80" style="margin: 8px;">
                                <div class="col-12 row">
                                    <div class="col-4 border-top border-start border-black padding-col">
                                        <b>Họ và tên</b>
                                    </div>
                                    <div class="col-8 border-top border-start border-end border-black padding-col">
                                            <b>` + item.accountName + `</b>
                                    </div>
                                </div>
                                <div class="col-12 row">
                                    <div class="col-4 border-top border-start border-black padding-col">
                                        <b>Ngày tháng năm sinh</b>
                                    </div>
                                    <div class="col-8 border-top border-start border-end border-black padding-col">
                                            <b>` + item.dob + `</b>
                                    </div>
                                </div>
                                <div class="col-12 row">
                                    <div class="col-4 border-top border-start border-black padding-col">
                                        <b>Giới tính (Xác nhận khi sinh)</b>
                                    </div>
                                    <div class="col-8 border-top border-start border-end border-black padding-col">
                                            <b>` + item.gender + `</b>
                                    </div>
                                </div>
                                <div class="col-12 row">
                                    <div class="col-4 border-top border-start border-black padding-col">
                                        <b>Dân tộc – Tôn giáo</b>
                                    </div>
                                    <div class="col-8 border-top border-start border-end border-black padding-col">
                                                <b>` + item.religiousNation + `</b>
                                    </div>
                                </div>
                                <div class="col-12 row">
                                    <div class="col-4 border-top border-start border-black padding-col">
                                        <b>Số điện thoại</b>
                                    </div>
                                    <div class="col-8 border-top border-start border-end border-black padding-col">
                                            <b>` + item.phone + `</b>
                                    </div>
                                </div>
                                <div class="col-12 row">
                                    <div class="col-4 border-top border-start border-black padding-col">
                                        <b>Địa chỉ</b>
                                    </div>
                                    <div class="col-8 border-top border-start border-end border-black padding-col">
                                            <b>` + item.address + `</b>
                                    </div>
                                </div>
                                <div class="col-12 row">
                                    <div class="col-4 border-top border-start border-black padding-col">
                                        <b>Thời gian tham vấn</b>
                                    </div>
                                    <div class="col-8 border-top border-start border-end border-black padding-col">
                                            <b>` + item.culturalLevel + `</b>
                                    </div>
                                </div>
                                <div class="col-12 row">
                                    <div class="col-4 border-top border-start border-black padding-col">
                                        <b>Hình thức tư vấn</b>
                                    </div>
                                    <div class="col-8 border-top border-start border-end border-black padding-col">
                                        <b></b>
                                    </div>
                                </div>
                                <div class="col-12 row">
                                    <div class="col-4 border-top border-start border-bottom border-black padding-col">
                                        <b>Cán bộ tư vấn</b>
                                    </div>
                                    <div class="col-8 border-top border-start border-end border-bottom border-black padding-col">
                                        <b></b>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div style="margin-bottom: 16px; margin-left: 8px;">
                        <label style="margin-bottom: 16px">
                            <b>
                                2.  	Phần chuyên môn
                            </b>
                        </label>
                        <div class="d-flex flex-column align-items-center">
                            <div class="row witdh-80" style="margin: 8px;">
                                <div class="col-12 row">
                                    <div class="col-4 border-top border-start border-black padding-col">
                                        <b>Lý do đến tư vấn</b>
                                    </div>
                                    <div class="col-8 border-top border-start border-end border-black padding-col">
                                        <b></b>
                                    </div>
                                </div>
                                <div class="col-12 row">
                                    <div class="col-4 border-top border-start border-black padding-col">
                                        <b>Triệu chứng, biểu hiện thực thể</b>
                                    </div>
                                    <div class="col-8 border-top border-start border-end border-black padding-col">
                                        <b></b>
                                    </div>
                                </div>
                                <div class="col-12 row">
                                    <div class="col-4 border-top border-start border-black padding-col">
                                        <b>Các mối quan hệ gia đình và xã hội</b>
                                    </div>
                                    <div class="col-8 border-top border-start border-end border-black padding-col">
                                        <b></b>
                                    </div>
                                </div>
                                <div class="col-12 row">
                                    <div class="col-4 border-top border-start border-black border-bottom padding-col">
                                        <b>Tiền sử bản thân và gia đình</b>
                                    </div>
                                    <div class="col-8 border-top border-start border-end border-black border-bottom padding-col">
                                        <b></b>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div style="margin-bottom: 16px; margin-left: 8px;">
                        <label style="margin-bottom: 16px">
                            <b>
                                3.  	Kết quả đánh giá sơ bộ
                            </b>
                        </label>
                        <div class="d-flex flex-column align-items-center">
                            <div class="row witdh-80" style="margin: 8px;">
                                <div class="col-12 row">
                                    <div class="col-4 border-top border-start border-black border-bottom padding-col">
                                        <b>Kết quả đánh giá sơ bộ</b>
                                    </div>
                                    <div class="col-8 border-top border-start border-end border-black border-bottom padding-col">
                                        <b></b>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div style="margin-bottom: 16px; margin-left: 8px;">
                        <label style="margin-bottom: 16px">
                            <b>
                                4.  	Mục tiêu tư vấn
                            </b>
                        </label>
                        <div class="d-flex flex-column align-items-center">
                            <div class="row witdh-80" style="margin: 8px;">
                                <div class="col-12 row">
                                    <div class="col-4 border-top border-start border-black border-bottom padding-col">
                                        <b>Mục tiêu tư vấn</b>
                                    </div>
                                    <div class="col-8 border-top border-start border-end border-black border-bottom padding-col">
                                        <b></b>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div style="margin-bottom: 16px; margin-left: 8px;">
                        <label style="margin-bottom: 16px">
                            <b>
                                5.  	Kết quả tư vấn
                            </b>
                        </label>
                        <div class="d-flex flex-column align-items-center">
                            <div class="row witdh-80" style="margin: 8px;">
                                <div class="col-12 row">
                                    <div class="col-4 border-top border-start border-black border-bottom padding-col">
                                        <b>Kết quả tư vấn</b>
                                    </div>
                                    <div class="col-8 border-top border-start border-end border-black border-bottom padding-col">
                                        <b></b>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div style="margin-bottom: 16px; margin-left: 8px;">
                        <label style="margin-bottom: 16px">
                            <b>
                                6.  	Kế hoạch tiếp theo
                            </b>
                        </label>
                        <div class="d-flex flex-column align-items-center">
                            <div class="row witdh-80" style="margin: 8px;">
                                <div class="col-12 row">
                                    <div class="col-4 border-top border-start border-black border-bottom padding-col">
                                        <b>Kế hoạch tiếp theo</b>
                                    </div>
                                    <div class="col-8 border-top border-start border-end border-black border-bottom padding-col">
                                        <b></b>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div style="margin-bottom: 16px; margin-left: 8px;">
                        <label style="margin-bottom: 16px">
                            <b>
                                7.  	Đánh giá của học sinh sau buổi tư vấn (phần này hiện cho học sinh đánh giá)
                            </b>
                        </label>
                        <div class="d-flex flex-column align-items-center">
                            <div class="row witdh-80" style="margin: 8px;">
                                <div class="col-12 row">
                                    <div class="col-4 border-top border-start border-black padding-col">
                                        <b>Chấm sao</b>
                                    </div>
                                    <div class="col-8 border-top border-start border-end border-black padding-col">
                                        <b></b>
                                    </div>
                                </div>
                                <div class="col-12 row">
                                    <div class="col-4 border-top border-start border-black border-bottom padding-col">
                                        <b>Nhận xét:</b>
                                    </div>
                                    <div class="col-8 border-top border-start border-end border-bottom border-black padding-col">
                                        <b></b>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>`
        })
    }

    $(document).ready(async function () {
        await load.call();
    });