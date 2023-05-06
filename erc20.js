document.getElementById('file-form').addEventListener('submit', function(e) {
  e.preventDefault();

  var file = document.getElementById('file-input').files[0];
  var reader = new FileReader();

  reader.readAsText(file);

  reader.onload = function() {
    var csvData = reader.result;
    var data = Papa.parse(csvData, {
      header: true,
      dynamicTyping: true
    });

    var f2Value = data.data[0]['To'];

    var uniqueTokenSymbols = new Set(data.data.map(row => row['TokenSymbol']).filter(tokenSymbol => tokenSymbol !== undefined));

    var resultsEl = document.getElementById('result');
    resultsEl.innerHTML = '';

    function parseFormattedNumber(value) {
      if (typeof value === 'string') {
        return parseFloat(value.replace(/,/g, ''));
      } else {
        return value;
      }
    }

    var sumFilteredValues = function(filteredRows) {
      var columnGValues = filteredRows.map(function(row) {
        return parseFormattedNumber(row['TokenValue']);
      });

      var columnGFilteredValues = columnGValues.filter(function(value) {
        return value !== null && value !== undefined && value !== "";
      });

      return columnGFilteredValues.reduce(function(acc, value) {
        return acc + value;
      }, 0) || 0;
    };

    uniqueTokenSymbols.forEach(function(k2Value) {
      var filteredRowsTo = data.data.filter(function(row) {
        return row['To'] === f2Value && row['TokenSymbol'] === k2Value;
      });

      var filteredRowsFrom = data.data.filter(function(row) {
        return row['From'] === f2Value && row['TokenSymbol'] === k2Value;
      });

      var sumTo = sumFilteredValues(filteredRowsTo);
      var sumFrom = sumFilteredValues(filteredRowsFrom);
      var currentBalance = sumTo - sumFrom;

      resultsEl.innerHTML += "Sum of " + k2Value + " values (To): " + sumTo.toFixed(2) + "<br>" + "Sum of " + k2Value + " values (From): " + sumFrom.toFixed(2) + "<br><br><span class='balance-text'>Current balance of " + k2Value + ": " + currentBalance.toFixed(2) + "</span><br><br>";
    });
  };
});
