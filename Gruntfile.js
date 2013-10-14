var path = require('path');
module.exports = function (grunt) {
// load all grunt tasks
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
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

    oocss: {
      src: './app/'
    },

    // Used to connect to a locally running web server (so Jasmine can test against a DOM)
    /*{src: ['path*//*'], dest: 'dest/', filter: 'isFile'}, // includes files in path
     {src: ['path*//**'], dest: 'dest/'}, // includes files in path and its subdirs
     {expand: true, cwd: 'path/', src: ['**'], dest: 'dest/'}, // makes all src relative to cwd
     {expand: true, flatten: true, src: ['path*//**'], dest: 'dest/', filter: 'isFile'} // flattens results to a single level*/

    connect: {
      server: {
        options: {
          hostname: '*',
          port: 8000,
          base: './src/'
        }
      }
    },


    copy: {
      release: {
        files: {
          'release': ['src/*']
        }
      }
    },

    'useminPrepare': {
      html: 'src/index.html'
    },

    'usemin': {
      html: 'release/index.html'
    },
    concat: {
      options: {
        banner: ';(function($) {',
        footer: '})(jQuery);',
        separator: '\n'
      }/*,
      dist: {
        src: [
          'src/script/treedrag.DragDrop.js',
          'src/script/treedrag.PropertiesSetter.js',
          'src/script/treedrag.Toggler.js',
          'src/script/treedrag.Treedrag.js'
        ],
        dest: 'dist/jquery.treedrag.js'
      }*/
    },

    // Run: `grunt watch` from command line for this section to take effect
    watch: {
      files: ['./src/**/*'],
      tasks: ''
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

  //grunt.registerTask('clean', ['compass:clean']);
  //grunt.registerTask('build', ['compass:dev']);

  //grunt.registerTask('clean', ['compass:clean']);
  grunt.registerTask('release', ['useminPrepare','copy','concat','usemin']);
};
