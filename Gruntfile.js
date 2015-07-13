module.exports = function(grunt) {

  // show elapsed time at the end
  require('time-grunt')(grunt);
  // load all grunt tasks
  require('load-grunt-tasks')(grunt);
  
  var path = require('path');
  
  var config = {
    path: {
        src    : 'app',
        dist   : 'dist',
        tmp    : '.tmp',
        test   : 'test',
        server : './server'
    },

    connection: {
        port     : 9090,
        hostName : '*' //change to 0.0.0.0
    }

  };

  // Project configuration.
  grunt.initConfig({
  
    pathConfig: config.path,

    // bower: {
    //     install: {
    //         targetDir: './lib',
    //         layout: 'byType',
    //         install: true,
    //         verbose: false,
    //         cleanTargetDir: true,
    //         cleanBowerDir: true
    //        //just run 'grunt bower:install' and you'll see files from your Bower packages in lib directory
    //     }
    // },
    
    watch: {
        emberTemplates: {
            files: '<%= pathConfig.src %>/templates/**/*.hbs',
            tasks: ['emberTemplates:app']
        },

        neuter: {
            files: ['<%= pathConfig.src %>/scripts/**/*.js'],
            tasks: ['neuter:app']
        },

        less : {
            files: "<%=pathConfig.src%>/themes/{,*/}*.less",
            tasks: ['less:app']
        },

        imagemin : {
            files: '<%= pathConfig.src %>/themes/{,*/}/images/*.{png,jpg,jpeg,svg}',
            tasks: ['imagemin:app']

        },

        jshint: {
            files: ['<%= pathConfig.src %>/scripts/**/*.js'],
            tasks: ['jshint']
        },

        jscs: {
            files: ['<%= pathConfig.src %>/scripts/**/*.js'],
            tasks: ['jscs']
        }
    },
    
    jshint: {
        options: {
            jshintrc : true,
            reporter: require('jshint-stylish')
        },

        files: ['<%= pathConfig.src %>/scripts/**/*.js']
    },

    jscs: {
        src: "<%= pathConfig.src %>/scripts/**/*.js",
        options: {
            config: ".jscsrc",
            requireCurlyBraces: [ "if" ]
        }
    },

    clean: {
        dist: {
            files: [{
                dot: true,
                src: [
                    '<%= pathConfig.tmp %>',
                    '<%= pathConfig.dist %>/*',
                    '!<%= pathConfig.dist %>/.git*'
                ]
            }]
        }
    },

    less: {
        app: {
            files: {
                "<%= pathConfig.tmp %>/themes/main/main.css": "<%=pathConfig.src%>/themes/main/*.less",
                "<%= pathConfig.tmp %>/themes/light/main.css": "<%=pathConfig.src%>/themes/light/*.less"
            }
        },
        dist: {
            options: {
              cleancss : true
            },
             files: {
                "<%= pathConfig.dist %>/themes/main/main.css": "<%=pathConfig.src%>/themes/main/*.less",
                "<%= pathConfig.dist %>/themes/light/main.css": "<%=pathConfig.src%>/themes/light/*.less"
            }
        }
    },

    rev: {
        dist: {
            files: {
                src: [
                    '<%= pathConfig.dist %>/scripts/**/*.js',
                    '<%= pathConfig.dist %>/themes/{,*/}*.css',
                    '<%= pathConfig.dist %>/images/{,*/}*.{png,jpg,jpeg,gif,webp}',
                    '<%= pathConfig.dist %>/styles/fonts/*'
                ]
            }
        }
    },

    useminPrepare: {
        html: '<%= pathConfig.tmp %>/index.html',

        dist: '<%= pathConfig.dist %>/index.html',

        options: {
            dest: '<%= pathConfig.dist %>'
        }
    },

    usemin: {
        html : ['<%= pathConfig.dist %>/{,*/}*.html'],
        css  : ['<%= pathConfig.dist %>/themes/{,*/}*.css'],
        options: {
            dirs: ['<%= pathConfig.dist %>']
        }
    },

    imagemin: {

        app: {
            files: [{
                expand : true,
                cwd    : '<%= pathConfig.src %>/themes/main/images',
                src    : '{,*/}*.{png,jpg,jpeg}',
                dest   : '<%= pathConfig.tmp %>/themes/main/images'
            },{
                expand : true,
                cwd    : '<%= pathConfig.src %>/themes/light/images',
                src    : '{,*/}*.{png,jpg,jpeg}',
                dest   : '<%= pathConfig.tmp %>/themes/light/images'
            }]
        },

        dist: {
            files: [{
                expand : true,
                cwd    : '<%= pathConfig.src %>/themes/main/images',
                src    : '{,*/}*.{png,jpg,jpeg}',
                dest   : '<%= pathConfig.dist %>/themes/main/images'
            },{
                expand : true,
                cwd    : '<%= pathConfig.src %>/themes/light/images',
                src    : '{,*/}*.{png,jpg,jpeg}',
                dest   : '<%= pathConfig.dist %>/themes/light/images'
            }]
        }
    },
    svgmin: {
        
        app: {
            files: [{
                expand : true,
                cwd    : '<%= pathConfig.src %>/themes/main/images',
                src    : '{,*/}*.svg',
                dest   : '<%= pathConfig.tmp %>/themes/main/images'
            },{
                expand : true,
                cwd    : '<%= pathConfig.src %>/themes/light/images',
                src    : '{,*/}*.svg',
                dest   : '<%= pathConfig.tmp %>/themes/light/images'
            }]
        },

        dist: {
            files: [{
                expand : true,
                cwd    : '<%= pathConfig.src %>/themes/main/images',
                src    : '{,*/}*.svg',
                dest   : '<%= pathConfig.dist %>/themes/main/images'
            },{
                expand : true,
                cwd    : '<%= pathConfig.src %>/themes/light/images',
                src    : '{,*/}*.svg',
                dest   : '<%= pathConfig.dist %>/themes/light/images'
            }]
        }
    },

    cssmin: {
        dist: {
            files: {
                '<%= pathConfig.dist %>/themes/main/main.css': [
                    '<%= pathConfig.tmp %>/themes/main/{,*/}*.css',
                    '<%= pathConfig.src %>/themes/main/{,*/}*.css'
                ],
                '<%= pathConfig.dist %>/themes/light/main.css': [
                    '<%= pathConfig.tmp %>/themes/light/{,*/}*.css',
                    '<%= pathConfig.src %>/themes/light/{,*/}*.css'
                ]
            }
        }
    },
    htmlmin: {
        dist: {
            options: {
                /*removeCommentsFromCDATA: true,
                // https://github.com/yeoman/grunt-usemin/issues/44
                //collapseWhitespace: true,
                collapseBooleanAttributes: true,
                removeAttributeQuotes: true,
                removeRedundantAttributes: true,
                useShortDoctype: true,
                removeEmptyAttributes: true,
                removeOptionalTags: true*/
            },
            files: [{
                expand : true,
                cwd    : '<%= pathConfig.src %>',
                src    : '*.html',
                dest   : '<%= pathConfig.dist %>'
            }]
        }
    },
    replace: {

        app: {
            options: {
              variables: {
                ember                       : 'lib/ember/ember.js',
                ember_data                  : 'lib/ember-data/ember-data.js',
                ember_lsadapter             : 'lib/ember-localstorage-adapter/localstorage_adapter.js',
                threeJs                     : 'lib/components-threejs/three.js',
                threeJsTrackBallControls    : 'lib/threejs-examples/examples/js/controls/TrackballControls.js',
                jQuery                      : 'lib/jquery/dist/jquery.js',
                handlebars                  : 'lib/handlebars/handlebars.js',
                i18n                        : 'lib/ember-i18n/lib/i18n.js',
                cldr                        : 'lib/cldr/plurals.js',
                jcarousel                   : 'lib/jcarousel/dist/jquery.jcarousel.min.js',
                hammer                      : 'lib/hammerjs/hammer.js',
                hammerJq                    : 'lib/hammerjs/jquery.hammer.js',
                loggerConfig                : 'config/developmentLoggerConfig.js',
                jqGrid                      : 'lib/jqgrid/js/minified/jquery.jqGrid.min.js',
                jqGridLocale                : 'lib/jqgrid/js/i18n/grid.locale-en.js',
                jqGridCss                   : 'lib/jqgrid/css/ui.jqgrid.css',
                kendoUi                     : 'lib/kendo-ui-core/js/kendo.ui.core.min.js',
                kendoCommonCss              : 'lib/kendo-ui-core/styles/kendo.common.min.css',
                kendoBlackCss               : 'lib/kendo-ui-core/styles/kendo.common.min.css/kendo.metroblack.min.css'
              }
            },

            files: [
              {src: '<%= pathConfig.src %>/index.html', dest: '<%= pathConfig.tmp %>/index.html'}
            ]
        },

        dist: {
            options: {
              variables: {
                ember                       : 'lib/ember/ember.prod.js',
                ember_data                  : 'lib/ember-data/ember-data.prod.js',
                ember_lsadapter             : 'lib/ember-localstorage-adapter/localstorage_adapter.js',
                threeJs                     : 'lib/threejs-build/build/three.min.js',
                threeJsTrackBallControls    : 'lib/threejs-examples/examples/js/controls/TrackballControls.js',
                jQuery                      : 'lib/jquery/dist/jquery.min.js',
                handlebars                  : 'lib/handlebars/handlebars.min.js',
                i18n                        : 'lib/ember-i18n/lib/i18n.js',
                cldr                        : 'lib/cldr/plurals.js',
                jcarousel                   : 'lib/jcarousel/dist/jquery.jcarousel.min.js',
                hammer                      : 'lib/hammerjs/hammer.js',
                hammerJq                    : 'lib/hammerjs/jquery.hammer.js',
                loggerConfig                : 'config/developmentLoggerConfig.js',
                jqGrid                      : 'lib/jqgrid/js/minified/jquery.jqGrid.min.js',
                jqGridLocale                : 'lib/jqgrid/js/i18n/grid.locale-en.js',
                jqGridCss                   : 'lib/jqgrid/css/ui.jqgrid.css',
                kendoUi                     : 'lib/kendo-ui-core/js/kendo.ui.core.min.js',
                kendoCommonCss              : 'lib/kendo-ui-core/styles/kendo.common.min.css',
                kendoBlackCss               : 'lib/kendo-ui-core/styles/kendo.common.min.css/kendo.metroblack.min.css'
              }
            },

            files: [
              {src: '<%= pathConfig.src %>/index.html', dest: '<%= pathConfig.dist %>/index.html'}
            ]
        },

        serverConfig : {

            options: {

                variables: {

                    portToChoose : '<%=grunt.config("portToListen")%>',

                    protocolToChoose : '<%=grunt.config("protocolName")%>',

                    localPortToChoose : '<%=grunt.config("localPort")%>',

                    domainToChoose : '<%=grunt.config("hostName")%>'//'evbyminsd4d80.minsk.epam.com'
                }

            },

            files: [
              {expand: true, flatten: true, src: ['config.js'], dest: 'config/'}
            ]
        }

    },

    prompt: {
        serverConfig: {
          options: {
            questions: [
                {
                    config: 'hostName',
                    type: 'input',
                    message: 'Which host would you like to use? (Controller should be launched on this domain.)',
                    default: 'evbyminsd4d80.minsk.epam.com',
                    validate: function(value) {

                        var ipAddressRegex = new RegExp("^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$");

                        var hostnameRegex = new RegExp("^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9\-]*[A-Za-z0-9])$");

                        return ipAddressRegex.test(value) || hostnameRegex.test(value) || 'Must be valid host name or ip.';
                    }
                },
                {
                    config: 'portToListen',
                    type: 'input',
                    message: 'Which port would you like to use?',
                    default: '8080',
                    validate : function(value) {
                        var portRegex = new RegExp("^0*(?:6553[0-5]|655[0-2][0-9]|65[0-4][0-9]{2}|6[0-4][0-9]{3}|[1-5][0-9]{4}|[1-9][0-9]{1,3}|[0-9])$");
                        return portRegex.test(value) || 'Must be valid port number.';
                    }
                },
                {
                    config: 'protocolName',
                    type: 'list',
                    message: 'Which protocol would you like to use?',
                    default: 'http',
                    choices: ['http', 'https']
                },
                {
                    config: 'localPort',
                    type: 'input',
                    message: 'Which port should use UI?',
                    default: '9090',
                    validate : function(value) {
                        var portRegex = new RegExp("^0*(?:6553[0-5]|655[0-2][0-9]|65[0-4][0-9]{2}|6[0-4][0-9]{3}|[1-5][0-9]{4}|[1-9][0-9]{1,3}|[0-9])$");
                        return portRegex.test(value) || 'Must be valid port number.';
                    }
                }
              
            ]
          }
        }
    },

    // Put files not handled in other tasks here
    copy: {
        fonts: {
            files: [
                { 
                    expand  : true,
                    flatten : true,
                    filter  : 'isFile',
                    cwd     : '<%= pathConfig.src %>/lib/',
                    dest    : '<%= pathConfig.src %>/styles/fonts/',
                    src     : [ 
                        'bootstrap-sass/dist/fonts/**', // Bootstrap
                        'font-awesome/fonts/**' // Font-Awesome
                    ]
                }
            ]
        },
        dist: {
            files: [
                {
                    expand : true,
                    dot    : true,
                    cwd    : '<%= pathConfig.src %>',
                    dest   : '<%= pathConfig.dist %>',
                    src    : [
                        '*.{ico,txt}',
                        '.htaccess',
                        'images/{,*/}*.{webp,gif}',
                        'styles/fonts/*'
                    ]
                }
            ]
        }
    },
    concurrent: {
        app: [
            'emberTemplates:app'
        ],
        jshint : [
            'jshint'
        ],
        test: [
            'emberTemplates'
        ],
        dist: [
            'emberTemplates',
            'imagemin',
            'svgmin',
            'htmlmin'
        ]
    },
    emberTemplates: {
        options: {
            templateName: function (sourceFile) {
                var templatePath = config.path.src + '/templates/';
                return sourceFile.replace(templatePath, '');
            }
        },

        app: {
            files: {
                '<%= pathConfig.tmp %>/scripts/compiled-templates.js': '<%= pathConfig.src %>/templates/**/*.hbs'
            }
        },

        dist: {
            files: {
                '<%= pathConfig.dist %>/scripts/compiled-templates.js': '<%= pathConfig.src %>/templates/**/*.hbs'
            }
        }
    },
    neuter: {
        app: {
            options: {
                filepathTransform: function (filepath) {
                    return config.path.src + '/' + filepath;
                }
            },
            src  : '<%= pathConfig.src %>/scripts/app.js',
            dest : '<%= pathConfig.tmp %>/scripts/combined-scripts.js'
        },

        dist: {
            options: {
                filepathTransform: function (filepath) {
                    return config.path.src + '/' + filepath;
                }
            },
            src  : '<%= pathConfig.src %>/scripts/app.js',
            dest : '<%= pathConfig.dist %>/scripts/combined-scripts.js'
        }
    }
  });

   grunt.registerTask('start', function (target) {
        grunt.task.run([
            'clean:dist',
            'less:app',
            'replace:app',
            'concurrent:app',
            'concurrent:jshint',
            'neuter:app',
            'copy:fonts',
            'imagemin:app',
            'svgmin:app',
            'watch'
        ]);
    });
    
    grunt.registerTask('build', [
        // 'bower',
        'clean:dist',
        'less:dist',
        'replace:dist',
        'neuter:dist',
        'emberTemplates:dist',
        'copy:fonts',
        'imagemin:dist',
        'svgmin:dist',
        'prompt:serverConfig',
        'replace:serverConfig'

        // 'clean:dist',
        // 'less:dist',
        // 'replace:dist',
        // 'useminPrepare',
        // 'concurrent:dist',
        // 'neuter:app',
        // 'concat',
        // 'cssmin',
        // 'copy',
        // 'rev',
        // 'usemin'
    ]);

    grunt.registerTask('config-app', [
        'prompt:serverConfig',
        'replace:serverConfig'
    ]);


};