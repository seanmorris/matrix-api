exports.files = {
	javascripts: {joinTo:{
		'vendor.js': /^(?!source)/,
		'matrix.js': /^source/
	}}
};

exports.paths = {
	public: 'dist', watched: ['source','build']
};

exports.modules = {
	nameCleaner: path => path.replace(/^source(?:-docs)?\//, 'matrix-api/')
}
