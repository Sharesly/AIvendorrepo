$(document).ready(function(){


  // configure table columns
 function createTableColumns() {
  var tableColumns = [
    { 'data': 'displayName',      'title': 'Display Name',                       'className': 'displayName',      "defaultContent": "" },
    { 'data': 'productName',      'title': 'Product Name (with Access Link)',    'className': 'productName',      "defaultContent": "" },
    { 'data': 'aiTypes',          'title': 'AI Type(s)',                         'className': 'aiTypes',          "defaultContent": "" },
    { 'data': 'releaseType',      'title': 'Release Type',                       'className': 'releaseType',      "defaultContent": "" },
    { 'data': 'releaseNotes',     'title': 'Release Notes',                      'className': 'releaseNotes',     "defaultContent": "" },
    { 'data': 'toolDescription',  'title': 'Tool Description (Vendor-Provided)', 'className': 'toolDescription',  "defaultContent": "" },
    { 'data': 'policyLinks',      'title': 'AI Policy & Documentation Links',    'className': 'policyLinks',      "defaultContent": "" },
    { 'data': 'policyNotes',      'title': 'AI Policy Notes',                    'className': 'policyNotes',      "defaultContent": "" },
    { 'data': 'notesResources',   'title': 'Notes & Resources',                  'className': 'notesResources',   "defaultContent": "" },
    { 'data': 'lastReviewed',     'title': 'Last Reviewed (Date)',               'className': 'lastReviewed',     "defaultContent": "" }
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
var url = 'https://sheets.googleapis.com/v4/spreadsheets/1y4_nV85jFc3fqww_VdsPcQlPlozzn5Pf/values/PublicView!A:J?key=AIzaSyCmqnBijhOsTPfft3WE6rYAfQ1tERXPoAg';
if (window.location.href.indexOf("accountability-dashboard") > -1) {
    url = 'https://sheets.googleapis.com/v4/spreadsheets/1A_o9Nk-COZl21FqTKgcwhS_EU1wo3reEMvufj3fovWc/values/A:G?key=AIzaSyCmqnBijhOsTPfft3WE6rYAfQ1tERXPoAg';
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
       myData = myData.map(function(n, i) {
    var myObject = {
      displayName:     n[0],
      productName:     n[1],
      aiTypes:         n[2],
      releaseType:     n[3],
      releaseNotes:    n[4],
      toolDescription: n[5],
      policyLinks:     n[6],
      policyNotes:     n[7],
      notesResources:  n[8],
      lastReviewed:    n[9]
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
'ajax': {
  url: url,
  cache: true,
  error: function (xhr, status, err) {
    console.error('Sheets AJAX error:', status, err, xhr && xhr.responseText);
  },
  'dataSrc': function (json) {
    console.log('Sheets JSON:', json);

    // If the API call failed, json may be undefined or have an "error"
    if (!json || json.error) {
      console.error('Sheets API error payload:', json && json.error);
      return [];
    }

    var myData = json.values || [];
    console.log('Raw rows length (incl header):', myData.length);

    // If your sheet DOES NOT have a header row in row 1, comment the next line:
    if (myData.length > 0) {
      // Remove header row (row 1)
      myData.splice(0, 1);
    }

    // Filter out completely empty rows
    myData = myData.filter(r => (r || []).some(cell => (cell || '').toString().trim() !== ''));

    // Pad short rows so n[0]..n[9] exist
    myData = myData.map(n => {
      const row = Array.isArray(n) ? n.slice() : [];
      while (row.length < 10) row.push('');
      return {
        displayName:     row[0],
        productName:     row[1],
        aiTypes:         row[2],
        releaseType:     row[3],
        releaseNotes:    row[4],
        toolDescription: row[5],
        policyLinks:     row[6],
        policyNotes:     row[7],
        notesResources:  row[8],
        lastReviewed:    row[9]
      };
    });

    console.log('Mapped rows length:', myData.length);
    return myData;
  }
},
