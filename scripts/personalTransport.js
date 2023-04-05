function addtransport() {
    var transportType = document.getElementById("transport-type").value;
    var transportQuantity = document.getElementById("transport-number").value;
    var transportTable = document.getElementById("transport-table");

    if (transportType === "" || transportQuantity === "") {
        return;
    }

    // Check if the transport type has already been added to the table
    var rows = transportTable.getElementsByTagName("tr");
    for (var i = 0; i < rows.length; i++) {
        var cells = rows[i].getElementsByTagName("td");
        if (cells.length > 0 && cells[0].innerHTML === transportType) {
            alert("This transport type has already been added.");
            return;
        }
    }

    // Add the new livestock type, quantity, and delete button to the table
    var newRow = transportTable.insertRow();
    var typeCell = newRow.insertCell(0);
    var quantityCell = newRow.insertCell(1);
    var deleteCell = newRow.insertCell(2);
    typeCell.innerHTML = transportType;
    quantityCell.innerHTML = transportQuantity;
    deleteCell.innerHTML = "<button>X</button>";

    // Add event listener to delete button
    var deleteButton = deleteCell.getElementsByTagName("button")[0];
    deleteButton.addEventListener("click", function () {
        transportTable.deleteRow(newRow.rowIndex);
    });

    // Get the current user's ID
    var user = firebase.auth().currentUser;
    var userID = user.uid;

    // Write the data to Firestore
    var db = firebase.firestore();
    var transportCollection = db.collection("transport_Personal");
    transportCollection.where("userID", "==", userID).where("type", "==", transportType).get()
        .then(function (querySnapshot) {
            if (querySnapshot.empty) {
                transportCollection.add({
                        type: transportType,
                        quantity: transportQuantity,
                        userID: userID
                    })
                    .then(function (docRef) {
                        console.log("Document written with ID: ", docRef.id);
                    })
                    .catch(function (error) {
                        console.error("Error adding document: ", error);
                    });
                } else {
                    console.log("Document with the same userID and livestock type already exists.");
                }
            })
            .catch(function (error) {
                console.error("Error getting documents: ", error);
            });
}
//calls function to run it
addtransport();


firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        function populateTransportTable() {

            // Get the Firestore database instance
            var db = firebase.firestore();

            // Get a reference to the livestock collection
            var transportRef = db.collection("transport_Personal");

            console.log(user.uid);

            // Query the transport collection and get the documents
            transportRef
                .where("userID", "==", user.uid)
                .get().then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        // Get the transport type and quantity from the document data
                        var transportType = doc.data().type;
                        var transportQuantity = doc.data().quantity;

                        console.log('---------> ', doc.data());

                        // Add the transport vehicles to the table
                        var transportTable = document.getElementById("transport-table");
                        var newRow = transportTable.insertRow();
                        var typeCell = newRow.insertCell(0);
                        var quantityCell = newRow.insertCell(1);
                        var deleteCell = newRow.insertCell(2);
                        typeCell.innerHTML = transportType;
                        quantityCell.innerHTML = transportQuantity;
                        deleteCell.innerHTML = "<button>X</button>";

                        // Add event listener to delete button
                        var deleteButton = deleteCell.getElementsByTagName("button")[0];
                        deleteButton.addEventListener("click", function () {
                            // Delete the corresponding document from the collection
                            transportRef.where("type", "==", transportType).get()
                                .then(function (querySnapshot) {
                                    querySnapshot.forEach(function (doc) {
                                        doc.ref.delete().then(function () {
                                            console.log("Document successfully deleted!");
                                        }).catch(function (error) {
                                            console.error("Error removing document: ", error);
                                        });
                                    });
                                })
                                .catch(function (error) {
                                    console.error("Error getting documents: ", error);
                                });
                            // Remove the row from the table
                            transportTable.deleteRow(newRow.rowIndex);
                        });
                    });
                });


        }
        populateTransportTable();
    } else {
        // No user is signed in.
    }
});