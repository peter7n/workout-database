/******************************************************
 ** Program Filename: script.js
 ** Author: Peter Nguyen
 ** Date: 12/6/15
 ** Description: CS 290-400
 ** Database interaction assignment
 ******************************************************/

// Note: this code borrowed from instructor's example
function deleteRow(tableID, currentRow) {
  try {
    var table = document.getElementById(tableID);
    var rowCount = table.rows.length;
    for (var i = 0; i < rowCount; i++) {
      var row = table.rows[i];

      if (row == currentRow.parentNode.parentNode) {
        if (rowCount <= 1) {
          alert("Cannot delete all the rows.");
          break;
        }
        table.deleteRow(i);
        rowCount--;
        i--;
      }
    }
  } catch (e) {
    alert(e);
  }
}

function addRow(tableID) {
  var table = document.getElementById(tableID);
  var rowCount = table.rows.length;
  var row = table.insertRow(rowCount);
  var cell1 = row.insertCell(0);
  var cell2 = row.insertCell(1);
  var cell3 = row.insertCell(2);
  var cell4 = row.insertCell(3);
  var cell5 = row.insertCell(4);
  var cell6 = row.insertCell(5);
  var cell7 = row.insertCell(6);
  cell1.innerHTML = document.getElementById("name").value;
  cell2.innerHTML = document.getElementById("reps").value;
  cell3.innerHTML = document.getElementById("weight").value;
  cell4.innerHTML = document.getElementById("date").value;
  cell5.innerHTML = document.getElementById("lbs").value;
  cell6.innerHTML = '<form method="post" onsubmit="deleteRow(&quot;workoutTable&quot;, this)"><input type="hidden" name="id" value="{{this.id}}" /><input type="submit" name="delete" value="delete" /></form>';
  cell7.innerHTML = '<form method="post"><input type="hidden" name="id" value="{{this.id}}" /><input type="submit" name="edit" value="edit" /></form>';
  rowCount++;
}
