// Get the currently logged in user
var user = firebase.auth().currentUser;

// Get a reference to the Firestore collection
var usersRef = firebase.firestore().collection("users");

// Get the user's document from the collection
usersRef.doc(user.uid).get().then(function(doc) {
  if (doc.exists) {
    // Get the user's address field from the document
    var address = doc.data().address;

    // Use a geocoding API to get the latitude and longitude of the address
    var geocoder = new MapboxGeocoder({
      accessToken: 'pk.eyJ1IjoiYWpnYWJsIiwiYSI6ImNsZXFyN2pmaDBsbmQzcmxrdDN1bWR2dWQifQ.X2m-VshHfJA_ZpBixUPCaw',
      mapboxgl: mapboxgl
    });

    geocoder.query(address, function(result) {
      // Center the map around the coordinates
      map.setCenter(result.result.center);
    });
  }
});
