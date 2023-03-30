db.collection("alertForm")
  .orderBy("timestamp", "desc")
  .get()
  .then((querySnapshot) => {
    const tableBody = document.getElementById("submissions").getElementsByTagName("tbody")[0];
    // Loop through each submission and add a row to the table
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const timestamp = data.timestamp.toDate().toLocaleString();
      const row = `
        <tr>
          <td>${data.Name}</td>
          <td>${data.evacuation}</td>
          <td>${data.transport}</td>
          <td>${data.property}</td>
          <td>${timestamp}</td>
        </tr>
      `;
      tableBody.innerHTML += row;
    });
  })
  .catch((error) => {
    console.error("Error fetching submissions:", error);
  });