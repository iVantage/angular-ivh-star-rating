/*jshint node:true */

module.exports = function(grunt) {
  'use strict';

  // Project configuration
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      gruntfile: ['gruntfile.js'],
      src: 'src/**/*.js'
    },

    clean: {
      all: 'dist'
    },
    
    concat: {
      options: {
        separator: '\n'
      },
      all: {
        files: {
          'dist/angular-ivh-star-rating.js': [
            'src/scripts/module.js',
            'src/scripts/**/*.js'
          ]
        }
      }
    },

    uglify: {
      'dist/angular-ivh-star-rating.min.js': 'dist/angular-ivh-star-rating.js'
    },

    bump: {
      options: {
        commitMessage: 'chore: Bump for release (v%VERSION%)',
        files: ['package.json', 'bower.json'],
        commitFiles: ['-a'],
        push: false
      }
    }
  });

  // Load plugins
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  // Register task(s)
  grunt.registerTask('default', [
    'jshint',
    //'test',
    'build'
  ]);

  grunt.registerTask('build', [
    'clean',
    'concat',
    'uglify'
  ]);

};
