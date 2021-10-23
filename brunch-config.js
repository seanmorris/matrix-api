exports.files = {
	javascripts: {joinTo:{
		'vendor.js': /^(?!source)/,
		'matrix.js': /^source/
	}}
};

exports.plugins = {
	babel: {
		presets: [[ "minify" , { builtIns: false } ]]
	},
	raw: {
		pattern: /\.(html|jss)$/,
		wrapper: content => `module.exports = ${JSON.stringify(content)}`
	}
};

exports.paths = {
	public: 'dist', watched: ['source','build']
};

exports.modules = {
	nameCleaner: path => path.replace(/^source(?:-docs)?\//, 'matrix-api/')
}
