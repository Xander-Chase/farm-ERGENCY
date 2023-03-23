
    // Get the Firestore database instance


    // Get a reference to the livestock collection
    var livestockRef = db.collection("livestock_Personal");

    // Query the livestock collection and get the documents
    livestockRef.get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            // Get the livestock type and quantity from the document data
            var livestockType = doc.data().type;
            var livestockQuantity = doc.data().quantity;

            console.log('---------> ', doc.data());

        });
    });