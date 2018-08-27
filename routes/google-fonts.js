const fontList = require('../assets/google-fonts.json');

module.exports = app => {
	app.get('/api/google-fonts', (req, res) => {
		res.send('Hello');
	});
}