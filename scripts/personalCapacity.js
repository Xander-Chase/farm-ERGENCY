function addCapacity() {
    var livestockType = document.getElementById("capacity-type").value;
    var livestockQuantity = document.getElementById("capacity-number").value;
    var livestockTable = document.getElementById("capacity-table");

    if (livestockType === "" || livestockQuantity === "") {
        return;
    }

    // Check if the livestock type has already been added to the table
    var rows = livestockTable.getElementsByTagName("tr");
    for (var i = 0; i < rows.length; i++) {
        var cells = rows[i].getElementsByTagName("td");
        if (cells.length > 0 && cells[0].innerHTML === livestockType) {
            alert("This livestock type has already been added.");
            return;
        }
    }

    // Add the new livestock type, quantity, and delete button to the table
    var newRow = livestockTable.insertRow();
    var typeCell = newRow.insertCell(0);
    var quantityCell = newRow.insertCell(1);
    var deleteCell = newRow.insertCell(2);
    typeCell.innerHTML = livestockType;
    quantityCell.innerHTML = livestockQuantity;
    deleteCell.innerHTML = "<button>X</button>";

    // Add event listener to delete button
    var deleteButton = deleteCell.getElementsByTagName("button")[0];
    deleteButton.addEventListener("click", function() {
        livestockTable.deleteRow(newRow.rowIndex);
    });

    // Write the data to Firestore
    var db = firebase.firestore();
    var livestockCollection = db.collection("livestock_Emergency_Capacity");
    livestockCollection.where("type", "==", livestockType).get()
    .then(function(querySnapshot) {
        if (querySnapshot.empty) {
            livestockCollection.add({
                type: livestockType,
                quantity: livestockQuantity
            })
            .then(function(docRef) {
                console.log("Document written with ID: ", docRef.id);
            })
            .catch(function(error) {
                console.error("Error adding document: ", error);
            });
        }
    })
    .catch(function(error) {
        console.error("Error getting documents: ", error);
    });
}
//calls function to run it
addLivestock();

function populateCapacityTable() {

    // Get the Firestore database instance
    var db = firebase.firestore();

    // Get a reference to the livestock collection
    var livestockRef = db.collection("livestock_Emergency_Capacity");

    // Query the livestock collection and get the documents
    livestockRef.get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            // Get the livestock type and quantity from the document data
            var livestockType = doc.data().type;
            var livestockQuantity = doc.data().quantity;

            // Add the livestock to the table
            var livestockTable = document.getElementById("capacity-table");
            var newRow = livestockTable.insertRow();
            var typeCell = newRow.insertCell(0);
            var quantityCell = newRow.insertCell(1);
            var deleteCell = newRow.insertCell(2);
            typeCell.innerHTML = livestockType;
            quantityCell.innerHTML = livestockQuantity;
            deleteCell.innerHTML = "<button>X</button>";

            // Add event listener to delete button
            var deleteButton = deleteCell.getElementsByTagName("button")[0];
            deleteButton.addEventListener("click", function() {
                // Delete the corresponding document from the collection
                livestockRef.where("type", "==", livestockType).get()
                .then(function(querySnapshot) {
                    querySnapshot.forEach(function(doc) {
                        doc.ref.delete().then(function() {
                            console.log("Document successfully deleted!");
                        }).catch(function(error) {
                            console.error("Error removing document: ", error);
                        });
                    });
                })
                .catch(function(error) {
                    console.error("Error getting documents: ", error);
                });
                // Remove the row from the table
                livestockTable.deleteRow(newRow.rowIndex);
            });
        });
    });


}
populateCapacityTable();


