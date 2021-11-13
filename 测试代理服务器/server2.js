const { v4: uuid } = require('uuid');

const express = require('express')
const app = express()

app.use((request,response,next)=>{
	console.log('有人请求服务器2(球员名字)了');
	next()
})

app.get('/playerName', (request,response)=>{
	const playerNames = [
		{id:uuid(), name:'LeBron James', src: 'https://cdn.nba.com/headshots/nba/latest/1040x760/2544.png'},
		{id:uuid(), name:'Kevin Durant', src: 'https://cdn.nba.com/headshots/nba/latest/1040x760/201142.png'},
		{id:uuid(), name:'Carmelo Anthony', src: 'https://cdn.nba.com/headshots/nba/latest/260x190/2546.png'},
		{id:uuid(), name:'Russel Westbrook', src: 'https://cdn.nba.com/headshots/nba/latest/1040x760/201566.png'},
		{id:uuid(), name:'James Harden', src: 'https://cdn.nba.com/headshots/nba/latest/1040x760/201935.png'},
		{id:uuid(), name:'Paul George', src: 'https://cdn.nba.com/headshots/nba/latest/1040x760/202331.png'},
		{id:uuid(), name:'Giannis Antetokounmpo', src: 'https://cdn.nba.com/headshots/nba/latest/260x190/203507.png'},
		{id:uuid(), name:'Stephen Curry', src: 'https://cdn.nba.com/headshots/nba/latest/260x190/201939.png'},
		{id:uuid(), name:'Damian Lillard', src: 'https://cdn.nba.com/headshots/nba/latest/260x190/203081.png'},
		{id:uuid(), name:'Bradley Beal', src: 'https://cdn.nba.com/headshots/nba/latest/260x190/203078.png'}
	]
	response.send(playerNames)
})

app.listen(5001,(err)=>{
	if(!err) console.log('服务器2(球员名字)启动成功了,请求球员名字信息地址为：http://localhost:5001/playerName');
})
