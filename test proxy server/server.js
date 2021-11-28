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
	let playerName = decodeURI(request.url).split('?')[1].split('=')[1].split('+').join(' ');

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
			// 处理名字中带有'影响SQL搜索
			playerName = handleColon(playerName);
			// query player information from name
			query = `SELECT * FROM \`database-bigquery.6893project.player_information\` WHERE name = \'${playerName}\' LIMIT 100`;
			break;
		case 5001:
			// 处理名字中带有'影响SQL搜索
			playerName = handleColon(playerName);
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

// 处理名字中带有冒号'影响SQL查询的问题
function handleColon(name) {
	let i = 0;
	while(name.charAt(i)) {
		if(name.charAt(i) === '\'') {
			name = name.slice(0, i) + '\\' + name.slice(i);
			i++;
		}
		i++;
	}
	return name;
}