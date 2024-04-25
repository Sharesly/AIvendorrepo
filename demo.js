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
function filterButtons() {
$(".form-check-input")
		.click(function(event){
		
			/* $ (".highlight-category").removeClass ("highlight-category");
			mycategory=$(this).attr("id");
			var highlightclass="li#"+mycategory;
			$ (highlightclass)
				.addClass ("highlight-category");
    */
			
console.log($(this).attr('value'));
	if ($(this).attr('value') === 'All Recommendations') {
		oTable
	        .columns( 2 )
	        .columns( 1 )
	        .search( "")
	        .draw();
	}
	else {
		oTable
	        .columns( 2 )
	        .columns( 1 )
	        .search( "^" + $(this).attr('value')+"$", true, false)
	        .draw();
	}

		});
}
  // create the table container and object
  $('#googleSheetsDataTable').html('<table cellpadding="0" cellspacing="0" border="0" class="display table" id="data-table-container" style="width:100%"></table>');
var url = 'https://sheets.googleapis.com/v4/spreadsheets/1QzT3tUeBBd7R7NWbpVIPM9G_fI_DH2knKKZeP82PDY0/values/A:G?key=AIzaSyCmqnBijhOsTPfft3WE6rYAfQ1tERXPoAg';
if (window.location.href.indexOf("accountability-dashboard") > -1) {
    url = 'https://sheets.googleapis.com/v4/spreadsheets/1A_o9Nk-COZl21FqTKgcwhS_EU1wo3reEMvufj3fovWc';
} 
//this function creates the datatable and selects configuration options
  var oTable = $('#data-table-container').DataTable({
   buttons: [],
   pageLength: 15,
    //get the data via AJAX from Google Sheets
    'ajax' : {
   url: url,
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
//use the column definition above to configure the columns
'columns': createTableColumns(),
'initComplete' : function (settings) {
      filterButtons();
    },
//this functionruns after each row is created - used here to add CSS classes for styling based on cell content
'createdRow': function( row, data, dataIndex ) {
    $(row).children('.priority').addClass(data.priority);
    $(row).children('.status').addClass(data.status);
   // $(row).children('.COMPLETED').append('<img class="table-icon" src="icons/correct.png">');
    //$(row).children('.NOT').append('<img class="table-icon" src="icons/pending.png">');
   // $(row).children('.IN-PROGRESS').append('<img class="table-icon" src="icons/settings.png">'); 
}


  });

});
