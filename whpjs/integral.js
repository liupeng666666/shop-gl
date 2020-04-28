var csh = 0;
var page = 1;
var integral_list;
var name;
var state = "";
var type;
var style;
$(function () {
    dataTable();
})

function dataTable() {
    /* data tables*/
    $('#dataTables-example').DataTable({
        responsive: true,
        pageLength: 10,
        bLengthChange: false,
        searching: false,
        serverSide: true,
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
        //		aaSorting: [
        //			[7, 'desc']
        //		],
        aoColumnDefs: [{
            "bSortable": false,
            "aTargets": [0, 1, 3, 4, 5, 6, 8, 9]
        }],
        ajax: function (data, callback, settings) {
            name = $("#name").val();
            state = $("#state").val();
            type = $("#type").val();
            style = $("#style").val();
            var p = data.start;
            $.ajax({
                type: "post",
                url: "../buyshop/BuyIntegral/BuyIntegralSelect",
                async: true,
                dataType: "json",
                beforeSend: function (xhr) {
                    xhr.setRequestHeader('Authorization', token);
                },
                data: {
                    page: p,
                    num: 10,
                    name: name,
                    state: state,
                    style: style,
                    type: type
                },
                success: function (data) {
                    if (data.code == 100) {
                        var list = [];
                        integral_list = data.integral;
                        for (var i in data.integral) {
                            var integral = data.integral[i];

                            list.push({
                                pid: "<input type=\"checkbox\" value='" + integral.pid + "' name='checkbox'>",
                                title: unde(integral.title),
                                cumulative: unde(integral.cumulative),
                                reduce: unde(integral.reduce),
                                createtime: unde(integral.createtime),
                                type: zhuangtai(integral.type, 2),
                                endtime: zhuangtai(integral.endtime, 3, integral.type),
                                cycle: zhuangtai(integral.cycle, 5, integral.type),
                                style: zhuangtai(integral.style, 4),
                                state: zhuangtai(integral.state, 1)
                            })
                        }
                        var returnData = {};
                        returnData.draw = page; //这里直接自行返回了draw计数器,应该由后台返回
                        returnData.recordsTotal = data.count; //返回数据全部记录
                        returnData.recordsFiltered = data.count; //后台不实现过滤功能，每次查询均视作全部结果
                        returnData.data = list; //返回的数据列表
                        callback(returnData);
                        page += 1;

                    } else if (data.code == 401) {
                        window.location.href = "login.html";
                    }

                },
                error: function (err) {

                }
            })

        },
        "columns": [{
            "data": "pid",
            "orderable": false
        },

            {
                "data": "title",
                "orderable": false
            },
            {
                "data": "cumulative",
                "orderable": false
            },
            {
                "data": "reduce",
                "orderable": false
            },
            {
                "data": "createtime",
                "orderable": false
            },
            {
                "data": "type",
                "orderable": false
            },
            {
                "data": "endtime",
                "orderable": false
            },
            {
                "data": "cycle",
                "orderable": false
            },
            {
                "data": "style",
                "orderable": false
            },
            {
                "data": "state",
                "orderable": false
            }

        ]
    });
}

function zhuangtai(state, code, type) {
    if (code == 2) {
        if (state == 0) {
            return "指定日期";
        } else {
            return "周期";
        }
    }
    if (code == 1) {
        if (state == 0) {
            return "<i class=\"fa fa-check text-success\"></i>";
        } else {
            return "<i class=\"fa fa-times text-danger\"></i>";
        }
    }
    if (code == 4) {
        if (state == 0) {
            return "不累加";
        } else if (state == 1) {
            return "累加";
        }
    }
    if (code == 3) {
        if (type == 0) {
            return state;
        } else {
            return "--";
        }
    }
    if (code == 5) {
        if (type == 1) {
            return state;
        } else {
            return "--";
        }
    }
}


function select() {

    $('#dataTables-example').dataTable().fnClearTable();
    $('#dataTables-example').dataTable().fnDestroy();
    dataTable();
}

function add() {
    $("#addItem").modal("show");
}

jQuery(document).ready(function (a) {

    $('#add_endtime').datetimepicker({
        language: 'zh-CN'
    });
    $('#edit_endtime').datetimepicker({
        language: 'zh-CN'
    });
});


