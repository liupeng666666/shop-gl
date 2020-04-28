var token = "";

$(function () {
    token = window.sessionStorage.getItem("token");
    var role = JSON.parse(window.sessionStorage.getItem("role"));
    var buy = JSON.parse(window.sessionStorage.getItem("buy"));
    $("#left_user_img").attr("src", buy.img);
    $("#left_user_nickname").html(buy.nickname);
    var str = "<li class=\"menu-title\">MENU</li>";
    for (var i in role) {
        if (role[i].level == 1) {

            var st = digui(role[i].pid, "", role);
            if (st != null && st != "") {

                var num = digui_num(role[i].pid, role);
                if (num > 0) {
                    str += "<li class=\" with-sub active\">";
                } else {
                    str += "<li class=\"with-sub\">";
                }
            } else {

                if (role[i].url == url()) {
                    str += "<li class=\"active\">";
                } else {
                    str += "<li>";
                }
            }

            str += "<a href=\"" + role[i].url + "\" class=\"waves-effect  waves-light\">";
            if (st != null && st != "") {
                str += "<span class=\"s-caret\"><i class=\"fa fa-angle-down\"></i></span>";
            }
            str += "<span class=\"s-icon\"><i class=\"ti-home\"></i></span>";
            str += "<span class=\"s-text\">" + role[i].name + "</span>";
            str += "</a>";
            if (st != null && str != "") {
                if (num > 0) {
                    str += "<ul style='display:block'>";
                } else {
                    str += "<ul>";
                }

                str += st;
                str += "</ul>";
            }
            str += "</li>";
        }
    }

    $(".sidebar-menu").html(str);
    LoginIp();
})

function digui(id, str, role) {
    for (var i in role) {
        if (role[i].parentid == id) {
            str += "<li><a href=\"" + role[i].url + "\">" + role[i].name + "</a></li>";
        }
    }
    return str;
}

function url() {
    var test = window.location.href;
    test = test.substring(0, test.lastIndexOf('.html')) + ".html";
    var d1 = test.substring(test.lastIndexOf('/') + 1);
    return d1;
}

function digui_num(id, role) {
    var num = 0;
    for (var i in role) {
        if (role[i].parentid == id) {
            if (role[i].url == url()) {
                num += 1;
            }
        }
    }
    return num;
}

var setting = {
    check: {
        enable: true,
        chkboxType: {
            "Y": "ps",
            "N": "ps"
        },
    },
    data: {
        simpleData: {
            enable: true
        }
    },
    view: {
        showIcon: true,
    },
    callback: {
        onClick: zTreebeforeClick
    }
};

function zTreebeforeClick() {

}

function check(state) {
    var pid_array = new Array();
    var str = $("input[name='checkbox']");
    var objarray = str.length;
    var chestr = 0;
    var pid;
    for (i = 0; i < objarray; i++) {
        if (str[i].checked == true) {
            pid = str[i].value;
            chestr += 1;
            pid_array.push(pid);
        }
    }
    if (state == 1) {
        if (chestr != 1) {
            $("#tip-public-div").html("修改只能勾选一条记录！");
            $("#tip-public").modal("show");
            return false;
        }
    } else if (state == 2) {
        if (chestr == 0) {
            $("#tip-public-div").html("删除不能少于一条记录！");
            $("#tip-public").modal("show");
            return false;
        }
    } else if (state == 3) {
        if (chestr == 0) {
            $("#tip-public-div").html("启用不能少于一条记录！");
            $("#tip-public").modal("show");
            return false;
        }
    } else if (state == 4) {
        if (chestr == 0) {
            $("#tip-public-div").html("禁止不能少于一条记录！");
            $("#tip-public").modal("show");
            return false;
        }
    } else if (state == 5) {
        if (chestr == 0) {
            $("#tip-public-div").html("更新不能少于一条记录！");
            $("#tip-public").modal("show");
            return false;
        }
    } else if (state == 6) {
        if (chestr == 0) {
            $("#tip-public-div").html("取消不能少于一条记录！");
            $("#tip-public").modal("show");
            return false;
        }
    } else if (state == 7) {
        if (chestr != 1) {
            $("#tip-public-div").html("初始化密码只能勾选一条记录！");
            $("#tip-public").modal("show");
            return false;
        }
    }
    return pid_array;
}

function unde(value) {

    if (typeof (value) == "undefined") {
        return "";
    } else {
        return value;
    }
}

/**
 * 获取url 地址栏请求参数数据
 */
function GetRequest() {
    var url = location.search; // 获取url中"?"符后的字串
    var theRequest = new Object();
    if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        strs = str.split("&");
        for (var i = 0; i < strs.length; i++) {
            theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
        }
    }
    return theRequest;
}


function LoginIp() {
    var loginState = window.sessionStorage.getItem("loginState");
    if (loginState != 1) {
        LoginIpLog();
    } else {
        var loginIp = window.sessionStorage.getItem("loginIp");
        var loginAddress = window.sessionStorage.getItem("loginAddress");
        $("#iplog").attr("title", "登录IP为：" + loginIp + "， IP地址：" + loginAddress);
    }
}

function LoginIpLog() {

    $.ajax({
        type: "post",
        url: "../buyshop/BuyIpLog/BuyIpLogSelect",
        async: true,
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        success: function (data) {
            var str = "";
            if (data.code == 100) {
                window.sessionStorage.setItem("loginState", 1);
                window.sessionStorage.setItem("loginIp", data.log.ip);
                window.sessionStorage.setItem("loginAddress", data.log.region + data.log.city);

                $("#iplog").attr("title", "登录IP为：" + data.log.ip + "， IP地址：" + data.log.region + data.log.city);
            }

        },
        error: function (err) {

        }
    })
}