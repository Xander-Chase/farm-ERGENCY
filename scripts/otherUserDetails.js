// Get the userID from the query parameter
var urlParams = new URLSearchParams(window.location.search);
var userID = urlParams.get('id');
db.collection("userinfo")
    .where("userID", "==", userID)
    .orderBy("timestamp", "desc")
    .limit(1)
    .get()
    .then(querySnapshot => {
        querySnapshot.forEach(doc => {
            const data = doc.data();
            document.getElementById("full-name").value = data.Name;
            document.getElementById("email").value = data.email;
            document.getElementById("mobile").value = data.mobile;
            document.getElementById("phone").value = data.phone;
            document.getElementById("address").value = data.address;
        });
    })
    .catch(error => {
        console.log("Error getting user info: ", error);
    });


firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        function populateTransportTable() {

            // Get the Firestore database instance
            var db = firebase.firestore();

            // Get a reference to the livestock collection
            var transportRef = db.collection("transport_Personal");

            // Query the transport collection and get the documents
            transportRef
                .where("userID", "==", userID)
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
                    });
                });
        }
        populateTransportTable();
    } else {
        // No user is signed in.
    }
});

firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        function populateTransportTable() {

            // Get the Firestore database instance
            var db = firebase.firestore();

            // Get a reference to the livestock collection
            var transportRef = db.collection("livestock_Emergency_Capacity");

            // Query the transport collection and get the documents
            transportRef
                .where("userID", "==", userID)
                .get().then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        // Get the transport type and quantity from the document data
                        var transportType = doc.data().type;
                        var transportQuantity = doc.data().quantity;

                        console.log('---------> ', doc.data());

                        // Add the transport vehicles to the table
                        var transportTable = document.getElementById("capacity-table");
                        var newRow = transportTable.insertRow();
                        var typeCell = newRow.insertCell(0);
                        var quantityCell = newRow.insertCell(1);
                        var deleteCell = newRow.insertCell(2);
                        typeCell.innerHTML = transportType;
                        quantityCell.innerHTML = transportQuantity;
                    });
                });
        }
        populateTransportTable();
    } else {
        // No user is signed in.
    }
});


function populatePicture() {
    firebase.auth().onAuthStateChanged(user => {
            if (user) {

                currentUser = db.collection("users").doc(userID);

                currentUser.get()
                    .then(userDoc => {
                        let picUrl = userDoc.data().profilePic;
                        if (picUrl != null) {
                            console.log(picUrl);
                            $("#mypic-goes-here").attr("src", picUrl);
                        } else
                            console.log("picURL is null");
                    })

            } else {
                console.log("no user is logged in")
            }
        }

    )

}
populatePicture();