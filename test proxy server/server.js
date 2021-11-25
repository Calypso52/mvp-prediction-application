const {BigQuery} = require('@google-cloud/bigquery');
const bodyParser = require('body-parser')
const bigquery = new BigQuery();
const express = require('express')

/*************** 5000 port server ***************/
const app5000 = express()

app5000.use((request,response,next)=>{
	console.log('有人请求服务器1(球员姓名)了');
	// console.log('请求来自于',request.get('Host'));
	// console.log('请求的地址',request.url);
	next()
})

app5000.get('/playerStatistic', async (request,response)=>{
	const playerName = request.url.split('?')[1].split('=')[1].split('+').join(' ');

	// 数据库彻底配好后就可以删掉这一块了
	/*
	const SamplePlayerStatistics = [
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
	response.send(SamplePlayerStatistics);
	*/
	
	const playerStatistics = await query(playerName, 5000);
	// 取小数点后1位
	StatisticFix(playerStatistics);
	response.send(playerStatistics);
})

app5000.listen(5000,(err)=>{
	if(!err) console.log('服务器1(球员姓名)启动成功了,请求球员卡信息地址为：http://localhost:5000/playerStatistic');
})

/*************** 5001 port server ***************/
const app5001 = express()
app5001.use(bodyParser.json());

app5001.use((request,response,next)=>{
	console.log('有人请求服务器2(球员名字)了');
	next()
})

app5001.post('/playerName', async (request,response)=>{
	const nameKey = request.body.name;

	// const playerNames = [
	// 	{id:uuid(), name:'LeBron James', src: 'https://cdn.nba.com/headshots/nba/latest/1040x760/2544.png'},
	// 	{id:uuid(), name:'Kevin Durant', src: 'https://cdn.nba.com/headshots/nba/latest/1040x760/201142.png'},
	// 	{id:uuid(), name:'Carmelo Anthony', src: 'https://cdn.nba.com/headshots/nba/latest/260x190/2546.png'},
	// 	{id:uuid(), name:'Russell Westbrook', src: 'https://cdn.nba.com/headshots/nba/latest/1040x760/201566.png'},
	// 	{id:uuid(), name:'James Harden', src: 'https://cdn.nba.com/headshots/nba/latest/1040x760/201935.png'},
	// 	{id:uuid(), name:'Paul George', src: 'https://cdn.nba.com/headshots/nba/latest/1040x760/202331.png'},
	// 	{id:uuid(), name:'Giannis Antetokounmpo', src: 'https://cdn.nba.com/headshots/nba/latest/260x190/203507.png'},
	// 	{id:uuid(), name:'Stephen Curry', src: 'https://cdn.nba.com/headshots/nba/latest/260x190/201939.png'},
	// 	{id:uuid(), name:'Damian Lillard', src: 'https://cdn.nba.com/headshots/nba/latest/260x190/203081.png'},
	// 	{id:uuid(), name:'Bradley Beal', src: 'https://cdn.nba.com/headshots/nba/latest/260x190/203078.png'}
	// ]
	const playerNames = await query(nameKey, 5001);

	response.send(playerNames)
})

app5001.listen(5001,(err)=>{
	if(!err) console.log('服务器2(球员名字)启动成功了,请求补全球员名字地址为：http://localhost:5001/playerName');
})

/*************** functions ***************/
// 搜索球员信息
async function query(playerName, port) {
	let query;
	switch(port) {
		case 5000:
			// query player information from name
			query = `SELECT * FROM \`database-bigquery.6893project.player_information\` WHERE name = \'${playerName}\' LIMIT 100`;
			break;
		case 5001:
			// query player information from key of name
			query = `SELECT id, name, src FROM \`database-bigquery.6893project.player_information\` WHERE lower(name) LIKE lower(\'%${playerName}%\') LIMIT 10`;
			break;
	}

    const options = {
      query: query,
      // Location must match that of the dataset(s) referenced in the query.
      location: 'us-east1',
    };
  
    // Run the query as a job
    const [job] = await bigquery.createQueryJob(options);
  
    // Wait for the query to finish
    const [rows] = await job.getQueryResults();

	let arr = [];
	rows.forEach(row => {
        arr.push(row);
    });
	return arr;
}

// 修改小数点位数
function StatisticFix(arr) {
	let obj = arr[0];
	for(let key in obj) {
		if(typeof(obj[key]) === 'number') obj[key] = obj[key].toFixed(1);
	}
}