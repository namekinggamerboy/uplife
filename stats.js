const Status = (client, ops, time) => {
  
  if (isNaN(time) || time < 12000) return console.error(`API limitation reached: status can't change in lesser than 12 seconds.`)
  
  let y = 0,
      arr = Object.entries(ops)
  
  setInterval(async () => {
    if (y >= arr.length) y = 0
    
    let code = arr[y][1].description.replace("{userCount}", client.users.size).replace("{guildCount}", client.guilds.size).replace("{channelCount}", client.channels.size).replace("{emojiCount}", client.emojis.size);
    
    if (code) { 
      client.user.setActivity(code, { type: arr[y][1].type }) 
    } 
    y++
  }, time) 
}

module.exports = Status;
