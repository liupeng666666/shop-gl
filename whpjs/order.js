var csh = 0;
var page = 1;
var mumber_list;
var order_list;
var nickname;
var state;
var paystate;
var iscoupon;
var isintegral;
var isgive;
var ismention;
var spell;
var shipment;
var mumberid;
$(function () {
    dataTable();
    mumber_select();
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
                url: "../buyshop/OrderSubOrder/OrderSubOrderSelect",
                async: true,
                dataType: "json",
                beforeSend: function (xhr) {
                    xhr.setRequestHeader('Authorization', token);
                },
                data: {
                    page: p,
                    num: 10,
                    nickname: nickname,
                    state: state,
                    paystate: paystate,
                    "mumberid": mumberid,
                    "iscoupon": iscoupon,
                    isintegral: isintegral,
                    isgive: isgive,
                    ismention: ismention,
                    spell: spell,
                    shipment: shipment
                },
                success: function (data) {
                    if (data.code == 100) {
                        var list = [];
                        order_list = data.order;
                        for (var i in data.order) {
                            var order = data.order[i];
                            var userimg = "";
                            var mumberimg = "";
                            if (order.userimg != null) {
                                userimg = "<img src='" + order.userimg + "' alt=\"\" class=\"gridpic\">";
                            }
                            if (order.mumberimg != null) {
                                mumberimg = "<img src='" + order.mumberimg + "' alt=\"\" class=\"gridpic\">";
                            }
                            var payment = order.payment;
                            if (order.state == 0 || order.state == 3) {
                                payment = "未支付";
                            }
                            list.push({
                                pid: "<input type=\"checkbox\" value='" + order.pid + "' name='checkbox'>",
                                userimg: userimg,
                                nickname: unde(order.nickname),
                                mumberimg: mumberimg,
                                mumbername: unde(order.fullname),
                                total: unde(order.total),
                                payment: payment,
                                state: zhuangtai(order.state, 4),
                                paystate: zhuangtai(order.paystate, 3),
                                iscoupon: zhuangtai(order.iscoupon, 1),
                                isintegral: zhuangtai(order.isintegral, 1),
                                isgive: zhuangtai(order.isgive, 1),
                                ismention: zhuangtai(order.ismention, 2),
                                spell: zhuangtai(order.spell, 5),
                                shipment: zhuangtai(order.shipment, 6),
                                createtime: unde(order.createtime),
                                address: unde(order.province) + unde(order.city) + unde(order.area) + unde(order.message),
                                trade: unde(order.trade),
                                pslc: "<span class=\"status success\" onclick=\"log('" + order.pid + "')\">购买流程日志</span>",
                                xxxx: "<span class=\"status success\" onclick=\"list('" + order.pid + "')\">详细信息</span>"
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
                "data": "userimg",
                "orderable": false
            },
            {
                "data": "nickname",
                "orderable": false
            },
            {
                "data": "mumberimg",
                "orderable": false
            },
            {
                "data": "mumbername",
                "orderable": false
            },

            {
                "data": "total",
                "orderable": false
            },
            {
                "data": "payment",
                "orderable": false
            },
            {
                "data": "state",
                "orderable": false
            },
            {
                "data": "paystate",
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
                "data": "ismention",
                "orderable": false
            },
            {
                "data": "spell",
                "orderable": false
            },
            {
                "data": "shipment",
                "orderable": false
            },
            {
                "data": "createtime",
                "orderable": false
            },
            {
                "data": "address",
                "orderable": false
            },
            {
                "data": "trade",
                "orderable": false
            },
            {
                "data": "pslc",
                "orderable": false
            },
            {
                "data": "xxxx",
                "orderable": false
            }

        ]
    });
}

function zhuangtai(state, code) {
    if (code == 1) {
        if (state == 0) {
            return "未开启";
        } else if (state == 1) {
            return "已开启";
        } else {
            return "未支付";
        }
    }
    if (code == 2) {
        if (state == 0) {
            return "自提";
        } else if (state == 1) {
            return "派送";
        } else {
            return "未支付";
        }
    }
    if (code == 3) {
        if (state == 0) {
            return "余额支付";
        } else if (state == 1) {
            return "微信支付";
        } else {
            return "未支付";
        }
    }
    if (code == 5) {
        if (state == 0) {
            return "否";
        } else if (state == 1) {
            return "是";
        } else {
            return "未支付";
        }
    }
    if (code == 6) {
        if (state == 0) {
            return "未出货";
        } else if (state == 1) {
            return "已出货";
        } else if (state == 2) {
            return "已收货";
        } else {
            return "未支付";
        }
    }
    if (code == 4) {
        if (state == 0) {
            return "创建订单";
        } else if (state == 1) {
            return "已付款";
        } else if (state == 2) {
            return "已完成";
        } else if (state == 3) {
            return "已取消";
        } else if (state == 4) {
            return "申请售后";
        } else if (state == 5) {
            return "已完成售后";
        } else {
            return "未支付";
        }
    }

    if (code == 7) {
        if (state == 0) {
            return "创建订单";
        } else if (state == 1) {
            return "已付款";
        } else if (state == 2) {
            return "已完成";
        } else if (state == 3) {
            return "已取消";
        } else if (state == 4) {
            return "申请售后";
        } else if (state == 5) {
            return "已完成售后";
        } else if (state == 6) {
            return "已发货";
        }
    }

    if (code == 8) {
        if (state == 0) {
            return "正常交易";
        } else if (state == 1) {
            return "已退货";
        } else {
            return "未支付";
        }
    }
}

function mumber_select() {
    $.ajax({
        type: "post",
        url: "../buyshop/BuyMumber/BuyMumberSelect",
        async: true,
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        success: function (data) {
            var str = "<option value=''>团长</option>";
            if (data.code == 100) {
                for (var i in data.mumber) {
                    var mumber = data.mumber[i];
                    str += "<option value='" + mumber.pid + "'>" + mumber.fullname + "</option>";
                }
            }
            $("#mumberid").html(str);
        },
        error: function (err) {

        }
    })
}

function select() {

    nickname = $("#nickname").val();
    state = $("#state").val();
    paystate = $("#paystate").val();
    iscoupon = $("#iscoupon").val();
    isintegral = $("#isintegral").val();
    isgive = $("#isgive").val();
    ismention = $("#ismention").val();
    spell = $("#spell").val();
    shipment = $("#shipment").val();
    mumberid = $("#mumberid").val();
    $('#dataTables-example').dataTable().fnClearTable();
    $('#dataTables-example').dataTable().fnDestroy();
    dataTable();
}

function log(orderid) {

    $.ajax({
        type: "post",
        url: "../buyshop/OrderSubOrder/OrderSubOrderLogSelect",
        async: true,
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        data: {orderid: orderid},
        success: function (data) {
            var str = "";
            if (data.code == 100) {
                for (var i in data.log) {
                    var log = data.log[i];
                    str += "<tr>";
                    str += "<td>" + log.createtime + "</td>";
                    str += "<td>" + zhuangtai(log.state, 7) + "</td>";
                    str += "</tr>";
                }
            }
            $("#log_html").html(str);
            $("#LogItem").modal("show");
        },
        error: function (err) {

        }
    })
}


function list(orderid) {

    $.ajax({
        type: "post",
        url: "../buyshop/OrderSubOrder/OrderSubOrderListSelect",
        async: true,
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        data: {orderid: orderid},
        success: function (data) {
            var str = "";
            if (data.code == 100) {
                for (var i in data.list) {
                    var list = data.list[i];

                    var imgs = list.img;
                    var img = JSON.parse(imgs).thumbnail;
                    if (img != null && img != "") {
                        img = "<img src=\"" + img + "\" alt=\"\" class=\"gridpic\">";
                    } else {
                        img = "";
                    }


                    str += "<tr>";
                    str += "<td>" + img + "</td>";
                    str += "<td>" + unde(list.title) + "</td>";
                    str += "<td>" + list.price + "</td>";
                    str += "<td>" + list.number + "</td>";
                    str += "<td>" + zhuangtai(list.state, 8) + "</td>";
                    str += "</tr>";
                }
            }
            $("#list_html").html(str);
            $("#ListItem").modal("show");
        },
        error: function (err) {

        }
    })
}
