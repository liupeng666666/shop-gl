var mumber_list;
var user_list;
var csh = 0;

var add_lat;
var add_lon;
var up_lat;
var up_lon;
var up_img;
var up_nickname;
$(function () {
    select();
})

function select() {
    if (csh != 0) {
        $('#dataTables-example').dataTable().fnClearTable();
        $('#dataTables-example').dataTable().fnDestroy();
    } else {
        csh += 1;
    }
    var name = $("#name").val();
    $.ajax({
        type: "post",
        url: "../buyshop/BuyMumber/BuyMumberSelect",
        async: true,
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        data: {
            name: name
        },
        success: function (data) {
            var str = "";
            if (data.code == 100) {
                mumber_list = data.mumber;
                for (var i in data.mumber) {
                    var mumber = data.mumber[i];
                    str += "<tr><td><input type=\"checkbox\" value='" + mumber.pid + "' name='checkbox'></td>";
                    str += " <td class=\"text-center\"><img src=\"" + mumber.img + "\" alt=\"\" class=\"gridpic\"></td> ";
                    str += "<td>" + unde(mumber.nickname) + "</td>";
                    str += "<td>" + unde(mumber.fullname) + "</td>";
                    str += "<td>" + unde(mumber.phone) + "</td>";
                    str += "<td>" + unde(mumber.village) + "</td>";
                    str += "<td>" + unde(mumber.address) + "</td>";
                    str += "<td>" + unde(mumber.fee) + "</td>";
                    str += "<td>" + unde(mumber.gps_lat) + "," + unde(mumber.gps_lon) + "</td>";
                    str += "<td>" + unde(mumber.range) + "KM</td>";
                    str += "<td>" + unde(mumber.khao) + "</td>";
                    str += "<td>" + unde(mumber.bank) + "</td>";
                    str += "<td>" + unde(mumber.bank_name) + "</td>";
                    str += "<td>" + unde(mumber.createtime) + "</td>";
                    str += "<td>" + unde(mumber.updatetime) + "</td>";
                    str += "<td>" + unde(mumber.c_nickname) + "</td>";
                    if (mumber.state == 0) {
                        str += "<td class=\"text-center\"><i class=\"fa fa-check text-success\"></i></td>";
                    } else {
                        str += "<td class=\"text-center\"><i class=\"fa fa-times text-danger\"></i></td>";
                    }
                    str += "<td><span class=\"status success\" onclick='maps(\"" + mumber.pid + "\")'>查看地图</span></td>";
                    str += "</tr>";

                }
                $("#mumber_html").html(str);
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
    add_maps();
    $("#addItem").modal("show");
}

function qd_add() {
    var nickname = $("#add_nickname").val();
    var phone = $("#add_phone").val();
    var fullname = $("#add_fullname").val();
    var openid = $("#add_select").val();
    var village = $("#add_village").val();
    var address = $("#add_address").val();
    var range = $("#add_range").val();
    var fee = $("#add_fee").val();
    var khao = $("#add_khao").val();
    var bank = $("#add_bank").val();
    var bank_name = $("#add_bank_name").val();
    var img = $("#add_img").attr("src");
    if (phone == null || phone == "") {
        $("#add_tishi").html("手机号不能为空");
        $("#add_danger").show();
        return false;
    }
    if (fullname == null || fullname == "") {
        $("#add_tishi").html("真实姓名不能为空");
        $("#add_danger").show();
        return false;
    }
    if (openid == null || openid == "") {
        $("#add_tishi").html("请选择一个用户");
        $("#add_danger").show();
        return false;
    }
    if (village == null || village == "") {
        $("#add_tishi").html("所在小区不能为空");
        $("#add_danger").show();
        return false;
    }
    if (address == null || address == "") {
        $("#add_tishi").html("详细地址不能为空");
        $("#add_danger").show();
        return false;
    }
    if (khao == null || khao == "") {
        $("#add_tishi").html("银行卡号不能为空");
        $("#add_danger").show();
        return false;
    }
    if (bank == null || bank == "") {
        $("#add_tishi").html("所在银行不能为空");
        $("#add_danger").show();
        return false;
    }
    if (bank_name == null || bank_name == "") {
        $("#add_tishi").html("持卡人姓名不能为空");
        $("#add_danger").show();
        return false;
    }
    if (add_lat == null || add_lat == "" || add_lon == null || add_lon == "") {
        $("#add_tishi").html("请再地图选择一个位置");
        $("#add_danger").show();
        return false;
    }
    if (range == null || range == "") {
        $("#add_tishi").html("配送范围不能为空");
        $("#add_danger").show();
        return false;
    }
    if (fee == null || fee == "") {
        $("#add_tishi").html("配送费不能为空");
        $("#add_danger").show();
        return false;
    }
    var gps = bMapTransQQMap(add_lon, add_lat);
    $.ajax({
        type: "post",
        url: "../buyshop/BuyMumber/BuyMumberInsert",
        async: true,
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        data: {
            nickname: nickname,
            phone: phone,
            fullname: fullname,
            fee: fee,
            range: range,
            address: address,
            village: village,
            openid: openid,
            img: img,
            gps_lat: gps.lat,
            gps_lon: gps.lng,
            bank: bank,
            khao: khao,
            bank_name: bank_name
        },
        success: function (data) {

            if (data.code == 100) {
                select();
                $("#addItem").modal("hide");
            } else if (data.code == 101) {
                $("#add_tishi").html("该用户已绑定团长");
                $("#add_danger").show();
                return false;
            } else if (data.code == 102) {
                $("#add_tishi").html("团长数量超出当前商家拥有数量，请联系客服升级");
                $("#add_danger").show();
                return false;
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
    if (t != false) {
        for (var i in mumber_list) {
            if (mumber_list[i].pid == t[0]) {
                var mumber = mumber_list[i];
                $("#update_address").val(mumber.address);
                $("#update_fullname").val(mumber.fullname);
                $("#update_nickname").val(mumber.nickname);
                $("#update_range").val(mumber.range);
                $("#update_fee").val(mumber.fee);
                $("#update_phone").val(mumber.phone);
                $("#update_khao").val(mumber.khao);
                $("#update_bank").val(mumber.bank);
                $("#update_bank_name").val(mumber.bank_name);
                $("#update_village").val(mumber.village);
                $("#update_img").attr("src", mumber.img);
                up_lat = mumber.gps_lat;
                up_lon = mumber.gps_lon;
                up_nickname = mumber.nickname;
                up_img = mumber.img;
                update_maps(mumber.gps_lat, mumber.gps_lon, mumber.range);
            }
        }
        $("#editItem").modal("show");
    }

}

function qd_update() {
    var nickname = $("#update_nickname").val();
    var phone = $("#update_phone").val();
    var fullname = $("#update_fullname").val();
    var openid = $("#update_select").val();
    var village = $("#update_village").val();
    var address = $("#update_address").val();
    var range = $("#update_range").val();
    var fee = $("#update_fee").val();
    var khao = $("#update_khao").val();
    var bank = $("#update_bank").val();
    var bank_name = $("#update_bank_name").val();
    var img = $("#update_img").attr("src");
    if (phone == null || phone == "") {
        $("#update_tishi").html("手机号不能为空");
        $("#update_danger").show();
        return false;
    }
    if (fullname == null || fullname == "") {
        $("#update_tishi").html("真实姓名不能为空");
        $("#update_danger").show();
        return false;
    }
    if (village == null || village == "") {
        $("#update_tishi").html("所在小区不能为空");
        $("#update_danger").show();
        return false;
    }
    if (address == null || address == "") {
        $("#update_tishi").html("详细地址不能为空");
        $("#update_danger").show();
        return false;
    }
    if (khao == null || khao == "") {
        $("#add_tishi").html("银行卡号不能为空");
        $("#add_danger").show();
        return false;
    }
    if (bank == null || bank == "") {
        $("#add_tishi").html("所在银行不能为空");
        $("#add_danger").show();
        return false;
    }
    if (bank_name == null || bank_name == "") {
        $("#add_tishi").html("持卡人姓名不能为空");
        $("#add_danger").show();
        return false;
    }
    if (up_lat == null || up_lat == "" || up_lon == null || up_lon == "") {
        $("#update_tishi").html("请再地图选择一个位置");
        $("#update_danger").show();
        return false;
    }
    if (range == null || range == "") {
        $("#update_tishi").html("配送范围不能为空");
        $("#update_danger").show();
        return false;
    }
    if (fee == null || fee == "") {
        $("#update_tishi").html("配送费不能为空");
        $("#update_danger").show();
        return false;
    }
    var gps = bMapTransQQMap(up_lon, up_lat);
    $.ajax({
        type: "post",
        url: "../buyshop/BuyMumber/BuyMumberUpdate",
        async: true,
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        data: {
            pid: t[0],
            nickname: nickname,
            phone: phone,
            fullname: fullname,
            fee: fee,
            range: range,
            address: address,
            village: village,
            openid: openid,
            img: img,
            gps_lat: gps.lat,
            gps_lon: gps.lng,
            bank: bank,
            khao: khao,
            bank_name: bank_name
        },
        success: function (data) {

            if (data.code == 100) {
                select();
                $("#editItem").modal("hide");
            } else if (data.code == 101) {
                $("#update_tishi").html("该用户已绑定团长");
                $("#update_danger").show();
                return false;
            } else if (data.code == 102) {
                $("#update_tishi").html("团长数量超出当前商家拥有数量，请联系客服升级");
                $("#update_danger").show();
                return false;
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
        url: "../buyshop/BuyMumber/BuyMumberState",
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

function xz_input() {
    var name = $("#add_sx").val();
    if (name == null || name == "") {
        $(".show_hide").hide();
    } else {
        user_cx(name, 0);
    }
}

function up_xz_input() {
    var name = $("#update_sx").val();
    if (name == null || name == "") {
        $("#update_select").html("");
        $("#update_nickname").val(up_nickname);
        $("#update_img").attr("src", up_img);
    } else {
        user_cx(name, 1);
    }
}

function user_cx(name, state) {
    $.ajax({
        type: "post",
        url: "../buyshop/SubUser/SubUserSelectXx",
        async: true,
        dataType: "json",
        data: {
            name: name

        },
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        success: function (data) {
            var str = "";
            if (data.code == 100) {

                user_list = data.user;
                for (var i in data.user) {
                    var user = data.user[i];
                    if (i == 0) {
                        if (state == 0) {
                            $("#add_nickname").val(user.nickname);
                            $("#add_img").attr("src", user.img);
                            $(".show_hide").show();
                        } else {
                            $("#update_nickname").val(user.nickname);
                            $("#update_img").attr("src", user.img);

                        }

                    }
                    str += "<option value='" + user.openid + "'>" + user.nickname + "</option>";
                }
                if (data.user.length == 0) {
                    if (state == 0) {
                        $(".show_hide").hide();
                    } else {
                        $("#update_nickname").val(up_nickname);
                        $("#update_img").attr("src", up_img);
                    }

                }
            } else {
                if (state == 0) {
                    $(".show_hide").hide();
                } else {
                    $("#update_nickname").val(up_nickname);
                    $("#update_img").attr("src", up_img);
                }
            }
            if (state == 0) {
                $("#add_select").html(str);
            } else {
                $("#update_select").html(str);
            }

        },
        error: function (err) {

        }
    })

}

function add_xz(value) {

    for (var i in user_list) {
        var user = user_list[i];
        if (user.openid == value) {
            $("#add_nickname").val(user.nickname);
            $("#add_img").attr("src", user.img);
            $(".show_hide").show();
        }
    }
}

function update_xz(value) {

    for (var i in user_list) {
        var user = user_list[i];
        if (user.openid == value) {
            $("#update_nickname").val(user.nickname);
            $("#update_img").attr("src", user.img);
        }
    }
}

function maps(id) {
    $("#mapItem").modal("show");
    for (var i in mumber_list) {
        if (mumber_list[i].pid == id) {
            ditu(mumber_list[i].gps_lat, mumber_list[i].gps_lon, mumber_list[i].range);
        }
    }

}

function ditu(lat, lon, range) {
    var fh = qqMapTransBMap(lon, lat);
    console.log(fh);
    var map = new BMap.Map("map_zs"); // 创建Map实例
    var mPoint = new BMap.Point(fh.lng, fh.lat);
    map.centerAndZoom(mPoint, 14); // 初始化地图,设置中心点坐标和地图级别
    map.enableScrollWheelZoom(true); //开启鼠标滚轮缩放
    map.addOverlay(new BMap.Circle(mPoint, range * 1000));
    var marker = new BMap.Marker(mPoint); // 创建标注
    map.addOverlay(marker); // 将标注添加到地图中
    marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
}

function bMapTransQQMap(lng, lat) {
    let x_pi = 3.14159265358979324 * 3000.0 / 180.0;
    let x = lng - 0.0065;
    let y = lat - 0.006;
    let z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_pi);
    let theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_pi);
    let lngs = z * Math.cos(theta);
    let lats = z * Math.sin(theta);
    return {
        lng: lngs,
        lat: lats
    }
}

function qqMapTransBMap(lng, lat) {
    let x_pi = 3.14159265358979324 * 3000.0 / 180.0;
    let x = lng;
    let y = lat;
    let z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * x_pi);
    let theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * x_pi);
    let lngs = z * Math.cos(theta) + 0.0065;
    let lats = z * Math.sin(theta) + 0.006;
    return {
        lng: lngs,
        lat: lats
    }
}

function add_maps() {
    var buy = JSON.parse(window.sessionStorage.getItem("buy"));
    var map = new BMap.Map("add_js");
    map.centerAndZoom(buy.city_name, 12);
    map.enableScrollWheelZoom(true); //开启鼠标滚轮缩放
    //单击获取点击的经纬度
    map.addEventListener("click", function (e) {
        map.clearOverlays();
        var marker = new BMap.Marker(e.point); // 创建标注
        map.addOverlay(marker); // 将标注添加到地图中
        marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画

        add_lat = e.point.lat;
        add_lon = e.point.lng;
    });

}

function update_maps(lat, lon, range) {
    var fh = qqMapTransBMap(lon, lat);
    console.log(fh);
    var map = new BMap.Map("update_js"); // 创建Map实例
    var mPoint = new BMap.Point(fh.lng, fh.lat);
    map.centerAndZoom(mPoint, 14); // 初始化地图,设置中心点坐标和地图级别
    map.enableScrollWheelZoom(true); //开启鼠标滚轮缩放
    map.addOverlay(new BMap.Circle(mPoint, range * 1000));
    var marker = new BMap.Marker(mPoint); // 创建标注
    map.addOverlay(marker); // 将标注添加到地图中
    marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
    //单击获取点击的经纬度
    map.addEventListener("click", function (e) {
        map.clearOverlays();
        var marker = new BMap.Marker(e.point); // 创建标注
        map.addOverlay(marker); // 将标注添加到地图中
        marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画

        up_lat = e.point.lat;
        up_lon = e.point.lng;
    });

}