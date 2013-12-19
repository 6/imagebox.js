module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    uglify: {
      code: {
        files: {
          'imagebox-min.js': ['imagebox.js']
        },
        options: {
          compress: true,
          mangle: true,
          preserveComments: false,
          sourceMap: 'imagebox-min.map'
        }
      }
    },

    cssmin: {
      code: {
        files: {
          'imagebox-min.css': ['imagebox.css']
        }
      }
    },

    watch: {
      javascripts: {
        files: ['imagebox.js'],
        tasks: ['uglify']
      },
      stylesheets: {
        files: ['imagebox.css'],
        tasks: ['cssmin']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.registerTask('default', ['uglify', 'cssmin', 'watch']);
};
