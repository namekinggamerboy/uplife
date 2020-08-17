const Discord = require("discord.js");
const moment = require("moment");
require("moment-duration-format");
const client = new Discord.Client();
client.afk = new Map();
const ReactionRoleManager = require("reaction-role");
const chalk = require('chalk');
const economy = require("economy-uplife");
const db = require('quick.db');
const ms = require("ms");
const canvas = require("discord-canvas"),
welcomeCanvas = new canvas.Welcome();
const giveaways = require("discord-giveaways");
const prefiX = require("discord-prefix"),
path = require("path"),
fs = require("fs");
const { Player } = require("music-uplife");

const se = {

owner: null,
start: false,
rr: false,
youtubeapi: null,
prefix: null,
music: null,
message: null
  
}

module.exports = {

bot: client,

version: require("./package.json").version,

randomNum(min, max) {
		return Math.floor(Math.random() * (max - min)) + min;
	},

printDate(pdate, isLongDate){
        let monthNames = [
            "January", "February", "March",
            "April", "May", "June", "July",
            "August", "September", "October",
            "November", "December"
          ];
        
        let day = pdate.getDate();
        let monthIndex = pdate.getMonth();
        let year = pdate.getFullYear();
        let hour = pdate.getHours() < 10 ? "0" + pdate.getHours() : pdate.getHours();
        let minute = pdate.getMinutes() < 10 ? "0" + pdate.getMinutes() : pdate.getMinutes();

        let thedate = (isLongDate) ? day + " " + monthNames[monthIndex] + " " + year + " at " + hour + "h" + minute 
        : day + " " + monthNames[monthIndex] + " " + year
        return thedate;
	},

convertMs(milliseconds){
		let roundTowardsZero = milliseconds > 0 ? Math.floor : Math.ceil;
		let days = roundTowardsZero(milliseconds / 86400000),
		hours = roundTowardsZero(milliseconds / 3600000) % 24,
		minutes = roundTowardsZero(milliseconds / 60000) % 60,
		seconds = roundTowardsZero(milliseconds / 1000) % 60;
		if(seconds === 0){
			seconds++;
		}
		let isDays = days > 0,
		isHours = hours > 0,
		isMinutes = minutes > 0;
		let pattern = 
		(!isDays ? "" : (isMinutes || isHours) ? "{days} days, " : "{days} days and ")+
		(!isHours ? "" : (isMinutes) ? "{hours} hours, " : "{hours} hours and ")+
		(!isMinutes ? "" : "{minutes} minutes and ")+
		("{seconds} seconds");
		let sentence = pattern
			.replace("{duration}", pattern)
			.replace("{days}", days)
			.replace("{hours}", hours)
			.replace("{minutes}", minutes)
			.replace("{seconds}", seconds);
		return sentence;
	},

  start(token, Prefix, owner, op) {
  
if (!token)
    return console.log(chalk.bold.red(
      "[uplife-api]{type: error} ⚠️: make sure your give me bot token or invite bot token"
    ));
 /* if (!game)
    return console.log(chalk.bold.red(
      "[uplife-api]{type: error} ⚠️: make sure your give me bot game"
    ));

  if (!name)
    return console.log(chalk.bold.red(
      "[uplife-api]{type: error} ⚠️: make sure your give me bot game playing status"
    ));

  if (!stats)
    return console.log(chalk.bold.red(
      "[uplife-api]{type: error} ⚠️: make sure your give me bot status"
    ));*/
    
 /*  if (!status)
    return console.log(chalk.bold.red(
      "[uplife-api]{type: error} ⚠️: make sure your give me status"
    )); */

  if (!Prefix)
    return console.log(chalk.bold.red(
      "[uplife-api]{type: error} ⚠️: make sure your give me bot prefix"
    ));
 se.prefix = Prefix; 
  if (!owner)
    return console.log(chalk.bold.red(
      "[uplife-api]{type: error} ⚠️: make sure your give me bot Owner id"
    ));
    se.owner = owner;
 if (op.music === "true") {
  if(!op.youtubekey) return console.log(chalk.bold.red("[uplife-api]{type: error} ⚠️: make sure your give me youtube v3 api key for music"));
  const player = new Player(client, op.youtubekey);
client.player = player;
 se.youtubeapi = op.youtubekey;
  }
  
client.on("error", e => {
  console.log("[ERROR] " + e);
});
client.on("disconnected", () => {
  console.log("[WARN] Disconnected from Discord");
  console.log("[LOG] Attempting to log in...");
  client.login(token);
});

    client.on("ready", () => {
      console.log(chalk.green(
        "[uplife-api]{type: successfully} ✔️bot online: " +
          client.user.tag +
          " here bot Invite link: " +
          `https://discordapp.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=8 support server link: https://discord.gg/KmngEup`
      ));
      if(op.gvieaway === "rue"){
      giveaways.launch(client, {
        updateCountdownEvery: 5000,
        botsCanWin: false,
        ignoreIfHasPermission: [
          "MANAGE_MESSAGES",
          "MANAGE_GUILD",
          "ADMINISTRATOR"
        ],
        embedColor: op.embedcolor,
        embedColorEnd: op.embedcolorend,
        reaction: `${op.reaction}`,
        storage: `${op.giveawaystorage}`||__dirname+"/giveaways.json"
      });
        }
});

  
client.on("message", msg => {
 if (msg.channel.type == "dm") return;
    if (msg.author.bot) {
      return;
    }
    const message = msg;
 prefiX.setPrefix(Prefix) 
 if (prefiX.getPrefix(msg.guild.id) === null) {
        var prefix = prefiX.getPrefix()
    } else {
        var prefix = prefiX.getPrefix(msg.guild.id)
        }
 if (!msg.content.startsWith(Prefix)) return; 
   /* reset-prefix Command */
      if (msg.content === `${Prefix}reset-prefix`) {
if(!msg.member.hasPermission("ADMINISTRATOR")) return msg.reply({ 
embed:{ 
title: "only Admin parmission user use this Command.", 
color: 0xff0000
}});
    prefiX.setPrefix(`${Prefix}`, msg.guild.id)
msg.channel.send({ embed: {
title: `✅ | successfully reset prefix to ${Prefix}`,
color: 0x00ff00
 }});
  }  
});  
  
  
  client.on("message", msg => {
 if (msg.channel.type == "dm") return;
    if (msg.author.bot) {
      return;
    }
 se.message = msg;
 if (prefiX.getPrefix(msg.guild.id) === null) {
        var prefix = prefiX.getPrefix()
    } else {
        var prefix = prefiX.getPrefix(msg.guild.id)
    }
const message = msg;
    
    if (msg.content.match(new RegExp(`^<@!?${client.user.id}>( |)$`))) {
      msg.channel.send({ embed:{ title: "My prefix in this server is set to: `"+prefix+"`\nTo reset to default execute `"+Prefix+"reset-prefix` command!", color: 0x0022ff}});
    }
    if (!msg.content.startsWith(prefix)) return;
    if(op.util === "true"){
    /* Util commands */
    if (msg.content === prefix + "ping") {
      msg.channel.send({
        embed: { title: `🏓 **pong** ` + "`" + client.ws.ping + "`" + `ms` }
      });
    }
if(msg.content === prefix + "invite") { 
  msg.channel.send({
    embed: { 
      title: 'Thanks for choosing me!:blush:',
    description: `To add me, follow [this URL](https://discordapp.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=8)`
      
    }
  });
}
    if (msg.content === prefix + "botinfo") {
      msg.channel.send({
        embed: {
          title: "Bot info",
          description:
            `name: ${client.user.tag}\nprefix: ${Prefix}\nowner: **${
              client.users.find(e => e.id === owner).tag
            }**\nServers: **${client.guilds.size}**\nMembers: **${
              client.users.size
            }**\nLibrary: **uplife-api**\nUptime:` +
            "`" +
            `${moment.duration(client.uptime).format("d[d] h[h] m[m] s[s]")}` +
            "`",
          image: {
            url:
              "https://cdn.discordapp.com/attachments/580808905979068484/590192336265543681/Tw_1-1.gif"
          },
          color: 0x00ff00
        }
      });
    }
    } 
    if(op.help === "true"){
    if (msg.content === prefix + "help") {
      let Op = new Discord.MessageEmbed()
        Op.setTitle(`help Command | my prefix: ${prefix}`)
 if(op.mod === "true"){       
Op.addField(`MOD COMMANS`, "`setprefix`,`kick`,`ban`,`warn`,`clear`,`unban`,`mute`,`unmute`", true)
        }
if(op.util === "true"){
Op.addField(
          `UTIL COMMANDS`,
          "`botinfo`,`ping`,`help`,`serverinfo`,`userinfo`,`invite`",
          true
        )
}
  if(op.economy === "true"){   
   Op.addField(
          `ECONOMY COMMANDS`,
          "`balance`,`addmoney`,`work`,`daily`,`resetdaily`,`leaderboard`,`dice`,`delete`,`coinflip`,`slots`,`transfer`",
          true
        )
}
if(op.music === "true"){
        Op.addField(
          `Music COMMANDS`,
          "`play`,`skip`,`stop`,`setvolume`,`nowplaying`,`loop-on`,`loop-off`,`queue`,`clear-queue`,`pause`,`resume`",
          true
        )
}
if(op.giveaway === "true"){
        Op.addField(`GIVEAWAY COMMANDS`, "`start-giveaway`,`end-giveaway`,`reroll-giveaway`", true)
}
if(op.welcomer === "true"){
       Op.addField(`WELCOMER COMMANDS`, "`setimage`,`setchannel`,`setcolor`,`setmessage`,`weltest`,`disable-welcomer`", true)
    }
        Op.addField(`ONWER COMMANDS`, "`serverlist`,`restart`", true)
    /*    if(client.commands){
        Op.addField(`CUSTOM COMMANDS`, client.commands.map(e => "`"+e.command.name+"`").join(","), true)
      } */
        Op.setColor("RANDOM");
      msg.channel.send(Op);
   }
    }   
  });
  
  if(op.economy === "true"){
economy.start(client, Prefix);
}
  
  client.on("message", async msg => {
    if (msg.channel.type == "dm") return;
    if (msg.author.bot) {
      return;
    }
    const message = msg;
 if (prefiX.getPrefix(msg.guild.id) === null) {
        var prefix = prefiX.getPrefix()
    } else {
        var prefix = prefiX.getPrefix(msg.guild.id)
    }
    if (!msg.content.startsWith(prefix)) return;
    const args = msg.content.slice(prefix.length).split(" ");
    const command = args.shift().toLowerCase();
    if(op.util === "true"){
    if (command === "userinfo") {
      let inline = true;
      let resence = true;
      const status = {
        online: "🍏 Online",
        idle: "🌙 Idle",
        dnd: "🔴 Do Not Disturb",
        offline: "⚪ Offline/Invisible"
      };

      const member =
        message.mentions.members.first() ||
        message.guild.members.get(args[0]) ||
        message.member;
      let target = message.mentions.users.first() || message.author;
      let bot;
      if (member.user.bot === true) {
        bot = "✅ Yes";
      } else {
        bot = "❌ No";
      }

      let embed = new Discord.MessageEmbed()
        //.setAuthor(member.user.username)
        .setThumbnail(target.displayAvatarURL())
        .setColor("#00ff00")
        .addField("Full Username", `${member.user.tag}`, inline)
        .addField("ID", member.user.id, inline)
        .addField(
          "Nickname",
          `${
            member.nickname !== null
              ? `✅ Nickname: ${member.nickname}`
              : "❌ None"
          }`,
          true
        )
        .addField("Bot", `${bot}`, inline, true)
        .addField(
          "Status",
          `${status[member.user.presence.status]}`,
          inline,
          true
        )
        .addField(
          "Playing",
          `${
            member.user.presence.activities[0]
              ? `✅ ${member.user.presence.activities[0].name}`
              : "❌ Not playing"
          }`,
          inline,
          true
        )
        .addField(
          "Roles",
          `${member.roles
            .filter(r => r.id !== message.guild.id)
            .map(roles => `<@&${roles.id}>`)
            .join(" **|** ") || "❌No Roles"}`,
          true
        )
        .addField("Joined Discord At", "`"+moment.utc(member.user.createdAt).format('DD/MM/YYYY | HH:mm:ss')+"`", true)
        .setFooter(`Information about ${member.user.username}`)
        .setTimestamp();

      message.channel.send(embed);
    } else if (command === "serverinfo") {
      let ops = new Discord.MessageEmbed()
   ops.setTitle("serverinfo")
   ops.setColor("#ccffff")
  if(msg.guild.icon){
  ops.setThumbnail(msg.guild.iconURL({ size: 2048 }))
                    }
        ops.addField("📂server name", msg.guild.name, true)
        ops.addField("🆔server id", `${msg.guild.id}`, true)
        ops.addField(
          "🏂server Boosts", `${msg.guild.premiumSubscriptionCount || 0}`, true)
        ops.addField("👑server Owner", `<@${msg.guild.owner.user.id}>`, true)
        ops.addField("🔖server Region", `${msg.guild.region}`, true)
        ops.addField("💤server afk channel", `${msg.guild.afkChannel || "no afk channel"}`, true)
        ops.addField("📜server roles", `${msg.guild.roles.size || 0}`, true)
        ops.addField("😎server emojis", `${msg.guild.emojis.size || 0}`, true)
        ops.addField("📡server channels", `${msg.guild.channels.size || 0}`, true)
        ops.addField("🎪server Create", "`"+`${moment.utc(msg.guild.createdAt).format('DD/MM/YYYY | HH:mm:ss')}`+"`", true);
      msg.channel.send(ops);
    }
    } 
      /* start owner commands */
    
      if(command === "restart"){
   if(message.author.id === owner){
       process.exit(1);
      } else {
        message.channel.send(":x:your not my owner");
      } 
      } else
      if(command === "serverlist"){
      if(message.author.id === owner){
     
    await message.delete();

        let i0 = 0;
        let i1 = 10;
        let page = 1;

        let utils = {
   TOTAL_SERVERS : "Total Servers",
      MEMBERS: "Members",
          PAGE: "Page"
        };

        let description = 
        `${utils.TOTAL_SERVERS} : ${message.client.guilds.size}\n\n`+
        message.client.guilds.sort((a,b) => b.memberCount-a.memberCount).map((r) => r)
        .map((r, i) => `**${i + 1}** - ${r.name} | ${r.memberCount} ${utils.MEMBERS.toLowerCase()}`)
        .slice(0, 10)
        .join("\n");

        let embed = new Discord.MessageEmbed()
            .setAuthor(message.author.tag, message.author.displayAvatarURL())
            .setColor("0099ff")
            .setFooter(client.user.username)
            .setTitle(`${utils.PAGE}: ${page}/${Math.ceil(client.guilds.size/10)}`)
            .setDescription(description);

        let msg = await message.channel.send(embed);
        
        await msg.react("⬅️");
        await msg.react("❌");
        await msg.react("➡️");

        let collector = msg.createReactionCollector((reaction, user) => user.id === message.author.id);

        collector.on("collect", async(reaction, user) => {

            if(reaction._emoji.name === "⬅️") {

                // Updates variables
                i0 = i0-10;
                i1 = i1-10;
                page = page-1;
                
                // if there is no guild to display, delete the message
                if(i0 < 0){
                    return msg.delete();
                }
                if(!i0 || !i1){
                    return msg.delete();
                }
                
                description = `${utils.TOTAL_SERVERS} : ${client.guilds.size}\n\n`+
                client.guilds.sort((a,b) => b.memberCount-a.memberCount).map((r) => r)
                .map((r, i) => `**${i + 1}** - ${r.name} | ${r.memberCount} ${utils.MEMBERS.toLowerCase()}`)
                .slice(i0, i1)
                .join("\n");

                // Update the embed with new informations
                embed.setTitle(`${utils.PAGE}: ${page}/${Math.round(client.guilds.size/10)}`)
                .setDescription(description);
            
                // Edit the message 
                msg.edit(embed);
            
            };

            if(reaction._emoji.name === "➡️"){

                // Updates variables
                i0 = i0+10;
                i1 = i1+10;
                page = page+1;

                // if there is no guild to display, delete the message
                if(i1 > client.guilds.size + 10){
                    return msg.delete();
                }
                if(!i0 || !i1){
                    return msg.delete();
                }
                description = `${utils.TOTAL_SERVERS} : ${client.guilds.size}\n\n`+
      client.guilds.sort((a,b) => b.memberCount-a.memberCount).map((r) => r)
                .map((r, i) => `**${i + 1}** - ${r.name} | ${r.memberCount} ${utils.MEMBERS.toLowerCase()}`)
                .slice(i0, i1)
                .join("\n");
                /* Update the embed with new informations */             embed.setTitle(`${utils.PAGE}: ${page}/${Math.round(client.guilds.size/10)}`)               .setDescription(description);          
                // Edit the message 
                msg.edit(embed);
            };
            if(reaction._emoji.name === "❌"){
                return msg.delete(); 
            }
            // Remove the reaction when the user react to the message
            await reaction.users.remove(message.author.id);
        });    
        
      } else {
        message.channel.send(":x:your not my owner");
      } 
      }
      /* start giveaway commands */
  if(op.giveaway === "true"){
      if(command === "start-giveaway"|| command === "sgiveaway"){   
if(!message.member.hasPermission('MANAGE_MESSAGES')){
        return message.channel.send(':x: You need to have the manage messages permissions to start giveaways.');
    }

    // Giveaway duration
    let giveawayDuration = args[0];
    // If the duration isn't valid
    if(!giveawayDuration || isNaN(ms(giveawayDuration))){
        return message.channel.send(':x: You have to specify a valid duration!');
    }
    // Number of winners
    let giveawayNumberWinners = args[1];
    // If the specified number of winners is not a number
    if(isNaN(giveawayNumberWinners)){
        return message.channel.send(':x: You have to specify a valid number of winners!');
    }
        let wi = "winners";
        if(parseInt(args[1]) <= 2)wi = "winner";
    // Giveaway prize
    let giveawayPrize = args.slice(2).join(' ');
    // If no prize is specified
    if(!giveawayPrize){
        return message.channel.send(':x: You have to specify a valid prize!');
    }
                                       
giveaways.start(msg.channel, {
    time: ms(args[0]),
    prize: args.slice(2).join(" "),
    winnersCount: parseInt(args[1]),
    messages: {
        giveaway: `${op.giveawaymessage}`,
        giveawayEnded: `${op.giveawayembed}`,
        timeRemaining: "Time remaining: **{duration}**!\nHosted by.<@"+msg.author.id+">",
        inviteToParticipate: `${op.participate}`,
        winMessage: "Congratulations, {winners}! You won **{prize}**!",
        embedFooter: "Giveaways",
        noWinner: "Giveaway cancelled, no valid participations.",
        winners: wi,
        endedAt: "Ended at",
        units: {
            seconds: "seconds",
            minutes: "minutes",
            hours: "hours",
            days: "days"
        }
    }
});
  message.channel.send({ embed:{ title: "✅ Successfully start Giveaway", color: 0x00ff00}});   
        
      } else
      if(command === "reroll-giveaway"||command === "rgiveaway"){
  if(!message.member.hasPermission('MANAGE_MESSAGES')){
        return message.channel.send(':x: You need to have the manage messages permissions to start giveaways.');
    }    
 let messageID = args[0];
if(!messageID) return message.channel.send("❌ | enter giveaway message id");
        giveaways.reroll(messageID).then(() => {
            message.channel.send("☑️ | Success! Giveaway rerolled!");
        }).catch((err) => {
            message.channel.send("❎ | No giveaway found for "+messageID+", please check and try again");
        }); 
      } else 
      if(command === "end-giveaway"||command === "egiveaway"){
    if(!message.member.hasPermission('MANAGE_MESSAGES')){
        return message.channel.send(':x: You need to have the manage messages permissions to start giveaways.');
    }    
 let messageID = args[0];
if(!messageID) return message.channel.send("❌ | enter giveaway message id");
      giveaways.edit(messageID, {
          setEndTimestamp: Date.now() 
        }).then(() => {
            message.channel.send("☑️ | Success! Giveaway updated!");
        }).catch((err) => {
            message.channel.send("❎ | No giveaway found for "+messageID+", please check and try again");
        });
      }
  }
     /* mod comamnds*/
   if(op.welcomer === "true"){
     if(command === "weltest"){
         if(!db.get(`color_${message.guild.id}`)) return message.channel.send("❌ | set welcome color then try");
         if(!db.get(`image_${message.guild.id}`)) return message.channel.send("❌ | set welcome image then try");
         if(!db.get(`channel_${message.guild.id}`)) return message.channel.send("❌ | set welcome channel then try");
         message.channel.send("✅ | welcome test successfull")
         client.emit('guildMemberAdd', message.member); 
 } else
 if (command === "setchannel") {
          if (!msg.member.hasPermission("ADMINISTRATOR"))
            return msg.reply({
              embed: {
                title: "only Admin parmission user use this Command.",
                color: 0xff0000
              }
            });
          let cha = message.mentions.channels.first();
          if (!cha)
            return message.channel.send({
              embed: {
                title: "❌ | please mention channel",
                color: 0xff0000
              }
            });
          message.channel.send({
            embed: {
              title: "✅ | successfully select channel",
              color: 0x00ff00,
              description: `channel <#${cha.id}>`
            }
          });
          db.set(`channel_${message.guild.id}`, cha.id);
        } else if (command === "setimage") {
          if (!msg.member.hasPermission("ADMINISTRATOR"))
            return msg.reply({
              embed: {
                title: "only Admin parmission user use this Command.",
                color: 0xff0000
              }
            });
          let im;
          if(message.attachments.first())im = message.attachments.first().url;
    if(args[0])im = args[0];
          if (!im)
            return message.channel.send({
              embed: {
                title: "❌ | please give me attachment or image url",
                color: 0xff0000
              }
            });
          message.channel.send({
            embed: {
              title: "✅ | successfully set image",
              image: {
                url: im
              },
              color: 0x00ff00
            }
          });
          db.set(`image_${message.guild.id}`, im);
        } else if(command === "disable-welcomer"||command === "off-welcomer"){
if(!message.member.hasPermission("ADMINISTRATOR")) return message.reply({ 
embed:{ 
title: "only Admin parmission user use this Command.", 
color: 0xff0000
}});
let guildid = message.guild.id;

db.delete(`image_${guildid}`).catch();

db.delete(`color_${guildid}`).catch();

db.delete(`msg_${guildid}`).catch();

db.delete(`channel_${guildid}`).catch();

message.channel.send({ embed: { title: "✅ | successfully Welcomer disable", color: 0x00ff00 }});
} else if (command === "setcolor") {
          if (!msg.member.hasPermission("ADMINISTRATOR"))
            return msg.reply({
              embed: {
                title: "only Admin parmission user use this Command.",
                color: 0xff0000
              }
            });
          if (!args[0])
            return message.channel.send({
              embed: {
                title: "❌ | please give me color",
                color: "ff0000"
              }
            });

      if(!args[0].startsWith("#")){
      var color = "#"+args[0];
      } else {
      var color = args[0];
      }
          message.channel.send({
            embed: {
              title: "✅ | successfully set color-" + color,
              color: color
            }
          });
          db.set(`color_${message.guild.id}`, color);
        } else if (command === "setmessage") {
          if (!msg.member.hasPermission("ADMINISTRATOR"))
            return msg.reply({
              embed: {
                title: "only Admin parmission user use this Command.",
                color: 0xff0000
              }
            });
          if (!args[0])
            return message.channel.send({
              embed: {
                title: "❌ | please give me welcome message",
                color: "ff0000"
              }
            });
          
  db.set(`msg_${msg.guild.id}`, args.join(" "));
  msg.channel.send({ embed: {
   title: "`✅` | set welcome message",
   description: args.join(" "),
   color: 0x00ff00
  }});
     }
    }
     if(command === "setprefix"){
if(!message.member.hasPermission("ADMINISTRATOR")) return message.reply({ 
embed:{ 
title: "only Admin parmission user use this Command.", 
color: 0xff0000
}});

      if (args[0].length >= 5)
        return message.channel
          .send({
            embed: {
              color: 0xff2222,
              timestamp: "1337-01-01T02:28:00",
              footer: {
                text: message + ""
              },
              description: "Enter prefix that smaller than 5 symbols",
              title: "Error"
            }
          });
prefiX.setPrefix(args[0], message.guild.id)
message.channel.send({ embed: {
title: `✅ | successfully set prefix to ${args[0]}`,
color: 0x00ff00
 }});
}
     if(op.mod === "true"){
  if( command === "clear") {
        if (!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send({
    embed: {
      "description": "Denied!",
      "color": 0xff2222,
      "title": "Error"
    }
  });
      const amount = parseInt(args[0]);
      if (!amount || amount <= 1 || amount > 101)
        return msg.channel.send({
          embed: {
            title: "Enter number between 2 and 100",
            color: 0xff2222
          }
        });
      msg.channel
        .bulkDelete(amount, true).catch( );
  msg.channel.send({ embed: { title: "✅  `" + args[0] + "` message successfully delete", color: 0x00ff00
    }});
    } else if (command === "ban") {
if (!message.member.hasPermission("BAN_MEMBERS")) return message.channel.send({
    embed: {
      "description": "Denied! your not parmission to ban member",
      "color": 0xff2222,
      "title": "Error"
    }
  });
      let BMember = msg.mentions.users.first();
      let BReason = args.slice(1).join(" ");
      if (!BMember)
        return msg.channel.send({
          embed: { title: "user not found🙄(mention user)", color: 0xff0000 }
        });
      if (BMember.id == msg.author.id)
        return msg.reply("are you serious, ban yourself?");
      if (!BReason)
        return msg.channel.send({
          embed: { title: "please give me Reason😌", color: 0xff0000 }
        });
      msg.guild
        .member(BMember)
        .ban({
          reason: BReason
        })
        .then(() => {
          msg.reply({
            embed: {
              title: `✅Successfully banned ${BMember.tag}`,
              color: 0xff0000,
              description: `ban reason: ${BReason}`
            }
          });
        })
        .catch(err => {
          msg.reply("I was unable to ban the member");
          // Log the error
          console.error(err);
        });
    } else if (command === "kick") {
  if (!message.member.hasPermission("KICK_MEMBERS")) return message.channel.send({
    embed: {
      "description": "Denied! your not parmission to kick member",
      "color": 0xff2222,
      "title": "Error"
    }
  });     
      let KMember = msg.mentions.users.first();
      let KReason = args.slice(1).join(" ");
      if (!KMember)
        return msg.channel.send({
          embed: { title: "user not found🙄", color: 0xff0000 }
        });
      if (KMember.id == msg.author.id)
        return msg.reply("are you serious, kick yourself?");
      if (!KReason)
        return msg.channel.send({
          embed: { title: "please give me Reason😌", color: 0xff0000 }
        });
      msg.guild
        .member(KMember)
        .kick({
          reason: KReason
        })
        .then(() => {
          msg.reply({
            embed: {
              title: `✅Successfully kicked ${KMember.tag}`,
              color: 0xff0000,
              description: `ban reason: ${KReason}`
            }
          });
        })
        .catch(err => {
          msg.reply("I was unable to ban the member");
        });
    } else if(command === "warn"){
let reasons = [
    "I'm sorry, friend, but someone's stray hand today",
    "You asked for it"
  ];

  if (!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send({
    embed: {
      "title": "Sorry, but you don't have permission to use this!",
      "color": 0xff2222
    }
  });
  let warnedmember = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0]);
  if (!warnedmember) return message.channel.send({
    embed: {
      "title": "Please mention a user to warn.`😅`",
      "color": 0xff2222
    }
  });
  
  let reason = args.slice(1).join(' ');
  if (!reason) reason = reasons[Math.floor(Math.random() * reasons.length)];
  
if(warnedmember.id === client.user.id) return message.channel.send({embed:{
  title: message.author.username+'your warn me`😶`',
  color: 0xff0000
}});
  
  if(warnedmember.id === owner) return message.channel.send({embed:{
  title: message.author.username+'your warn my Owner`😶`',
  color: 0xff0000
}});

  const warned = new Discord.MessageEmbed()
    .setColor(0xff0000)
    .setDescription(`You have been warned in ${message.guild.name} by ${message.author.username} for: *${reason}*.`)
    .setTitle("Warn")

  let author = message.author.username;

  message.channel.send({
    embed: {
      "description": `***${warnedmember.user.tag} was warned!***\n**Reason: **${reason}`,
      "title": "Warned by " + message.author.username,
      "color": 0xff0000
    }
  });
  await warnedmember.send(warned);      
    } else if (command === "unban") {
      if (!message.member.hasPermission("BAN_MEMBERS")) return message.channel.send({
    embed: {
      "description": "Denied! your not parmission to ban member",
      "color": 0xff2222,
      "title": "Error"
    }
  });
      let member = client.users.find(e => e.id === args.join(" "));
      if (!args[0])
        return msg.channel.send({
          embed: { title: "user not found🙄", color: 0xff0000 }
        });
      msg.guild.members.unban(member.id).catch(err => {
        msg.reply("I was unable to unban the member");
      });
      msg.channel.send({
        embed: {
          title: `✅Successfuly unbanned ${member.tag}`,
          color: 0x22ff22
        }
      });
    } else if (command === "mute") {
        if (!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send({
    embed: {
      "title": "You don't have permissions, baby",
      "color": 0xff2222
    }
  });
  let tomute = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
  if (!tomute) return message.channel.send({
    embed: {
      "title": "Couldn't find user :anguished: ",
      "color": 0xff2222
    }
  });
  if (tomute.hasPermission("MANAGE_MESSAGES")) return message.channel.send({
    embed: {
      "title": "The user you are trying to mute is either the same, or higher role than you",
      "color": 0xff2222
    }
  });
  let muterole = message.guild.roles.find(e => e.name === "muted");

  if (!muterole) {
    try {
      muterole = await message.guild.roles.create({ data:{
        name: "muted",
        color: "#000100",
        permissions: []
      }})
      message.guild.channels.forEach(async (channel, id) => {
        await channel.createOverwrite(muterole, {
          SEND_MESSAGES: false,
          ADD_REACTIONS: false
        });
      });
    } catch (e) {
      console.log(e.stack);
    }
  }

  await (tomute.roles.add(muterole.id));
  message.channel.send({
    embed: {
      "title": "Muted",
      "description": `<@${tomute.id}> has been muted by <@${message.author.id}>`,
      "color": 0x00ff00
    }
  });
    } else if (command === "unmute") {
      if (!message.member.hasPermission("MANAGE_MESSAGES"))
        return message.channel.send({
          embed: {
            title: "You don't have permissions, baby",
            color: 0xff2222
          }
        });
      let tomute = message.guild.member(msg.mentions.users.first());
      if (!tomute)
        return message.channel.send({
          embed: {
            title: "Couldn't find user :anguished:(tag User)",
            color: 0xff2222
          }
        });
      if (tomute.hasPermission("MANAGE_MESSAGES"))
        return message.channel.send({
          embed: {
            title:
              "The user you are trying to mute is either the same, or higher role than you",
            color: 0xff2222
          }
        });
      let unmute = msg.guild.roles.find(e => e.name === "muted");
      if (!tomute.roles.has(unmute.id))
        return message.channel.send({
          embed: {
            description: `<@${tomute.id}> already unmuted or haven't been muted`,
            color: 0xff2222,
            title: "Error"
          }
        });
      tomute.roles.remove(unmute.id);
      message.channel.send({
        embed: {
          description: `<@${tomute.id}> has been unmuted by <@${message.author.id}>!`,
          color: 0x22ff22,
          title: "Unmuted"
        }
      });
    } 
   }
          /* music Command */
      if (op.music === "true") {
        if (command === "play" || command === "p") {
if (!message.member.voice.channel)
            return message.channel.send({
              embed: { title: "Join voice channel first!", color: 0xff2222 }
            });
          if (!args[0])
            return message.channel.send({
              embed: {
                title: "❌ | please give me <Video name or video url>",
                color: 0xff0000
              }
            });
        
 let aSongIsAlreadyPlaying = client.player.isPlaying(message.guild.id);
          // If there's already a song playing
          if (aSongIsAlreadyPlaying) {
            // Add the song to the queue
            let song = await client.player.addToQueue( message.guild.id, args.join(" "), message.author );
            let data = await Promise.resolve(song.ytdl.getInfo(song.url));
            let songtime = data.length_seconds * 1000;
 message.channel.send(
              new Discord.MessageEmbed()
.setColor("#ccffcc")
.setTitle("Added to queue")            .setThumbnail(song.thumbnail)
.addField("song name:", `**[${song.name}](${song.url})**`, true)
.addField("channel name:", `**${song.author}**`, true)
.addField("video duration:",`**${moment.duration(songtime).format(" H[h] m[m] s[s]")}**`,true)
.setFooter(song.requestedBy.tag, song.requestedBy.displayAvatarURL())
            );
            song.queue.on(
              "songChanged",
              (oldSong, newSong, skipped, repeatMode) => {
                if (repeatMode) {
                  message.channel.send({
                    embed: {
title: `Playing **${newSong.name}** again...`,
thumbnail: { url: song.thumbnail },
 color: 0x00ff00
                    }
                  });
                } else {
                  message.channel.send({
                    embed: {
                      title: `Now playing **${newSong.name}**...`,
thumbnail: { url: song.thumbnail },
        color: 0x00ff00
                    }
                  });
                }
              }
            );
          } else {
            // Else, play the song
            let song = await client.player.play(message.member.voice.channel, args.join(" "), message.author);
            let data = await Promise.resolve(song.ytdl.getInfo(song.url));
   let songtime = data.length_seconds * 1000;
message.channel.send(
              new Discord.MessageEmbed()
.setColor("#ccffcc")
.setTitle("Currently playing")        .setThumbnail(song.thumbnail)
.addField("song name:", `**[${song.name}](${song.url})**`, true)
.addField("channel name:", `**${song.author}**`, true)
.addField("video duration:",`**${moment.duration(songtime).format(" H[h] m[m] s[s]")}**`,true)
.setFooter(song.requestedBy.tag, song.requestedBy.displayAvatarURL())
            );
se.music = song.name;
          }
        } else if (command === "stop") {
          let aSongIsAlreadyPlaying = client.player.isPlaying(message.guild.id);
          if (!aSongIsAlreadyPlaying)
            return message.channel.send({
              embed: { title: "nothing playing!", color: 0x0099ff }
            });
          client.player.stop(message.guild.id);
          message.channel.send({
            embed: { title: "✅ Music stopped!", color: 0x00ff00 }
          });
        } else if (command === "pause") {
          let aSongIsAlreadyPlaying = client.player.isPlaying(message.guild.id);
          if (!aSongIsAlreadyPlaying)
            return message.channel.send({
              embed: { title: "nothing playing!", color: 0x0099ff }
            });
          let song = await client.player.pause(message.guild.id);
          message.channel.send({
            embed: { title: `${song.name} paused!`, color: 0x00ffcc }
          });
        } else if (command === "resume") {
          let aSongIsAlreadyPlaying = client.player.isPlaying(message.guild.id);
          if (!aSongIsAlreadyPlaying)
            return message.channel.send({
              embed: { title: "nothing playing!", color: 0x0099ff }
            });
          let song = await client.player.resume(message.guild.id);
          message.channel.send({
            embed: { title: `${song.name} resumed!`, color: 0x00ff00 }
          });
        } else if (command === "setvolume" || command === "volume") {
          let aSongIsAlreadyPlaying = client.player.isPlaying(message.guild.id);
          if (!aSongIsAlreadyPlaying)
            return message.channel.send({
              embed: { title: "nothing playing!", color: 0x0099ff }
            });
          client.player.setVolume(message.guild.id, parseInt(args[0]));
          message.channel.send({
            embed: { title: `Volume set to ${args[0]} `, color: 0x0099ff }
          });
        } else if (command === "nowplaying" || command === "np") {
          let aSongIsAlreadyPlaying = client.player.isPlaying(message.guild.id);
          if (!aSongIsAlreadyPlaying)
            return message.channel.send({
              embed: { title: "nothing playing!", color: 0x0099ff }
            });
          let song = await client.player.nowPlaying(message.guild.id);
          let data = await Promise.resolve(song.ytdl.getInfo(song.url));
          let songtime = data.length_seconds * 1000;
          let queue = await client.player.getQueue(message.guild.id);
          let now = queue.connection.dispatcher.streamTime;
          message.channel.send({
            embed: {
              title: `Now playing`,
              description: `**[${song.name}](${
                song.url
              })**\nduration-  **${moment
                .duration(now)
                .format(" H[h] m[m] s[s]")} / ${moment
                .duration(songtime)
                .format(" H[h] m[m] s[s]")}**`,
              thumbnail: { url: song.thumbnail },
              color: "RANDOM"
            }
          });
        } else if (command === "loop-on") {
          // Enable repeat mode
          let aSongIsAlreadyPlaying = client.player.isPlaying(message.guild.id);
          if (!aSongIsAlreadyPlaying)
            return message.channel.send({
              embed: { title: "nothing playing!", color: 0x0099ff }
            });
          client.player.setRepeatMode(message.guild.id, true);
          // Get the current song
          let song = await client.player.nowPlaying(message.guild.id);
          message.channel.send({
            embed: {
              title: `${song.name} will be repeated indefinitely!`,
              color: "RANDOM"
            }
          });
        } else if (command === "loop-off") {
          // Disable repeat mode
          let aSongIsAlreadyPlaying = client.player.isPlaying(message.guild.id);
          if (!aSongIsAlreadyPlaying)
            return message.channel.send({
              embed: { title: "nothing playing!", color: 0x0099ff }
            });
          client.player.setRepeatMode(message.guild.id, false);
          // Get the current song
          let song = await client.player.nowPlaying(message.guild.id);
          message.channel.send({
            embed: {
              title: `${song.name}  will no longer be repeated indefinitely!`,
              color: "RANDOM"
            }
          });
        } else if (command === "skip") {
          let aSongIsAlreadyPlaying = client.player.isPlaying(message.guild.id);
          if (!aSongIsAlreadyPlaying)
            return message.channel.send({
              embed: { title: "nothing playing!", color: 0x0099ff }
            });
          let song = await client.player.skip(message.guild.id);
          message.channel.send({
            embed: { title: `${song.name} skipped!`, color: 0xff00ff }
          });
        } else if (command === "queue" || command === "q") {
          let queue = await client.player.getQueue(message.guild.id);
          if (!queue)
            return msg.channel.send({
              embed: { title: "nothing playing!", color: 0x0099ff }
            });
          message.channel.send({
            embed: {
              title: "Server queue:",
              color: 0xffff00,
              description: queue.songs
                .map((song, i) => {
                  return `${i === 0 ? "Current" : `#${i + 1}`} - ${
                    song.name
                  } | ${song.author}`;
                })
                .join("\n")
            }
          });
        } else if (command === "clear-queue") {
          let aSongIsAlreadyPlaying = client.player.isPlaying(message.guild.id);
          if (!aSongIsAlreadyPlaying)
            return message.channel.send({
              embed: { title: "nothing playing!", color: 0x0099ff }
            });
          client.player.clearQueue(message.guild.id);
          message.channel.send({
            embed: { title: "✅ Queue cleared!", color: "RANDOM" }
          });
        }
      }
  });

  

client.on('guildMemberAdd', async member => {
   if(op.welcomer === "true"){

  let image = await welcomeCanvas
  .setUsername(member.user.username)
  .setDiscriminator(member.user.discriminator)
  .setMemberCount(member.guild.memberCount)
  .setGuildName(member.guild.name)
  .setAvatar(member.user.displayAvatarURL({ format: 'png', size: 2048 }))
  .setOpacity("border", 0)
  .setColor("username-box", "#D3D3D3")
  .setColor("discriminator-box", "#D3D3D3")
  .setColor("message-box", "#D3D3D3")
  .setColor("title", db.get(`color_${member.guild.id}`)||"#ccffcc")
  .setColor("avatar", "#00ff00")
  .setBackground(db.get(`image_${member.guild.id}`)||"https://static.tildacdn.com/tild3166-3465-4533-b163-323762393762/-/empty/database1.png")
  .toAttachment();
let attachment = new Discord.MessageAttachment(image.toBuffer(), "welcome.png");

if(db.get(`msg_${member.guild.id}`)){
 var chat = db.get(`msg_${member.guild.id}`).split("{user}").join("<@"+member.user.id+">").split("{servername}").join( member.guild.name).split("{membercount}").join(member.guild.memberCount);
   } else { 
   var chat = `welcome <@${member.user.id}> to **${member.guild.name}**`; 
}
let ch = db.get(`channel_${member.guild.id}`);
if(ch){
let ch1 = member.guild.channels.get(ch);
 ch1.send(chat, attachment);
} else { 

}
} 
});
    
  client.login(token).catch( );
    se.start = true;
},
async command(op) {
   if(!se.start) return console.log("❌ | please start script then use");
    client.on("message", async msg => {
      if (msg.channel.type == "dm") return;
      if (msg.author.bot) {
        return;
      }
      var message = msg;
      prefiX.setPrefix(se.prefix);
      if (prefiX.getPrefix(msg.guild.id) === null) {
        var prefix = prefiX.getPrefix();
      } else {
        var prefix = prefiX.getPrefix(msg.guild.id);
      }
      if (!msg.content.startsWith(prefix)) return;
      const args = msg.content.slice(prefix.length).split(" ");
      const command = args.shift().toLowerCase();

      var guildicon = message.guild.icon
        ? `https://cdn.discordapp.com/icons/${message.guild.id}/${message.guild.icon}.png?size=2048`
        : "https://discordemoji.com/assets/emoji/discordcry.png";

      if (command === op.name) {
        if (op.dm === "true") {
          var ssl = message.author;
        } else {
          var ssl = message.channel;
        }
        if (op.msgreact) {
          let react = client.emojis.find(e => e.name === op.msgreact);
          msg.react(react.id);
        }
        if (op.msgdelete) {
          msg.delete({ timeout: op.msgdelete || 10 });
        }

        if (op.send) {
          ssl
            .send(
              op.send
                .split("{guildid}")
                .join(message.guild.id)
                .split("{guildname}")
                .join(message.guild.name)
                .split("{ping}")
                .join(client.ws.ping)
                .split("{authorid}")
                .join(message.author.id)
                .split("{authoravatar}")
                .join(message.author.displayAvatarURL({ size: 2048 }))
                .split("{authorcreate}")
                .join(
                  moment
                    .utc(message.author.createdAt)
                    .format("dddd, MMMM Do YYYY, HH:mm:ss")
                )
                .split("{args}")
                .join(args.join(" "))
            )
            .then(function (message){
              if (op.botmsgreact) {
                let react = client.emojis.find(e => e.name === op.botmsgreact);
                message.react(react.id);
              }
              if (op.botmsgdelete) {
                message.delete({ timeout: op.botmsgdelete || 10 });
              }
            })
            .catch( );
        }
        if (op.embed) {
          let embed = op.embed;
          let ha = new Discord.MessageEmbed();
          if (embed.title) {
            ha.setTitle(op.embed.title);
          }
          if (embed.image) {
            ha.setImage(
              op.embed.image
                .split("{authoravatar}")
                .join(message.author.displayAvatarURL())
                .split("{guildicon}")
                .join(guildicon)
            );
          }
          if (embed.thumbnail) {
            ha.setThumbnail(
              op.embed.thumbnail
                .split("{authoravatar}")
                .join(message.author.displayAvatarURL())
                .split("{guildicon}")
                .join(guildicon)
            );
          }
          if (embed.color) {
            ha.setColor(op.embed.color);
          }
          if (embed.message) {
            ha.setDescription(
              op.embed.message
                .split("{ping}")
                .join(client.ws.ping)
                .split("{authorid}")
                .join(message.author.id)
                .split("{authoravatar}")
                .join(message.author.displayAvatarURL({ size: 2048 }))
                .split("{guildid}")
                .join(message.guild.id)
                .split("{guildname}")
                .join(message.guild.name)
                .split("{authorcreate}")
                .join(
                  moment
                    .utc(message.author.createdAt)
                    .format("dddd, MMMM Do YYYY, HH:mm:ss")
                )
                .split("{args}")
                .join(args.join(" "))
            );
          }
          if (embed.url) {
            ha.setURL(op.embed.url);
          }
          if (embed.author) {
            ha.setAuthor(
              op.embed.author.name,
              op.embed.author.icon
                .split("{authoravatar}")
                .join(message.author.displayAvatarURL())
                .split("{guildicon}")
                .join(guildicon),
              op.embed.author.url
            );
          }
          if (embed.timestamp) {
            ha.setTimestamp(
              op.embed.timestamp.split("{nowdate}").join(new Date())
            );
          }
          if (embed.footer) {
            ha.setFooter(
              op.embed.footer.text,
              op.embed.footer.icon
                .split("{authoravatar}")
                .join(message.author.displayAvatarURL())
                .split("{guildicon}")
                .join(guildicon)
            );
          }

          ssl
            .send(ha)
            .then(function (message){
              if (op.botmsgreact) {
                let react = client.emojis.find(e => e.name === op.botmsgreact);
                message.react(react.id);
              }
              if (op.botmsgdelete) {
                message.delete({ timeout: op.botmsgdelete || 10 });
              }
            })
            .catch( );
        }
        if (op.reply) {
          ssl
            .send(
              `<@${message.author.id}>, ` +
                op.reply
                  .split("{guildid}")
                  .join(message.guild.id)
                  .split("{guildname}")
                  .join(message.guild.name)
                  .split("{ping}")
                  .join(client.ws.ping)
                  .split("{authorid}")
                  .join(message.author.id)
                  .split("{authoravatar}")
                  .join(message.author.displayAvatarURL({ size: 2048 }))
                  .split("{authorcreate}")
                  .join(
                    moment
                      .utc(message.author.createdAt)
                      .format("dddd, MMMM Do YYYY, HH:mm:ss")
                  )
                  .split("{args}")
                  .join(args.join(" "))
            )
            .then(function (message){
              if (op.botmsgreact) {
                let react = client.emojis.find(e => e.name === op.botmsgreact);
                message.react(react.id);
              }
              if (op.botmsgdelete) {
                message.delete({ timeout: op.botmsgdelete || 10 });
              }
            })
            .catch( );
        }
        if (op.file) {
          let attachment = new Discord.MessageAttachment(
            op.file
              .split("{guildid}")
              .join(message.guild.id)
              .split("{guildname}")
              .join(message.guild.name)
              .split("{ping}")
              .join(client.ws.ping)
              .split("{authorid}")
              .join(message.author.id)
              .split("{authoravatar}")
              .join(message.author.displayAvatarURL({ size: 2048 }))
              .split("{authorcreate}")
              .join(
                moment
                  .utc(message.author.createdAt)
                  .format("dddd, MMMM Do YYYY, HH:mm:ss")
              )
              .split("{args}")
              .join(args.join(" "))
          );
          ssl
            .send(attachment)
            .then(function (message){
              if (op.botmsgreact) {
                let react = client.emojis.find(e => e.name === op.botmsgreact);
                message.react(react.id);
              }
              if (op.botmsgdelete) {
                message.delete({ timeout: op.botmsgdelete || 10 });
              }
            })
            .catch( );
        }
      }
    });
  },

  async guildadd(o) {
    client.on("guildCreate", async guild => {
      let icon = guild.icon
        ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png?size=2048`
        : "https://discordemoji.com/assets/emoji/discordcry.png";
      var op = client.channels.find(e => e.name === o.channelname).id;
      if (!o.channelname) op = o.channelid;
      let channel = client.channels.get(op);
      channel.send({
        embed: {
          title: o.title,
          thumbnail: { url: o.thumbnail.replace("{guildicon}", icon) },
          description: o.message
            .replace("{guildname}", guild.name)
            .replace("{guildid}", guild.id)
            .replace("{guildmember}", guild.memberCount)
            .replace("{guildownerid}", guild.owner.user.id)
            .replace("{guildownertag}", guild.owner.user.tag),
          color: o.color
        }
      });
    });
  },

  async guildremove(o) {
    client.on("guildDelete", async guild => {
      let icon = guild.icon
        ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png?size=2048`
        : "https://discordemoji.com/assets/emoji/discordcry.png";
      var op = client.channels.find(e => e.name === o.channelname).id;
      if (!o.channelname) op = o.channelid;
      let channel = client.channels.get(op);
      channel.send({
        embed: {
          title: o.title,
          thumbnail: { url: o.thumbnail.replace("{guildicon}", icon) },
          description: o.message
            .replace("{guildname}", guild.name)
            .replace("{guildid}", guild.id)
            .replace("{guildmember}", guild.memberCount)
            .replace("{guildownerid}", guild.owner.user.id)
            .replace("{guildownertag}", guild.owner.user.tag),
          color: o.color
        }
      });
    });
  },
  get: db.get,
  
  set: db.set,
  
  async msgdelete(o) {
   client.on("messageDelete", async msg => {
      let message = msg;

      if (message.channel.type !== "dm") {
        var content = "";
        if (message.content) {
          content = message.content;
        } else {
          content = "<<NO CONTENT>>";
        }

        const embed = new Discord.MessageEmbed()
          .setColor(o.color)
          .setTitle("Message Deleted")
          .addField(
            `User`,
            `<@${message.author.id}> (${message.author.tag})`,
            true
          )
          .addField(`Content`, `${content}`, true)
          .addField(
            `Channel`,
            `<#${message.channel.id}> (${message.channel.name})`,
            true
          );
if (client.channels.find(e => e.id === o.channelid)) {
client.channels.find(e => e.id === o.channelid)
            .send(embed)
            .catch(err => {
              console.log(err);
            });
        } else {
          console.log(
            `Unable to send message to modLogChannel (${o.channelid})`
          );
        }
      }
    });
  },

  async msgupdate(o) {
    client.on("messageUpdate", function(oldMessage, newMessage) {
      if (
        newMessage.channel.type == "text" &&
        newMessage.cleanContent != oldMessage.cleanContent
      ) {
        var log = client.channels.find(e => e.id === o.channelid);
        log.send({
          embed: {
            color: o.color,
            title: "MESSAGE UPDATE",
            fields: [
              {
                name: "Message send by",
                value: `${newMessage.author}`
              },
              {
                name: "Old message",
                value: `~~${oldMessage.cleanContent}~~`
              },
              {
                name: "New message",
                value: `**${newMessage.cleanContent}**`
              },
              {
                name: "Message link",
                value: `**[click me](${newMessage.url})**`
              }
            ],
            timestamp: new Date(),
            footer: {
              text: "logs",
              icon_url: newMessage.author.displayAvatarURL()
            }
          }
        });
      }
    });
  },
  
  async ractionMsg(op){
let msg = op.message;
let react = op.react;
let message = op.msg; 

try{
var rmsg = await message.channel.send(msg);
await rmsg.react(react).catch();
await rmsg.react(op.react1).catch();
await rmsg.react(op.react2).catch();
await rmsg.react(op.react3).catch();
await rmsg.react(op.react4).catch();
} catch(err) {
  
}
     const filter = (reaction, user) => user.id !== client.user.id;
    const collector = rmsg.createReactionCollector(filter, {
      time: op.time
    });

    collector.on("collect", (reaction, user) => {
      switch (reaction.emoji.name) {
       case `${react}`: 
   if(op.edit === "true"){
      rmsg.edit(op.newMessage);
      } 
   if(op.edit === "false"){   message.channel.send(op.newMessage);
   }      
   if(op.deleteReact === "true"){   reaction.users.remove(user).catch();
         }
          break; 

      case op.react1: 
   if(op.edit1 === "true"){
      rmsg.edit(op.newMessage1).catch();
      } 
   if(op.edit1 === "false"){   message.channel.send(op.newMessage1).catch();
   }      
   if(op.deleteReact === "true"){   reaction.users.remove(user).catch();
         }
          break; 

      case op.react2: 
   if(op.edit2 === "true"){
      rmsg.edit(op.newMessage2).catch();
      } 
   if(op.edit2 === "false"){   message.channel.send(op.newMessage2).catch();
   }      
   if(op.deleteReact === "true"){   reaction.users.remove(user).catch();
         }
          break; 
 
      case op.react3: 
   if(op.edit3 === "true"){
      rmsg.edit(op.newMessage3).catch();
      } 
   if(op.edit3 === "false"){   message.channel.send(op.newMessage3).catch();
   }      
   if(op.deleteReact === "true"){   reaction.users.remove(user).catch();
         }
          break;         
          
      case op.react4: 
   if(op.edit4 === "true"){
      rmsg.edit(op.newMessage4).catch();
      } 
   if(op.edit4 === "false"){   message.channel.send(op.newMessage4).catch();
   }      
   if(op.deleteReact === "true"){   reaction.users.remove(user).catch();
         }
          break;           
      }
    });
   collector.on("end", () => {     rmsg.reactions.removeAll().catch();
  }); 
  },
  async reactRoleSetup(op){
    if(!op) return console.log("❌ | please enter file name[only support json type]");
     const manager = new ReactionRoleManager(client, {
    storage: op
       });
client.reactionRoleManager = manager;
},
  async reactionRoleCreate(op){
  if(!se.rr) return console.log("❌ | please setup reactRole then create");
let message = op.msg;
let role = op.roleName;
let messageid = op.messageId;
let react = op.react;
 client.reactionRoleManager.create({
      messageID: messageid,
      channel: message.channel,
      reaction: react,
      role: message.guild.roles.get(message.guild.roles.find(e => e.name === role).id)
   
}).then(r =>{ console.log("[uplife-api]✔️ | reactrole create") }).catch( (e) => {console.log("[uplife-api] ❌ | reactrole not create error-"+e) });
   
  },

  async reactionRoleDelete(op){
  if(!se.rr) return console.log("❌ | please setup reactRole then delete");

let messageid = op.messageId;
let react = op.react;
 client.reactionRoleManager.delete({
          messageID: messageid,
          reaction: react
        }).then(r =>{ console.log("[uplife-api]✔️ | reactrole delete") }).catch( (e) => {console.log("[uplife-api] ❌ | reactrole not delete error-"+e) });;
  },
  async commandHeader(op){
       if(!se.start) return console.log("❌ | please start main file then use commandHeader");
client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();


fs.readdir(`${op.name}/`, (err, files) => {

  if(err) console.log(err);
  let jsfile = files.filter(f => f.split(".").pop() === "js");
  if(jsfile.length <= 0){
    console.log("Couldn't find commands.");
    return;
  }
  jsfile.forEach((f, i) =>{
    let props = require(`${op.name}/${f}`);
    console.log(`🎉 file-${f} loaded!`);
    client.commands.set(props.command.name, props);
    props.command.aliases.forEach(alias => { 
      client.aliases.set(alias, props.command.name);
  
  })
});
})
  client.on("message", async message => {
    if(message.author.bot) return;
    if(message.channel.type === "dm") return;
          var msg = message;
      prefiX.setPrefix(se.prefix);
      if (prefiX.getPrefix(msg.guild.id) === null) {
        var prefix = prefiX.getPrefix();
      } else {
        var prefix = prefiX.getPrefix(msg.guild.id);
      }
    let messageArray = message.cleanContent;
    let args = message.content.slice(prefix.length).trim().split(/ +/g);
    let cmd = args.shift().toLowerCase();
    let commandfile;

    if (client.commands.has(cmd)) {
      commandfile = client.commands.get(cmd);
  } else 
    if (client.aliases.has(cmd)) {
    commandfile = client.commands.get(client.aliases.get(cmd));
  }
  
      if (!message.content.startsWith(prefix)) return;

let option = {
  bot: client,
  msg: message,
  discord: Discord,
  message: args,
  guild: message.guild,
  guilds: client.guilds,
  author: message.author,
  emojis: message.guild.emojis,
  mentionUser: message.mentions.users.first(),
  mentionChannel: message.mentions.channels.first(),
  mentionRole: message.mentions.roles.first(),
  roles: message.guild.roles,
  channel: message.channel,
  channels: message.guild.channels,
  checkNsfwCannel : message.channel.nsfw,
  owner: se.owner,
  prefix: se.prefix,
  ping: client.ws.ping,
  allMembersCount: message.guild.memberCount,
  BotTyping: message.channel.startTyping(),
  BotStopTyping: message.channel.stopTyping(),
  attachment: message.attachments.first(),
  fullMessage: messageArray,
  emoteCount: message.guild.emojis.size,
  channelCount: message.guild.channels.size,
  roleCount: message.guild.roles.size,
  serverCount: client.guilds.size,
  commandsCount: client.commands.map(e => e.command.name).length,
  messageLength: messageArray.length,
  checkAdmin: message.member.hasPermission("ADMINISTRATOR"),
  randomUser: message.guild.members.filter(m => m.id !== message.author.id).random().user,
  randomUserID: message.guild.members.filter(m => m.id !== message.author.id).random().user.id,
  uptime: moment.duration(client.uptime).format("d[d] h[h] m[m] s[s]"),
  serverRegion: message.guild.region,
  serverName: message.guild.name,
  serverAfkChannel: message.guild.afkChannel,
  serverVerificationLevel : message.guild.verificationLevel,
  serverId: message.guild.id,
  serverIcon: message.guild.icon
        ? `https://cdn.discordapp.com/icons/${message.guild.id}/${message.guild.icon}.png?size=4096`
        : "https://discordemoji.com/assets/emoji/discordcry.png",
  getBotInvite: `https://discordapp.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=8`,
  commandList: client.commands.map(e => "`"+e.command.name+"`").join(",")
};
          
  try {
    commandfile.run(option);
  
  } catch (e) {
    
  }
  });
  },  
  async checkAfk(op){
    let bot = client;
    bot.on('message', async message => {
  if (message.content.includes(message.mentions.users.first())) { 
    let mentioned = bot.afk.get(message.mentions.users.first().id); 
    if (mentioned) message.channel.send(op.message.replace("{usertag}", mentioned.usertag).replace("{reason}", mentioned.reason)); 
  } 
   if(op.autoDeleteAfk === "true"){   
    let afkcheck = bot.afk.get(message.author.id); 
    if (afkcheck) return [bot.afk.delete(message.author.id), message.reply(`you have been removed from the afk list!`).then(msg => msg.delete({ timeout: 5000 }))];
   }
  });
  },
  
  async removeAfk(op){
  let author = op.authorId;
  if(client.afk.get(author)){
  client.afk.delete(author); 
  } else {
    console.log(`❌ | ${client.users.get(author).tag} not afk`);
  }
  },
  async setStatus(op){
    if(!se.start) return console.log("❎ | please start then use setStatus");
  let guild;
  if(op.musicStatus = "true"){
   guild = se.music||"❌ | nothing playing..";
 }
   
client.on('ready', () => {
if(op.statusTime){
      setInterval(() => {
        var d = Date();
        let a = d.toString();
        let l = op.gameName.replace("{guilds}", client.guilds.size).replace("{users}", client.users.size).replace("{realTime}", a).replace("{prefix}", se.prefix).replace("{music}", guild);
  // let la = Math.floor(Math.random() * (l.length - 1) + 1); // generates a random number between 1 and the length of the activities array list (in this case 5).
     
        /* client.user.setActivity(la, { type: `${name}` }); */
        client.user.setPresence({
          activity: {
            name: `${l}`,
            type: `${op.type}`
          },
          status: `${op.stats}`
        });
      }, op.statusTime); 
    } else {
   setInterval(() => {
         var d = Date();
        let a = d.toString();
let l = op.gameName.replace("{guilds}", client.guilds.size).replace("{users}", client.users.size).replace("{realTime}", a).replace("{prefix}", se.prefix).replace("{music}", guild);
// let la = Math.floor(Math.random() * (l.length - 1) + 1); // generates a random number between 1 and the length of the activities array list (in this case 5).
     
        /* client.user.setActivity(la, { type: `${name}` }); */
        client.user.setPresence({
          activity: {
            name: `${l}`,
            type: `${op.type}`
          },
          status: `${op.stats}`
        });
      }, 120000); 
}
});
},
async deleteTicket(op){
   let message = se.message;
   let channel = message.channel;
   let author = message.author;
if(op.ticketChecker === "true"){
  if(!channel.name.replace("ticket-","") === author.id) return channel.send("❌ | your not create this ticket");
}
 if(!message.channel.name.startsWith("ticket-")) return channel.send("❌ | this channel not a ticket channel");
  channel.send("`✔️` | delete ticket 5s");
setTimeout(() => {
  if(message.channel.name.startsWith("ticket-")) return message.channel.delete(op.deleteReason);
}, 5000);
},
 async createTicket(msg, msg1, embed){
   let message = se.message;

   
   if(embed.checkChannel === "true"){
        if (message.guild.channels.find(e => e.name === "ticket-" + message.author.id)) return message.channel.send(`❌ | You already have a ticket open.`);
    }  
  message.guild.channels.create(embed.categoryName,{ type: "category" }).then(ch => {
  message.guild.channels.create(`ticket-${message.author.id}`,{ type: "text" }).then(c => {
        
            let role2 = message.guild.roles.find(e => e.name === "@everyone");

            c.createOverwrite(role2, {
                SEND_MESSAGES: false,
                READ_MESSAGES: false,
                VIEW_CHANNEL: false
            });
            c.createOverwrite(message.author, {
                SEND_MESSAGES: true,
                READ_MESSAGES: true,
                VIEW_CHANNEL: true
            });
     let cmsg = msg.replace("{usertag}", message.author.tag).replace("{channelname}", c.name).replace("{username}", message.author.username).replace("{userid}", message.author.id).replace("{reason}", embed.reason).replace("{gguildname}", message.guild.name);
      
      message.channel.send(`${cmsg}`);
  
   let cmsg1 = msg1.replace("{usertag}", message.author.tag).replace("{channelname}", c.name).replace("{username}", message.author.username).replace("{userid}", message.author.id).replace("{reason}", embed.reason).replace("{gguildname}", message.guild.name); 
      
      if(embed.embedMessage = "true"){
           let em = new Discord.MessageEmbed()
                .setColor(embed.color)
             .setDescription(cmsg1)
                .setTimestamp();
            c.send(em);
      } else { 
        c.send(cmsg1); 
      }
        }).catch(console.error); // Send errors to console
       }).catch(console.error);
},

nsfw(op){
const superagent = require('superagent'),
snekfetch = require("snekfetch");
let message = se.message;
if(!message.channel.nsfw === false) return;
superagent.get('https://nekobot.xyz/api/image')
    .query({ type: op.type })
    .end((err, response) => {
if(op.embed === "false"){
   message.channel.send({
	files: [ response.body.message ] });
} else {
if(!op.type === "pgif"){
 message.channel.send({embed:{
color: embed.color||"#ffffff",
title: embed.title||" ",
image: { url: response.body.message },
discription: embed.Message||" "
}});
} else {
  let fg = new Discord.MessageAttachment(response.body.message, "pgif.gif");
 let em = new Discord.MessageEmbed()
  .setTitle(embed.title||" ")
  .setColor(embed.color||"#ffffff")
  .setDiscription(embed.message|| " ")
  .attachFiles(fg)
  .setImage('attachment://pgif.gif');
 message.channel.send(em);
}

}
    });

},
 dashboardOn(op){
client.on("ready", async () => {
 //Startup
client.appInfo = await client.fetchApplication();
  setInterval(async () => {
    client.appInfo = await client.fetchApplication();
  }, op.time);
  require(op.fileName)(client); 
  console.log("✔️ | success dashboard on");
});
},
  async setAfk(op){
    let message = op.msg;
    let bot = client; 
    let args = op.message;
   let reason = args ? args : 'I am currently afk, I will reply as soon possible.'; 
    let afklist = bot.afk.get(message.author.id); 
    if (!afklist) { 
     let construct = { 
       id: message.author.id,
       usertag: message.author.tag, 
       reason: reason
     }; bot.afk.set(message.author.id, construct);
if(op.successReply === "true"){
message.reply(`you have been set to afk for reason: ${reason}`).then(msg => msg.delete({ timeout: 5000 }));
} } 
  }
}
