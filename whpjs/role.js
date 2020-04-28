var role_list;
var role_list_xz;
$(function () {
    select();
})

function select() {
    $.ajax({
        type: "post",
        url: "../buyshop/SysRole/SysRoleSelect",
        async: true,
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        success: function (data) {
            var str = "";
            if (data.code == 100) {
                role_list = data.role;
                for (var i in data.role) {
                    role = data.role[i];
                    str += "<tr><td><input type=\"checkbox\" value='" + role.pid + "' name='checkbox'></td>";
                    str += "<td>" + role.name + "</td>";
                    str += "<td>" + role.createtime + "</td>";
                    str += "<td>" + role.updatetime + "</td>";
                    str += "<td>" + role.nickname + "</td>";
                    if (role.state == 0) {
                        str += "<td class=\"text-center\"><i class=\"fa fa-check text-success\"></i></td>";
                    } else {
                        str += "<td class=\"text-center\"><i class=\"fa fa-times text-danger\"></i></td>";
                    }

                    str += "</tr>";

                }
                $("#role_html").html(str);
            } else if (data.code == 401) {
                window.location.href = "login.html";
            }

        },
        error: function (err) {

        }
    })
}

function add() {
    var role = JSON.parse(window.sessionStorage.getItem("role"));
    var list = [];
    for (var i in role) {
        list.push({
            "id": role[i].pid,
            "pId": role[i].parentid,
            "name": role[i].name,
            checked: false
        });
    }

    console.log(list);
    $.fn.zTree.init($("#treeDemo"), setting, list);
    $("#addItem").modal("show");
}

function qd_add() {
    var name = $("#addname").val();
    var zTreeObj = $.fn.zTree.getZTreeObj("treeDemo");
    var checkedNodes = zTreeObj.getCheckedNodes();
    var list = [];
    for (var i in checkedNodes) {
        list.push(checkedNodes[i].id);
    }

    $.ajax({
        type: "post",
        url: "../buyshop/SysRole/SysRoleInsert",
        async: true,
        dataType: "json",
        data: {
            name: name,
            pid: list
        },
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        success: function (data) {

            if (data.code == 100) {
                $("#addItem").modal("hide");
                select();
            }

        },
        error: function (err) {

        }
    })
}

var t = [];

function update() {
    t = check(1);
    console.log("--" + t);
    if (t != false) {
        module(t[0]);

        for (var i in role_list) {
            var role = role_list[i];
            if (role.pid == t[0]) {
                $("#update_name").val(role.name);
            }
        }

        $("#editItem").modal("show");
    }

}

function module(roleid) {
    $.ajax({
        type: "post",
        url: "../buyshop/SysRole/SysRoleModuleSelect",
        async: true,
        dataType: "json",
        data: {
            roleid: roleid
        },
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        success: function (data) {

            if (data.code == 100) {
                role_list_xz = data.module;
                var role = JSON.parse(window.sessionStorage.getItem("role"));
                var list = [];
                for (var i in role) {
                    var status = false;
                    for (var j in data.module) {
                        if (role[i].pid == data.module[j].pid) {
                            status = true;
                        }
                    }
                    list.push({
                        "id": role[i].pid,
                        "pId": role[i].parentid,
                        "name": role[i].name,
                        checked: status
                    });
                }

                $.fn.zTree.init($("#treeUpdate"), setting, list);
            }

        },
        error: function (err) {

        }
    })
}

function update_qd() {
    var zTreeObj = $.fn.zTree.getZTreeObj("treeUpdate");
    var checkedNodes = zTreeObj.getCheckedNodes();

    var list = [];
    for (var i in checkedNodes) {
        list.push(checkedNodes[i].id);
    }

    var name = $("#update_name").val();

    $.ajax({
        type: "post",
        url: "../buyshop/SysRole/SysRoleUpdate",
        async: true,
        dataType: "json",
        data: {
            roleid: t[0],
            pid: list,
            name: name

        },
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        success: function (data) {

            if (data.code == 100) {
                $("#editItem").modal("hide");
                select();
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
        url: "../buyshop/SysRole/SysRoleState",
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