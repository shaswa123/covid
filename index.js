const unirest = require('unirest');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
var req = unirest('GET', 'https://covid-19-coronavirus-statistics.p.rapidapi.com/v1/stats');

const app = express();
app.set('json spaces', 4);
app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));

req.headers({
	'x-rapidapi-host': 'covid-19-coronavirus-statistics.p.rapidapi.com',
	'x-rapidapi-key': '36e8c53a52msh6701d242bca08ebp194f19jsn3e1d3cb29218'
});
let arr = new Array();
let deaths, confirmed, recovered, countries;
app.get('/', (a, b, c) => {
	deaths = 0;
	confirmed = 0;
	recovered = 0;
	countries = 0;

	req.end(function(res) {
		if (res.error) throw new Error(res.error);
		const results = res.body['data']['covid19Stats'];
		// results.forEach((element) => {
		// 	if (element['country'] === 'India') {
		// 		arr.push(element);
		// 	}
		// 	if (element['country'] == 'China') {
		// 		arr.push(element);
		// 	}
		// });
		let myMap = new Map();
		results.forEach((element) => {
			let flag = false;
			if (element['confirmed'] != 0) {
				confirmed += element['confirmed'];
				flag = true;
			}
			if (element['deaths'] != 0) {
				deaths += element['deaths'];
				flag = true;
			}
			if (element['recovered'] != 0) {
				recovered += element['recovered'];
				flag = true;
			}
			if (flag) {
				let country = element['country'];
				// countries++;
				if (myMap.get(element['country']) == undefined) {
					myMap.set(element['country'], 1);
				}
				arr.push(element);
			}
			countries = myMap.size;
		});
		let count = 0;
		setInterval(() => {
			for (let i = 0; i < 3; i++) {
				count++;
				if (count == 10) {
					clearInterval();
				}
			}
		}, 3000);
		b.render('index', { conf: confirmed, death: deaths, recv: recovered, countries: countries });
	});
});

app.post('/', (a, b, c) => {
	const rel = a.body.country;
	let ans = {
		conf: 0,
		dead: 0,
		rec: 0
	};
	arr.forEach((element) => {
		if (element['country'] == rel) {
			ans.conf += element['confirmed'];
			ans.dead += element['deaths'];
			ans.rec += element['recovered'];
		}
	});
	let count = 0;
	setInterval(() => {
		for (let i = 0; i < 3; i++) {
			count++;
			if (count == 10) {
				clearInterval();
			}
		}
	}, 3000);

	b.render('country.ejs', {
		conf: confirmed,
		death: deaths,
		recv: recovered,
		countries: countries,
		name: rel,
		res: ans
	});
});

app.listen(5000);
