/*!
 * Adminux (http://maxartkiller.com)
 * Copyright 2017 The Adminux Author: Maxartkiller
 * purchase licence before use
 * You can not resale or modify without prior licences.
*/


/* data tables*/
$('#dataTables-example').DataTable({
    responsive: true,
    pageLength: 2,
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


    }
});
