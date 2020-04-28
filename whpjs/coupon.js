var csh = 0;
var page = 1;
var class_list;
var coupon_list;
var goods_list;
var name;
var state = "";
var type;
var style;
var classid;
var sq;
$(function () {
    dataTable();
    class_select();
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
            classid = $("#classid").val();
            state = $("#state").val();
            type = $("#type").val();
            style = $("#style").val();
            sq = $("#sq").val();
            var p = data.start;
            $.ajax({
                type: "post",
                url: "../buyshop/BuyCoupon/BuyCouponSelect",
                async: true,
                dataType: "json",
                beforeSend: function (xhr) {
                    xhr.setRequestHeader('Authorization', token);
                },
                data: {
                    page: p,
                    num: 10,
                    name: name,
                    classid: classid,
                    state: state,
                    style: style,
                    type: type,
                    sq: sq
                },
                success: function (data) {
                    if (data.code == 100) {
                        var list = [];
                        coupon_list = data.coupon;
                        for (var i in data.coupon) {
                            var coupon = data.coupon[i];
                            var imgs = coupon.goods_img;
                            var goods_img = "";
                            if (imgs != null && imgs != "") {
                                goods_img = JSON.parse(imgs).thumbnail;
                                if (goods_img != null && goods_img != "") {
                                    goods_img = "<img src=\"" + goods_img + "\" alt=\"\" class=\"gridpic\">";
                                } else {
                                    goods_img = "";
                                }
                            }
                            var class_img = "";
                            if (coupon.class_img != null && coupon.class_img != "") {
                                class_img = "<img src=\"" + coupon.class_img + "\" alt=\"\" class=\"gridpic\">";
                            }

                            list.push({
                                pid: "<input type=\"checkbox\" value='" + coupon.pid + "' name='checkbox'>",
                                title: unde(coupon.title),
                                cumulative: unde(coupon.cumulative),
                                reduce: unde(coupon.reduce),
                                style: zhuangtai(coupon.style, 4),
                                number: unde(coupon.number),
                                w_number: unde(coupon.w_number),
                                createtime: unde(coupon.createtime),
                                type: zhuangtai(coupon.type, 2),
                                opentime: zhuangtai(coupon.opentime, 3, coupon.type),
                                endtime: zhuangtai(coupon.endtime, 3, coupon.type),
                                cycle: zhuangtai(coupon.cycle, 5, coupon.type),
                                class_img: class_img,
                                class_name: unde(coupon.class_name),
                                goods_img: goods_img,
                                goods_title: unde(coupon.goods_title),
                                state: zhuangtai(coupon.state, 1)
                            })
                        }
                        console.log(list);
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
                "data": "style",
                "orderable": false
            },

            {
                "data": "number",
                "orderable": false
            },
            {
                "data": "w_number",
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
                "data": "opentime",
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
                "data": "class_img",
                "orderable": false
            },
            {
                "data": "class_name",
                "orderable": false
            },
            {
                "data": "goods_img",
                "orderable": false
            },
            {
                "data": "goods_title",
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
            return "全场通用";
        } else if (state == 1) {
            return "新用户";
        } else if (state == 2) {
            return "分类";
        } else if (state == 3) {
            return "指定商品";
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

function class_select() {
    $.ajax({
        type: "post",
        url: "../buyshop/BuyClass/BuyClassSelect",
        async: true,
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        success: function (data) {
            var str = "<option value=''>分类</option>";
            if (data.code == 100) {
                class_list = data.list;
                for (var i in data.list) {
                    var dclass = data.list[i];
                    str += "<option value='" + dclass.pid + "'>" + dclass.name + "</option>";
                }
            }
            $("#classid").html(str);
        },
        error: function (err) {

        }
    })
}

function select() {

    $('#dataTables-example').dataTable().fnClearTable();
    $('#dataTables-example').dataTable().fnDestroy();
    dataTable();
}

function add() {
    var str = "<option value=''>选择</option>";
    for (var i in class_list) {
        var dclass = class_list[i];
        str += "<option value='" + dclass.pid + "'>" + dclass.name + "</option>";
    }
    $("#add_classid").html(str);
    $("#addItem").modal("show");
}

jQuery(document).ready(function (a) {
    $('#add_opentime').datetimepicker({
        language: 'zh-CN'
    });
    $('#add_endtime').datetimepicker({
        language: 'zh-CN'
    });
    $('#edit_opentime').datetimepicker({
        language: 'zh-CN'
    });
    $('#edit_endtime').datetimepicker({
        language: 'zh-CN'
    });
});

function xz_input() {

    var sx = $("#add_sx").val();
    if (sx != null && sx != "") {
        $.ajax({
            type: "post",
            url: "../buyshop/BuyGoods/BuyGoodsDan",
            async: true,
            dataType: "json",
            beforeSend: function (xhr) {
                xhr.setRequestHeader('Authorization', token);
            },
            data: {
                name: sx
            },
            success: function (data) {
                var str = "<option value=''>选择</option>";
                if (data.code == 100) {
                    goods_dan_list = data.goods;
                    for (var i in data.goods) {
                        var goods = data.goods[i];
                        str += "<option value='" + goods.pid + "'>" + goods.title + "</option>";
                    }
                }
                $("#add_select").html(str);
            },
            error: function (err) {

            }
        })
    }
}

function qd_add() {
    var number = $("#add_number").val();
    var title = $("#add_title").val();
    var opentime = $("#add_opentime").val();
    var endtime = $("#add_endtime").val();
    var type = $("#add_type").val();
    var style = $("#add_style").val();
    var classid = $("#add_classid").val();
    var goodsid = $("#add_select").val();
    var cumulative = $("#add_cumulative").val();
    var reduce = $("#add_reduce").val();
    var cycle = $("#add_cycle").val();
    if (title == null || title == "") {
        $("#add_tishi").html("请填写优惠券名称");
        $("#add_danger").show();
        return false;
    }
    if (number == null || number == "" || number <= 0) {
        $("#add_tishi").html("请填写数量");
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

        if (opentime == null || opentime == "") {
            $("#add_tishi").html("请填写开启时间");
            $("#add_danger").show();
            return false;
        }
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
        opentime = null;
        endtime = null;
    }

    if (style == 2) {
        if (classid == null || classid == "") {
            $("#add_tishi").html("请选择分类");
            $("#add_danger").show();
            return false;
        }
        goodsid = null;
    } else if (style == 3) {
        if (goodsid == null || goodsid == "") {
            $("#add_tishi").html("请选择商品");
            $("#add_danger").show();
            return false;
        }
        classid = null;
    } else {
        goodsid = null;
        classid = null;
    }

    $.ajax({
        type: "post",
        url: "../buyshop/BuyCoupon/BuyCouponInsert",
        async: true,
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        data: {
            title: title,
            number: number,
            cumulative: cumulative,
            reduce: reduce,
            type: type,
            style: style,
            cycle: cycle,
            opentime: opentime,
            endtime: endtime,
            classid: classid,
            goodsid: goodsid
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

function xz_style(value) {

    if (value == 2) {
        $(".style-class").show();
        $(".style-goods").hide();
    } else if (value == 3) {
        $(".style-class").hide();
        $(".style-goods").show();
    } else {
        $(".style-class").hide();
        $(".style-goods").hide();
    }
}

var t = [];

function update() {
    t = check(1);
    if (t != false) {
        var str = "";
        for (var i in class_list) {
            var dclass = class_list[i];
            str += "<option value='" + dclass.pid + "'>" + dclass.name + "</option>";
        }
        $("#edit_classid").html(str);

        for (var i in coupon_list) {
            var coupon = coupon_list[i];
            if (coupon.pid == t[0]) {
                $("#edit_title").val(coupon.title);
                $("#edit_number").val(coupon.number);
                $("#edit_cumulative").val(coupon.cumulative);
                $("#edit_reduce").val(coupon.reduce);
                $("#edit_style").val(coupon.style);
                $("#edit_type").val(coupon.type);
                $("#edit_opentime").val(coupon.opentime);
                $("#edit_endtime").val(coupon.endtime);
                $("#edit_cycle").val(coupon.cycle);

                if (coupon.style == 2) {
                    $("#edit_classid").val(coupon.classid);
                    $(".edit-style-class").show();
                    $(".edit-style-goods").hide();
                } else if (coupon.style == 3) {
                    $("#edit_select").html("<option value='" + coupon.goodsid + "'>" + coupon.goods_title + "</option>");
                    $(".edit-style-class").hide();
                    $(".edit-style-goods").show();
                } else {
                    $(".edit-style-class").hide();
                    $(".edit-style-goods").hide();
                }

                if (coupon.type == 0) {
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

function edit_xz_style(value) {

    if (value == 2) {
        $(".edit-style-class").show();
        $(".edit-style-goods").hide();
    } else if (value == 3) {
        $(".edit-style-class").hide();
        $(".edit-style-goods").show();
    } else {
        $(".edit-style-class").hide();
        $(".edit-style-goods").hide();
    }
}


function qd_edit() {
    var number = $("#edit_number").val();
    var title = $("#edit_title").val();
    var opentime = $("#edit_opentime").val();
    var endtime = $("#edit_endtime").val();
    var type = $("#edit_type").val();
    var style = $("#edit_style").val();
    var classid = $("#edit_classid").val();
    var goodsid = $("#edit_select").val();
    var cumulative = $("#edit_cumulative").val();
    var reduce = $("#edit_reduce").val();
    var cycle = $("#edit_cycle").val();
    if (title == null || title == "") {
        $("#edit_tishi").html("请填写优惠券名称");
        $("#edit_danger").show();
        return false;
    }
    if (number == null || number == "" || number <= 0) {
        $("#edit_tishi").html("请填写数量");
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

        if (opentime == null || opentime == "") {
            $("#edit_tishi").html("请填写开启时间");
            $("#edit_danger").show();
            return false;
        }
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
        opentime = null;
        endtime = null;
    }

    if (style == 2) {
        if (classid == null || classid == "") {
            $("#edit_tishi").html("请选择分类");
            $("#edit_danger").show();
            return false;
        }
        goodsid = null;
    } else if (style == 3) {
        if (goodsid == null || goodsid == "") {
            $("#edit_tishi").html("请选择商品");
            $("#edit_danger").show();
            return false;
        }
        classid = null;
    } else {
        goodsid = null;
        classid = null;
    }

    $.ajax({
        type: "post",
        url: "../buyshop/BuyCoupon/BuyCouponUpdate",
        async: true,
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        data: {
            title: title,
            number: number,
            cumulative: cumulative,
            reduce: reduce,
            type: type,
            style: style,
            cycle: cycle,
            opentime: opentime,
            endtime: endtime,
            classid: classid,
            goodsid: goodsid,
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
        url: "../buyshop/BuyCoupon/BuyCouponUpdateState",
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