function login() {
    var username = $("#username").val();
    var password = $("#password").val();
    var yzm = $("#yzm").val();
    if (username == null || username == "") {
        $(".tip-content").html("请输入用户名");
        showPop('#tip-public');
        return;
    }
    if (password == null || password == "") {
        $(".tip-content").html("请输入密码");
        showPop('#tip-public');
        return;
    }
    if (yzm == null || yzm == "") {
        $(".tip-content").html("请输入验证码");
        showPop('#tip-public');
        return;
    }

    $.ajax({
        type: "post",
        url: "../buyshop/Auth/SysBuyLogin",
        async: true,
        data: {
            username: username,
            password: password,
            yzm: yzm
        },
        dataType: "json",
        success: function (data) {
            if (data.code == 100) {
                window.sessionStorage.setItem("token", data.token);
                window.sessionStorage.setItem("user", JSON.stringify(data.user));
                window.sessionStorage.setItem("buy", JSON.stringify(data.buy));
                if (data.role.length == 0) {
                    $(".tip-content").html("暂无权限");
                    showPop('#tip-public');
                } else {
                    window.sessionStorage.setItem("role", JSON.stringify(data.role));
                    window.location.href = data.role[0].url;
                }
            } else if (data.code == 101) {
                $(".tip-content").html("参数不完整");
                showPop('#tip-public');
            } else if (data.code == 102) {
                $(".tip-content").html("用户名或者密码错误");
                showPop('#tip-public');
            } else if (data.code == 104) {
                $(".tip-content").html("验证码错误");
                showPop('#tip-public');
            } else {
                $(".tip-content").html("服务器走丢");
                showPop('#tip-public');
            }
        },
        error: function (err) {

        }
    });
}