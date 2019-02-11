const axios = require('axios');
const fontList = require('../assets/google-fonts.json');

module.exports = app => {
	app.get('/api/google-fonts', (req, res) => {
		const apiUrl = [];
		apiUrl.push('https://www.googleapis.com/webfonts/v1/webfonts');
		apiUrl.push('?key=AIzaSyBAeBGJ5r_JdheXlg46qkgsiFemJ7zfuek');
		const url = apiUrl.join('');

		axios.get(url, {
			method: 'HEAD',
			mode: 'no-cors'
		}).then(fontsList => {
			console.log(fontsList)
			res.send(fontsList);
		}).catch((err) => {
			res.send(err);
		});	
	});
}