var APIKey = "5258a1b12eab1eb6a43101023288eacf";
var youtubeId ="";
var link ="";
var resultId="";
var title ="";

$(document).ready(function(){
        $(".movieNewsContainer").hide();

         var images = ['0.jpg', '1.jpg', '2.jpg', '3.jpg', '4.jpg', '5.jpg', '6.jpg', '7.jpg', '8.jpg', '9.jpg'];
         var footerImages = ['11.jpg', '12.png', '13.jpg', '14.jpg', '15.jpg'];
         $('#header').css({'background-image': 'url(assets/images/' + images[Math.floor(Math.random() * images.length)] + ')'});
         $('#footer').css({'background-image': 'url(assets/images/' + footerImages[Math.floor(Math.random() * footerImages.length)] + ')'});
        addNews();
        //The function below adds Top 10 now playing movies right now
        $("#nowPlaying").on("click",function(event){
            event.preventDefault();
           $(".buttonBox").empty();
           $(".movieInfo").empty();
           
           var queryURL = "https://api.themoviedb.org/3/movie/now_playing?api_key="+APIKey+"&language=en-US&page=1";
          
            $.ajax({
            url: queryURL,
            method: "GET"
            })
            .then(function(response) {
                addButtonsWithMovieInfo(response);
            });
        });
        //The function below plays youtube video of clicked movie and adds news of that movie below
        $(document).on("click",".nowPlayingButton",function(event){
             playYoutube(event);
             $(".movieNewsContainer").show();
             addQueryNews(event.toElement.innerHTML);    
         });
        

         //The function below adds max 10 buttons of movie searched in input bar 
        $("#searchButton").on("click",function(event){
            event.preventDefault();
            $(".movieInfo").empty();
            $(".buttonBox").empty();
            $(".movieNewsContainer").show();

            var title = $("#inputMovie").val();
            addQueryNews(title);
            var queryURL = "https://api.themoviedb.org/3/search/movie?api_key="+APIKey+"&language=en-US&query="+title+"&page=1&include_adult=false";

            $.ajax({
                url: queryURL,
                method: "GET"
                })
                .then(function(response) {
                    
                    addButtonsWithMovieInfo(response);
    
                });
                $("#inputMovie").val("");

        });
        
        

        // The function below until addNews() adds chat box 
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
                //console.log(snapshot.val());
                //console.log(snapshot.val().message);
                database.ref().set(snapshot.val().message);
                $("#messageArea").prepend("<br>" + snapshot.val().message + "</br>");
            }, function (errorObject) {
                //console.log("The read failed: " + errorObject.code);
            });
       

    
});

//This function will add 20 ongoing news about tvshows and movies
function addNews()
{
    var newsURL="https://newsapi.org/v2/everything?sources=entertainment-weekly&apiKey=cfa7c039edef460a8f6723558e31f499";
    var topNewsURL="https://newsapi.org/v2/top-headlines?sources=entertainment-weekly&apiKey=cfa7c039edef460a8f6723558e31f499";
    var googleTopNews="https://newsapi.org/v2/top-headlines?country=ca&apiKey=cfa7c039edef460a8f6723558e31f499";

    $.ajax({
        url: newsURL,
        method: "GET"
        })
        .then(function(response) {
            //console.log(response);
            
            
            for(var i=0;i<20;i++)
            {
                var newsDiv =$("<div>");
                var title =$("<a>");
                var content = $("<div>");
                var newsImage=$("<img>");
                var publish =$("<div>");

                $(".topNews").append(publish);
                var newsDate=response.articles[i].publishedAt;
                var momentDate = moment(newsDate,'YYYY-MM-DD');
                publish.text(momentDate.format('LL'));
                publish.addClass("newsDate");
                

                $(".topNews").append(newsDiv);
                newsDiv.append(title);
                newsDiv.addClass("newsDivTitle");
                title.text(i+1+". "+response.articles[i].title);
                title.attr("href",response.articles[i].url); 
                
                $(".topNews").append(newsImage);
                newsImage.addClass("newsImage");
                newsImage.attr("src",response.articles[i].urlToImage);

                $(".topNews").append(content);
                content.text(response.articles[i].content);
                content.addClass("newsDivContent");

            }

        });
}

