function addLivestock() {
    var livestockType = document.getElementById("livestock-type").value;
    var livestockQuantity = document.getElementById("livestock-number").value;
    var livestockTable = document.getElementById("livestock-table");

    // Check if the livestock type has already been added to the table
    var rows = livestockTable.getElementsByTagName("tr");
    for (var i = 0; i < rows.length; i++) {
        var cells = rows[i].getElementsByTagName("td");
        if (cells.length > 0 && cells[0].innerHTML === livestockType) {
            alert("This livestock type has already been added.");
            return;
        }
    }

    // Add the new livestock type and quantity to the table
    var newRow = livestockTable.insertRow();
    var typeCell = newRow.insertCell(0);
    var quantityCell = newRow.insertCell(1);
    typeCell.innerHTML = livestockType;
    quantityCell.innerHTML = livestockQuantity;
}
//calls funtion to run it
addLivestock()


