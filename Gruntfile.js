module.exports = function(grunt){
	require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

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
			},
			test: {
				options: {
					transform: ['debowerify', 'hbsfy'],
					debug: true
				},
				src: ['test/mocha/backbone/**/*.js'],
				dest: 'test/testbundle.js'
			}
		},

		mocha: {
			backbonetest: {
				src: ['test/test.html'],
				options: {
					run: true
				}
			}
		},

		connect: {
			dev: {
				options: {
					port: 3000,
					base: 'build',
					open: true,
					keepalive: true
				}
			}
		}

	});

	grunt.registerTask('build:dev', ['clean:dev', 'browserify:dev', 'copy:dev']);
	grunt.registerTask('backbone:test', ['browserify:test', 'mocha:backbonetest']);
	grunt.registerTask('serve', ['build:dev', 'connect:dev']);
};
