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
	const playerStatistics = [
		{id:uuid(), name:'LeBron James', pts: 24.8, reb: 5.5, ast: 7.0, stl: 2.3, blk: 0.8, tov: 4.2},
		{id:uuid(), name:'Kevin Durant', pts: 29.5, reb: 8.5, ast: 5.0, stl: 0.6, blk: 0.7, tov: 3.5},
		{id:uuid(), name:'Carmelo Anthony', pts: 17.2, reb: 3.8, ast: 1.0, stl: 0.8, blk: 0.9, tov: 0.8},
		{id:uuid(), name:'Russel Westbrook', pts: 19.3, reb: 9.1, ast: 8.9, stl: 1.4, blk: 0.3, tov: 5.3}
	]
	response.send(playerStatistics)
})

app.listen(5000,(err)=>{
	if(!err) console.log('服务器1(球员姓名)启动成功了,请求球员姓名信息地址为：http://localhost:5000/playerStatistic');
})
