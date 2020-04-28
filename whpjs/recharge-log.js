var csh = 0;
var type;
var nickname;
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
            var p = data.start;
            var page = parseInt(p / 10) + 1;
            $.ajax({
                type: "post",
                url: "../buyshop/BuyRecharge/BuyRechargePayLogSelect",
                async: true,
                dataType: "json",
                beforeSend: function (xhr) {
                    xhr.setRequestHeader('Authorization', token);
                },
                data: {
                    type: type,
                    nickname: nickname,
                    page: p,
                    num: 10
                },
                success: function (data) {
                    if (data.code == 100) {
                        var list = [];
                        for (var i in data.paylog) {
                            var paylog = data.paylog[i];
                            var img = "";
                            if (paylog.img != null && paylog.img != "") {
                                img = "<img src=\"" + paylog.img + "\" alt=\"\" class=\"gridpic\">";
                            }
                            list.push({
                                pid: "<input type=\"checkbox\" value='" + paylog.pid + "' name='checkbox'>",
                                img: img,
                                nickname: unde(paylog.nickname),
                                type: zhuangtai(paylog.type, 1),
                                money: unde(paylog.money),
                                orderid: unde(paylog.orderid),
                                createtime: unde(paylog.createtime),
                                7: "",
                                8: "",
                                9: ""
                            })
                        }
                        console.log(list);
                        var returnData = {};
                        returnData.draw = page; //这里直接自行返回了draw计数器,应该由后台返回
                        returnData.recordsTotal = data.count; //返回数据全部记录
                        returnData.recordsFiltered = data.count; //后台不实现过滤功能，每次查询均视作全部结果
                        returnData.data = list; //返回的数据列表
                        callback(returnData);

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
                "data": "nickname",
                "orderable": false
            },
            {
                "data": "type",
                "orderable": false
            },
            {
                "data": "money",
                "orderable": false
            },

            {
                "data": "orderid",
                "orderable": false
            },
            {
                "data": "createtime",
                "orderable": false
            }
        ]

    });
}

function zhuangtai(state, code) {
    if (code == 1) {
        if (state == 0) {
            return "余额支付";
        } else if (state == 1) {
            return "微信支付";
        } else if (state == 2) {
            return "充值";
        } else if (state == 3) {
            return "微信充值";
        } else if (state == 4) {
            return "退款";
        }

    }
}

function select() {

    nickname = $("#nickname").val();
    type = $("#type").val();
    $('#dataTables-example').dataTable().fnClearTable();
    $('#dataTables-example').dataTable().fnDestroy();
    dataTable();

}
