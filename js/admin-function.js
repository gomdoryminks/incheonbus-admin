//전역변수
let noticeTimer;
let noticeCnt = 0;
let noticeIdx = 0;

$(function() {
    //공지사항 항목 클릭&더블클릭시
    $(".notice-list-table tr[data-notice-idx]").on("click", function(e) {
        let tagName = e.target.tagName.toLowerCase();
        let dataNoticeIdx = $(this).attr("data-notice-idx");
        
        if (tagName == "th" || tagName == "td") {
            if (noticeIdx != dataNoticeIdx) {
                noticeCnt = 0;
            }
            
            noticeCnt++;
            noticeIdx = dataNoticeIdx;
            
            if (noticeCnt === 1) {
                //공지사항 선택
                noticeTimer = setTimeout(setNoticeSelect, 200, this);
            } else {
                //공지사항 수정창 열기
                openNoticeUpdateLayer(this);
            }
        }
    }).on("dblclick", function(e) {
        let tagName = e.target.tagName.toLowerCase();
        
        if (tagName == "th" || tagName == "td") {
            e.preventDefault();
        }
    });
});

//선택한 파일 삭제
function setFileDelete(obj) {
    var fileObj = $(obj).closest(".c-file-input");
    var fileId = $(fileObj).find("input[type='file']").attr("id");
    var fileName = $(fileObj).find("input[type='file']").attr("name");
    var fileHtml = "";
    
    $(obj).remove();
    $(fileObj).find("label").remove();
    $(fileObj).find(".c-file-txt").val("");
    
    fileHtml += "<label>";
    fileHtml += "    <input type='file' id='" + fileId + "' name='" + fileName + "'>파일 선택";
    fileHtml += "</label>";
    
    $(fileObj).append(fileHtml);
    
    //파일 업로드시 파일명 추출 및 파일삭제 버튼 추가
    $(".c-file-input input[type='file']").on("change", function(e) {
        var fileObj = $(this).closest(".c-file-input");
        var fileName = "";
        var fileHtml = "";
        
        $(fileObj).find("label").css("display", "inline-block");
        $(fileObj).find(".c-file-btn").remove();
        
        if ($(this).val() != "") {
            if (window.FileReader) {
                //기본 브라우저
                fileName = $(this)[0].files[0].name;
            } else {
                //old IE
                fileName = $(this).val().split('/').pop().split('\\').pop();
            }
            
            fileHtml += "<button type='button' class='c-file-btn' onclick='setFileDelete(this);'>";
            fileHtml += "    <span>파일 삭제</span>";
            fileHtml += "</button>";
            
            $(fileObj).find("label").css("display", "none");
            $(fileObj).append(fileHtml);
        }
        
        $(fileObj).find(".c-file-txt").val(fileName);
    });
}

//공지사항 삭제
function setNoticeDelete(obj) {
    if ($(".notice-list-table").find("tr.active").length > 0) {
        let dataNoticeIdx = $(".notice-list-table").find("tr.active").attr("data-notice-idx");
        
        openLayer("confirm", "선택하신 공지사항을 삭제하시겠습니까?", "console.log('" + dataNoticeIdx + "');");
    } else {
        openLayer("alert", "삭제할 공지사항을 선택해주세요.", "");
    }
}

//공지사항 선택
function setNoticeSelect(obj) {
    noticeCnt = 0;
    
    if ($(obj).hasClass("active")) {
        $(obj).removeClass("active");
    } else {
        $(".notice-list-table").find("tr").removeClass("active");
        $(obj).addClass("active");
    }
}

//공지사항 종류에 따라 항목 보이기&숨기기
function setNoticeType(obj) {
    let typeVal = $(obj).val();
    
    $(obj).closest("table").find(".notice-content").removeClass("on");
    
    if (typeVal == "text") {
        $(obj).closest("table").find(".notice-text").addClass("on");
    } else if (typeVal == "image") {
        $(obj).closest("table").find(".notice-image").addClass("on");
    } else if (typeVal == "youtube") {
        $(obj).closest("table").find(".notice-youtube").addClass("on");
    }
}

