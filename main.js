// Listen for a form submission event
document.getElementById('file-form').addEventListener('submit', function(e) {
  e.preventDefault(); // Prevent the form from submitting and refreshing the page

  // Get the selected file from the file input element
  var file = document.getElementById('file-input').files[0];

  // Create a new file reader object
  var reader = new FileReader();

  // Read the selected file as text
  reader.readAsText(file);

  // Once the file is loaded, parse the CSV data using Papa Parse
  reader.onload = function() {
    var csvData = reader.result;
    var data = Papa.parse(csvData, {
      header: true, // Treat the first row as a header row
      dynamicTyping: true // Automatically parse numeric and boolean values
    });

    // Extract the values from column H and store them in an array
    var columnHValues = data.data.map(function(row) {
      return row["Value_IN(ETH)"];
    });

    // Extract the values from column I and store them in an array
    var columnIValues = data.data.map(function(row) {
      return row["Value_OUT(ETH)"];
    });
    
    // Filter out null, undefined, and empty string values from column H
    var columnHFilteredValues = columnHValues.filter(function(value) {
      return value !== null && value !== undefined && value !== "";
    });

    // Filter out null, undefined, and empty string values from column I
    var columnIFilteredValues = columnIValues.filter(function(value) {
      return value !== null && value !== undefined && value !== "";
    });
    
    // Sum up the values in column H
    var columnHSum = columnHFilteredValues.reduce(function(acc, value) {
      return acc + value;
    }, 0);

    // Sum up the values in column I
    var columnISum = columnIFilteredValues.reduce(function(acc, value) {
      return acc + value;
    }, 0);

    // Display the sum of column H and I in the HTML element with the ID "result"
    var resultsEl = document.getElementById('result');
    resultsEl.innerHTML = "Sum of ingoing transactions (in ETH): " + columnHSum.toFixed(2) + "<br>" + "Sum of outgoing transactions (in ETH): " + columnISum.toFixed(2);
    
  };
});
