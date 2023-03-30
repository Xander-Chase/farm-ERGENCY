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

function populateCapacityTable(userID) {

    // Get the Firestore database instance
    var db = firebase.firestore();

    // Get a reference to the user's livestock collection
    var livestockRef = db.collection("users").doc(userID).collection("livestock_Emergency_Capacity");

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
        });
    });
}


// Populate the table with the user's livestock data
populateCapacityTable(userID);