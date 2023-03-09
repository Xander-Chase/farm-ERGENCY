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

function saveAlert() {
    let evacuation = document.getElementById("immediateEvacuation").value;
    let transport = document.getElementById("immediateTransport").value;
    let property = document.getElementById("assistance").value;
    console.log(evacuation, transport, property);
  
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            var currentUser = db.collection("users").doc(user.uid)
            var userID = user.uid;
            //get the document for current user.
            currentUser.get()
                .then(userDoc => {
                    var userEmail = userDoc.data().email;
                    db.collection("alertForm").add({
                        userID: userID,
                        email: userEmail,
                        evacuation: evacuation,
                        transport: transport,
                        property: property,
                        timestamp: firebase.firestore.FieldValue.serverTimestamp()
                    }).then(() => {
                        window.location.href = "alertconfirm.html"; //new line added
                    })
                })
        } else {
            console.log("No user is signed in");
            window.location.href = 'alert.html';
        }
    });
  }
  