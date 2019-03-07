var modRewrite = require('connect-modrewrite');

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function (grunt) {

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Automatically load required Grunt tasks
  require('jit-grunt')(grunt, {
    cachebreaker: 'grunt-cache-breaker'
  });

  var serveStatic = require('serve-static');

  // Configurable paths for the application
  var appConfig = {
    app: 'public',
    dist: 'dist',
    scss: 'scss'
  };

  // Define the configuration for all the tasks
  grunt.initConfig({

    // Configurable paths for the application
    project: appConfig,

    sass: {
      dist: {
        options: {
          style: 'nested'
        },
        files: [{
        expand: true,
        cwd: 'scss',
        src: ['*.scss'],
        dest: './public/css/',
        ext: '.css'
      }]
      }
    },

    // Watches files for changes and runs tasks based on the changed files
    watch: {
      js: {
        files: ['<%= project.app %>/js/**/*.js'],
        options: {
          livereload: '<%= connect.options.livereload %>'
        }
      },
      styles: {
        files: ['<%= project.scss %>/**/*.scss'],
        tasks: ['sass', 'postcss'],
        options: {
          // nospawn: true
        }
      },
      gruntfile: {
        files: ['Gruntfile.js']
      },
      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        files: [
          '<%= project.app %>/**/*.html',
          '<%= project.app %>/css/**/*.css',
          '<%= project.app %>/img/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ]
      }
    },

    'string-replace': {
      dist: {
        files: {
          'dist/index.html': 'dist/index.html'
        },
        options: {
          replacements: [
            {
              pattern: /<!-- start vendor-css[\s\S]*end vendor-css imports -->/g,
              replacement: '<link href="css/vendors.min.css" rel="stylesheet">'
            },
            {
              pattern: /<!-- start vendor-js[\s\S]*end vendor-js imports -->/g,
              replacement: '<script src="js/vendors.min.js"></script>'            
            },
            {
              pattern: /<!-- start js[\s\S]*end js imports -->/g,
              replacement: '<script src="js/production.min.js"></script>'            
            },
            {
              pattern: /<!-- start css[\s\S]*end css imports -->/g,
              replacement: '<link href="css/production.min.css" rel="stylesheet">'            
            }
          ]
        }
      }
    },


    // The actual grunt server settings
    connect: {
      options: {
        port: 9000,
        // Change this to '0.0.0.0' to access the server from outside.
        // hostname: '192.168.87.141',
        hostname: 'localhost',
        livereload: 35729
      },
      livereload: {
        options: {
          open: true,
          middleware: function (connect) {
            return [
              modRewrite([
                '^[^\\.]*$ /index.html [L]'
                ]),
              serveStatic('.tmp'),
              connect().use(
                '/bower_components',
                serveStatic('./bower_components')
              ),
              connect().use(
                '/public/css',
                serveStatic('./public/css')
              ),
              serveStatic(appConfig.app)
            ];
          }
        }
      },
      dist: {
        options: {
          open: true,
          base: '<%= project.dist %>'
        }
      }
    },


    // Empties folders to start fresh
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= project.dist %>/{,*/}*',
            '!<%= project.dist %>/.git{,*/}*'
          ]
        }]
      },
      server: '.tmp'
    },

    // Add vendor prefixed styles
    postcss: {
      options: {
        map: true,
        processors: [
          require('autoprefixer')({browsers: '> 5%', remove: false})
        ]
      },
      dist: {
        src: 'public/css/*.css'
      }
    },

    // Renames files for browser caching purposes
    filerev: {
      dist: {
        src: [
          '<%= project.dist %>/js/{,*/}*.js',
          '<%= project.dist %>/css/{,*/}*.css',
          '<%= project.dist %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
          '<%= project.dist %>/img/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
          '<%= project.dist %>/css/fonts/*'
        ]
      }
    },

    // The following *-min tasks will produce minified files in the dist folder
    // By default, your `index.html`'s <!-- Usemin block --> will take care of
    // minification. These next options are pre-configured if you do not wish
    // to use the Usemin blocks.
    cssmin: {
      dist: {
        files: {
          'dist/css/production.min.css': [
            'public/css/main.css'
          ],
          'dist/css/vendors.min.css': [
            'public/css/bootstrap.min.css',
            'public/css/ionicons.min.css'
          ]
        }
      }
    },
    uglify: {
      dist: {
        options: {
          sourceMap: {
            includeSources: true
          }
        },
        files: {
          '<%= project.dist %>/js/production.min.js': [
            'public/js/*.js',
            'public/js/controllers/*.js',
            'public/js/directives/*.js',
            'public/js/services/*.js'
          ]
        }
      }
    },
    concat: {
      options: {
        separator: ';\n'
      },
      libs: {
        src: [
        'public/libs/jquery-3.1.1.min.js',
        'public/libs/angular.min.js',
        'public/libs/angular-animate.min.js',
        'public/libs/moment.min.js',
        'public/libs/platform.min.js',
        'public/libs/angular-ui-router.min.js',
        'public/libs/ui-bootstrap-tpls-2.5.0.min.js',
        'public/libs/lodash.min.js'
        ],
        dest: 'dist/js/vendors.min.js'
      }
    },

    imagemin: {
      dist: {
        options: {
                optimizationLevel: 0
            },
        files: [{
          expand: true,
          cwd: '<%= project.app %>/img',
          src: '{,*/}*.{png,jpg,jpeg,gif,}',
          dest: '<%= project.dist %>/img'
        },
        {
          expand: true,
          cwd: '<%= project.app %>/images',
          src: '{,*/}*.{png,jpg,jpeg,gif,}',
          dest: '<%= project.dist %>/images'
        }]
      }
    },

    htmlmin: {
      dist: {
        options: {
          collapseWhitespace: true,
          conservativeCollapse: true,
          collapseBooleanAttributes: true,
          // removeComments: true,
          // caseSensitive: true
        },
        files: [
          {
            expand: true,
            cwd: '<%= project.app %>',
            src: ['{,*/}*.html'],
            dest: '<%= project.dist %>'
          }
        ]
      }
    },

    // Copies remaining files to places other tasks can use
    copy: {
      dist: {
        files: [
          {
            expand: true,
            dot: true,
            cwd: '<%= project.app %>',
            dest: '<%= project.dist %>',
            src: ['*.{ico,png,txt}']
          },
          {
            expand: true,
            cwd: '.tmp/images',
            src: ['generated/*'],
            dest: '<%= project.dist %>/images'
          },
          {
            expand: true,
            cwd: '<%= project.app %>/img',
            src: '{,*/}*.{svg,}',
            dest: '<%= project.dist %>/img'
          },
          {
            expand: true,
            cwd: '<%= project.app %>/images',
            src: '{,*/}*.{svg,}',
            dest: '<%= project.dist %>/images'
          },
          {
            expand: true,
            cwd: './',
            dest: '<%= project.dist %>/.well-known',
            src: './apple-app-site-association'
          }
        ]
      },
      styles: {
        expand: true,
        cwd: '<%= project.app %>/styles',
        dest: '.tmp/styles/',
        src: '{,*/}*.css'
      },
      fonts: {
        expand: true,
        cwd: '<%= project.app %>/fonts',
        dest: '<%= project.dist %>/fonts',
        src: [
          '**/*'
        ]
      }
    },

    mkdir: {
      dist: {
        options: {
          create: ['<%= project.dist %>/.well-known/acme-challenge']
        }
      }
    },

    cachebreaker: {
      index: {
        options: {
          match: ['production.min.js', 'production.min.css', 'vendors.min.js', 'vendors.min.css']
        },
        files: {
          src: ['dist/index.html']
        }
      },
      appViews: {
        options: {
          match: ['/*.html']
        },
        files: {
          src: ['dist/js/production.min.js']
        }
      },
      templateContent: {
        options: {
          match: ['/*.html']
        },
        files: {
          src: ['dist/views/*.html']
        }
      },
      localViews: {
        options: {
          match: ['/*.html']
        },
        files: {
          src: ['public/js/app.js']
        }
      }
    }
  });


  grunt.registerTask('serve', 'Compile then start a connect web server', function (target) {
    console.log('target: ', target);
    if (target === 'dist') {
      console.log('serving dist');
      return grunt.task.run(['build', 'connect:dist:keepalive']);
      // return grunt.task.run(['connect:dist:keepalive']);
    }

    grunt.task.run([
      // 'clean:server',
      // 'copy:styles',
      // 'postcss:server',
      'connect:livereload',
      'watch'
    ]);
  });

  grunt.registerTask('emptyFile', 'Creates empty file', function() {
    grunt.file.write('dist/.well-known/acme-challenge/n.txt', 'n');
  });

  grunt.registerTask('build', [
    'clean:dist',
    'mkdir:dist',
    'emptyFile',
    'copy:dist',
    'copy:fonts',
    'concat',
    'imagemin',
    'htmlmin',
    'cssmin',
    'string-replace',
    'uglify',
    'cachebreaker:index',
    'cachebreaker:appViews',
    'cachebreaker:templateContent'
  ]);

  grunt.registerTask('default', [
    'build'
  ]);
};
