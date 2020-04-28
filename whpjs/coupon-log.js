var csh = 0;
var style;
var state;
var name;
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
            name = $("#name").val();
            style = $("#style").val();
            state = $("#state").val();

            $.ajax({
                type: "post",
                url: "../buyshop/BuyCoupon/BuyCouponLogSelect",
                async: true,
                dataType: "json",
                beforeSend: function (xhr) {
                    xhr.setRequestHeader('Authorization', token);
                },
                data: {
                    state: state,
                    style: style,
                    name: name,
                    page: p,
                    num: 10
                },
                success: function (data) {
                    if (data.code == 100) {
                        var list = [];
                        for (var i in data.coupon) {
                            var coupon = data.coupon[i];
                            var img = "";
                            if (coupon.img != null && coupon.img != "") {
                                img = "<img src=\"" + coupon.img + "\" alt=\"\" class=\"gridpic\">";
                            }
                            list.push({
                                pid: "<input type=\"checkbox\" value='" + coupon.pid + "' name='checkbox'>",
                                img: img,
                                nickname: unde(coupon.nickname),
                                title: unde(coupon.title),
                                cumulative: unde(coupon.cumulative),
                                reduce: unde(coupon.reduce),
                                style: zhuangtai(coupon.style, 1),
                                state: zhuangtai(coupon.state, 2, coupon.zt),
                                orderid: unde(coupon.orderid),
                                createtime: unde(coupon.createtime),
                                opentime: unde(coupon.opentime),
                                endtime: unde(coupon.endtime)
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
                "data": "state",
                "orderable": false
            },
            {
                "data": "orderid",
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
            }
        ]

    });
}

function zhuangtai(state, code, zt) {
    if (code == 1) {
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
    if (code == 2) {
        if (state == 0 && zt == 0) {
            return "未使用";
        } else if (state == 1) {
            return "已使用"
        } else {
            return "已过期";
        }
    }
}

function select() {
    $('#dataTables-example').dataTable().fnClearTable();
    $('#dataTables-example').dataTable().fnDestroy();
    dataTable();

}
