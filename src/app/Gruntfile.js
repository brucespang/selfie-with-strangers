module.exports = function (grunt) {
		grunt.initConfig({
				'pkg': grunt.file.readJSON('package.json'),
				'link-checker': {
						all: {
								site: '127.0.0.1',
								options: {
										initialPort: 3000
								}
						}
				},
				'jshint': {
						options: {
								jshintrc: true
						},
						files: {
								src: ['*.js']
						}
				},
		});

		grunt.loadNpmTasks('grunt-contrib-jshint');
		grunt.loadNpmTasks('grunt-link-checker');

		grunt.registerTask('default', ['test']);
		grunt.registerTask('test', ['jshint', 'link-checker']);
};
