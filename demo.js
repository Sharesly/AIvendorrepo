$(document).ready(function () {


  // configure table columns
  function createTableColumns() {
    var tableColumns = [
      { 'data': 'displayName', 'title': 'Vendor', 'className': 'displayName', "defaultContent": "" },
      { 'data': 'productName', 'title': 'AI Tool', 'className': 'productName', "defaultContent": "" },
      { 'data': 'toolDescription', 'title': 'Tool Description (Vendor-Provided)', 'className': 'toolDescription', "defaultContent": "" },
      { 'data': 'aiTypes', 'title': 'AI Type(s)', 'className': 'aiTypes', "defaultContent": "" },
      
      { 'data': 'policyLinks', 'title': 'AI Policy & Documentation Links', 'className': 'policyLinks', "defaultContent": "" },
      { 'data': 'ethicsCategories', 'title': 'AI Ethics Policy Categories', 'className': 'ethicsCategories', "defaultContent": "" },
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
  var url = 'https://docs.google.com/spreadsheets/d/1y4_nV85jFc3fqww_VdsPcQlPlozzn5Pf/gviz/tq?tqx=out:csv&sheet=Vendors';
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
      { targets: 2, width: '40%' }, // Tool Description
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
            displayName: row['Display Name'] || '',
            productName: (function(){
              var raw = row['Product Name (with Access Link)'] || '';
              if(!raw) return '';
              var lines = raw.split(/\r?\n/).map(function(l){ return l.trim(); }).filter(function(l){ return l.length > 0; });
              var items = [];
              for(var i = 0; i < lines.length; i += 2) {
                var name = lines[i];
                var url = lines[i+1] || '';
                // If the pair is reversed (first is URL), swap
                if(url && !/^https?:\/\//i.test(url) && /^https?:\/\//i.test(name)) {
                  url = name;
                  name = lines[i+1] || url;
                }
                if(url) {
                  items.push("<a target='_blank' rel='noopener noreferrer' href='" + url + "'>" + name + "</a>");
                } else {
                  if(/^https?:\/\//i.test(name)) {
                    items.push("<a target='_blank' rel='noopener noreferrer' href='" + name + "'>" + name + "</a>");
                  } else {
                    items.push(name);
                  }
                }
              }
              return items.join('<br><br>');
            })(),
            aiTypes: row['AI Type(s)'] ? row['AI Type(s)'].split(',').map(function(type) {
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
            ethicsCategories: row['AI Ethics Policy Categories'] ? row['AI Ethics Policy Categories'].split(',').map(function(cat){
              var c = cat.trim();
              var cls = '';
              // match exact known values or use includes for flexibility
              if(c === 'Ethics') cls = 'bg-primary';
              else if(c === 'Environment') cls = 'bg-success';
              else if(c === 'Privacy / Personal Data / Training Data') cls = 'bg-light text-dark';
              else cls = 'bg-secondary';
              return "<span style='margin-bottom: 2px' class='badge rounded-pill " + cls + "'>" + c + "</span>";
            }).join('<br>') : '',
            releaseType: row['Release Type'] || '',
            toolDescription: row['Tool Description (Vendor-Provided)'] || '',
            policyLinks: (function(){
              var raw = row['AI Policy & Documentation Links'] || '';
              if(!raw) return '';
              // split into non-empty trimmed lines (handles \n and \r\n)
              var lines = raw.split(/\r?\n/).map(function(l){ return l.trim(); }).filter(function(l){ return l.length > 0; });
              var items = [];
              for(var i = 0; i < lines.length; i += 2) {
                var name = lines[i];
                var url = lines[i+1] || '';
                // If the pair is reversed (first is URL), swap
                if(url && !/^https?:\/\//i.test(url) && /^https?:\/\//i.test(name)) {
                  url = name;
                  name = lines[i+1] || url;
                }
                if(url) {
                  items.push("<a target='_blank' rel='noopener noreferrer' href='" + url + "'>" + name + "</a>");
                } else {
                  // single leftover line: if it's a URL, link it; otherwise show text
                  if(/^https?:\/\//i.test(name)) {
                    items.push("<a target='_blank' rel='noopener noreferrer' href='" + name + "'>" + name + "</a>");
                  } else {
                    items.push(name);
                  }
                }
              }
              return items.join('<br><br>');
            })(),
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

});
