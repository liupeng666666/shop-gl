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
        url: "../buyshop/SubMumberRecruit/SubMumberRecruitSelect",
        async: true,
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        success: function (data) {
            var str = "";
            if (data.code == 100) {
                for (var i in data.recruit) {
                    var recruit = data.recruit[i];
                    str += "<tr><td><input type=\"checkbox\" value='" + recruit.pid + "' name='checkbox'></td>";
                    str += " <td class=\"text-center\"><img src=\"" + recruit.img + "\" alt=\"\" class=\"gridpic\"></td> ";
                    str += "<td>" + unde(recruit.nickname) + "</td>";
                    str += "<td>" + unde(recruit.fullname) + "</td>";
                    str += "<td>" + unde(recruit.phone) + "</td>";
                    str += "<td>" + unde(recruit.area) + "</td>";
                    str += "<td>" + unde(recruit.village) + "</td>";
                    str += "<td>" + unde(recruit.createtime) + "</td>";
                    str += " <td class=\"text-center\"><img src=\"" + recruit.m_img + "\" alt=\"\" class=\"gridpic\"></td> ";
                    str += "<td>" + unde(recruit.m_nickname) + "</td>";
                    str += "<td>" + unde(recruit.m_fullname) + "</td>";
                    str += "</tr>";

                }
                $("#recruit_html").html(str);
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