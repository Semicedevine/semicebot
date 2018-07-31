const Discord = require('discord.js');
const bot = new Discord.Client();

const fetch = require('node-fetch');

const fs = require('fs');

const { Client } = require('pg');

const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: true,
  });

client.connect()
  .then(() => {
      console.log("THE FOLLOWING IS THE DATABASE_URL, PAY ATTENTION");
      console.log(process.env.DATABASE_URL.toString());
  });

  /*const createTableText = `
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TEMP TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  data JSONB
);
`*/

  
  async function asyncCall() {
    console.log('calling');
    /*const createTableText = `
    CREATE EXTENSION IF NOT EXISTS "pgcrypto";

    CREATE TEMP TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    data JSONB
    );
    `*/
    const createTableText = `CREATE TABLE joinMessages (
        message text,
        contributer text, -- low temperature
        contributerId text
       );
       `
    // create our temp table
    // await client.query(createTableText)

    const newUser = { email: 'brian.m.carlson@gmail.com' }
    // create a new user
    await client.query(`INSERT INTO joinMessages VALUES ('What is life', 'Semicedevine', '2815823125');`);

    console.log(await client.query(`SELECT * FROM joinMessages`));


    // const { rows } = await client.query('SELECT * FROM users')
    
    // expected output: "resolved"
  }
  
asyncCall();

/*client.query(createTableText, (err, res) => {
    console.log("it workd???") // Hello World!
  })*/

/*client.query('SELECT table_schema,table_name FROM information_schema.tables;', (err, res) => {
    if (err) throw err;
    for (let row of res.rows) {
      console.log(JSON.stringify(row));
    }
    client.end();
  });*/



function getInput(msg, number) {
    msg = msg.split(' ');
    msg.splice(0, number);
    msg = msg.join(' ');

    return msg;
}

function getSingleInput(msg, number) {
    msg = msg.split(' ');
    msg = msg[number];

    return msg;
}


const newUsers = [];

bot.on("guildMemberAdd", (member) => {
    const guild = member.guild;
    if (!newUsers[guild.id]) {
        newUsers[guild.id] = new Discord.Collection();
    }
    newUsers[guild.id].set(member.id, member.user);
    const userlist = newUsers[guild.id].map(u => u.toString()).join(" ");
    var text = fs.readFileSync('./joinmessages.txt').toString('utf-8');
    var textByLine = text.split('\n');
    console.log(textByLine[3]);
    var r = Math.floor(Math.random() * textByLine.length);
    var l = textByLine[3];
    var f = l.replace(/\[s\]/g, userlist);
    guild.channels.find("name", "dumping-ground").send(f);
    newUsers[guild.id].clear();
  });
  





