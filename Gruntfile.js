var path = require('path');
module.exports = function (grunt) {
// load all grunt tasks
	require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  //var ssInclude = require("connect-include");
	/*
	 Grunt installation:
	 -------------------
	 npm install -g grunt-cli
	 npm install -g grunt-init
	 npm init (creates a `package.json` file)

	 Project Dependencies:
	 ---------------------
	 npm install grunt --save-dev
	 npm install grunt-contrib-watch --save-dev
	 npm install grunt-contrib-jshint --save-dev
	 npm install grunt-contrib-uglify --save-dev
	 npm install grunt-contrib-requirejs --save-dev
	 npm install grunt-contrib-sass --save-dev
	 npm install grunt-contrib-imagemin --save-dev
	 npm install grunt-contrib-htmlmin --s)ave-dev
	 npm install grunt-contrib-connect --save-dev
	 npm install grunt-contrib-jasmine --save-dev
	 npm install grunt-template-jasmine-requirejs --save-dev
	 npm install grunt-template-jasmine-istanbul --save-dev

	 Simple Dependency Install:
	 --------------------------
	 npm install (from the same root directory as the `package.json` file)
	 */

	// Project configuration.
	grunt.initConfig({
		// Store your Package file so you can reference its specific data whenever necessary
		pkg: grunt.file.readJSON('package.json'),

		connect: {
			server: {
				options: {
					hostname: '*',
					port: 8000,
					base: 'app',
          directory:'app'
				}

			}
		},

		clean: {
			dist: ["dist/"]
		},

		copy: {
			release: {
				files: [
					{
						expand: true, cwd: "app/", dest: './dist/',
						src: ['*.html', 'css/**']
					}
				]
			}

		},

		'useminPrepare': {
			html: 'app/index.html',
      options: {
        dest: 'dist'
      }
		},

    usemin: {
      options: {
        assetsDirs: ['dist']
      },
      html: ['dest/{,*/}*.html'],
      css: ['css/{,*/}*.css']
    },


		// Run: `grunt watch` from command line for this section to take effect
		watch: {
			files: ['./app/**/*'],
			tasks: ''
		},

    uglify:{
      options:{
        compress:{},
        beautify:true,
        preserveComments:'all'
      }
    }
		/*  open: {
		 dev: {
		 url: 'http://localhost:<%= connect.server.options.port %>',
		 app: 'Google Chrome'
		 }
		 },*/
	});


	// Default Task
	//grunt.registerTask('default', ['clean', 'connect', 'build', /* 'open:dev', */'watch']);
	grunt.registerTask('default', ['connect', 'watch']);

	grunt.registerTask('build', ['clean:dist', 'useminPrepare', 'concat', 'uglify', 'copy','usemin']);
};
