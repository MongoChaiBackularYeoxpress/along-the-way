module.exports = function(grunt){
	require('matchdep').filterdev('grunt-*').foreach(grunt.loadnpmtasks)

	grunt.initConfig({
		clean: {
			dev: {
				src: ['build/']
			}
		},
		copy: {
			dev: {
				expand: true,
				cwd: 'app/',
				src: ['*.html', '*.css'],
				dest: 'build/',
				filter: 'isFile'
			}
		},
		browserify: {
			dev: {
				options: {
					transform: ['debowerify', 'hbsfy'],
					debug: true
				},
				src: ['app/js/**/*.js'],
				dest: 'build/bundle.js'
			}
		}
	});

	grunt.registerTask('build:dev', ['clean:dev', 'browserify:dev', 'copy:dev']);
}