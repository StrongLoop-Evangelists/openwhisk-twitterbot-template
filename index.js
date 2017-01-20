var Twit = require('twit');
var wordfilter = require('wordfilter');
var T = new Twit(require('botfiles/config.js'));
var myText = require('botfiles/sample-text.js');

//a nice 'pick' function thanks to Darius Kazemi: https://github.com/dariusk
Array.prototype.pick = function() {
  return this[Math.floor(Math.random()*this.length)];
};

//functions 
  function tweetOK(phrase) {
      if (!wordfilter.blacklisted(phrase) && phrase !== undefined && phrase !== "" && tweetLengthOK(phrase)){
        return true;
      } else {
        return false;
      }
  }

  function tweetLengthOK(phrase) {
      if (phrase.length <= 130){
        return true;
      } else {
        return false;
      }
  }

function pickTweet(){
      var tweetText = myText.pick();
      if (tweetOK(tweetText)) {
        return tweetText;
      }
      else {
        tweetText = pickTweet();
      }
  }

function main(params){

    var textToTweet = pickTweet();
  
  	T.post('statuses/update', { status: textToTweet }, function(err, reply) {
              if (err) {
                console.log('error:', err);
                return{ error: err};
              }
              else {
                console.log('tweet:', reply);
                return {payload: 'yep, tweeted'};
              }
            });
  };

