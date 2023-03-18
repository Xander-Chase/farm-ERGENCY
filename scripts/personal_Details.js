var currentUser;          //put this right after you start script tag before writing any functions.

function getNameFromAuth() {
    firebase.auth().onAuthStateChanged(user => {
        // Check if a user is signed in:
        if (user) {
            // Do something for the currently logged-in user here: 
            console.log(user.uid); //print the uid in the browser console
            console.log(user.displayName);  //print the user name in the browser console
            const userName = user.displayName;

            //method #1:  insert with JS
            document.getElementById("name-goes-here").innerText = userName;   

        } else {
            // No user is signed in.
        }
    });
}
getNameFromAuth(); //run the function


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
  
  //call the function to run it 
populateUserInfo();

function editUserInfo() {
  //Enable the form fields
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
          var currentUser = db.collection("users").doc(user.uid)
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
                  }).then(() => {
                      window.location.href = "personalDetails.html"; //new line added
                  })
              })
      } else {
          console.log("No user is signed in");
          window.location.href = 'personalDetails.html';
      }
  });
}

