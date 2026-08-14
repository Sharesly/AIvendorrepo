$(document).ready(function () {


  // configure table columns
  function createTableColumns() {
    var tableColumns = [
      { 'data': 'displayName', 'title': 'Database Vendor / Publisher', 'className': 'displayName', "defaultContent": "" },
      { 'data': 'productName', 'title': 'AI Tool Name (with Access Link)', 'className': 'productName', "defaultContent": "" },
      { 'data': 'aiTypes', 'title': 'AI Functionality', 'className': 'aiTypes', "defaultContent": "" },
      { 'data': 'thirdPartyAIUsage', 'title': 'Third Party AI Usage Disclosure', 'className': 'thirdPartyAIUsage', "defaultContent": "" },
      { 'data': 'thirdPartyAIProviders', 'title': 'Third Party AI Provider(s)', 'className': 'thirdPartyAIProviders', "defaultContent": "" },
      { 'data': 'useResourceWithoutAI', 'title': 'Can I use this resource without using AI? (Beta)', 'className': 'reuseResourceWithoutAI', "defaultContent": "" },
      { 'data': 'modelTrainOnData', 'title': 'Does the model train on my data?', 'className': 'modelTrainOnData', "defaultContent": "" },
      { 'data': 'dataRetained', 'title': 'Is my data retained?', 'className': 'dataRetained', "defaultContent": "" },
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
          case 'Vendor':
            columnIndex = 0;
            break;
          case 'AI Tool':
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
  var url = 'https://docs.google.com/spreadsheets/d/1uJA6Y0Uh_5bny2IoKXR4PuIuWsD6PF5S/gviz/tq?tqx=out:csv&sheet=Vendors';
  if (window.location.href.indexOf("accountability-dashboard") > -1) {
    url = 'https://sheets.googleapis.com/v4/spreadsheets/1A_o9Nk-COZl21FqTKgcwhS_EU1wo3reEMvufj3fovWc/values/A:G?key=AIzaSyCmqnBijhOsTPfft3WE6rYAfQ1tERXPoAg';
  }
  //this function creates the datatable and selects configuration options
  var oTable = $('#data-table-container').DataTable({
    responsive: true,
    autoWidth: false, 
    buttons: [],
    pageLength: 100,
    // ensure DataTables allocates a wider width for the Tool Description column (index 2)
    columnDefs: [
      { targets: 0, width: '12%' }, // Vendor
      { targets: 1, width: '18%' }, // AI Tool
  
      { targets: 3, width: '10%' }, // AI Types
      { targets: 4, width: '10%' }, // Policy Links
      { targets: 5, width: '10%' }  // Ethics Categories
    ],
    //get the data via AJAX from Google Sheets
    ajax: function (data, callback) {
      fetch(url)
        .then(r => r.text())
        .then(csvText => {
          const parsed = Papa.parse(csvText, { header: true, skipEmptyLines: true });

          // Map CSV headers -> your field names used in createTableColumns()
          const rows = (parsed.data || []).map(row => ({
            displayName: row['Database Vendor / Publisher'] || '',
            productName: row['AI Tool Name (with Access Link)'] || '',
            aiTypes: row['AI Functionality'] ? row['AI Functionality'].split(',').map(function(type) {
              var t = type.trim();
              var colorClass = '';
              switch (t) {
                case 'Search Interpretation': colorClass = 'bg-primary'; break;
                case 'Recommender': colorClass = 'bg-success'; break;
                case 'Generative': colorClass = 'bg-secondary'; break;
                case 'Hybrid': colorClass = 'bg-warning text-dark'; break;
                case 'Summarization': colorClass = 'bg-info text-dark'; break;
                case 'Classification': colorClass = 'bg-danger'; break;
                default: colorClass = 'bg-light text-dark';
              }
              return "<span style='margin-bottom: 2px' class='badge rounded-pill " + colorClass + "'>" + t + "</span>";
            }).join('<br>') : '',
            thirdPartyAIUsage: (function () {
              var value = row['Third Party AI Usage Disclosure'] || '';
              var c = value.trim();
              if (!c) return '';

              var cls = '';
              if (c === 'Yes') cls = 'bg-primary';
              else if (c === 'Unclear') cls = 'bg-success';
              else if (c === 'Not Used') cls = 'bg-danger';
              else if (c === 'No Data Found') cls = 'bg-info text-dark';
              else if (c === 'Not Applicable') cls = 'bg-warning text-dark';
              else cls = 'bg-secondary';

              return "<span style='margin-bottom: 2px' class='badge rounded-pill " + cls + "'>" + c + "</span>";
            })(),
            thirdPartyAIProviders: row['Third Party AI Provider(s)'] || '',
            useResourceWithoutAI: (function () {
              var value = row['Can I use this resource without using AI? (Beta)'] || '';
              var c = value.trim();
              if (!c) return '';

              var cls = '';
              if (c === 'Yes') cls = 'bg-primary';
              else if (c === 'No Data Found') cls = 'bg-success';
              else if (c === 'No') cls = 'bg-danger';
              else if (c === 'Partial') cls = 'bg-info text-dark';
              else if (c === 'Unclear') cls = 'bg-warning text-dark';
              else cls = 'bg-secondary';

              return "<span style='margin-bottom: 2px' class='badge rounded-pill " + cls + "'>" + c + "</span>";
            })(),
            modelTrainOnData: row['Does the model train on my data?'] || '',
            dataRetained: (function () {
              var value = row['Is my data retained?'] || '';
              var c = value.trim();
              if (!c) return '';

              var cls = '';
              if (c === 'Yes') cls = 'bg-primary';
              else if (c === 'No Data Found') cls = 'bg-success';
              else if (c === 'No') cls = 'bg-danger';
              else if (c === 'Partial') cls = 'bg-info text-dark';
              else if (c === 'Unclear') cls = 'bg-warning text-dark';
              else cls = 'bg-secondary';

              return "<span style='margin-bottom: 2px' class='badge rounded-pill " + cls + "'>" + c + "</span>";
            })(),
          }));

          callback({ data: rows });
        })
        .catch(err => {
          console.error('CSV fetch/parse error:', err);
          callback({ data: [] });
        });
    },
    //initial order by column 6, the default sort
    'order': [[0, "asc"]],
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

  $(window).on('load', function () {
    oTable.columns.adjust().responsive.recalc();
  });

});
