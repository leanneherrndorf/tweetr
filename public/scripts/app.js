/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

function createTweetElement(tweetData) {
  var $tweet = $("<article>").addClass("tweet");
  var $header = $("<header>");
  $header.append($("<img>").addClass("profile").attr("src", tweetData.user.avatars.small));
  $header.append($("<h2>").text(tweetData.user.name));
  $header.append($("<span>").text(tweetData.user.handle));
  $tweet.append($header);

  let time = new Date(tweetData.created_at).toJSON();

  $tweet.append($("<p>").addClass("tweettext").text(tweetData.content.text));
  var $footer = $("<footer>");
  $footer.append($("<time>").addClass("timeago").attr("datetime", time));
  $footer.append($("<div>").addClass("social")
          .append($("<i>").addClass("fa fa-flag").attr('aria-hidden', "true"))
          .append($("<i>").addClass("fa fa-retweet").attr('aria-hidden', "true"))
          .append($("<i>").addClass("fa fa-heart").attr('aria-hidden', "true"))
          );
  $tweet.append($footer);
  return $tweet;
}

//Hover state
function hoverstate(){
  $("article.tweet").hover(function() {
    $(this).addClass('hover');
  }, function(){
    $(this).removeClass('hover');
  });
}

function renderTweets(data){
  var $output;
  data.forEach(function(elm){
    var $tweet = createTweetElement(elm);
    $output = $('#tweets-container').prepend($tweet);
    $("time.timeago").timeago();
  });
  hoverstate();
}

//Loads all initial tweets
function loadTweets() {
  $.ajax({
    method: 'GET',
    url: '/tweets'
  }).done(function(tweet){
    renderTweets(tweet);
  });
}

//flash appropriate error message
function flash(text) {
  $('.new-tweet form .flash').text(text);
  setTimeout(function(){
    $('.new-tweet form .flash').text("");
  }, 1000);
}

$(document).ready(function(){
  loadTweets();

//check if count is too long, or empty and return appropriate warning. Else if everything is okay, post new tweet,
//and clear text area and reset count to 140
  $('.new-tweet').on('submit', function(event) {
    event.preventDefault();

    let count = 140 - $('section form textarea').val().length;
    let text = $('section form textarea').val();
    console.log(text);
    if(text.trim().length === 0){
      flash("Please enter text!");
    }else if(count === 140){
      flash("Please enter text!");
    }else if(count < 0){
      flash("Your tweet is too long!");
    }else{
      $.ajax({
        url: '/tweets',
        method: 'POST',
        data: $("section form").serialize()
      }).done(function(responseText) {
        renderTweets([responseText]);
      });
      $(".new-tweet form .counter").text('140');
      $(".new-tweet form textarea").val('');
    }
  });

  //functionality for hovering over the compose button
  $("#nav-bar .compose").hover(function() {
    $(this).addClass('button');
  }, function(){
    $(this).removeClass('button');
  });

  //toggle for the compose new tweet input field, activated and deactivated by clicking compose
  $("#nav-bar .compose").click(function(e) {
    e.preventDefault();
    $(".new-tweet").slideToggle('click', false);

    $(".new-tweet form textarea").focus();
  });
});

