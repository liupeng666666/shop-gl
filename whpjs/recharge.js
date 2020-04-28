var recharge_list;
$(function () {
    select();
})

function select() {

    $.ajax({
        type: "post",
        url: "../buyshop/BuyRecharge/BuyRechargeSelect",
        async: true,
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        success: function (data) {
            var str = "";
            if (data.code == 100) {
                recharge_list = data.recharge;
                for (var i in data.recharge) {
                    var recharge = data.recharge[i];
                    str += "<tr><td><input type=\"checkbox\" value='" + recharge.pid + "' name='checkbox'></td>";
                    str += " <td>" + unde(recharge.money) + "</td> ";
                    str += "<td>" + unde(recharge.actual) + "</td>";
                    str += "<td>" + unde(recharge.createtime) + "</td>";
                    if (recharge.state == 0) {
                        str += "<td><i class=\"fa fa-check text-success\"></i></td>";
                    } else {
                        str += "<td><i class=\"fa fa-times text-danger\"></i></td>";
                    }
                    str += "</tr>";

                }
                $("#money_html").html(str);
                //dataTable();
            } else if (data.code == 401) {
                window.location.href = "login.html";
            }

        },
        error: function (err) {

        }
    })
}

function add() {
    $("#addItem").modal("show");
}

function qd_add() {
    var money = $("#add_money").val();
    var actual = $("#add_actual").val();
    if (money == null || money == "" || money <= 0) {
        $("#add_tishi").html("充值金额不能为空或者小于0");
        $("#add_danger").show();
        return false;
    }

    if (actual == null || actual == "" || actual <= 0) {
        $("#add_tishi").html("支付金额不能为空或者小于0");
        $("#add_danger").show();
        return false;
    }
    $.ajax({
        type: "post",
        url: "../buyshop/BuyRecharge/BuyRechargeInsert",
        async: true,
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        data: {
            money: money,
            actual: actual
        },
        success: function (data) {

            if (data.code == 100) {
                select();
                $("#addItem").modal("hide");
            } else if (data.code == 103) {
                $("#add_tishi").html("服务器异常，请稍后再试");
                $("#add_danger").show();
                return false;
            } else if (data.code == 401) {
                window.location.href = "login.html";
            }

        },
        error: function (err) {

        }
    })
}

var t = [];

function update() {

    t = check(1);
    console.log(t);

    if (t != false) {
        for (var i in recharge_list) {
            if (recharge_list[i].pid == t[0]) {
                var recharge = recharge_list[i];
                $("#edit_money").val(recharge.money);
                $("#edit_actual").val(recharge.actual);
            }
        }
        $("#EditItem").modal("show");
    }

}

function qd_edit() {
    var money = $("#edit_money").val();
    var actual = $("#edit_actual").val();
    if (money == null || money == "" || money <= 0) {
        $("#edit_tishi").html("充值金额不能为空或者小于0");
        $("#edit_danger").show();
        return false;
    }

    if (actual == null || actual == "" || actual <= 0) {
        $("#edit_tishi").html("支付金额不能为空或者小于0");
        $("#edit_danger").show();
        return false;
    }
    $.ajax({
        type: "post",
        url: "../buyshop/BuyRecharge/BuyRechargeUpdate",
        async: true,
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        data: {
            money: money,
            actual: actual,
            pid: t[0]
        },
        success: function (data) {

            if (data.code == 100) {
                select();
                $("#EditItem").modal("hide");
            } else if (data.code == 103) {
                $("#update_tishi").html("服务器异常，请稍后再试");
                $("#update_danger").show();
                return false;
            } else if (data.code == 401) {
                window.location.href = "login.html";
            }

        },
        error: function (err) {

        }
    })
}

function state(state) {
    t = check(state + 1);
    if (t != false) {
        var isdel = null;
        var states = null;
        if (state == 1) {
            isdel = 1;
            $("#delItem").modal("show");
        } else if (state == 2) {
            states = 0;
            cz_state(states, isdel, "showPrompt");
        } else {
            states = 1;
            cz_state(states, isdel, "showPrompt");
        }
    }
}

function del_qd() {
    cz_state(null, 1, "delItem");
}

function cz_state(state, isdel, id) {
    $.ajax({
        type: "post",
        url: "../buyshop/BuyRecharge/BuyRechargeUpdateState",
        async: true,
        dataType: "json",
        data: {
            pid: t,
            state: state,
            isdel: isdel

        },
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        success: function (data) {

            if (data.code == 100) {
                if (state != null) {
                    if (state == 0) {
                        $("#state_css").html("<i class=\"fa fa-check fa-lg bg-success\"></i>已启用");
                    } else {
                        $("#state_css").html("<i class=\"fa fa-times fa-lg bg-danger\"></i>已禁用");
                    }
                    $("#" + id).modal("show");
                } else {
                    $("#" + id).modal("hide");
                }

                select();
            }

        },
        error: function (err) {

        }
    })

}