//레이어창 열기
function openLayer(type, msg, fun) {
    $("#" + type + "-layer .l-box .l-con-area .l-con").html(msg);
    
    $("#" + type + "-layer .l-box .l-btn-area .confirm-btn").removeAttr("onclick");
    $("#" + type + "-layer .l-box .l-btn-area .confirm-btn").attr("onclick","closeLayer(this);" + fun);
    
    $("#" + type + "-layer").addClass("on");
    
    let scrollTop = parseInt($(document).scrollTop());

    $("body").css("top", -scrollTop + "px");

    $("body").addClass("scroll-disable").on('scroll touchmove', function(event) {
        event.preventDefault();
    });
}

//공지사항 추가창 열기
function openNoticeInsertLayer(obj) {
    $("#notice-insert-layer").addClass("on");
    
    let scrollTop = parseInt($(document).scrollTop());

    $("body").css("top", -scrollTop + "px");

    $("body").addClass("scroll-disable").on('scroll touchmove', function(event) {
        event.preventDefault();
    });
    
    //공지사항 종류에 따라 항목 보이기&숨기기
    setNoticeType($("#notice-insert-layer").find(".notice-type"));
    
    //파일 업로드시 파일명 추출 및 파일삭제 버튼 노출
    $(".c-file-input input[type='file']").on("change", function(e) {
        var fileObj = $(this).closest(".c-file-input");
        var fileName = "";
        var fileHtml = "";
        
        $(fileObj).find("label").css("display", "inline-block");
        $(fileObj).find(".c-file-btn").remove();
        
        if ($(this).val() != "") {
            if (window.FileReader) {
                //기본 브라우저
                fileName = $(this)[0].files[0].name;
            } else {
                //old IE
                fileName = $(this).val().split('/').pop().split('\\').pop();
            }
            
            fileHtml += "<button type='button' class='c-file-btn' onclick='setFileDelete(this);'>";
            fileHtml += "    <span>파일 삭제</span>";
            fileHtml += "</button>";
            
            $(fileObj).find("label").css("display", "none");
            $(fileObj).append(fileHtml);
        }
        
        $(fileObj).find(".c-file-txt").val(fileName);
    });
}

//공지사항 수정창 열기
function openNoticeUpdateLayer(obj) {
    clearTimeout(noticeTimer);
    noticeCnt = 0;
    
    $(".notice-list-table").find("tr").removeClass("active");
    
    $("#notice-update-layer").addClass("on");
    
    let scrollTop = parseInt($(document).scrollTop());

    $("body").css("top", -scrollTop + "px");

    $("body").addClass("scroll-disable").on('scroll touchmove', function(event) {
        event.preventDefault();
    });
    
    //공지사항 종류에 따라 항목 보이기&숨기기
    setNoticeType($("#notice-update-layer").find(".notice-type"));
    
    //파일 업로드시 파일명 추출 및 파일삭제 버튼 노출
    $(".c-file-input input[type='file']").on("change", function(e) {
        var fileObj = $(this).closest(".c-file-input");
        var fileName = "";
        var fileHtml = "";
        
        $(fileObj).find("label").css("display", "inline-block");
        $(fileObj).find(".c-file-btn").remove();
        
        if ($(this).val() != "") {
            if (window.FileReader) {
                //기본 브라우저
                fileName = $(this)[0].files[0].name;
            } else {
                //old IE
                fileName = $(this).val().split('/').pop().split('\\').pop();
            }
            
            fileHtml += "<button type='button' class='c-file-btn' onclick='setFileDelete(this);'>";
            fileHtml += "    <span>파일 삭제</span>";
            fileHtml += "</button>";
            
            $(fileObj).find("label").css("display", "none");
            $(fileObj).append(fileHtml);
        }
        
        $(fileObj).find(".c-file-txt").val(fileName);
    });
}

//레이어창 닫기
function closeLayer(obj) {
    $(obj).closest(".l-area").removeClass("on");
    
    if ($(".l-area.on").length == 0) {
        $("body").removeClass("scroll-disable").off('scroll touchmove');

        let scrollTop = Math.abs(parseInt($("body").css("top")));

        $("html,body").animate({scrollTop: scrollTop}, 0);
    }
}

