var user_list;
var role_list;
var csh = 0;
$(function () {
    select();
    role();
})

function select() {
    if (csh != 0) {
        $('#dataTables-example').dataTable().fnClearTable();
        $('#dataTables-example').dataTable().fnDestroy();
    } else {
        csh += 1;
    }

    $.ajax({
        type: "post",
        url: "../buyshop/SysUser/SysUserSelect",
        async: true,
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        success: function (data) {
            var str = "";
            if (data.code == 100) {
                user_list = data.user;
                for (var i in data.user) {
                    user = data.user[i];
                    str += "<tr><td><input type=\"checkbox\" value='" + user.pid + "' name='checkbox'></td>";
                    str += " <td class=\"text-center\"><img src=\"" + user.img + "\" alt=\"\" class=\"gridpic\"></td> ";
                    str += "<td>" + unde(user.username) + "</td>";
                    str += "<td>" + unde(user.nickname) + "</td>";
                    str += "<td>" + unde(user.phone) + "</td>";
                    str += "<td>" + unde(user.role_name) + "</td>";
                    str += "<td>" + unde(user.createtime) + "</td>";
                    str += "<td>" + unde(user.updatetime) + "</td>";
                    str += "<td>" + unde(user.c_nickname) + "</td>";
                    if (user.state == 0) {
                        str += "<td class=\"text-center\"><i class=\"fa fa-check text-success\"></i></td>";
                    } else {
                        str += "<td class=\"text-center\"><i class=\"fa fa-times text-danger\"></i></td>";
                    }

                    str += "</tr>";

                }
                $("#user_html").html(str);
                dataTable();
            } else if (data.code == 401) {
                window.location.href = "login.html";
            }

        },
        error: function (err) {

        }
    })
}

function dataTable() {
    /* data tables*/
    $('#dataTables-example').DataTable({
        responsive: true,
        pageLength: 10,
        bLengthChange: false,
        searching: false,
        sPaginationType: "full_numbers",
        oLanguage: {
            oPaginate: {
                sFirst: "<<",
                sPrevious: "<",
                sNext: ">",
                sLast: ">>"
            },
            sInfo: "共  _TOTAL_ 项纪录,  _PAGE_ / _PAGES_ 页",
            sEmptyTable: "没有找到相应结果",

        },
        bAutoWidth: false,
        aaSorting: [
            [7, 'desc']
        ],
        aoColumnDefs: [{
            "bSortable": false,
            "aTargets": [0, 1, 3, 4, 5, 6, 8, 9]
        }]

    });
}

function add() {
    xz_input("");

    $("#addItem").modal("show");
}

function role() {
    $.ajax({
        type: "post",
        url: "../buyshop/SysRole/SysRoleSelect",
        async: true,
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        success: function (data) {

            if (data.code == 100) {
                role_list = data.role;
            } else if (data.code == 401) {
                window.location.href = "login.html";
            }

        },
        error: function (err) {

        }
    })
}

function xz_input(value) {
    var str = "";
    if (value == null || value == "") {
        str += "<option value=''>选择角色</option>";
        for (var i in role_list) {
            var role = role_list[i];
            str += "<option value='" + role.pid + "'>" + role.name + "</option>";
        }
    } else {
        for (var i in role_list) {
            var role = role_list[i];
            if (role.name.indexOf(value) != -1) {
                str += "<option value='" + role.pid + "'>" + role.name + "</option>";
            }

        }
    }
    console.log(str);

    $("#add_select").html(str);
}

