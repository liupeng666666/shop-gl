var csh = 0;
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
    $.ajax({
        type: "post",
        url: "../buyshop/BuyMumberMoney/BuyMumberMoneySelect",
        async: true,
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        success: function (data) {
            var str = "";
            if (data.code == 100) {
                for (var i in data.money) {
                    var money = data.money[i];
                    str += "<tr><td><input type=\"checkbox\" value='" + money.pid + "' name='checkbox'></td>";
                    str += " <td class=\"text-center\"><img src=\"" + money.img + "\" alt=\"\" class=\"gridpic\"></td> ";
                    str += "<td>" + unde(money.nickname) + "</td>";
                    str += "<td>" + unde(money.fullname) + "</td>";
                    str += "<td>" + unde(money.phone) + "</td>";
                    str += "<td>" + unde(money.sale) + "</td>";
                    str += "<td>" + unde(money.total_num) + "</td>";
                    str += "<td>" + unde(money.total) + "</td>";
                    str += "<td>" + unde(money.surplus) + "</td>";
                    str += "<td>" + unde(money.withdraw) + "</td>";
                    str += "<td>" + unde(money.khao) + "</td>";
                    str += "<td>" + unde(money.bank) + "</td>";
                    str += "<td>" + unde(money.bank_name) + "</td>";
                    str += "<td><span class=\"status success\" onclick='withdraw_tz(\"" + money.pid + "\")'>提现</span><span class=\"status warning\" onclick='log_tz(\"" + money.pid + "\")'>日志</span></td>";
                    str += "</tr>";

                }
                $("#money_html").html(str);
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

function log_tz(pid) {

    window.location.href = "mumber_log.html?pid=" + pid;
}

function withdraw_tz(pid) {

    window.location.href = "mumber_withdraw.html?pid=" + pid;
}

