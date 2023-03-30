const signOutButton = document.getElementById('signOut');
signOutButton.addEventListener('click', () => {
  firebase.auth().signOut()
    .then(() => {
      console.log('User signed out successfully.');
      window.location.href = 'index.html'; // redirect to index.html
    })
    .catch((error) => {
      console.log('Error signing out:', error);
    });
});