function qd_add() {
    var title = $("#add_title").val();
    var endtime = $("#add_endtime").val();
    var type = $("#add_type").val();
    var style = $("#add_style").val();
    var cumulative = $("#add_cumulative").val();
    var reduce = $("#add_reduce").val();
    var cycle = $("#add_cycle").val();
    if (title == null || title == "") {
        $("#add_tishi").html("请填写积分名称");
        $("#add_danger").show();
        return false;
    }
    if (cumulative == null || cumulative == "" || cumulative <= 0) {
        $("#add_tishi").html("请填写累计金额");
        $("#add_danger").show();
        return false;
    }
    if (reduce == null || reduce == "" || reduce <= 0) {
        $("#add_tishi").html("请填写立减金额");
        $("#add_danger").show();
        return false;
    }
    if (type == 0) {
        if (endtime == null || endtime == "") {
            $("#add_tishi").html("请填写结束时间");
            $("#add_danger").show();
            return false;
        }
        cycle = null;
    } else {
        if (cycle == null || cycle == "" || cycle <= 0) {
            $("#add_tishi").html("请填写周期");
            $("#add_danger").show();
            return false;
        }
        endtime = null;
    }

    $.ajax({
        type: "post",
        url: "../buyshop/BuyIntegral/BuyIntegralInsert",
        async: true,
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        data: {
            title: title,
            cumulative: cumulative,
            reduce: reduce,
            type: type,
            style: style,
            cycle: cycle,
            endtime: endtime
        },
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

function xz_type(value) {

    if (value == 0) {
        $(".open-end").show();
        $(".open-cycle").hide();
    } else {
        $(".open-end").hide();
        $(".open-cycle").show();
    }
}

var t = [];

function update() {
    t = check(1);
    if (t != false) {

        for (var i in integral_list) {
            var integral = integral_list[i];
            if (integral.pid == t[0]) {
                $("#edit_title").val(integral.title);
                $("#edit_cumulative").val(integral.cumulative);
                $("#edit_reduce").val(integral.reduce);
                $("#edit_style").val(integral.style);
                $("#edit_type").val(integral.type);
                $("#edit_endtime").val(integral.endtime);
                $("#edit_cycle").val(integral.cycle);

                if (integral.type == 0) {
                    $(".edit-open-cycle").hide();
                    $(".edit-open-end").show();
                } else {
                    $(".edit-open-cycle").show();
                    $(".edit-open-end").hide();
                }
                $("#EditItem").modal("show");

            }
        }
    }
}

function edit_xz_type(value) {

    if (value == 0) {
        $(".edit-open-end").show();
        $(".edit-open-cycle").hide();
    } else {
        $(".edit-open-end").hide();
        $(".edit-open-cycle").show();
    }
}


function qd_edit() {
    var title = $("#edit_title").val();
    var endtime = $("#edit_endtime").val();
    var type = $("#edit_type").val();
    var style = $("#edit_style").val();
    var cumulative = $("#edit_cumulative").val();
    var reduce = $("#edit_reduce").val();
    var cycle = $("#edit_cycle").val();
    if (title == null || title == "") {
        $("#edit_tishi").html("请填写积分名称");
        $("#edit_danger").show();
        return false;
    }
    if (cumulative == null || cumulative == "" || cumulative <= 0) {
        $("#edit_tishi").html("请填写累计金额");
        $("#edit_danger").show();
        return false;
    }
    if (reduce == null || reduce == "" || reduce <= 0) {
        $("#edit_tishi").html("请填写立减金额");
        $("#edit_danger").show();
        return false;
    }
    if (type == 0) {

        if (endtime == null || endtime == "") {
            $("#edit_tishi").html("请填写结束时间");
            $("#edit_danger").show();
            return false;
        }
        cycle = null;
    } else {
        if (cycle == null || cycle == "" || cycle <= 0) {
            $("#edit_tishi").html("请填写周期");
            $("#edit_danger").show();
            return false;
        }
        endtime = null;
    }


    $.ajax({
        type: "post",
        url: "../buyshop/BuyIntegral/BuyIntegralUpdate",
        async: true,
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        data: {
            title: title,
            cumulative: cumulative,
            reduce: reduce,
            type: type,
            style: style,
            cycle: cycle,
            endtime: endtime,
            pid: t[0]
        },
        success: function (data) {

            if (data.code == 100) {
                select();
                $("#EditItem").modal("hide");
            } else if (data.code == 401) {
                window.location.href = "login.html";
            }

        },
        error: function (err) {

        }
    })
}

function zstate(state) {
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
        url: "../buyshop/BuyIntegral/BuyIntegralUpdateState",
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