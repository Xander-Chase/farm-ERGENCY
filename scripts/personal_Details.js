var currentUser;

function getNameFromAuth() {
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      console.log(user.uid);
      console.log(user.displayName);
      const userName = user.displayName;
      document.getElementById("name-goes-here").innerText = userName;
    } else {
      // No user is signed in.
    }
  });
}

getNameFromAuth();

function populateUserInfo() {
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      var userID = user.uid;
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
    } else {
      console.log("No user is signed in");
    }
  });
}

populateUserInfo();

function saveUserLongLat(userID, longitude, latitude) {
  db.collection("users").doc(userID).update({
    longitude: longitude,
    latitude: latitude
  })
  .then(() => {
    console.log("Longitude and latitude saved to Firestore");
  })
  .catch((error) => {
    console.error("Error saving longitude and latitude: ", error);
  });
}

function geocodeAddress(address, userID) {
  
  const geocodingUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${address}.json?access_token=pk.eyJ1IjoiYWpnYWJsIiwiYSI6ImNsZXFyN2pmaDBsbmQzcmxrdDN1bWR2dWQifQ.X2m-VshHfJA_ZpBixUPCaw`;
  // console.log("geocoding lat and long", geocodeAddress);
    fetch(geocodingUrl)
    .then(response => response.json())
    .then(data => {
      // Get the longitude and latitude from the geocoder
      const longitude = data.features[0].center[0];
      const latitude = data.features[0].center[1];

      // Save the longitude and latitude to Firestore
      saveUserLongLat(userID, longitude, latitude);
    })
    .catch(error => {
      console.log("Error geocoding address: ", error);
    });
}


function editUserInfo() {
  document.getElementById('personalInfoFields').disabled = false;
}

function saveUserInfo() {
  let fullName = document.getElementById("full-name").value;
  let userEmail = document.getElementById("email").value;
  let userMobile = document.getElementById("mobile").value;
  let userPhone = document.getElementById("phone").value;
  let userAddress = document.getElementById("address").value;

  console.log(fullName, userEmail, userMobile, userPhone, userAddress);

  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      var currentUser = db.collection("users").doc(user.uid);
      var userID = user.uid;
      //get the document for current user.
      currentUser.get()
        .then(userDoc => {
          db.collection("userinfo").add({
            userID: userID,
            Name: fullName,
            email: userEmail,
            mobile: userMobile,
            phone: userPhone,
            address: userAddress,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
          }).then(docRef => {
            const geocodingUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${userAddress}.json?access_token=pk.eyJ1IjoiYWpnYWJsIiwiYSI6ImNsZXFyN2pmaDBsbmQzcmxrdDN1bWR2dWQifQ.X2m-VshHfJA_ZpBixUPCaw`;
            fetch(geocodingUrl)
              .then(response => response.json())
              .then(data => {
                // Get the longitude and latitude from the geocoder
                const longitude = data.features[0].center[0];
                const latitude = data.features[0].center[1];

                // Save the longitude and latitude to Firestore
                docRef.update({
                  longitude: longitude,
                  latitude: latitude
                }).then(() => {
                  console.log("Longitude and latitude saved to Firestore");
                  window.location.href = "personalDetails.html";
                }).catch(error => {
                  console.log("Error updating document: ", error);
                });
              })
              .catch(error => {
                console.log("Error geocoding address: ", error);
              });
          }).catch(error => {
            console.log("Error adding document: ", error);
          });
        });
    } else {
      console.log("No user is signed in");
      window.location.href = 'personalDetails.html';
    }
  });
}
