const {BigQuery} = require('@google-cloud/bigquery');
const bodyParser = require('body-parser')
const bigquery = new BigQuery();
const express = require('express')
const cookieParser = require('cookie-parser');
const app = express()

/*************** 5000 port server ***************/
app.use((request,response,next)=>{
	console.log('有人请求服务器1(球员姓名)了');
	// console.log('请求来自于',request.get('Host'));
	// console.log('请求的地址',request.url);
	next()
})

app.get('/playerStatistic', async (request,response)=>{
	let playerName = decodeURI(request.url).split('?')[1].split('=')[1].split('+').join(' ');

	const playerStatistics = await query(playerName, 5000);
	// 取小数点后1位
	StatisticFix(playerStatistics);
	response.send(playerStatistics[0]);
})

app.listen(5000,(err)=>{
	if(!err) console.log('服务器1(球员姓名)启动成功了,请求球员卡信息地址为：http://localhost:5000/playerStatistic');
})

/*************** 5001 port server ***************/
app.use(bodyParser.json());

app.use((request,response,next)=>{
	console.log('有人请求服务器2(球员名字)了');
	next()
})

app.post('/playerName', async (request,response)=>{
	const nameKey = request.body.name;

	const playerNames = await query(nameKey, 5001);

	response.send(playerNames)
})

app.listen(5001,(err)=>{
	if(!err) console.log('服务器2(球员名字)启动成功了,请求补全球员名字地址为：http://localhost:5001/playerName');
})

/*************** 5002 port server ***************/
app.use(bodyParser.json());

app.use((request,response,next)=>{
	console.log('有人请求 predictionStatistic 了');
	next()
})

app.post('/predictionStatistic', async (request,response)=>{
	const predictionStatistic = request.body;
	// await addToTable(predictionStatistic, '6893project', 'playerdata_to_algorithm');

	// const playerNames = await query(nameKey, 5001);
	const playerNames = '123';

	response.send(playerNames)
})

app.listen(5002,(err)=>{
	if(!err) console.log('/predictionStatistic 接口启动了，地址为：http://localhost:5002/predictionStatistic');
})

/*************** 5003 port server ***************/
// 解析前端发送的请求的参数
app.use(bodyParser.json());
// 使用 cookieParser 中间件
app.use(cookieParser());
app.use((request,response,next)=>{
	console.log('有人请求 loginVerification 了');
	next()
})
app.post('/loginVerification', async (request,response)=>{
	// cookie中存最近的登陆人账号密码，当同一个人在一段时间内连续登陆时，不用上数据库查找
	const { accountNumber, passWord } = request.body;
	// 1表示账号错误，2表示密码错误，3表示成功

	/*************** 缓存数据存cookie中 ***************/
	if(request.cookies.account && request.cookies.password) {  // 首先得有，说明以前设置过
		// console.log(request.cookies);
		if(request.cookies.account === accountNumber && request.cookies.password === passWord) {  // 都命中
			response.send('3'); // 直接传，不用上数据库搜索了
		} else if(request.cookies.account === accountNumber && request.cookies.password !== passWord) { // 账号对了，密码不对
			response.send('2'); // 也直接传，不用上数据库搜索
		}
	}
	// cookie中没有记住的账号密码，或者存了但是没有匹配的账号时，上数据库查询，并在成功查到时更新cookie
	const SQLpassword = await query(accountNumber, 5003);
	if(!SQLpassword.length) response.send('1');
	else if(SQLpassword[0].password !== passWord) {
		response.send('2');
	} else {
		response.cookie('account', accountNumber, {maxAge: 60 * 1000});
		response.cookie('password', passWord, {maxAge: 60 * 1000});
		response.send('3');
	}
	/*************** 缓存数据存cookie中 ***************/

	// const SQLpassword = await query(accountNumber, 5003);
	// if(!SQLpassword.length) response.send('1');
	// else {
	// 	response.send(SQLpassword[0].password === passWord ? '3' : '2');
	// }
})

app.listen(5003,(err)=>{
	if(!err) console.log('/loginVerification 接口启动了，地址为：http://localhost:5003/loginVerification');
})

/*************** functions ***************/
// 搜索球员信息
async function query(keyword, port) {
	let query;
	switch(port) {
		case 5000:
			// 处理名字中带有'影响SQL搜索
			keyword = handleColon(keyword);
			// query player information from name
			query = `SELECT * FROM \`database-bigquery.6893project.player_information\` WHERE name = \'${keyword}\' LIMIT 100`;
			break;
		case 5001:
			// 处理名字中带有'影响SQL搜索
			keyword = handleColon(keyword);
			// query player information from key of name
			query = `SELECT id, name, src FROM \`database-bigquery.6893project.player_information\` WHERE lower(name) LIKE lower(\'%${keyword}%\') LIMIT 10`;
			break;
		case 5003:
			query = `SELECT password FROM \`database-bigquery.6893project.account_information\` WHERE account = \'${keyword}\'`;
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

// 给bigquery表格（其中字段new_request=1的数据会被算法获取）
async function addToTable(predictionStatistic, bigqueryDataset, bigqueryTable) {
	predictionStatistic.new_request = 1;
	// const row = [];
	// row.push(predictionStatistic);
	let row = JSON.stringify(predictionStatistic);
	console.log(row);
	await bigquery
		.dataset(bigqueryDataset)
		.table(bigqueryTable)
		.insert(row)
		.catch((error) => {
			console.log(error.errors)
		});
}

// 修改小数点位数
function StatisticFix(arr) {
	let obj = arr[0];
	for(let key in obj) {
		if(typeof(obj[key]) === 'number') obj[key] = parseFloat(obj[key].toFixed(1));
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