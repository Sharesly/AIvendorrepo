$(document).ready(function(){


  // create table headers
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

  var oTable = $('#data-table-container').DataTable({
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
     console.log(myData);
     return myData;
   }
 },
'order': [[ 6, "asc" ]],
'columns': createTableColumns(),

'createdRow': function( row, data, dataIndex ) {
  console.log(data);
    $(row).children('.priority').addClass(data.priority);
    $(row).children('.status').addClass(data.status);
}


  });

});
