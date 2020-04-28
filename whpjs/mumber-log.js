var csh = 0;
var mumberid;
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
            console.log(data);
            var page = data.draw;
            var p = (page - 1) * 10;
            $.ajax({
                type: "post",
                url: "../buyshop/BuyMumberLog/BuyMumberLogSelect",
                async: true,
                dataType: "json",
                beforeSend: function (xhr) {
                    xhr.setRequestHeader('Authorization', token);
                },
                data: {
                    mumberid: mumberid,
                    page: p,
                    num: 10
                },
                success: function (data) {
                    if (data.code == 100) {
                        var list = [];
                        for (var i in data.log) {
                            var log = data.log[i];
                            var imgs = log.img;
                            var img = JSON.parse(imgs).thumbnail;
                            if (img != null && img != "") {
                                img = "<img src=\"" + img + "\" alt=\"\" class=\"gridpic\">";
                            } else {
                                img = "";
                            }
                            var type = "基础团购";
                            if (log.type == 1) {
                                type = "秒杀";
                            } else if (log.type == 2) {
                                type = "精品团购";
                            }
                            list.push({
                                pid: "<input type=\"checkbox\" value='" + log.pid + "' name='checkbox'>",
                                img: img,
                                title: unde(log.title),
                                money: unde(log.money),
                                num: unde(log.num),
                                unit: unde(log.unit),
                                type: unde(type),
                                user_img: "<img src=\"" + log.user_img + "\" alt=\"\" class=\"gridpic\">",
                                nickname: unde(log.nickname),
                                createtime: unde(log.createtime),
                                8: "",
                                9: ""
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
                "data": "money",
                "orderable": false
            },
            {
                "data": "num",
                "orderable": false
            },
            {
                "data": "unit",
                "orderable": false
            },
            {
                "data": "type",
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
                "data": "createtime",
                "orderable": false
            }
        ]

    });
}