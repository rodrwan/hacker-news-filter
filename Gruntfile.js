var dotenv, fs;

dotenv = require('dotenv');
fs = require('fs');

module.exports = function (grunt) {
  'use strict';
  if (fs.existsSync('.env')) {
    dotenv.load();
  }

  // Project configuration.
  grunt.initConfig({

    // Read the package.json (optional)
    pkg: grunt.file.readJSON('package.json'),

    // Metadata.
    meta: {
      basePath: '',
      srcPathCss: 'src/scss/',
      srcPathJs: 'src/app/',
      deployPath: 'public/build/assets/',
      copyHtml: 'public/build/html/',
      buildApp: 'public/build/app/'
    },

    banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
            '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
            '* Copyright (c) <%= grunt.template.today("yyyy") %> ',

    // Task configuration.
    concat: {
      options: {
        banner: '<%= meta.banner %>'
      },
      dist: {
        src: [
          '<%= meta.srcPathJs %>app.mdl.js',
          '<%= meta.srcPathJs %>init.js',
          '<%= meta.srcPathJs %>app.ctl.js',
          '<%= meta.srcPathJs %>routes/**/*.mdl.js',
          '<%= meta.srcPathJs %>routes/**/*.ctl.js',
          '<%= meta.srcPathJs %>routes/**/*.drv.js',
          '<%= meta.srcPathJs %>directives/**/*.mdl.js',
          '<%= meta.srcPathJs %>directives/**/*.drv.js',
          '<%= meta.srcPathJs %>components/**/*.mdl.js',
          '<%= meta.srcPathJs %>components/**/*.drv.js',
          '<%= meta.srcPathJs %>services/**/*.mdl.js',
          '<%= meta.srcPathJs %>services/**/*.srv.js'
        ],
        dest: '<%= meta.buildApp %><%= pkg.name %>.js'
      }
    },

    ngAnnotate: {
      options: {
        singleQuotes: true
      },
      dist: {
        files: [{
          expand: true,
          cwd: '<%= meta.buildApp %>',
          src: '*.js',
          dest: '<%= meta.buildApp %>'
        }]
      }
    },

    ngconstant: {
      build: {
        options: {
          dest: 'src/app/init.js',
          name: 'HackerNews.config',
          wrap: '(function () {\n\'use strict\'\n\n {%= __ngModule %} })();'
        },
        constants: {
          SCRAPER_API_URL: 'http://hacker-news-filter.herokuapp.com/api'
        }
      },
      test: {
        options: {
          dest: 'src/app/init.js',
          name: 'HackerNews.config',
          wrap: '(function () {\n\'use strict\'\n\n {%= __ngModule %} })();'
        },
        constants: {
          SCRAPER_API_URL: 'http://localhost:' + process.env.PORT + '/api'
        }
      }
    },

    sass: {
      dist: {
        options: {
          bundleExec: true
        },
        files: [{
          expand: true,
          flatten: true,
          src: [
            '<%= meta.srcPathCss %>style.scss',
            '<%= meta.srcPathCss %>reset.scss'
          ],
          dest: '.tmp/',
          ext: '.css'
        }]
      }
    },

    cssmin: {
      build: {
        files: [{
          expand: true,
          cwd: '.tmp/',
          src: [
            '*.css'
          ],
          dest: '<%= meta.deployPath %>css/',
          ext: '.min.css'
        }]
      }
    },

    uglify: {
      build: {
        files: {
          '<%= meta.buildApp %><%= pkg.name %>.min.js': [
            '<%= meta.buildApp %><%= pkg.name %>.js'
          ]
        }
      }
    },

    copy: {
      dist: {
        files: [
          {
            dest: '<%= meta.buildApp %>',
            src: [
              '**/routes/**/*.html',
              '**/directives/**/*.html',
              '**/components/**/*.html'
            ],
            cwd: '<%= meta.srcPathJs %>',
            expand: true
          },
          {
            dest: 'public/build/assets/images/',
            src: [
              '**/*.{jpg,png,gif}'
            ],
            cwd: 'src/images',
            expand: true
          }, {
            dest: 'public/',
            src: [
              'index.html',
              'manifest.json'
            ],
            cwd: 'src/',
            flatten: true,
            expand: true
          }
        ]
      }
    },

    wiredep: {
      task: {

        // Point to the files that should be updated when
        // you run `grunt wiredep`
        src: [
          'public/index.html'   // .html support...
        ],

        options: {
          // See wiredep's configuration documentation for the options
          // you may pass:

          // https://github.com/taptapship/wiredep#configuration
        }
      }
    },

    clean: {
      dist: {
        files: [{
          src: [
            '.tmp'
          ]
        }]
      }
    },

    watch: {
      scripts: {
        files: [
          '<%= meta.srcPathCss %>**/*.scss',
          '<%= meta.srcPathJs %>**/*.scss',
          '<%= meta.srcPathJs %>**/*.js',
          'src/index.html'
        ],
        tasks: [
          'sass',
          'cssmin',
          'ngconstant:test',
          'concat',
          'ngAnnotate',
          'uglify',
          'copy',
          'wiredep',
          'clean'
        ],
        options: {
          livereload: {
            port: 8001
          }
        }
      }
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-ng-annotate');
  grunt.loadNpmTasks('grunt-wiredep');
  grunt.loadNpmTasks('grunt-ng-constant');
  grunt.loadNpmTasks('grunt-contrib-clean');

  grunt.registerTask('build', [
    'sass',
    'cssmin',
    'ngconstant:build',
    'concat',
    'ngAnnotate',
    'uglify',
    'copy',
    'clean',
    'wiredep'
  ]);

  grunt.registerTask('dev', [
    'sass',
    'cssmin',
    'ngconstant:test',
    'concat',
    'ngAnnotate',
    'uglify',
    'copy',
    'wiredep',
    'clean',
    'watch'
  ]);

  grunt.registerTask('default', 'dev');
  grunt.registerTask('heroku:production', 'build');
};
