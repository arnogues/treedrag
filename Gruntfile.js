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

   Gem Dependencies:
   -----------------
   gem install image_optim
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

    copy: {
      /* main: {
       files: [
       {
       expand: true,
       cwd: 'app/',
       dest: 'build/',
       src: [
       'assets*//**',
       'mocks*//**'
       ]
       }
       ]
       },*/
      /* 'handlebars-templates': {
       options: {
       processContent: function (content, srcpath) {
       console.log(content, srcpath);
       return "toto" + content + "toto"
       }
       },
       files: [
       {
       expand: true,
       cwd: 'src/main/',
       dest: 'dev/',
       src: [
       'template*//**'
       ]
       }
       ]
       },*/

      /* images: {
       files: [
       {
       expand: true,
       cwd: 'src/main/',
       dest: 'src/main/webapp/images',
       src: [
       'images*//**'
       ]
       }
       ]
       }*/
    },

    connect: {
      server: {
        options: {
          hostname: '*',
          port: 8000,
          base: './src/'
        }
      }
    },

    open: {
      dev: {
        url: 'http://localhost:<%= connect.server.options.port %>',
        app: 'Google Chrome'
      }
    },

    compass: {  // Task
      /*dist: {  // Target
       options: { // Target options
       sassDir: "src/main/css",
       cssDir: 'dist/css',
       imagesDir: 'src/main/img',
       generatedImagesDir: 'dist/img',
       environment: 'production'
       }
       },*/
      clean: {  // Target
        options: { // Target options
          sassDir: "src/main/resources/sass",
          cssDir: 'src/main/resources/css',
          environment: 'development',
          clean: true
        }
      },
      dev: { // Another target
        options: {
          sassDir: "src/main/sass",
          cssDir: 'src/main/webapp/css',
          imagesDir: 'src/main/images',
          generatedImagesDir: 'src/main/webapp/img',
          environment: 'development'
        }
      }
    },

    // Run: `grunt watch` from command line for this section to take effect
    watch: {
      files: ['./src/**/*'],
      tasks: ''
    }

  });

  // Default Task
  //grunt.registerTask('default', ['clean', 'connect', 'build', /* 'open:dev', */'watch']);
  grunt.registerTask('default', ['connect', 'watch']);

  //grunt.registerTask('clean', ['compass:clean']);
  grunt.registerTask('build', ['compass:dev']);
};
