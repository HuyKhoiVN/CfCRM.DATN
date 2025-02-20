"use strict"
var pageIndex = 1;
var pageSize = 6;
var countTotalPage = 0;
var currentPage = 1;
async function LoadPagingPageBookingHistory(paramCountUrlxx, bookingStatusId) {
    var result = await httpService.getAsync(paramCountUrlxx + "?bookingStatusId=" + bookingStatusId);
    if (result < pageSize) {
        countTotalPage = Math.round(result / pageSize);
    }
    else {
        if (Math.round(result / pageSize) < (result / pageSize)) {
            countTotalPage = Math.round(result / pageSize) + 1;
        }
        else {
            countTotalPage = Math.round(result % pageSize);
        }
    }
    var newHtml = '';
    $(".pagina_list_booking").html('');
    if (countTotalPage < 1 && countTotalPage >= 0) {
        countTotalPage = 1;
    }
    for (var i = 0; i <= countTotalPage; i++) {
        if (i == 0) {
            newHtml += `<li class="page_item disabled">
                            <a class="page-link-booking" href="javascript:void(0)" tabindex="-1" aria-disabled="true">
                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
                                    <rect width="32" height="32" rx="5" fill="#F7F7F9"></rect>
                                    <path d="M24 16.5C24.2761 16.5 24.5 16.2761 24.5 16C24.5 15.7239 24.2761 15.5 24 15.5L24 16.5ZM8.64645 15.6464C8.45118 15.8417 8.45118 16.1583 8.64645 16.3536L11.8284 19.5355C12.0237 19.7308 12.3403 19.7308 12.5355 19.5355C12.7308 19.3403 12.7308 19.0237 12.5355 18.8284L9.70711 16L12.5355 13.1716C12.7308 12.9763 12.7308 12.6597 12.5355 12.4645C12.3403 12.2692 12.0237 12.2692 11.8284 12.4645L8.64645 15.6464ZM24 15.5L9 15.5L9 16.5L24 16.5L24 15.5Z" fill="#1B1E28"></path>
                                </svg>
                            </a>
                        </li>
                        <li class="page_item "><a class="page-link-booking active_paginate" href="javascript:void(0)" tabindex="`+ (i + 1) + `">` + (i + 1) + `</a></li>
                        `;
        }
        else if (i == countTotalPage) {
            if (countTotalPage == 1) {
                newHtml += `
                        <li class="page_item disabled">
                            <a class="page-link-booking" href="javascript:void(0)">
                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
                                    <rect width="32" height="32" rx="5" transform="matrix(-1 0 0 1 32 0)" fill="#F7F7F9"></rect>
                                    <path d="M8 16.5C7.72386 16.5 7.5 16.2761 7.5 16C7.5 15.7239 7.72386 15.5 8 15.5L8 16.5ZM23.3536 15.6464C23.5488 15.8417 23.5488 16.1583 23.3536 16.3536L20.1716 19.5355C19.9763 19.7308 19.6597 19.7308 19.4645 19.5355C19.2692 19.3403 19.2692 19.0237 19.4645 18.8284L22.2929 16L19.4645 13.1716C19.2692 12.9763 19.2692 12.6597 19.4645 12.4645C19.6597 12.2692 19.9763 12.2692 20.1716 12.4645L23.3536 15.6464ZM8 15.5L23 15.5L23 16.5L8 16.5L8 15.5Z" fill="#1B1E28"></path>
                                </svg>
                            </a>
                        </li>`;
            }
            else {
                newHtml += `
                        <li class="page_item">
                            <a class="page-link-booking" href="javascript:void(0)">
                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
                                    <rect width="32" height="32" rx="5" transform="matrix(-1 0 0 1 32 0)" fill="#F7F7F9"></rect>
                                    <path d="M8 16.5C7.72386 16.5 7.5 16.2761 7.5 16C7.5 15.7239 7.72386 15.5 8 15.5L8 16.5ZM23.3536 15.6464C23.5488 15.8417 23.5488 16.1583 23.3536 16.3536L20.1716 19.5355C19.9763 19.7308 19.6597 19.7308 19.4645 19.5355C19.2692 19.3403 19.2692 19.0237 19.4645 18.8284L22.2929 16L19.4645 13.1716C19.2692 12.9763 19.2692 12.6597 19.4645 12.4645C19.6597 12.2692 19.9763 12.2692 20.1716 12.4645L23.3536 15.6464ZM8 15.5L23 15.5L23 16.5L8 16.5L8 15.5Z" fill="#1B1E28"></path>
                                </svg>
                            </a>
                        </li>`;
            }
        }
        else {
            newHtml += `
                        <li class="page_item "><a class="page-link-booking" href="javascript:void(0)" tabindex="`+ (i + 1) + `">` + (i + 1) + `</a></li>
            `;
        }
    }
    $(".pagina_list_booking").append(newHtml);
}
$('body').on('click', '.page-link-booking', async function (e) {
    currentPage = $(this).attr("tabindex");
    if (currentPage != -1 && currentPage != undefined) {
        if (currentPage > 1 && currentPage < countTotalPage) {
            $(".pagina_list_booking .page-link-booking .active_paginate").removeClass("active_paginate");
            $(".page-link-booking[tabindex=" + currentPage + "]").addClass("active_paginate");
            $(".page_item:first-child").removeClass("disabled");
            $(".page_item:last-child").removeClass("disabled");
        }
        else if (currentPage == 1) {
            $(".pagina_list_booking .page-link-booking .active_paginate").removeClass("active_paginate");
            $(".page-link-booking[tabindex=" + currentPage + "]").addClass("active_paginate");
            $(".page_item:first-child").addClass("disabled");
            $(".page_item:last-child").removeClass("disabled");
        }
        else if (currentPage == countTotalPage) {
            $(".page_item:first-child").removeClass("disabled");
            $(".page_item:last-child").addClass("disabled");
            $(".pagina_list_booking .page-link-booking .active_paginate").removeClass("active_paginate");
            $(".page-link-booking[tabindex=" + currentPage + "]").addClass("active_paginate");
        }
        pageIndex = currentPage;
    }
    else {
        if (currentPage != -1) {
            debugger;
            pageIndex = parseInt(pageIndex) + 1;
            if (pageIndex == countTotalPage) {
                $(".page_item:first-child").removeClass("disabled");
                $(".page_item:last-child").addClass("disabled");
                $(".pagina_list_booking .page-link-booking .active_paginate").removeClass("active_paginate");
                $(".page-link-booking[tabindex=" + pageIndex + "]").addClass("active_paginate");
            }
            else if (pageIndex > countTotalPage) {
                $(".page_item:first-child").addClass("disabled");
                $(".page_item:last-child").addClass("disabled");
                $(".pagina_list_booking .page-link-booking .active_paginate").removeClass("active_paginate");
                $(".page-link-booking[tabindex=" + countTotalPage + "]").addClass("active_paginate");
                pageIndex = countTotalPage;
            }
            else {
                $(".pagina_list_booking .page-link-booking .active_paginate").removeClass("active_paginate");
                $(".page-link-booking[tabindex=" + pageIndex + "]").addClass("active_paginate");
                $(".page_item:first-child").removeClass("disabled");
                $(".page_item:last-child").removeClass("disabled");
            }
        }
        else {
            pageIndex = Math.floor(parseInt(pageIndex) + parseInt(currentPage));
            if (pageIndex == 0) {
                pageIndex++;
                $(".page_item:first-child").addClass("disabled");
                $(".page_item:last-child").removeClass("disabled");
                $(".pagina_list_booking .page-link-booking .active_paginate").removeClass("active_paginate");
                $(".page-link-booking[tabindex=" + pageIndex + "]").addClass("active_paginate");
            }
            else if (pageIndex == 1) {
                $(".page_item:first-child").addClass("disabled");
                $(".page_item:last-child").removeClass("disabled");
                $(".pagina_list_booking .page-link-booking .active_paginate").removeClass("active_paginate");
                $(".page-link-booking[tabindex=" + pageIndex + "]").addClass("active_paginate");
            }
            else {
                $(".page_item:first-child").removeClass("disabled");
                $(".page_item:last-child").removeClass("disabled");
                $(".pagina_list_booking .page-link-booking .active_paginate").removeClass("active_paginate");
                $(".page-link-booking[tabindex=" + pageIndex + "]").addClass("active_paginate");
            }
            currentPage = pageIndex;
        }
    }
    await loadDataConsuling.call();
});