function qd_add() {
    var nickname = $("#add_nickname").val();
    var phone = $("#add_phone").val();
    var password = $("#add_password").val();
    var roleid = $("#add_select").val();
    var file = document.getElementById("file-addHead").files;
    if (nickname == null || nickname == "") {
        $("#add_tishi").html("真实姓名不能为空");
        $("#add_danger").show();
        return false;
    }
    if (phone == null || phone == "") {
        $("#add_tishi").html("手机号不能为空");
        $("#add_danger").show();
        return false;
    }
    if (password == null || password == "") {
        $("#add_tishi").html("密码不能为空");
        $("#add_danger").show();
        return false;
    }
    if (roleid == null || roleid == "") {
        $("#add_tishi").html("请选择角色");
        $("#add_danger").show();
        return false;
    }
    if (file.length == 0) {
        $("#add_tishi").html("请选择头像");
        $("#add_danger").show();
        return false;
    }
    var fromData = new FormData();
    fromData.append("nickname", nickname);
    fromData.append("phone", phone);
    fromData.append("password", password);
    fromData.append("roleid", roleid);
    fromData.append("file", file[0]);
    $.ajax({
        type: "post",
        url: "../buyshop/SysUser/SysUserInsert",
        async: true,
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        data: fromData,
        enctype: "multipart/form-data",
        processData: false,
        contentType: false,
        success: function (data) {

            if (data.code == 100) {
                select();
                $("#addItem").modal("hide");
            } else if (data.code == 401) {
                window.location.href = "login.html";
            }

        },
        error: function (err) {

        }
    })
}

var t = [];
var roleid;

function update() {
    t = check(1);
    if (t != false) {
        for (var i in user_list) {
            if (user_list[i].pid == t[0]) {
                $("#update_nickname").val(user_list[i].nickname);
                //$("#file-editHead").val(user_list[i].img);
                roleid = user_list[i].roleid;
                up_xz_input("");
            }
        }
        $("#editItem").modal("show");
    }

}

function up_xz_input(value) {
    var str = "";
    if (value == null || value == "") {
        for (var i in role_list) {
            var role = role_list[i];
            if (role.pid == roleid) {
                str += "<option value='" + role.pid + "' selected>" + role.name + "</option>";
            } else {
                str += "<option value='" + role.pid + "'>" + role.name + "</option>";
            }

        }
    } else {
        for (var i in role_list) {
            var role = role_list[i];
            if (role.name.indexOf(value) != -1) {
                if (role.pid == roleid) {
                    str += "<option value='" + role.pid + "' selected>" + role.name + "</option>";
                } else {
                    str += "<option value='" + role.pid + "'>" + role.name + "</option>";
                }
            }

        }

    }

    $("#update_select").html(str);

}

function qd_update() {
    var nickname = $("#update_nickname").val();
    var file = document.getElementById("file-editHead").files;
    var roleid = $("#update_select").val();
    if (nickname == null || nickname == "") {
        $("#update_tishi").html("真实姓名不能为空");
        $("#update_danger").show();
        return false;
    }
    if (roleid == null || roleid == "") {
        $("#update_tishi").html("角色不能为空");
        $("#update_danger").show();
        return false;
    }
    var fromData = new FormData();
    fromData.append("nickname", nickname);
    fromData.append("roleid", roleid);
    fromData.append("pid", t[0]);
    if (file.length > 0) {
        fromData.append("file", file[0]);
    } else {
        fromData.append("file", "");
    }

    $.ajax({
        type: "post",
        url: "../buyshop/SysUser/SysUserUpdate",
        async: true,
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        data: fromData,
        enctype: "multipart/form-data",
        processData: false,
        contentType: false,
        success: function (data) {

            if (data.code == 100) {
                select();
                $("#editItem").modal("hide");
            } else if (data.code == 401) {
                window.location.href = "login.html";
            }

        },
        error: function (err) {

        }
    })
}

function password() {
    t = check(7);
    if (t != false) {
        $("#memberPWD").modal("show");
    }
}

function qd_pass() {
    var password = $("#pass_pass").val();
    var password_news = $("#pass_pass_news").val();

    if (password == null || password == "") {
        $("#pass_tishi").html("新密码不能为空");
        $("#pass_danger").show();
        return false;
    }
    if (password_news == null || password_news == "") {
        $("#pass_tishi").html("确认密码不能为空");
        $("#pass_danger").show();
        return false;
    }
    if (password_news != password) {
        $("#pass_tishi").html("新密码和确认密码不一致");
        $("#pass_danger").show();
        return false;
    }

    var fromData = new FormData();
    fromData.append("password", password);
    fromData.append("pid", t[0]);

    $.ajax({
        type: "post",
        url: "../buyshop/SysUser/SysUserUpdate",
        async: true,
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        data: fromData,
        enctype: "multipart/form-data",
        processData: false,
        contentType: false,
        success: function (data) {

            if (data.code == 100) {
                select();
                $("#memberPWD").modal("hide");
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
        url: "../buyshop/SysUser/SysUserState",
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