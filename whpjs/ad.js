var csh = 0;
var page = 1;
var state = "";
var goods_list;
var ad_list;
var edit_img;
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
            console.log(data);
            var p = data.start;
            $.ajax({
                type: "post",
                url: "../buyshop/BuyAd/BuyAdSelect",
                async: true,
                dataType: "json",
                beforeSend: function (xhr) {
                    xhr.setRequestHeader('Authorization', token);
                },
                data: {
                    page: p,
                    num: 10,
                    state: state
                },
                success: function (data) {
                    if (data.code == 100) {
                        var list = [];
                        ad_list = data.list;
                        for (var i in data.list) {
                            var ad = data.list[i];
                            var str = "";
                            if (ad.img != null && ad.img != "") {
                                str = "<img src=\"" + ad.img + "\" alt=\"\" height='50px'>";
                            }
                            list.push({
                                pid: "<input type=\"checkbox\" value='" + ad.pid + "' name='checkbox'>",
                                img: str,
                                demo: unde(ad.demo),
                                createtime: unde(ad.createtime),
                                state: zhangtai(ad.state, 1),
                                url: unde(ad.title),
                                6: "",
                                7: "",
                                8: "",
                                9: ""
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
                "data": "img",
                "orderable": false
            },
            {
                "data": "demo",
                "orderable": false
            },
            {
                "data": "createtime",
                "orderable": false
            },
            {
                "data": "state",
                "orderable": false
            },

            {
                "data": "url",
                "orderable": false
            }

        ]
    });
}

function zhangtai(state, code) {

    if (code == 1) {
        if (state == 0) {
            return "<i class=\"fa fa-check text-success\"></i>";
        } else {
            return "<i class=\"fa fa-times text-danger\"></i>";
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

function xz_input(st) {
    var sx = "";
    if (st == 1) {
        sx = $("#add_sx").val();
    } else {
        sx = $("#edit_sx").val();
    }

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
                if (st == 1) {
                    $("#add_select").html(str);
                } else {
                    $("#edit_select").html(str);
                }

            },
            error: function (err) {

            }
        })
    }
}

function qd_add() {
    var file = document.getElementById("file-addHead").files;

    var memo = $("#add_memo").val();
    var url = $("#add_select").val();

    if (file.length == 0) {
        $("#add_tishi").html("请选择图片");
        $("#add_danger").show();
        return false;
    }
    if (memo == null || memo == "") {
        $("#add_tishi").html("请填写备注");
        $("#add_danger").show();
        return false;
    }
    if (url == null || url == "") {
        $("#add_tishi").html("请选择跳转商品");
        $("#add_danger").show();
        return false;
    }


    var fromData = new FormData();
    fromData.append("file", file[0]);

    fromData.append("memo", memo);
    fromData.append("url", url);

    $.ajax({
        type: "post",
        url: "../buyshop/BuyAd/BuyAdInsert",
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

function xz_type(value) {

    if (value == 2) {
        $(".hide_type").show();
    } else {
        $(".hide_type").hide();
    }
}

var t = [];

function update() {
    t = check(1);
    if (t != false) {

        for (var i in ad_list) {
            var ad = ad_list[i];
            if (ad.pid == t[0]) {
                edit_img = ad.img;

                $("#edit_img").attr("src", ad.img);
                $("#edit_demo").val(ad.demo);
                $("#edit_select").html("<option value='" + ad.url + "'>" + ad.title + "</option>");
                $("#EditItem").modal("show");

            }
        }
    }
}


function qd_edit() {
    var img = edit_img;
    var file = document.getElementById("file-editHead").files;
    var url = $("#edit_select").val();
    var demo = $("#edit_demo").val();
    if (img == null && file.length == 0) {
        $("#edit_tishi").html("请选择图片");
        $("#edit_danger").show();
        return false;
    }
    if (demo == null || demo == "") {
        $("#edit_tishi").html("请填写备注");
        $("#edit_danger").show();
        return false;
    }

    if (url == null || url == "") {
        $("#edit_tishi").html("请选择跳转商品");
        $("#edit_danger").show();
        return false;
    }


    var fromData = new FormData();
    fromData.append("img", img);
    fromData.append("file", file[0]);

    fromData.append("demo", demo);
    fromData.append("url", url);

    fromData.append("pid", t[0]);
    $.ajax({
        type: "post",
        url: "../buyshop/BuyAd/BuyAdUpdate",
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
                $("#EditItem").modal("hide");
                select();

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
        url: "../buyshop/BuyAd/BuyAdUpdateState",
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