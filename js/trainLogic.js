/* global firebase moment */
// Steps to complete:

// 1. Initialize Firebase
// 2. Create button for adding new train - then update the html + update the database
// 3. Create a way to retrieve train from the database.
// 4. Create a way to calculate the next arrival + Minutes away using difference between start and current time.
//    Then use moment.js formatting to set difference in minutes.
// 5. Display in html

// 1. Initialize Firebase
  var config = {
  apiKey: "AIzaSyAqbbkL9CQst_XWwCb2nu8QJNDwQJCVdMo",
  authDomain: "first-project-692a5.firebaseapp.com",
  databaseURL: "https://first-project-692a5.firebaseio.com",
  projectId: "first-project-692a5",
  storageBucket: "first-project-692a5.appspot.com",
  messagingSenderId: "321581678501"
  };
  firebase.initializeApp(config);

  var database = firebase.database();
// Initial Values
    var trainName = "";
    var destination = "";
    var firstTraintime = 0;
    var frequency = "";

  // 2. Button for adding train
  $("#add-train").on("click", function(event) {
    event.preventDefault();

  // Grabs user input from text boxes
  var trainName = $("#train-name-input").val().trim();
  var destination = $("#destination-input").val().trim();
  var firstTraintime = moment($("#train-time-input").val().trim(), "HH:mm").format("X");
  var frequency = $("#frequency-input").val().trim();

// Code for handling the push
      database.ref().push({
        trainName: trainName,
        destination: destination,
        firstTraintime: firstTraintime,
        frequency: frequency,
        dateAdded: firebase.database.ServerValue.TIMESTAMP
      });

    });
    // Firebase watcher + initial loader + order/limit
    database.ref().orderByChild("dateAdded").limitToLast(1).on("child_added", function(snapshot) {
      // storing the snapshot.val() in a variable for convenience
      var sv = snapshot.val();

      // Console.loging the last user's data - snapshot value
      console.log(sv.trainName);
      console.log(sv.destination);
      console.log(sv.frequency);
      //console.log(sv.comment);

      // Change the HTML to reflect
      // $("#train-name-input").text(sv.trainName);
      // $("#destination-input").text(sv.destination);
      // $("#frequency-input").text(sv.frequency);
      // $("#comment-display").text(sv.comment);

      // Handle the errors
    }, function(errorObject) {
      console.log("Errors handled: " + errorObject.code);
    });

    // First Train of the Day is 3:00 AM
    // Assume Train comes every 7 minutes.
    // Assume the current time is 3:16 AM....
    // What time would the next train be...? (Use your brain first)
    // It would be 3:21 -- 5 minutes away

    // ==========================================================
    // Solved Mathematically
    // 16 - 00 = 16
    // 16 % 7 = 2 (Modulus is the remainder)
    // 7 - 2 = 5 minutes away
    // 5 + 3:16 = 3:21

    // Assumptions
    var frequency = 30;

    // Time is 3:30 AM
    var firstTraintime = "06:30";

    // First Time (pushed back 1 year to make sure it comes before current time)
    var firstTimeConverted = moment(firstTraintime, "hh:mm").subtract(1, "years");
    console.log(firstTimeConverted);

    // Current Time
    var currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

    // Difference between the times
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);

    // Time apart (remainder)
    var tRemainder = diffTime % frequency;
    console.log(tRemainder);

    // Minute Until Train
    var tMinutesTillTrain = frequency - tRemainder;
    console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

    // Next Train
    var nextTrain = moment().add(tMinutesTillTrain, "minutes");
    console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));

// Add each train's data into the table
  $("#train-table > tbody").append("<tr><td>" + trainName + "</td><td>" + 
    destination + "</td><td>" + frequency + "</td><td>" + moment(nextTrain).format("hh:mm") + "</td><td>" + tMinutesTillTrain + "</td></tr>");
  