//This function will add 20 movie news
function addQueryNews(title)
{
    $(".movieNews").empty();
    var queryNews="https://newsapi.org/v2/everything?q="+title+"&language=en&sortBy=relevancy&apiKey=7a70b0d355fc47d4a73c34f23bbb6db5";

    $.ajax({
        url: queryNews,
        method: "GET"
        })
        .then(function(response) {
            //console.log(response);
            
            for(var i=19;i>=0;i--)
            {
                var newsDiv =$("<div>");
                var title =$("<a>");
                var content = $("<div>");
                var newsImage=$("<img>");
                var publish =$("<div>");
                var containerDiv=$("<div>");

                $(containerDiv).prepend(content);
                content.text(response.articles[i].content);
                content.addClass("movieNewsContent");

                $(containerDiv).prepend(newsDiv);
                newsDiv.append(title);
                newsDiv.addClass("movieNewsTitle");
                title.text(i+1+". "+response.articles[i].title);
                title.attr("href",response.articles[i].url);

                $(containerDiv).prepend(publish);
                var newsDate=response.articles[i].publishedAt;
                var momentDate = moment(newsDate,'YYYY-MM-DD');
                publish.text(momentDate.format('LL'));
                publish.addClass("movieNewsDate");

                $(".movieNews").prepend(containerDiv);
                containerDiv.addClass("col-md-8");

                $(".movieNews").prepend(newsImage);
                newsImage.addClass("movieNewsImage");
                newsImage.attr("src",response.articles[i].urlToImage);
                newsImage.addClass("col-md-4");

            }

        });
    }

//This function will search for trailer on youtube
function searchYoutube(search)
{
   var APIKey = "AIzaSyBtp6rXtBjreYY-3-sZ3LntzY6ptXDnhA8";
   var queryURL = "https://www.googleapis.com/youtube/v3/search?part=id&q="+search+"+trailer&type=video&key=" + APIKey;
    $.ajax({
      url: queryURL,
      method: "GET"
    }) 
      .then(function(response) {        
        
        resultId = response.items[0].id.videoId.toString();
         
      });

}

//This function will play youtube video
function playYoutube(event) {

    var target = event.currentTarget.id;
    var movieName = event.currentTarget.value.trim();
    var infoNumber= target.substring(10);
    var dataId = $("#"+target).attr("data-id");
    
    var queryURL= "https://api.themoviedb.org/3/movie/"+dataId+"/videos?api_key="+APIKey+"&language=en-US";

    $.ajax({
        url: queryURL,
        method: "GET"
    })
        .then(function(response) {
        
        if(response.results.length===0)
        {
             searchYoutube(movieName);
             link= "https://www.youtube.com/embed/"+resultId+"?autoplay=1";
             $("#youtube").attr("src",link);
        }else{
            youtubeId = response.results[0].key; 
             link = "https://www.youtube.com/embed/"+youtubeId+"?autoplay=1";
             $("#youtube").attr("src",link);
        }
        });

        $(".overview").hide();
        
        $(".movieInfo"+infoNumber).show();
        
        
        
}


//This function will add movie buttons from TMDB with its info
function addButtonsWithMovieInfo(response) {

    var count =0;
    for(var i=0;i<10+count;i++)
    {
            if(response.results[i].original_language==="en")   
            {
            var year =$("<div>");    
            var newDiv=$("<div>");
            var infoTitle= $("<div>");
            var infoDiv= $("<div>");
            var poster = $("<img>");
            var newButton=$("<button>");
            $(".buttonBox").append(newDiv);
            newDiv.append(newButton);
            newButton.text(response.results[i].original_title);
            newButton.attr("value",response.results[i].original_title.trim());
            newButton.attr("id","nowPlaying"+i);
            newButton.addClass("col-md-12 btn btn-outline-primary nowPlayingButton");
            newButton.attr("data-id",response.results[i].id);
            //These lines add release date of the movie
            $(".movieInfo").append(year);
            year.addClass("movieInfo"+i+" overview");
            
            const dateToStore = response.results[i].release_date;
            const momentDate = moment(dateToStore,'YYYY-MM-DD');
            year.text(momentDate.format('LL'));
            //These lines post a poster under movieInfo class
            $(".movieInfo").append(poster);
            poster.attr("src","https://image.tmdb.org/t/p/w185"+response.results[i].poster_path);
            poster.addClass("movieInfo"+i+" overview");
            //These lines post a title under poster in movieInfo class
            $(".movieInfo").append(infoTitle);
            infoTitle.text(response.results[i].original_title+" Storyline: ");
            infoTitle.addClass("movieInfo"+i+" overview");
            //These lines post a movie overview under movie title in movieInfo class
            $(".movieInfo").append(infoDiv);
            infoDiv.text(response.results[i].overview);
            infoDiv.addClass("movieInfo"+i+" info overview");
            $(".movieInfo"+i).hide();
            }else{
                count++;
            }
    }



}


// function sticky() {
//     if ($(".topNews").pageYOffset > sticky || $(".youtubeBox").pageYOffset > sticky ||$(".buttonBox").pageYOffset > sticky) {
//       header.classList.add("sticky");
//     } else {
//       header.classList.remove("sticky");
//     }
//   }

