var csh = 0;
var mumberid;
var state;
var page = 1;
$(function () {
    mumberid = GetRequest().pid;
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

            var p = (page - 1) * 10;
            $.ajax({
                type: "post",
                url: "../buyshop/BuyMumberWithdraw/BuyMumberWithdrawSelect",
                async: true,
                dataType: "json",
                beforeSend: function (xhr) {
                    xhr.setRequestHeader('Authorization', token);
                },
                data: {
                    mumberid: mumberid,
                    page: p,
                    num: 10,
                    state: state
                },
                success: function (data) {
                    if (data.code == 100) {
                        var list = [];
                        for (var i in data.withdraw) {
                            var withdraw = data.withdraw[i];

                            var state = "<span class=\"status warning\">暂未审核</span>";
                            if (withdraw.state == 1) {
                                state = "<span class=\"status success\">审核通过</span>";
                            } else if (withdraw.state == 2) {
                                state = "<span class=\"status danger\">审核失败</span>";
                            }
                            var user_img = "";
                            if (withdraw.user_img != null && withdraw.user_img != "") {
                                user_img = "<img src=\"" + withdraw.user_img + "\" alt=\"\" class=\"gridpic\">";
                            }
                            var botton = "";
                            if (withdraw.state == 0) {
                                botton = "<button class=\"btn btn-primary\" type=\"button\" d\>审核</button>";
                            }
                            list.push({
                                pid: "<input type=\"checkbox\" value='" + withdraw.pid + "' name='checkbox'>",
                                img: "<img src=\"" + withdraw.img + "\" alt=\"\" class=\"gridpic\">",
                                fullname: unde(withdraw.fullname),
                                money: unde(withdraw.money),
                                actual_money: unde(withdraw.actual_money),
                                tax_money: unde(withdraw.tax_money),
                                state: unde(state),
                                before_money: unde(withdraw.before_money),
                                after_money: unde(withdraw.after_money),
                                createtime: unde(withdraw.createtime),
                                user_img: user_img,
                                nickname: unde(withdraw.nickname),
                                examinetime: unde(withdraw.examinetime),
                                memo: unde(withdraw.memo),
                                cz: botton
                            })
                        }
                        console.log(list);
                        //$("#money_html").html(str);
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
                "data": "fullname",
                "orderable": false
            },
            {
                "data": "money",
                "orderable": false
            },
            {
                "data": "actual_money",
                "orderable": false
            },
            {
                "data": "tax_money",
                "orderable": false
            }, {
                "data": "state",
                "orderable": false
            },
            {
                "data": "before_money",
                "orderable": false
            },
            {
                "data": "after_money",
                "orderable": false
            },
            {
                "data": "createtime",
                "orderable": false
            },
            {
                "data": "user_img",
                "orderable": false
            },
            {
                "data": "nickname",
                "orderable": false
            },
            {
                "data": "examinetime",
                "orderable": false
            },
            {
                "data": "memo",
                "orderable": false
            },
            {
                "data": "cz",
                "orderable": false
            }
        ]

    });
}


function select() {
    state = $("#state").val();
    $('#dataTables-example').dataTable().fnClearTable();
    $('#dataTables-example').dataTable().fnDestroy();
    page = 1;
    dataTable();
}
