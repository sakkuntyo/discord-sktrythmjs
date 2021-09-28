//共通ライブラリ
const fs = require("fs");
const exec = require("child_process").exec;
const Duplex = require("stream").Duplex;

//discordbotの操作に必要
const Discord = require("discord.js");
const discordtoken = JSON.parse(
  fs.readFileSync("./settings.json", "utf8")
).discordtoken;
const client = new Discord.Client();

//ytdl
const ytdl = require("discord-ytdl-core");

//ytsr
const ytsr = require("ytsr");
const validUrl = require("valid-url");

//queue
const queue = new Map();

client.on("ready", () => {
  if (!fs.existsSync("./tmp")) {
    fs.mkdirSync("./tmp");
  }
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("message", async (msg) => {
  if (msg.author.bot) return;
  //console.log("message:", msg.content);

  if (msg.content.match(/^!sr /) || msg.channel.name.match("sr")) {
    console.log("firstcmd: sr");
    var secondory_msg = msg.content.replace(/^!sr /, "");

    var voiceChannel = msg.member.voice.channel;

    // join force
    try {
      var joinedChannel = await voiceChannel.join();
    } catch (e) {
      console.log(e);
    }

    console.log("secondmsg ->", secondory_msg);

    // play cmd
    if (secondory_msg.match(/^play .*/) || secondory_msg.match(/^p .*$/)) {
      console.log("secondcmd: play");
      var messageInfo = secondory_msg.replace(/^play /, "");
      messageInfo = messageInfo.replace(/^p /, "");
      console.log("messageInfo ->", messageInfo);

      //search and push queue
      var musicTitle = "";
      var musicUrl = "";
      if (validUrl.isUri(messageInfo)) {
        musicUrl = messageInfo;
      } else {
        const options = {
          pages: 1,
        };
        const filters1 = await ytsr.getFilters(messageInfo);
	const filter1 = filters1.get('Type').get('Video');
        const searchResults = await ytsr(filter1.url, options);
        musicTitle = searchResults.items[0].title;
        musicUrl = searchResults.items[0].url;
      }

      if (!queue.get(msg.guild.id)) {
        queue.set(msg.guild.id, {
          playing: false,
          connection: null,
          songs: [],
        });
      }

      queue.get(msg.guild.id).songs.push({ title: musicTitle, url: musicUrl });

      msg.channel.send(
        "queue index " + queue.get(msg.guild.id).songs.length + "\r" + musicUrl
      );

      console.log(queue.get(msg.guild.id));

      //already playing
      if (queue.get(msg.guild.id).playing) {
        console.log("Since it is playing, we will just add it to the queue.");
        return;
      }

      play(msg, queue.get(msg.guild.id).songs[0]);
    }

    // queue cmd
    if (secondory_msg.match(/^q/) || secondory_msg.match(/^queue/)) {
      msg.channel.send(
        "queue status" +
          "\r " +
          JSON.stringify(queue.get(msg.guild.id).songs, null, "\t")
      );
      queue.get(msg.guild.id).songs;
      return;
    }

    // queue cmd
    if (secondory_msg.match(/^sh/) || secondory_msg.match(/^shuffle/)) {
      for(i = queue.get(msg.guild.id).songs.length - 1; i > 0; i--) {
	          var j = Math.floor(Math.random() * (i + 1));
	          var tmp = queue.get(msg.guild.id).songs[i];
	          queue.get(msg.guild.id).songs[i] = queue.get(msg.guild.id).songs[j];
	          queue.get(msg.guild.id).songs[j] = tmp;
      }
      msg.channel.send(
        "shuffled" +
          "\r " +
          JSON.stringify(queue.get(msg.guild.id).songs, null, "\t")
      );
      queue.get(msg.guild.id).songs;
      return;
    }
    /*
    // skip cmd
    if (secondory_msg.match(/^s/) || secondory_msg.match(/^skip/) ) {
      queue.get(msg.guild.id).connection.dispatcher.finish();
      return
    }
    */

    // disconnect cmd
    if (secondory_msg.match(/^disc$/)) {
      console.log("secondcmd: disc");
      try {
        voiceChannel.leave();
        queue.delete(msg.guild.id);
        return 0;
      } catch (e) {
        console.log(e);
        return 1;
      }
    }
  }
});

function play(msg) {
  if (!queue.get(msg.guild.id).songs[0]) {
    console.log("tried to play, but the queue was empty, so I quit.");
    msg.guild.me.voice.channel.leave();
    return;
  }

  let stream = ytdl(queue.get(msg.guild.id).songs[0].url, {
    opusEncoded: true,
    encoderArgs: ["-af", "bass=g=10,volume=0.05"],
  });

  msg.member.voice.channel.join().then((connection) => {
    queue.get(msg.guild.id).playing = true;
    queue.get(msg.guild.id).connection = connection;

    let dispatcher = connection
      .play(stream, {
        type: "opus",
      })
      .on("finish", () => {
        queue.get(msg.guild.id).playing = false;
        queue.get(msg.guild.id).songs.shift();
        if (queue.get(msg.guild.id).songs.length == 0) {
          console.log("The song is over and the queue is empty, so I stop.");
          msg.guild.me.voice.channel.leave();
          return;
        }
        play(msg);
      });
  });
}

client.login(discordtoken);
