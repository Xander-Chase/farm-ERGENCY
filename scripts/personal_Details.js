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

contactForm.addEventListener('submit', function(event) {
  event.preventDefault();
  
  const formData = new FormData(contactForm);
  
  const fullName = formData.get('full-name');
  const email = formData.get('email');
  const phone = formData.get('phone');
  const mobile = formData.get('mobile');
  const address = formData.get('address');
  
  console.log('Full Name:', fullName);
  console.log('Email:', email);
  console.log('Phone:', phone);
  console.log('Mobile:', mobile);
  console.log('Address:', address);
});
