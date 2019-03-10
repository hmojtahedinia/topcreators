var APIKey = "5258a1b12eab1eb6a43101023288eacf";
var youtubeId = "";
var link = "";


$(document).ready(function () {

  // Here we are building the URL we need to query the database
  var queryURL = "https://api.themoviedb.org/3/movie/now_playing?api_key=" + APIKey + "&language=en-US&page=1";
  // Here we run our AJAX call to the OpenWeatherMap API
  $.ajax({
    url: queryURL,
    method: "GET"
  })
    // We store all of the retrieved data inside of an object called "response"
    .then(function (response) {

      // Log the resulting object
      //console.log(response.results[0].original_language);
      var count = 0;
      for (var i = 0; i < 10 + count; i++) {
        if (response.results[i].original_language === "en") {
          var newDiv = $("<div>");
          var newButton = $("<button>");
          $(".buttonBox").append(newDiv);
          newDiv.append(newButton);
          newButton.text(response.results[i].original_title);
          newButton.attr("id", "nowPlaying" + i);
          newButton.addClass("col-md-12 btn btn-outline-primary nowPlaying");
          newButton.attr("data-id", response.results[i].id);
        } else {
          count++;
        }
      }

    });


  $(document).on("click", ".nowPlaying", function (event) {

    // console.log(event);
    var target = event.currentTarget.id;
    var dataId = $("#" + target).attr("data-id");
    // console.log(dataId);
    var queryURL = "https://api.themoviedb.org/3/movie/" + dataId + "/videos?api_key=" + APIKey + "&language=en-US";

    $.ajax({
      url: queryURL,
      method: "GET"
    })
      .then(function (response) {

        console.log(queryURL);
        console.log(response.results[0].key);
        youtubeId = response.results[0].key;
        link = "https://www.youtube.com/embed/" + youtubeId + "?autoplay=1";
      });

    $("#youtube").attr("src", link);
  });



  //<script src="https://www.gstatic.com/firebasejs/5.8.6/firebase.js"></script>


  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyAQJ_F-7GSyLAbPYlgoVPaX15W_WJPYkcw",
    authDomain: "topcreatorsproject1.firebaseapp.com",
    databaseURL: "https://topcreatorsproject1.firebaseio.com",
    projectId: "topcreatorsproject1",
    storageBucket: "topcreatorsproject1.appspot.com",
    messagingSenderId: "874107222924"
  };
  firebase.initializeApp(config);


  var database = firebase.database();
  var message = "";

  $("#submitButton").on("click", function (event) {
    event.preventDefault();
    message = $("#inputText").val().trim();
    database.ref().set({
    message: message,
    });
  });


  database.ref().on("value", function (snapshot) {
    console.log(snapshot.val());
    console.log(snapshot.val().message);
    database.ref().set(snapshot.val().message);
    $("#messageArea").prepend("<br>" + snapshot.val().message + "</br>");
  }, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
  });








});