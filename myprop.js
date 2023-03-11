function writelivestocks() {
    //define a variable for the collection you want to create in Firestore to populate data
    var routesRef = db.collection("livestock_Personal");

    routesRef.add({
    name: "",
    count: "",
        last_updated: firebase.firestore.FieldValue.serverTimestamp()  //current system time
    });}

    function writeRoutes() 
        //define a variable for the collection you want to create in Firestore to populate data
        var routesRef = db.collection("my_Livestock");
    
        routesRef.add({
            cow: "5",
        });
        routesRef.add({
            horse: "3",
        });
        routesRef.add({
            pig: "10",
        });



var button = document.getElementById("enter");
var inputData = document.getElementById("input");
var ul = document.querySelector("ul");
var li = document.querySelectorAll("li");
var deleteBtn = document.getElementsByClassName("delete");

ul.onclick = function (event) {
    if (event.target.className === "li" || event.target.className==="li done") {
        event.target.classList.toggle("done");
    }
}
function removeParentNode(event) {
    var target = event.target;
    target.removeEventListener("click", removeParentNode);
    target.parentNode.remove();
}

for (var i=0; i<deleteBtn.length; i++) {
    deleteBtn[i].addEventListener("click", removeParentNode);
}


function checkInputLength() {
    return inputData.value.length;
}

function createList() {
    var li = document.createElement("li");
    li.appendChild(document.createTextNode(inputData.value));

    var btnDel = document.createElement("button");
    btnDel.appendChild(document.createTextNode("delete"));
    btnDel.addEventListener("click", removeParentNode);

    li.innerHTML = li.innerHTML + " ";
    li.className = "li";
    li.appendChild(btnDel);
    ul.appendChild(li);

    inputData.value = "";
}

function addListAfterClick() {
    if (checkInputLength() > 0) {
        createList();
    }
}

function addListAfterKeypress(event) {
    if (checkInputLength() > 0 && event.keyCode === 13) {
        createList();
    }
}

button.addEventListener("click", addListAfterClick);
inputData.addEventListener("keypress", addListAfterKeypress);


