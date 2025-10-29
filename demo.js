$(document).ready(function () {


  // configure table columns
  function createTableColumns() {
    var tableColumns = [
      { 'data': 'displayName', 'title': 'Display Name', 'className': 'displayName', "defaultContent": "" },
      { 'data': 'productName', 'title': 'Product Name (with Access Link)', 'className': 'productName', "defaultContent": "" },
      { 'data': 'aiTypes', 'title': 'AI Type(s)', 'className': 'aiTypes', "defaultContent": "" },
      { 'data': 'toolDescription', 'title': 'Tool Description (Vendor-Provided)', 'className': 'toolDescription', "defaultContent": "" },
      { 'data': 'policyLinks', 'title': 'AI Policy & Documentation Links', 'className': 'policyLinks', "defaultContent": "" },
      { 'data': 'policyNotes', 'title': 'AI Policy Notes', 'className': 'policyNotes', "defaultContent": "" },
      { 'data': 'notesResources', 'title': 'Notes & Resources', 'className': 'notesResources', "defaultContent": "" },
    ];
    return tableColumns;
  }

  function filterButtons() {
    $(".form-check-input")
      .click(function (event) {
        var value = $(this).attr('value');
        var columnIndex;

        // Determine which column to search based on the radio button value
        switch (value) {
          case 'Display Name':
            columnIndex = 0;
            break;
          case 'Product Name (with Access Link)':
            columnIndex = 1;
            break;
          case 'AI Types':
            columnIndex = 2;
            break;
          default:
            columnIndex = null;
        }

        // Clear all column searches first
        oTable.columns().search('').draw();

        if (columnIndex !== null) {
          oTable
            .column(columnIndex)
            .search(value)
            .draw();
        }
      });
    }

  // create the table container and object
  $('#googleSheetsDataTable').html('<table cellpadding="0" cellspacing="0" border="0" class="display table" id="data-table-container" style="width:100%"></table>');
  var url = 'https://docs.google.com/spreadsheets/d/1y4_nV85jFc3fqww_VdsPcQlPlozzn5Pf/gviz/tq?tqx=out:csv&sheet=Vendors';
  if (window.location.href.indexOf("accountability-dashboard") > -1) {
    url = 'https://sheets.googleapis.com/v4/spreadsheets/1A_o9Nk-COZl21FqTKgcwhS_EU1wo3reEMvufj3fovWc/values/A:G?key=AIzaSyCmqnBijhOsTPfft3WE6rYAfQ1tERXPoAg';
  }
  //this function creates the datatable and selects configuration options
  var oTable = $('#data-table-container').DataTable({
    buttons: [],
    pageLength: 15,
    //get the data via AJAX from Google Sheets
    ajax: function (data, callback) {
      fetch(url)
        .then(r => r.text())
        .then(csvText => {
          const parsed = Papa.parse(csvText, { header: true, skipEmptyLines: true });

          // Map CSV headers -> your field names used in createTableColumns()
          const rows = (parsed.data || []).map(row => ({
            displayName: row['Display Name'] || '',
            productName: row['Product Name (with Access Link)'] || '',
            aiTypes: row['AI Type(s)'] || '',
            releaseType: row['Release Type'] || '',
            releaseNotes: row['Release Notes'] || '',
            toolDescription: row['Tool Description (Vendor-Provided)'] || '',
            policyLinks: row['AI Policy & Documentation Links'] ? "<a target='blank' href='" + row['AI Policy & Documentation Links'] + "'>" + row['AI Policy & Documentation Links'] + "</a>": '',
            policyNotes: row['AI Policy Notes'] || '',
            notesResources: row['Notes & Resources'] || '',
            lastReviewed: row['Last Reviewed (Date)'] || ''
          }));

          callback({ data: rows });
        })
        .catch(err => {
          console.error('CSV fetch/parse error:', err);
          callback({ data: [] });
        });
    },
    //initial order by column 6, the default sort
    'order': [[6, "asc"]],
    dom: 'Bfrtip',
    //use the column definition above to configure the columns
    'columns': createTableColumns(),
    'initComplete': function (settings) {
      filterButtons();
    },
    //this functionruns after each row is created - used here to add CSS classes for styling based on cell content
    'createdRow': function (row, data, dataIndex) {
      $(row).children('.priority').addClass(data.priority);
      $(row).children('.status').addClass(data.status);
      // $(row).children('.COMPLETED').append('<img class="table-icon" src="icons/correct.png">');
      //$(row).children('.NOT').append('<img class="table-icon" src="icons/pending.png">');
      // $(row).children('.IN-PROGRESS').append('<img class="table-icon" src="icons/settings.png">'); 
    }


  });

});
