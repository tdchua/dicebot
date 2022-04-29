//Created by Timothy Joshua Dy Chua
//Purpose: to create a discord bot to help out in dicing for loot in essenceRO, a private server for ragnarok
//Usage: Simply use this command "!dice Name1 Name2 Name3 Name4"
//Output: The winner's name.
//Useful link: https://web.dev/promises/


const Discord = require('discord.js');


function dice_for_users(num_of_dicers, dicers, message) {
  return new Promise(function(resolve) {

    var idx;
    var highest_dice = 0;
    var highest_user = 0;
    var round_num = 1;
    var winners = [];

    while(winners.length != 1) { //To check if there is only one winner.
      winners = [];

      console.log("Round " + round_num);
      message.channel.send("Round **" + round_num + "**");

      console.log(dicers.length);
      for(idx=0; idx<num_of_dicers; idx++) {

        var dice = (Math.floor(Math.random() * 20) + 1); //To generate the value of the dice.
        user = dicers[idx];

        console.log(user + " dices [ " + dice + " ]");
        message.channel.send(user + " dices [**" + dice + "**]");

        if(highest_dice < dice) {
          winners = [];
          highest_dice = dice;
          highest_user = user;
          winners.push(user);
        }
        else if(highest_dice == dice) {
          winners.push(user);
        }

      }
      if(winners.length > 1) {
        message.channel.send("There was a tie! Players: **" + winners + "**");
      }
      else if(winners.length == 1) {
        var highest = [highest_dice, highest_user];
      }
      highest_dice = 0;
      dicers = winners;
      num_of_dicers = dicers.length;
      round_num += 1;

    }
    resolve(highest); //The promise resolves to only one person winning the dice.
  });


}

// Initialize Discord Bot
const bot = new Discord.Client();
bot.once('ready', () => {
  console.log(`Logged in as ${bot.user.tag}!`);
});
// Bot Token
bot.login("INSERT_TOKEN_HERE");


bot.on('message', message => {
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!`
    if (message.content[0] == '!') {
      var message_content = message.content;
      console.log(message_content); //To print out the message content
      var args = message_content.split(' ');
      console.log(args); //print out the "words"that were split from the message
   //
      //Delete spaces from array
      var filtered = args.filter(function(value, index, arr){ return value != "";}); //To remove '' elements in the list because of extra spacing.
      console.log(filtered);
   //
      var cmd = filtered[0]; //This is where !something goes for now it only listens to !dice
      var num_of_dicers = filtered.length - 1; //Counts the number of dicers by measuring length of array.
      var user = 0
      var dicers = filtered.slice(1, num_of_dicers+1); //To get the names for dicing after "!dice"
      var highest = []
   //
      console.log("Number of Dicers: " + num_of_dicers);
      console.log("Dicers: " + dicers);

      switch(cmd.slice(1)) {
          // !ping
          case "dice": {
            //I used promise here  as a waiting function because printing out the winner happened even before the printing of dicing finished.
            //Printing out the winner had to wait on the promise of each person dicing.
            //Once everyone's dice was printed out, the winner can be announced.
            highest = dice_for_users(num_of_dicers, dicers, message).then(
              function(result) {
                message.channel.send("**" + result[1] + "** wins with [**" + result[0] + "**] !!!");
              }
            );
          }
          break;
      //     // Just add any case commands if you want to..
      }
   }
});
