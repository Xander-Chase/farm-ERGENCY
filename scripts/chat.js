// Get the chat messages collection
const chatRef = db.collection('chatMessages');

// Listen for new chat messages
chatRef.orderBy('timestamp').onSnapshot((snapshot) => {
  snapshot.docChanges().forEach((change) => {
    if (change.type === "added") {
      const message = change.doc.data();
      // Display the new message in the chat interface
      displayChatMessage(message);
    }
  });
});

// Send a new chat message
function sendChatMessage(message) {
  // Create a new chat message object
  const newMessage = {
    message: message,
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  };
  
  // Add the new message to the Firestore collection
  chatRef.add(newMessage)
  .then((docRef) => {
    console.log("Chat message added with ID: ", docRef.id);
  })
  .catch((error) => {
    console.error("Error adding chat message: ", error);
  });
}

// Display a chat message in the chat interface
function displayChatMessage(message) {
  const div = document.createElement("div");
  div.textContent = message.message;
  document.getElementById("chat-messages").appendChild(div);
}