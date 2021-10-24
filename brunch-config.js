exports.files = {
	javascripts: {joinTo:{
		'vendor.js': /^(?!source)/,
		'matrix-api.js': /^source/
	}}
};

exports.paths = {
	public: 'dist', watched: ['source','build']
};

exports.modules = {
	nameCleaner: path => path.replace(/^source\//, 'matrix-api/')
}
