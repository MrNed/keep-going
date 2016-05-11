module.exports = function(grunt) {
  require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    watch: {
      scripts: {
        files: [
          'js/main.js',
          'js/classes/*.js',
          'js/states/*.js',
          'js/classes/enemies/*.js'
        ],
        tasks: [
          'concat',
          'uglify'
        ],
        options: {
          spawn: false,
          livereload: true,
        },
      },
    },
    uglify: {
      build: {
        files : {
          'js/scripts.min.js' : 'js/scripts.js'
        }
      }
    },
    concat: {
      dist: {
        src: [
          'js/classes/*.js',
          'js/classes/enemies/*.js',
          'js/states/*.js',
          'js/main.js'
        ],
        dest: 'js/scripts.js',
      },
    },
  });

  grunt.registerTask('default', ['watch']);
};