# Make Your Own TwitterBot With OpenWhisk

Twitterbots are fun, and it's easy to create one with Apache OpenWhisk and Bluemix. With this template, you can make a bot that randomly tweets a line from a textfile. (For an example, check out [PLUBot](https://twitter.com/PLUBot).)

## Instructions

### 1. Clone this repo

Prerequisites: I assume you have node and npm installed. Need help installing either? [Here's a link for you.](http://blog.npmjs.org/post/85484771375/how-to-install-npm)

1. Clone this repo
2. Run `npm install`
3. Open in your favorite editor.

### 2. Get Credentials and Add Configuration

To run your own bot you will need Twitter and Bluemix credentials, the OpenWhisk CLI, and an idea.

##### Create a Twitter account and app keys

* a Twitter account
* a Twitter application (not the same as a Twitter account; apply for one at [https://apps.twitter.com](apps.twitter.com))
* a Consumer Key, a Consumer Secret, an Access Token, and your Access Token Secret

Put this information in the `temp-config.js` file, and rename it to `config.js`. Then delete `temp-config.js`.

##### Register for Bluemix

* a Bluemix account. Sign up for one at [https://console.ng.bluemix.net/registration](https://console.ng.bluemix.net/registration). *No credit card required! You'll get 2GB of runtime and container memory free for 30 days, plus access to provision up to 10 services (including databases, devops pipelines, and more).*


##### Install and configure Openwhisk
* Visit the [OpenWhisk CLI setup page](https://console.ng.bluemix.net/openwhisk/cli) and log in to Bluemix.
* Install the OpenWhisk CLI (instructions [here](https://console.ng.bluemix.net/docs/openwhisk/openwhisk_cli.html#openwhisk-cli)).
* Log in to Bluemix, if you haven't already.
* Follow these instructions (step 2 of the CLI setup) to authorize your OpenWhisk CLI: 
![instructions](https://github.com/emckean/blank-openwhisk-bot/blob/master/bluemix-auth.png?raw=true)

You can also run your own OpenWhisk server! This is beyond the scope of this workshop, but you can find more info [here](https://github.com/openwhisk/openwhisk).


### 3. Add Your Source Data

To add text for your bot to tweet, add it in the `botfiles/sample-text.js` file. Make sure each line you add (except the last one) ends with a comma. This file should have no blank lines.

IMPORTANT: you must install the botfiles folder as a local module before deploying: 

`npm install --save ./botfiles`

If you make changes, you must update the installation: 

`rm -rf node_module/botfiles && npm install --save ./botfiles`

##### Run Tests
There are tests for the functions in `index.js` in the `tests/test.js` file. Run them with `npm test`.

### 4. Create a Zipfile
Because we want to use node modules with our bot, we'll upload our entire directory as a zip file. NB: We want to zip the *contents* of our repo, not the root folder.

On a Mac, you can do this with this command: 
`zip -r -X "twitterbot.zip" *  `

If you update your bot, remember to remove your zip file so that it doesn't get re-zipped into your updated file! Try 
`rm twitterbot.zip && zip -r -X "twitterbot.zip" *`

### 5. Create Your OpenWhisk Action

`wsk action create myTwitterBot --kind nodejs:6 twitterbot.zip`

Remember that if you change your action, you need to `update` it:

`wsk action update myTwitterBot --kind nodejs:6 twitterbot.zip`

##### Check your action
Before we set up triggers and rules to let our bot tweet by itself, let's check that it actually works.

`wsk action invoke myTwitterBot -r --blocking`

You should see a response like this (the "payload" should be a line from your sample-text.js)

~~~~
{
    "payload": "I'm a good bot, Brant"
}
~~~~


### 6. Create Your OpenWhisk Trigger
We want our bot to tweet once an hour (don't have your bot tweet more than once an hour; that's kind of rude). You can set an alarm trigger with `cron` (let's call it `sendTweet`) to make this happen, like so: 

`wsk trigger create sendTweet --feed /whisk.system/alarms/alarm --param cron "5 * * * 0-6"`

Cron syntax is tricky! If you don't want to remember it, you can use this handy [crontab generator](http://crontab-generator.org/).

### 7. Create Your OpenWhisk Rule
Once you have an action and a trigger, you can put them together with a rule, like so:

`wsk rule create tweetRule sendTweet myTwitterBot`

The format here is 

`wsk rule create NameOfRule NameOfTrigger NameOfAction`

### 8. Enjoy Your Bot!

Your bot should now tweet five minutes after the hour, every hour, forever (or until your Bluemix trial expires). 

### 9. Want to Turn Off Your Bot?

Double-check the name of your rule by entering 
`wsk rule list` at the command line. Then delete your rule (most likely `tweetRule`) with the line 
`wsk delete rule tweetRule`. 

### 10. Cleanup

If you are creating this example on a lab computer, make sure you:

* log out of your Bluemix account
* delete your bot code on this machine: `rm -rf openwhisk-twitterbot-template`
* de-authorize your OpenWhisk account on this machine, by removing `$HOME/.wskprops` (on the Interconect DevZone lab machines this will be in `/usr/local/bin`).
* delete sensitive commands (e.g., your OpenWhisk auth command) from your bash/zsh history. You can do this by editing the `~/.bash_history` or `~/.zsh_history` files. (The zsh shell may also  be called `.zhistory`. Not sure where yours is? Try `echo $HISTFILE`.)

### At IBM InterConnect? Complete this lab and scan this code for InterConnect bucks! 
![QR code](https://chart.googleapis.com/chart?chs=500x500&cht=qr&chl=QR234)


## Thank Yous
Thanks to [Darius Kazemi](https://github.com/dariusk) for the wordfilter module and for the .pick function. Thanks to [Ray Camden](https://www.raymondcamden.com/) for the best darn OpenWhisk blog posts ever, plus the link to the [crontab generator](http://crontab-generator.org/). Thanks also to [Allison Parrish](https://twitter.com/aparrish) and David Celis for reviewing an earlier version of this bot repo; all errors remain the exclusive property & reponsibility of the author. :-)

