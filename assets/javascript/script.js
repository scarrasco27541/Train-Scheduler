// Initialize Firebase
var config = {
	apiKey: "AIzaSyBYUuYu1woIjil2daiuCFC4rAgsNrJiHZE",
	authDomain: "train-scheduler-3612b.firebaseapp.com",
	databaseURL: "https://train-scheduler-3612b.firebaseio.com",
	projectId: "train-scheduler-3612b",
	storageBucket: "train-scheduler-3612b.appspot.com",
	messagingSenderId: "830154882653"
};
firebase.initializeApp(config);
var database = firebase.database();

var trains;
// GET the values FROM Firebase
database.ref().on("value", function(snapshot) {
	trains = snapshot.val();
	if (trains==null) { 
		trains = [];
	}
	console.log("data loaded: ", trains);
	drawBoard();					
});		

// -------------------------------------------------------------

function getNextArrival(firstTime, frequency) {
	var rightNow = moment();
	var arrival = moment(firstTime, "HH:mm");
	var next = arrival.add(frequency, 'minutes');
//			console.log("next: ", next);
//			console.log(arrival.diff(rightNow));
	while( arrival.diff(rightNow) < 0 ) {
		arrival.add(frequency, 'minutes')
	}			
	return arrival;	// Some moment.js object representing the next arrival time in the future
}

function drawBoard() {
	$("#train_info").empty();
	for (var i=0;i<trains.length;i++) {
		var tr = $("<tr>");
		
//				tr.html("<td>"+trains[i].name+"</td>");
		var td = $("<td>");
		td.html(trains[i].name);
		tr.append(td);
		var td = $("<td>");
		td.html(trains[i].destination);
		tr.append(td);
		var td = $("<td>");
		td.html(trains[i].frequency);
		tr.append(td);
		
		//// Here I would have been passing a MOMENT in, not the string of military time
		//// I would have to adjust the getNextArrival function above to go ahead and assume that
		//// I'm not re-using that military time conversion anywhere yet, so not doing that after all.
//				var firstMoment = moment(trains[i].first, "HH:mm");
//				var nextArrival = getNextArrival(firstMoment, trains[i].frequency);
		
		var nextArrival = getNextArrival(trains[i].first, trains[i].frequency);
		var td = $("<td>");
		td.html(nextArrival.format("HH:mm"));
		tr.append(td);
		
		var td = $("<td>");
		td.html( nextArrival.diff(moment(), "minutes") );
		tr.append(td);

		
		// ...
		$("#train_info").append(tr);
	}
}  

function addTrain(event) {
	event.preventDefault();
	
	var train = {};
	train.name = $("#train_name").val();
	train.destination = $("#train_dest").val();
	train.frequency = $("#train_freq").val();
	train.first = $("#train_first").val();
	trains.push(train);
	database.ref().set(trains);
}

$(document).ready(function() {
	$("#train_submit").on("click", addTrain);		
});

