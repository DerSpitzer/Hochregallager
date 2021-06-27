/* 
 * Author: Us
 * We will have a global variable which will tell us our time in our simulation
 * it will be possible to reset this variable.
 */

let time_of_simulation = 0;
var our_simulation;

// This is our array of items in the storage
var items = [ 
          { id: "1_1", status: "empty", RFID:111111, ID:000000, color:"white" }
        , { id: "1_2", status: "empty", RFID:111111, ID:000000, color:"white" }
        , { id: "1_3", status: "empty", RFID:111111, ID:000000, color:"white" }
        , { id: "2_1", status: "empty", RFID:111111, ID:000000, color:"white" }
        , { id: "2_2", status: "empty", RFID:111111, ID:000000, color:"white" }
        , { id: "2_3", status: "empty", RFID:111111, ID:000000, color:"white" }
        , { id: "3_1", status: "empty", RFID:111111, ID:000000, color:"white" }
        , { id: "3_2", status: "empty", RFID:111111, ID:000000, color:"white" }
        , { id: "3_3", status: "empty", RFID:111111, ID:000000, color:"white" }
    ];

function startSimulation() {
    our_simulation = setInterval(simulate, 1000);
    document.getElementById("start_button").disabled = true;
    document.getElementById("start_button").style.backgroundColor = 'RoyalBlue';
}


function resetSimulation() {
    let reset_time = document.getElementById("reset_button");
    clearInterval(our_simulation);
    time_of_simulation = 0;
    simulate()

    document.getElementById("start_button").disabled = false;
    document.getElementById("start_button").style.backgroundColor = 'DodgerBlue';
    
}


// return true if in range, otherwise false
function inRange(x, min, max) {
    return ((x-min)*(x-max) <= 0);
}

function fillAll() {
    for (var x = 0; x < items.length; x += 1) {
        items[x].RFID = 55555;
        items[x].status = "full";
        items[x].ID = 444444;
        items[x].color = "blue"

        // Change the display
        document.getElementById(items[x].id).style.backgroundColor = items[x].color;
        document.getElementById("grid" + items[x].id).style.backgroundColor = "orange";
        document.getElementById("status" + items[x].id).innerHTML = "i";
    }
}


function setValues(data) {
    vertikal = data[time_of_simulation].werte["H-vertikal"];
    horizontal = data[time_of_simulation].werte["H-horizontal"];
    document.getElementById("horizontal").innerHTML = horizontal;
    document.getElementById("vertikal").innerHTML = vertikal;

    // Visualize
    h = parseInt(horizontal);
    v = parseInt(vertikal);

    // Checking if the arm is visiting a fach
    if (inRange(h, 2330, 2360)) {
        if (inRange(v, 85, 115)) {
            // 1_1
            kickItem("1_1");
        } else if(inRange(v, 435, 465)) {
            // 2_1
            kickItem("2_1");
        } else if(inRange(v, 885, 915)) {
            // 3_1
            kickItem("3_1");
        }
    } else if (inRange(h, 1610, 1640)) {
        if (inRange(v, 85, 115)) {
            // 1_2
            kickItem("1_2");
        } else if(inRange(v, 435, 465)) {
            // 2_2
            kickItem("2_2");
        } else if(inRange(v, 885, 915)) {
            // 3_2
            kickItem("3_2");
        }
    } else if (inRange(h, 885, 915)) {
        if (inRange(v, 85, 115)) {
            // 1_3
            kickItem("1_3");
        } else if(inRange(v, 435, 465)) {
            // 2_3
            kickItem("2_3");
        } else if(inRange(v, 885, 915)) {
            // 3_3
            kickItem("3_3");
        }
    }

    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");
    ctx.clearRect(0, 0, 200, 100);
    ctx.beginPath();
    ctx.rect(190 - h/13, v/13 + 4, 5, 5);
    ctx.fillStyle = "red";
    ctx.fill();
}

// This function is our time updater, so we know what time it is
function simulate() {
    d3.json("https://it2wi1.if-lab.de/rest/ft_fach").then( (data, error) => {
        if (error) {
            console.log(error);
        } else {
            // Clearing our interval if we reach the end of file
            if (time_of_simulation == data.length) {
                clearInterval(our_simulation);
                document.getElementById("start_button").disabled = false;
            } else {
                datum = data[time_of_simulation].datum
                document.getElementById('time_label').innerHTML = datum;
                setValues(data)
                time_of_simulation += 1;
            }
        }
    });
}

function getPos(id){
    var a = parseInt(id.slice(0,1))
    var b = parseInt(id.slice(2,3))
    console.log(a,b)
    return (a-1)*3+b-1;
}

