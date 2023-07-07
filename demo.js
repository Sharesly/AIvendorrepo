$(document).ready(function(){


  // configure table columns
  function createTableColumns(){

    var tableColumns =   [
        {'data': 'task', 'title': 'Recommendation/Task Name', 'className':'task', "defaultContent": "" },
        {'data': 'theme', 'title': 'Theme', 'className':'theme', "defaultContent": "" },
        {'data': 'assigned', 'title': 'Assigned To', 'className':'assigned', "defaultContent": ""},
        {'data': 'priority', 'title': 'Priority', 'className':'priority', "defaultContent": ""},
        {'data': 'targetDate', 'title': 'Target Date', 'className':'targetDate', "defaultContent": ""},
        {'data': 'status', 'title': 'Status', 'className':'status', "defaultContent": ""},
        {'data': 'sort', 'title': 'Sort', 'visible':false}

       ];
  return tableColumns;
}

  // create the table container and object
  $('#googleSheetsDataTable').html('<table cellpadding="0" cellspacing="0" border="0" class="display table" id="data-table-container" style="width:100%"></table>');

//this function creates the datatable and selects configuration options
  var oTable = $('#data-table-container').DataTable({
    //get the data via AJAX from Google Sheets
    'ajax' : {
   url:'https://sheets.googleapis.com/v4/spreadsheets/1QzT3tUeBBd7R7NWbpVIPM9G_fI_DH2knKKZeP82PDY0/values/A:G?key=AIzaSyCmqnBijhOsTPfft3WE6rYAfQ1tERXPoAg',
   cache: true,
   'dataSrc': function(json) {
     var myData = json['values']; //spreadsheet data lives in an array with the name values
     //rewrite data to an object with key-value pairs. This is also a chance to rename or ignore columns
     myData= myData.map(function( n, i ) {
         var myObject = {
           task:n[0],
           theme:n[1],
           assigned:n[2],
           priority:n[3],
           targetDate:n[4],
           status:n[5],
           sort: n[6]
         };
         return myObject;
     });
     myData.splice(0,1); //remove the first row, which contains the orginal column headers
     return myData;
   }
 },
 //initial order by column 6, the default sort
'order': [[ 6, "asc" ]],
dom: 'Bfrtip',
buttons: [
        'copy', 'excel', 'pdf'
    ],
//use the column definition above to configure the columns
'columns': createTableColumns(),
//this functionruns after each row is created - used here to add CSS classes for styling based on cell content
'createdRow': function( row, data, dataIndex ) {
    $(row).children('.priority').addClass(data.priority);
    $(row).children('.status').addClass(data.status);
}


  });

});
