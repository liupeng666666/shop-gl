var csh = 0;
var page = 1;
var class_list;
var goods_dan_list;
var goods_list;
var name1;
var state1;
var type1;
var date1;
var style1;
var classid;
var images;
var edit_images;
var atlas_images;
var atlas_edit_images;
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
            console.log(data);
            var p = data.start;
            $.ajax({
                type: "post",
                url: "../buyshop/BuyGoods/BuyGoodsSelect",
                async: true,
                dataType: "json",
                beforeSend: function (xhr) {
                    xhr.setRequestHeader('Authorization', token);
                },
                data: {
                    page: p,
                    num: 10,
                    name: name1,
                    classid: classid,
                    state: state1,
                    "style": style1,
                    "date": date1,
                    type: type1
                },
                success: function (data) {
                    if (data.code == 100) {
                        var list = [];
                        goods_list = data.goods;
                        for (var i in data.goods) {
                            var goods = data.goods[i];
                            var imgs = goods.img;
                            var img = JSON.parse(imgs).thumbnail;
                            if (img != null && img != "") {
                                img = "<img src=\"" + img + "\" alt=\"\" class=\"gridpic\">";
                            } else {
                                img = "";
                            }
                            list.push({
                                pid: "<input type=\"checkbox\" value='" + goods.pid + "' name='checkbox'>",
                                img: img,
                                title: unde(goods.title),
                                type: zhangtai(goods.type, 4),
                                classid: unde(goods.name),
                                number: unde(goods.number),
                                w_number: unde(goods.w_number),
                                xg_number: unde(goods.xg_number),
                                y_price: unde(goods.y_price),
                                x_price: unde(goods.x_price),
                                createtime: unde(goods.createtime),
                                opentime: unde(goods.opentime),
                                endtime: unde(goods.endtime),
                                estimatetime: unde(goods.estimatetime),
                                iscoupon: zhangtai(goods.iscoupon, 1),
                                isintegral: zhangtai(goods.isintegral, 1),
                                isgive: zhangtai(goods.isgive, 1),
                                unit: unde(goods.unit),
                                top: zhangtai(goods.top, 2),
                                reward: unde(goods.reward),
                                spell_number: unde(goods.spell_number),
                                spell_price: unde(goods.spell_price),
                                state: zhangtai(goods.state, 3),
                                spell_time: unde(goods.spell_time)
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
                "data": "img",
                "orderable": false
            },
            {
                "data": "title",
                "orderable": false
            },
            {
                "data": "type",
                "orderable": false
            },
            {
                "data": "classid",
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
                "data": "xg_number",
                "orderable": false
            },
            {
                "data": "y_price",
                "orderable": false
            },
            {
                "data": "x_price",
                "orderable": false
            },
            {
                "data": "createtime",
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
                "data": "estimatetime",
                "orderable": false
            },
            {
                "data": "state",
                "orderable": false
            },
            {
                "data": "iscoupon",
                "orderable": false
            },
            {
                "data": "isintegral",
                "orderable": false
            },
            {
                "data": "isgive",
                "orderable": false
            },
            {
                "data": "unit",
                "orderable": false
            },
            {
                "data": "top",
                "orderable": false
            },
            {
                "data": "reward",
                "orderable": false
            },
            {
                "data": "spell_number",
                "orderable": false
            },
            {
                "data": "spell_price",
                "orderable": false
            },
            {
                "data": "spell_time",
                "orderable": false
            }

        ]
    });
}

function zhangtai(state, code) {
    if (code == 1) {
        if (state == 0) {
            return "未开启";
        } else {
            return "已开启";
        }
    }
    if (code == 2) {
        if (state == 0) {
            return "未置顶";
        } else {
            return "已置顶";
        }
    }
    if (code == 3) {
        if (state == 0) {
            return "<i class=\"fa fa-check text-success\"></i>";
        } else {
            return "<i class=\"fa fa-times text-danger\"></i>";
        }
    }
    if (code == 4) {
        if (state == 0) {
            return "基础团购";
        } else if (state == 1) {
            return "秒杀";
        } else {
            return "精品团购";
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
    name1 = $("#name").val();
    classid = $("#classid").val();
    state1 = $("#state").val();
    type1 = $("#type").val();
    style1 = $("#style").val();
    date1 = $("#date").val();
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

var ue = UE.getEditor('add_editor');
var ue_edit = UE.getEditor('edit_editor');
UE.Editor.prototype._bkGetActionUrl = UE.Editor.prototype.getActionUrl;
UE.Editor.prototype.getActionUrl = function (action) {
    if (action == 'uploadimage' || action == 'uploadscrawl' || action == 'uploadimage') {
        return '../buyshop/ueditor/imgUpload'; //指定访问路径
    } else if (action == 'uploadvideo') {
        return 'http://a.b.com/video.php';
    } else {
        return this._bkGetActionUrl.call(this, action);
    }
}

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

function add_xz(value) {

    if (value != "" && value != null) {

        for (var i in goods_dan_list) {
            var goods = goods_dan_list[i];
            if (goods.pid == value) {
                var imgs = goods.img;
                images = imgs;
                var img = JSON.parse(imgs).thumbnail;
                if (img != null && img != "") {
                    $("#add_img").attr("src", img);
                    $(".show_hide").show();
                }
                var str = "";
                var atlas = goods.atlas;
                atlas_images = atlas;
                for (var i in JSON.parse(atlas)) {
                    str += "<img src='" + JSON.parse(atlas)[i].thumbnail + "' style=\"width: 100px;\">";
                }
                if (str != "") {
                    $("#add_atlas").html(str);
                    $(".atlas_show_hide").show();
                }

                $("#add_title").val(goods.title);
                $("#add_number").val(goods.number);
                $("#add_xg_number").val(goods.xg_number);
                $("#add_opentime").val(goods.opentime);
                $("#add_endtime").val(goods.endtime);
                $("#add_estimatetime").val(goods.estimatetime);
                $("#add_spell_number").val(goods.spell_number);
                $("#add_spell_price").val(goods.spell_price);
                $("#add_reward").val(goods.reward);
                $("#add_unit").val(goods.unit);
                $("#add_y_price").val(goods.y_price);
                $("#add_x_price").val(goods.x_price);
                $("#add_classid").val(goods.classid);
                $("#add_type").val(goods.type);
                $("#add_iscoupon").val(goods.iscoupon);
                $("#add_isintegral").val(goods.isintegral);
                $("#add_isgive").val(goods.isgive);
                $("#add_top").val(goods.top);
                $("#add_spell_time").val(goods.spell_time);
                ue.setContent(goods.message);
            }
        }
    }
}

function qd_add() {
    var img = images;
    var file = document.getElementById("file-addHead").files;
    var number = $("#add_number").val();
    var title = $("#add_title").val();
    var xg_number = $("#add_xg_number").val();
    var y_price = $("#add_y_price").val();
    var x_price = $("#add_x_price").val();
    var opentime = $("#add_opentime").val();
    var endtime = $("#add_endtime").val();
    var estimatetime = $("#add_estimatetime").val();
    var type = $("#add_type").val();
    var iscoupon = $("#add_iscoupon").val();
    var isintegral = $("#add_isintegral").val();
    var isgive = $("#add_isgive").val();
    var unit = $("#add_unit").val();
    var classid = $("#add_classid").val();
    var top = $("#add_top").val();
    var reward = $("#add_reward").val();
    var spell_number = $("#add_spell_number").val();
    var spell_price = $("#add_spell_price").val();
    var spell_time = $("#add_spell_time").val();
    var message = ue.getContent();
    var atlas = document.getElementById("file-addHead-atlas").files;
    if (images == null && file.length == 0) {
        $("#add_tishi").html("请选择图片");
        $("#add_danger").show();
        return false;
    }
    if (title == null || title == "") {
        $("#add_tishi").html("请填写标题");
        $("#add_danger").show();
        return false;
    }
    if (atlas_images == null && atlas.length == 0) {
        $("#add_tishi").html("请选择图集");
        $("#add_danger").show();
        return false;
    }
    if (number == null || number == "" || number <= 0) {
        $("#add_tishi").html("请填写数量");
        $("#add_danger").show();
        return false;
    }
    if (xg_number == null || xg_number == "" || xg_number <= 0) {
        $("#add_tishi").html("请填写限购数量");
        $("#add_danger").show();
        return false;
    }
    if (y_price == null || y_price == "" || y_price <= 0) {
        $("#add_tishi").html("请填写原价");
        $("#add_danger").show();
        return false;
    }
    if (x_price == null || x_price == "" || x_price <= 0) {
        $("#add_tishi").html("请填写限价");
        $("#add_danger").show();
        return false;
    }
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
    if (estimatetime == null || estimatetime == "") {
        $("#add_tishi").html("请填写送达时间");
        $("#add_danger").show();
        return false;
    }
    if (type == null || type == "") {
        $("#add_tishi").html("请选择类型");
        $("#add_danger").show();
        return false;
    }
    if (classid == null || classid == "") {
        $("#add_tishi").html("请选择分类");
        $("#add_danger").show();
        return false;
    }
    if (iscoupon == null || iscoupon == "") {
        $("#add_tishi").html("请选择是否开启优惠券");
        $("#add_danger").show();
        return false;
    }
    if (isintegral == null || isintegral == "") {
        $("#add_tishi").html("请选择是否抵扣优惠券");
        $("#add_danger").show();
        return false;
    }
    if (isgive == null || isgive == "") {
        $("#add_tishi").html("请选择是否赠送优惠券");
        $("#add_danger").show();
        return false;
    }
    if (unit == null || unit == "") {
        $("#add_tishi").html("请填写单位");
        $("#add_danger").show();
        return false;
    }
    if (top == null || top == "") {
        $("#add_tishi").html("请选择是否置顶");
        $("#add_danger").show();
        return false;
    }
    if (reward == null || reward == "") {
        $("#add_tishi").html("请填写赠送金额");
        $("#add_danger").show();
        return false;
    }
    if (type == 2) {
        if (spell_number == null || spell_number == "" || spell_number <= 0) {
            $("#add_tishi").html("请填写精品团购购买人数");
            $("#add_danger").show();
            return false;
        }
        if (spell_price == null || spell_price == "" || spell_price <= 0) {
            $("#add_tishi").html("请填写精品团购团购价");
            $("#add_danger").show();
            return false;
        }
        if (spell_time == null || spell_time == "" || spell_time <= 0) {
            $("#add_tishi").html("请填写精品团购分享周期");
            $("#add_danger").show();
            return false;
        }
    }

    var fromData = new FormData();
    fromData.append("img", img);
    fromData.append("file", file[0]);
    for (var i in atlas) {
        fromData.append("atlasfile[]", atlas[i]);
    }
    fromData.append("atlas", atlas_images);

    fromData.append("title", title);
    fromData.append("number", number);
    fromData.append("xg_number", xg_number);
    fromData.append("y_price", y_price);
    fromData.append("x_price", x_price);
    fromData.append("message", message);
    fromData.append("opentime", opentime);
    fromData.append("endtime", endtime);
    fromData.append("estimatetime", estimatetime);
    fromData.append("type", type);
    fromData.append("iscoupon", iscoupon);
    fromData.append("isintegral", isintegral);
    fromData.append("isgive", isgive);
    fromData.append("unit", unit);
    fromData.append("classid", classid);
    fromData.append("spell_number", spell_number);
    fromData.append("spell_price", spell_price);
    fromData.append("top", top);
    fromData.append("reward", reward);
    fromData.append("spell_time", spell_time);
    $.ajax({
        type: "post",
        url: "../buyshop/BuyGoods/BuyGoodsInsert",
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
        var str = "";
        for (var i in class_list) {
            var dclass = class_list[i];
            str += "<option value='" + dclass.pid + "'>" + dclass.name + "</option>";
        }
        $("#edit_classid").html(str);

        for (var i in goods_list) {
            var goods = goods_list[i];
            if (goods.pid == t[0]) {
                var imgs = goods.img;
                edit_images = imgs;
                var img = JSON.parse(imgs).thumbnail;
                if (img != null && img != "") {
                    $("#edit_img").attr("src", img);
                }
                var str = "";
                var atlas = goods.atlas;
                if (atlas != null && atlas != "") {

                    atlas_edit_images = atlas;
                    for (var i in JSON.parse(atlas)) {
                        str += "<img src='" + JSON.parse(atlas)[i].thumbnail + "' style=\"width: 100px;\">";
                    }
                    if (str != "") {
                        $("#edit_atlas").html(str);
                    }

                }

                $("#edit_title").val(goods.title);
                $("#edit_number").val(goods.number);
                $("#edit_xg_number").val(goods.xg_number);
                $("#edit_opentime").val(goods.opentime);
                $("#edit_endtime").val(goods.endtime);
                $("#edit_estimatetime").val(goods.estimatetime);
                $("#edit_spell_number").val(goods.spell_number);
                $("#edit_spell_price").val(goods.spell_price);
                $("#edit_reward").val(goods.reward);
                $("#edit_unit").val(goods.unit);
                $("#edit_y_price").val(goods.y_price);
                $("#edit_x_price").val(goods.x_price);
                $("#edit_classid").val(goods.classid);
                if (goods.type == 0) {
                    $(".edit_hide_type").hide();
                    $("#edit_type").html("<option value='0'>基础团购</option>");
                } else if (goods.type == 1) {
                    $(".edit_hide_type").hide();
                    $("#edit_type").html("<option value='1'>秒杀</option>");
                } else {
                    $("#edit_type").html("<option value='2'>精品团购</option>");
                    $(".edit_hide_type").show();
                }

                $("#edit_iscoupon").val(goods.iscoupon);
                $("#edit_isintegral").val(goods.isintegral);
                $("#edit_isgive").val(goods.isgive);
                $("#edit_top").val(goods.top);
                $("#edit_spell_time").val(goods.spell_time);
                ue_edit.setContent(unde(goods.message));

                $("#EditItem").modal("show");

            }
        }
    }
}


function qd_edit() {
    var img = edit_images;
    var file = document.getElementById("file-editHead").files;
    var number = $("#edit_number").val();
    var title = $("#edit_title").val();
    var xg_number = $("#edit_xg_number").val();
    var y_price = $("#edit_y_price").val();
    var x_price = $("#edit_x_price").val();
    var opentime = $("#edit_opentime").val();
    var endtime = $("#edit_endtime").val();
    var estimatetime = $("#edit_estimatetime").val();
    var type = $("#edit_type").val();
    var iscoupon = $("#edit_iscoupon").val();
    var isintegral = $("#edit_isintegral").val();
    var isgive = $("#edit_isgive").val();
    var unit = $("#edit_unit").val();
    var classid = $("#edit_classid").val();
    var top = $("#edit_top").val();
    var reward = $("#edit_reward").val();
    var spell_number = $("#edit_spell_number").val();
    var spell_price = $("#edit_spell_price").val();
    var atlas = document.getElementById("file-editHead-atlas").files;
    var message = ue_edit.getContent();
    var spell_time = $("#edit_spell_time").val();
    if (img == null && file.length == 0) {
        $("#edit_tishi").html("请选择图片");
        $("#edit_danger").show();
        return false;
    }
    if (title == null || title == "") {
        $("#edit_tishi").html("请填写标题");
        $("#edit_danger").show();
        return false;
    }
    if (atlas_edit_images == null && atlas.length == 0) {
        $("#edit_tishi").html("请选择图集");
        $("#edit_danger").show();
        return false;
    }

    if (number == null || number == "" || number <= 0) {
        $("#edit_tishi").html("请填写数量");
        $("#edit_danger").show();
        return false;
    }
    if (xg_number == null || xg_number == "" || xg_number <= 0) {
        $("#edit_tishi").html("请填写限购数量");
        $("#edit_danger").show();
        return false;
    }
    if (y_price == null || y_price == "" || y_price <= 0) {
        $("#edit_tishi").html("请填写原价");
        $("#edit_danger").show();
        return false;
    }
    if (x_price == null || x_price == "" || x_price <= 0) {
        $("#edit_tishi").html("请填写限价");
        $("#edit_danger").show();
        return false;
    }
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
    if (estimatetime == null || estimatetime == "") {
        $("#edit_tishi").html("请填写送达时间");
        $("#edit_danger").show();
        return false;
    }
    if (type == null || type == "") {
        $("#edit_tishi").html("请选择类型");
        $("#edit_danger").show();
        return false;
    }
    if (classid == null || classid == "") {
        $("#edit_tishi").html("请选择分类");
        $("#edit_danger").show();
        return false;
    }
    if (iscoupon == null || iscoupon == "") {
        $("#edit_tishi").html("请选择是否开启优惠券");
        $("#edit_danger").show();
        return false;
    }
    if (isintegral == null || isintegral == "") {
        $("#edit_tishi").html("请选择是否抵扣优惠券");
        $("#edit_danger").show();
        return false;
    }
    if (isgive == null || isgive == "") {
        $("#edit_tishi").html("请选择是否赠送优惠券");
        $("#edit_danger").show();
        return false;
    }
    if (unit == null || unit == "") {
        $("#edit_tishi").html("请填写单位");
        $("#edit_danger").show();
        return false;
    }
    if (top == null || top == "") {
        $("#edit_tishi").html("请选择是否置顶");
        $("#edit_danger").show();
        return false;
    }
    if (reward == null || reward == "") {
        $("#edit_tishi").html("请填写赠送金额");
        $("#edit_danger").show();
        return false;
    }
    if (type == 2) {
        if (spell_number == null || spell_number == "" || spell_number <= 0) {
            $("#edit_tishi").html("请填写精品团购购买人数");
            $("#edit_danger").show();
            return false;
        }
        if (spell_price == null || spell_price == "" || spell_price <= 0) {
            $("#edit_tishi").html("请填写精品团购团购价");
            $("#edit_danger").show();
            return false;
        }
        if (spell_time == null || spell_time == "" || spell_time <= 0) {
            $("#edit_tishi").html("请填写精品团购团购价");
            $("#edit_danger").show();
            return false;
        }
    }

    var fromData = new FormData();
    fromData.append("img", img);
    fromData.append("file", file[0]);
    fromData.append("atlas", atlas_edit_images);
    for (var i in atlas) {
        fromData.append("atlasfile[]", atlas[i]);
    }
    fromData.append("title", title);
    fromData.append("number", number);
    fromData.append("xg_number", xg_number);
    fromData.append("y_price", y_price);
    fromData.append("x_price", x_price);
    fromData.append("message", message);
    fromData.append("opentime", opentime);
    fromData.append("endtime", endtime);
    fromData.append("estimatetime", estimatetime);
    fromData.append("type", type);
    fromData.append("iscoupon", iscoupon);
    fromData.append("isintegral", isintegral);
    fromData.append("isgive", isgive);
    fromData.append("unit", unit);
    fromData.append("classid", classid);
    fromData.append("spell_number", spell_number);
    fromData.append("spell_price", spell_price);
    fromData.append("top", top);
    fromData.append("reward", reward);
    fromData.append("spell_time", spell_time);
    fromData.append("pid", t[0]);
    $.ajax({
        type: "post",
        url: "../buyshop/BuyGoods/BuyGoodsUpdate",
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
        url: "../buyshop/BuyGoods/BuyGoodsUpdateState",
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