const { v4: uuid } = require('uuid');

const express = require('express')
const app = express()

app.use((request,response,next)=>{
	console.log('有人请求服务器1(球员姓名)了');
	console.log('请求来自于',request.get('Host'));
	console.log('请求的地址',request.url);
	next()
})

app.get('/playerStatistic',(request,response)=>{
	const playerName = request.url.split('?')[1].split('=')[1].split('+').join(' ');
	const playerStatistics = [
		{id:uuid(), name:'LeBron James', pts: 24.8, reb: 5.5, ast: 7.0, stl: 2.3, blk: 0.8, tov: 4.2, src: 'https://cdn.nba.com/headshots/nba/latest/1040x760/2544.png', teamSrc: 'https://cdn.nba.com/logos/nba/1610612747/primary/D/logo.svg', team: 'LosAngles Lakers'},
		{id:uuid(), name:'Kevin Durant', pts: 29.5, reb: 8.5, ast: 5.0, stl: 0.6, blk: 0.7, tov: 3.5, src: 'https://cdn.nba.com/headshots/nba/latest/1040x760/201142.png', teamSrc: 'https://cdn.nba.com/logos/nba/1610612751/primary/D/logo.svg', team: 'Brooklyn Nets'},
		{id:uuid(), name:'Carmelo Anthony', pts: 17.2, reb: 3.8, ast: 1.0, stl: 0.8, blk: 0.9, tov: 0.8, src: 'https://cdn.nba.com/headshots/nba/latest/260x190/2546.png', teamSrc: 'https://cdn.nba.com/logos/nba/1610612747/primary/D/logo.svg', team: 'LosAngles Lakers'},
		{id:uuid(), name:'Russel Westbrook', pts: 19.3, reb: 9.1, ast: 8.9, stl: 1.4, blk: 0.3, tov: 5.3, src: 'https://cdn.nba.com/headshots/nba/latest/1040x760/201566.png', teamSrc: 'https://cdn.nba.com/logos/nba/1610612747/primary/D/logo.svg', team: 'LosAngles Lakers'},
		{id:uuid(), name:'James Harden', pts: 19.5, reb: 7.6, ast: 9.3, stl: 1.2, blk: 0.8, tov: 4.9, src: 'https://cdn.nba.com/headshots/nba/latest/1040x760/201935.png', teamSrc: 'https://cdn.nba.com/logos/nba/1610612751/primary/D/logo.svg', team: 'Brooklyn Nets'},
		{id:uuid(), name:'Paul George', pts: 19.5, reb: 7.6, ast: 9.3, stl: 1.2, blk: 0.8, tov: 4.9, src: 'https://cdn.nba.com/headshots/nba/latest/1040x760/202331.png', teamSrc: 'https://cdn.nba.com/logos/nba/1610612746/primary/D/logo.svg', team: 'LosAngles Clippers'},
		{id:uuid(), name:'Giannis Antetokounmpo', pts: 19.5, reb: 7.6, ast: 9.3, stl: 1.2, blk: 0.8, tov: 4.9, src: 'https://cdn.nba.com/headshots/nba/latest/260x190/203507.png', teamSrc: 'https://cdn.nba.com/logos/nba/1610612749/primary/D/logo.svg', team: 'Milwaukee Bucks'},
		{id:uuid(), name:'Stephen Curry', pts: 19.5, reb: 7.6, ast: 9.3, stl: 1.2, blk: 0.8, tov: 4.9, src: 'https://cdn.nba.com/headshots/nba/latest/260x190/201939.png', teamSrc: 'https://cdn.nba.com/logos/nba/1610612744/primary/D/logo.svg', team: 'Golden State Worriors'},
		{id:uuid(), name:'Damian Lillard', pts: 19.5, reb: 7.6, ast: 9.3, stl: 1.2, blk: 0.8, tov: 4.9, src: 'https://cdn.nba.com/headshots/nba/latest/260x190/203081.png', teamSrc: 'https://cdn.nba.com/logos/nba/1610612757/primary/L/logo.svg', team: 'Portland Trail Blazers'},
		{id:uuid(), name:'Bradley Beal', pts: 19.5, reb: 7.6, ast: 9.3, stl: 1.2, blk: 0.8, tov: 4.9, src: 'https://cdn.nba.com/headshots/nba/latest/260x190/203078.png', teamSrc: 'https://cdn.nba.com/logos/nba/1610612764/primary/D/logo.svg', team: 'Washington Wizards	'},
	]
	const filteredStatistic = filterKeyName(playerName, playerStatistics);
	response.send(filteredStatistic)
})

app.listen(5000,(err)=>{
	if(!err) console.log('服务器1(球员姓名)启动成功了,请求球员姓名信息地址为：http://localhost:5000/playerStatistic');
})

// 过滤关键字
filterKeyName = (filterWord, dataObj) => {
	return dataObj.filter(obj => obj.name === filterWord);
}