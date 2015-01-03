module.exports = function(grunt){
  "use strict";
  
  grunt.initConfig({

    // Meta
    pkg: grunt.file.readJSON('package.json'),

    banner: '/*!\n'+
            ' * <%= pkg.name %> \n'+
            ' * version: <%= pkg.version %>\n'+
            ' * license: <%= pkg.license %>\n'+
            ' * copyright: <%= pkg.author %> <%= grunt.template.today("yyyy") %> All Right Reserved.\n'+
            ' * build: <%= grunt.template.today("yyyy-mm-dd HH:MM:ss Z") %>\n'+
            ' */\n',

    // Dist Directory Clean
    clean: ["dist/"],

    // Concat
    concat: {
      options: {
        stripBanners: true,
        banner: "<%= banner %>"
      },
      files: {
        src: [
          "src/imageChanger.js",
          "src/transitions.js"
        ],
        dest: "dist/jquery.imageChanger.js"
      }
    },

    // Js Uglify
    uglify: {
      dist: {
        options: {
          banner: "<%= banner %>"
        },
        files: {
          "dist/jquery.imageChanger.min.js": "dist/jquery.imageChanger.js"
        }
      }
    },

    // Js Hint
    jshint: {
      options: {
        jshintrc: ".jshintrc"
      },
      files: [
        "Gruntfile.js",
        "package.json",
        ".jshintrc",
        "src/**/*.js"
      ]
    },

    // watch other files
    watch: {
      options: {
        spawn: false
      },
      js: {
        files: "src/**/*.js",
        tasks: ["clean", "concat", "jshint", "uglify"]
      }
    }
  });


  // Auto Load Tasks
  for (var devDependency in grunt.config.data.pkg.devDependencies) {
    if (devDependency.match(/^grunt-/)) {
      grunt.loadNpmTasks(devDependency);
    }
  }


  // Set Default Task
  grunt.registerTask("default", ["watch"]);
  grunt.registerTask("build", ["clean", "concat", "uglify"]);


};