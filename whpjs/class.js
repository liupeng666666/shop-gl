var class_list;
var admin_class_list;
var csh = 0;
var xz_img;
var edit_xz_img;
$(function () {
    select();
    xz_input();
})

function select() {
//	if(csh != 0) {
//		$('#dataTables-example').dataTable().fnClearTable();
//		$('#dataTables-example').dataTable().fnDestroy();
//	} else {
//		csh += 1;
//	}
    $.ajax({
        type: "post",
        url: "../buyshop/BuyClass/BuyClassSelectState",
        async: true,
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        success: function (data) {
            var str = "";
            if (data.code == 100) {
                class_list = data.list;
                for (var i in data.list) {
                    var dclass = data.list[i];
                    str += "<tr><td><input type=\"checkbox\" value='" + dclass.pid + "' name='checkbox'></td>";
                    str += " <td class=\"text-center\"><img src=\"" + dclass.img + "\" alt=\"\" class=\"gridpic\"></td> ";
                    str += "<td>" + unde(dclass.name) + "</td>";
                    str += "<td>" + unde(dclass.createtime) + "</td>";
                    if (dclass.state == 0) {
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

//function dataTable() {
//	/* data tables*/
//	$('#dataTables-example').DataTable({
//		responsive: true,
//		pageLength: 10,
//		bLengthChange: false,
//		searching: false,
//		sPaginationType: "full_numbers",
//		oLanguage: {
//			oPaginate: {
//				sFirst: "<<",
//				sPrevious: "<",
//				sNext: ">",
//				sLast: ">>"
//			},
//			sInfo: "共  _TOTAL_ 项纪录,  _PAGE_ / _PAGES_ 页",
//			sEmptyTable: "没有找到相应结果",
//
//		},
//		bAutoWidth: false,
//		aoColumnDefs: [{
//			"bSortable": false,
//			"aTargets": [0, 1, 3, 4, 5, 6, 8, 9]
//		}]
//
//	});
//}

function xz_input() {


    $.ajax({
        type: "post",
        url: "../buyshop/BuyClass/BuyClassAdminSelect",
        async: true,
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        success: function (data) {
            var str = "<option value=''>选择</option>";
            if (data.code == 100) {
                admin_class_list = data.list;
                for (var i in data.list) {
                    var dclass = data.list[i];
                    str += "<option value='" + dclass.pid + "'>" + dclass.name + "</option>";
                }
            }
            $("#add_select").html(str);
        },
        error: function (err) {

        }
    })

}


function add_xz(value) {

    if (value != "" && value != null) {

        for (var i in admin_class_list) {
            var dclass = admin_class_list[i];
            if (dclass.pid == value) {
                if (dclass.img != null && dclass.img != "") {
                    xz_img = dclass.img;
                    $("#add_img").attr("src", dclass.img);
                    $(".show_hide").show();
                }
                $("#add_name").val(dclass.name);

            }
        }
    }
}


function add() {
    $("#addItem").modal("show");
}

function qd_add() {
    var name = $("#add_name").val();
    var file = document.getElementById("file-addHead").files;
    if (name == null || name == "") {
        $("#add_tishi").html("分类名称不能为空");
        $("#add_danger").show();
        return false;
    }

    if (xz_img == null && file.length == 0) {
        $("#add_tishi").html("请选择图片");
        $("#add_danger").show();
        return false;
    }

    var fromData = new FormData();
    fromData.append("img", xz_img);
    fromData.append("file", file[0]);
    fromData.append("name", name);
    $.ajax({
        type: "post",
        url: "../buyshop/BuyClass/BuyClassInsert",
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
        for (var i in class_list) {
            if (class_list[i].pid == t[0]) {
                console.log("-----");
                var dclass = class_list[i];
                edit_xz_img = dclass.img;
                $("#edit_name").val(dclass.name);
                $("#edit_img").attr("src", dclass.img);
            }
        }
        $("#EditItem").modal("show");
    }

}

function qd_edit() {
    var name = $("#edit_name").val();
    var file = document.getElementById("file-editHead").files;
    if (name == null || name == "") {
        $("#edit_tishi").html("分类名称不能为空");
        $("#edit_danger").show();
        return false;
    }

    if (edit_xz_img == null && file.length == 0) {
        $("#edit_tishi").html("请选择图片");
        $("#edit_danger").show();
        return false;
    }

    var fromData = new FormData();
    fromData.append("img", edit_xz_img);
    fromData.append("file", file[0]);
    fromData.append("name", name);
    fromData.append("pid", t[0]);
    $.ajax({
        type: "post",
        url: "../buyshop/BuyClass/BuyClassUpdate",
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
        url: "../buyshop/BuyClass/BuyClassUpdateState",
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

