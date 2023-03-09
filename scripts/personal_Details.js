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
            //method #2:  insert using jquery
            // $("#name-goes-here").text(user_Name); //using jquery
            //method #3:  insert using querySelector
            //document.querySelector("#name-goes-here").innerText = userName

        } else {
            // No user is signed in.
        }
    });
}
getNameFromAuth(); //run the function

auth.signInWithEmailAndPassword(email, password)
  .then(function() {
    // User signed in successfully
  })
  .catch(function(error) {
    // Handle errors here
  });

  const contactForm = document.getElementById('contact-form');

  function populateUserInfo() {
    firebase.auth().onAuthStateChanged(user => {
        // Check if user is signed in:
        if (user) {

            //go to the correct user document by referencing to the user uid
            currentUser = db.collection("userinfo").doc(user.uid)
            //get the document for current user.
            currentUser.get()
                .then(userDoc => {
                    //get the data fields of the user
                    var user_name = userDoc.data().Name;
                    var user_email = userDoc.data().userEmail;
                    var user_phone = userDoc.data().userPhone;
                    var user_mobile = userDoc.data().userMobile;
                    var user_address = userDoc.data().userAddress;

                    //if the data fields are not empty, then write them in to the form.
                    if (fullName != null) {
                        document.getElementById("full-name").value = user_name;
                    }
                    if (userEmail != null) {
                        document.getElementById("email").value = user_email;
                    }
                    if (userPhone != null) {
                        document.getElementById("phone").value = user_phone;
                    }
                    if (userMobile != null) {
                        document.getElementById("mobile").value = user_mobile;
                    }
                    if (userAddress != null) {
                        document.getElementById("address").value = user_address;
                    }
                })
        } else {
            // No user is signed in.
            console.log ("No user is signed in");
        }
    });
}

//call the function to run it 
window.onload = populateUserInfo;

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