function openInfo(id) {
    if (document.getElementById("status" + id).textContent == "i") {
        document.getElementById("InfoFach").style.display = "inline-block";
        document.getElementById("headerInfoFach").innerHTML = "Info Fach " + id;

       
 
        // Set RFID and ID and the color of the blob
        var pos = getPos(id);
        document.getElementById("InfoFach-rfidLabel").innerHTML = "RFID-Adresse: " + items[pos].RFID;
        document.getElementById("InfoFach-idLabel").innerHTML = "ID-Nummer: " + items[pos].ID;
        document.getElementById("InfoFach-dot").style.backgroundColor = items[pos].color;

    } else {
        document.getElementById("fachstatus").innerHTML = "Fach " + id + " ist leer.";
        document.getElementById("rfid").value = "";
        document.getElementById("id-number").value = "";
        document.getElementById("infoBox").style.display = "inline-block";
    } 
}

function closeError() {
    // Closing Error and opening info fach
    document.getElementById("Error").style.display = "none";
    document.getElementById("infoBox").style.display = "inline-block";
}

function closeInfoFach() {
    document.getElementById("InfoFach").style.display = "none";
}

function checkInfo() {
    // We let our window disappear
    document.getElementById("infoBox").style.display = "none";

    // Getting the id number of the fach
    var id = document.getElementById("fachstatus").textContent;
    id = id.slice(5, 8);

    var rfid = parseInt(document.getElementById("rfid").value);
    var idnumber = parseInt(document.getElementById("id-number").value);

    // Getting the color
    var e = document.getElementById("selection");
    var value = e.options[e.selectedIndex].value;
    var color = e.options[e.selectedIndex].text;
    console.log(color)
    if (color == "Weiß") color = "white";
    if (color == "Blau") color = "blue";
    if (color == "Rot") color = "red";
    

    // Make checks for the rightness //
    if (!Number.isInteger(rfid) || rfid > 999999 || rfid < 100000 || !Number.isInteger(idnumber) || idnumber > 999999 || idnumber < 100000) {
        // There was an error, closing the info fach and opening the error message
        document.getElementById("InfoFach").style.display = "none";
        document.getElementById("Error").style.display = "inline-block";
    } else {
        // Edit our array of items and display it
        changeItem(id, idnumber, rfid, color)
        document.getElementById("Ergebnismeldung").style.display = "inline-block";
    }
}

function changeItem(id, idnumber, rfid, color) {
    // Get the position of our element in the array
    var pos = getPos(id);

    // Change the values
    items[pos].RFID = rfid;
    items[pos].color = color;
    items[pos].status = "full";
    items[pos].ID = idnumber;

    // Change the display
    document.getElementById(id).style.backgroundColor = color;
    document.getElementById("grid" + id).style.backgroundColor = "orange";
    document.getElementById("status" + id).innerHTML = "i";

    // Update our litte doughnut
    updateDoughnut();
}

function closeInfo() {
    document.getElementById("infoBox").style.display = "none";
}

function closeErgebnismeldung(){
    document.getElementById("Ergebnismeldung").style.display = "none";
}

function setup() {
    updateDoughnut();
}

function updateDoughnut() {
    // Getting the number of items in our list
    var count = 0
    for (var i in items) {
        if (items[i].status == "full") {
           count+=1;
        }
    }

    document.getElementById("belegt_label").innerHTML = "Belegte Fächer: " + count;

    var xValues = ["Belegt", "Frei"];
    var yValues = [count, 9-count];
    var barColors = [
    "orange",
    "lightgrey"
    ];
    new Chart("myChart", {
        type: "doughnut",
        data: {
            labels: xValues,
            datasets: [{
                backgroundColor: barColors,
                data: yValues
            }]
        },
        options: {
            title: {
                display: false,
            },
        }
    });
}

function kickItem(getID) {
    if (getID != null) {
        var id = getID
    } else {
        var id = document.getElementById("headerInfoFach").textContent.slice(10,13);
    }
    var pos = getPos(id);
    items[pos].status = "empty";

    // Change the display
    document.getElementById(id).style.backgroundColor = "lightgreen";
    document.getElementById("grid" + id).style.backgroundColor = "lightgreen";
    document.getElementById("status" + id).innerHTML = "+";

    // Update our litte doughnut
    updateDoughnut();

    // Close the window
    document.getElementById("InfoFach").style.display = "none";
}


function reset() {
    time_of_simulation = 0;
}



/*
<button class="btn">
            <i class="fa fa-check"></i>
        </button>
        <button class="btn">
            <i class="fa fa-arrows-alt-h"></i>
        </button>
        <button class="btn">
            <i class="fa fa-times"></i>
        </button>
        */