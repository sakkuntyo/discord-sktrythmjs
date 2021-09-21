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

client.on("ready", () => {
  if (!fs.existsSync("./tmp")) {
    fs.mkdirSync("./tmp");
  }
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("message", async (msg) => {
  if (msg.author.bot) return;
  console.log("message:", msg.content);

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

      var musicUrl = "";
      if (validUrl.isUri(messageInfo)) {
        musicUrl = messageInfo;
      } else {
        //search
        const options = {
          pages: 1,
        };
        const searchResults = await ytsr(messageInfo, options);
        musicUrl = searchResults.items[0].url;
      }

      msg.channel.send(musicUrl);

      //play
      let stream = ytdl(musicUrl, {
        opusEncoded: true,
        encoderArgs: ["-af", "bass=g=10,volume=0.05"],
      });

      msg.member.voice.channel.join().then((connection) => {
        let dispatcher = connection
          .play(stream, {
            type: "opus",
          })
          .on("finish", () => {
            msg.guild.me.voice.channel.leave();
          });
      });
    }

    // disconnect cmd
    if (secondory_msg.match(/^disc$/)) {
      console.log("secondcmd: disc");
      try {
        voiceChannel.leave();
        return 0;
      } catch (e) {
        console.log(e);
        return 1;
      }
    }
  }
});

client.login(discordtoken);