bot.on('message', (message) => {
    var c = message.content;



    if(c == '!agree with me') {
        var r = Math.floor(Math.random() * 11);
        if(r==0) {
            var s = "^lol no";
        } else if(r==1) {
            var s = "^FINALLY, someone else here gets it";
        } else if(r==2) {
            var s = "^omggg TOTALLY MAN";
        } else if(r==3) {
            var s = "^you got it m7!";
        } else if(r==4) {
            var s = "^IKR";
        } else if(r==5) {
            var s = "^yeahhh you right";
        } else if(r==6) {
            var s = "yes master";
        } else {
            var s = "^agreed";
        }
        message.channel.send(s);
    } else if(c == "!commands") {
            //message.channel.send("SEMICEBOT V0.4 IS WORKING AS INTENDED:\n\n*!agree with me* - agreed\n\n*!commands* - commandception?\n\n*!dm [@someone] [enter message here]* - I dm someone for you (for whatever reason)\n\n*!dm anonymously [@someone] [enter message here]* - hehe\n\n*!help* - useful explanation\n\n*!notice me* - misc\n\n*!ping* - has to do with computers\n\n*!puke* - misc\n\n*!semice* - ???\n\n*!why* - if you ever have any questions about my presence");
            //message.channel.send("```ini\nSEMICEBOT V0.5 IS WORKING AS INTENDED:\n\n[!agree with me] - agreed\n\n[!commands] - commandception?\n\n[!dm (@someone) (enter message here)] - I dm someone for you (for whatever reason)\n\n[!dm anonymously (@someone) (enter message here)] - hehe\n\n[!help] - useful explanation\n\n[!notice me] - misc\n\n[!ping] - has to do with computers\n\n[!puke] - misc\n\n[!semice] - ???\n\n[!why] - if you ever have any questions about my presence```");
            message.channel.send(fs.readFileSync('./commands.txt').toString('utf-8'));
    } else if(c.startsWith('!dm anonymously')) {
        if(message.guild) {
            if(message.mentions.members.size > 0) {
                var v = getInput(c, 3);
                var m = message.mentions.users.first();
                var g = message.guild.toString();
    
                if(v.length > 0) {
                    m.send('hey, someone in ' + g + ' wanted me to tell you "' + v +'"');
                    message.channel.send("ok, sneaky");
                } else {
                    message.channel.send("bruh, give me something to actually send <_<");
                }
            } else {
                message.channel.send("???");
            }
        } else {
        message.channel.send("yee gotta do this in a server, m7... nice try tho xd")
        }
    } else if(c.startsWith('!dm')) {
        var o = message.author.toString();
        var v = getInput(c, 2);
        if(message.guild) {
            if(message.mentions.members.size) {
                var m = message.mentions.members.first();
                if(v.length > 0) {
                    m.send('hey, ' + o + ' wanted me to tell you "' + v +'"');
                    message.channel.send("ok");
                } else {
                    message.channel.send("bruh, give me something to actually send <_<");
                }
            } else {
            bot.fetchUser(getSingleInput(c, 1))
                .then((User) => {
                    User.send('hey, ' + o + ' wanted me to tell you "' + v +'"');
                    message.channel.send("ok");
                })
                .catch((err) => {
                    message.channel.send("???");
                })
            }
        } else {
            bot.fetchUser(getSingleInput(c, 1))
                .then((User) => {
                    User.send('hey, ' + o + ' wanted me to tell you "' + v +'"');
                    message.channel.send("ok");
                })
                .catch((err) => {
                    message.channel.send("yee gotta do this in a server, m7");
                })
        }
    } else if(c.startsWith('!get id')) {
        var v = getInput(c, 2);
        if(message.guild) {
            if(message.mentions.members.size) {
                var m = message.mentions.members.first();
                message.channel.send(m.id.toString());
            } else {
                message.channel.send("i can't get the id of someone who isn't even in this server… there’s literally no way for me to tell who you’re talking about <_<");
            }
        } else {
        message.channel.send('do it in a channel pls omgsjskdk does anyone ever listen');
        }
    }  else if(c == '!help') {
        message.channel.send("*We don't use the !**h**elp command, b**e**cause he**lp** is for the weak. True members of the greater com**m**unist society use !commands inst**e**ad.*");
    } else if(c.startsWith('!join me to')) {
        message.channel.send("no yee lazy bum do it yourself wtf?");
    } else if(c == '!notice me') {
        var r = Math.floor(Math.random() * 6);
        if(r==0) {
            var s = " NO";
        } else if(r==1) {
            var s = " **no**";
        } else if(r==2) {
            var s = " *no*";
        } else {
            var s = " no";
        }
        message.channel.send(message.author.toString() + s);
    } else if(c.startsWith('!op.gg')) {
        var l = "http://na.op.gg/summoner/userName="
        var v = getInput(c, 1);
        fetch(l + v)
            .then(res => res.text())
            .then((body) => {
                var m = ('meta name="description" content="')
                var p = body.search(m);
                var n = body.substring(p + m.length);
                var t = n.search('"');
                var metaRaw = n.substring(0, t);
                var meta = metaRaw.split("/");
                if(!meta[1].replace(/\s/g, '').length) {
                    meta[1] = "Unranked";
                }
                console.log(meta[1]);
                message.channel.send(meta[1]);
            })
    } else if(c == '!penta') {
        var r = Math.floor(Math.random() * 1);

        var s = [
            "did you know? 100% of all females and males have ass holes"
        ];

        message.channel.send(s[r]);
    } else if(c == '!ping') {
        message.channel.send("pong");
    } else if(c == '!play world peace') {
        message.channel.send("https://www.youtube.com/watch?v=U06jlgpMtQs");
        //PLAY THE COMMUNIST ANTHEM OUT LOUD LELLLLLL
    } else if(c == '!puke') {
        message.channel.send("eww no... wth");
    } else if (c.startsWith('!research')) {
        /*var v = getInput(c, 1);
        var api = "https://jsonplaceholder.typicode.com/posts";
        var apifailz = "https://www.google.com/search?q=" + v;
        snekfetch.get(api).then(r => {
            var body = r.body;
            var id = Number(v);
            if(!id) {
                return message.channel.send("bruh send an id");
            }

            var entry = body.find(post => post.id === id);
            if(!entry) {
                return message.channel.send("pick a number from 1 to 100 ffs how hard can it be T_T");
            } else {
                var embed = new Discord.RichEmbed()
                    .setAuthor(entry.title)
                    .setDescription(entry.body)
                    .addField("Author ID", entry.userId)
                    .setFooter("Post ID:" + entry.id);
                message.channel.send({embed: embed});
            }
        });*/
    } else if (c == '!secrets') {
        message.channel.send(fs.readFileSync('./secrets.txt').toString('utf-8'));
    } else if (c == '!semice') {
        var r = Math.floor(Math.random() * 9);

        var s = [
            "dw, i just got back from the war",
            "I'LL hAVE YOU KNOWWWWW M7777777, i'vE BEEN IN mULTIPLE VIETNAM WARRRRRS",
            "sometimes I wonder to myself when I sleep in my bed at night, why is there so much gay in this world?",
            "they call me, the snipemaster... *proceeds to miss ult*",
            "Really, what makes you say that?",
            "p-pro-pr-problem?",
            "mann why u gotta be so EZ??",
            "trust me, it's what the international streamers told me",
            "it works everytime, don't even worry about it",
        ];

        message.channel.send(s[r]);
    } else if(c == '!why') {
        var r = Math.floor(Math.random() * 4);
        if(r==0) {
            message.channel.send("https://www.youtube.com/watch?v=U06jlgpMtQs");
        } else {
            message.channel.send("**because semice our lord and communist savior said so**");
        }
    } else if (c.startsWith('!dctr')) {
        if(message.author.id=="206849393259839498") {
            if(c.startsWith('!dctr2')) {
                var s1 = getSingleInput(c, 1); //guide
                var s2 = getSingleInput(c, 2); //channel
                var v = getInput(c, 3);
                bot.guilds.get(s1).channels.get(s2).send(v);
            } else {
                bot.fetchUser(getSingleInput(c, 1))
                .then((User) => {
                    var v = getInput(c, 2);
                    if(v.length > 0) {
                        User.send(v);
                    } else {
                        message.channel.send("ERROR, MSG NOT SENT");
                    }
                })
                .catch((err) => {
                    message.channel.send("ERROR, MSG NOT SENT");
                })
            }
        } else {
            message.channel.send("hey what gives, only master semice can use this command ???");
        }
    } else if (c == "00000000") {
        message.channel.send("http://www.dailymail.co.uk/news/article-2515598/Launch-code-US-nuclear-weapons-easy-00000000.html");
    }
    else if (c.startsWith('!add')) {
        if(message.guild) {
            if(message.guild.id=="469270948504403988") {
                if(message.channel.id=="471053415716356106") {
                    var v = getInput(c, 1);
                    if(v.includes("[s]")) {
                        fs.writeFile("joinmessages.txt", fs.readFileSync('./joinmessages.txt').toString('utf-8') + "\n" + v, function(err) {
                            if(err) {
                                return console.log(err);
                            }
                        
                            message.channel.send("cool, ok");
                        }); 
                    } else {
                        message.channel.send("you realise I'm supposed at least mention the person's name, right?");
                    }
                } else {
                    message.channel.send("wrong channel, smart one");
                }
            } else {
                    message.channel.send("wrong guide, smart one");
            }
        } else {
            message.channel.send("*facepalms*");
        }
    }


    if(!message.guild) {
        if(c!="" && !message.author.bot) {
            bot.guilds.get("469270948504403988").channels.get("469588624166354984").send(message.author.username + ': ' + c);
        }
    } else {
        if(c.includes("semi" && !message.author.bot)) {
            var r = Math.floor(Math.random() * 4);
            if(r==0) {
                message.channel.send("**I heard that**").then(msg => {
                    msg.delete(5000)
                  })
                  .catch("idk");
            }
        }
    }


});


/*bot.on('messageUpdated', (oldMessage, newMessage) => {
    var r = Math.floor(Math.random() * 0);
    if(r==5) {
        newMessage.channel.send("**I'm watching you**");
    }
    var interval = setInterval (function () {
        // use the message's channel (TextChannel) to send a new message
        message.channel.send("123")
        .catch(console.error); // add error handling here
    }, 1 * 1000);
})*/




bot.login(process.env.BOT_TOKEN);