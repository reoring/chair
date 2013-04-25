module.exports = (grunt) ->
  
    # Project configuration.
    grunt.initConfig
        pkg: grunt.file.readJSON("package.json")
        coffee:
            compile:
                options:
                    join: true
                    bare: true

                files:
                    "build/chair.js": ["src/*.coffee"]
                    "build/table.js": ["src/port/*.coffee"]
                    "build/datasource.js": ["src/infrastructure/*.coffee"]

            domain:
                options:
                    join: true
                    bare: true
                files:
                    "build/chair.model.js": ["src/domain/model/*.coffee"]

        uglify:
            options:
                banner: "/*! <%= pkg.name %> <%= grunt.template.today(\"yyyy-mm-dd\") %> */\n"

            build:
                src: "build/<%= pkg.name %>.js"
                dest: "build/<%= pkg.name %>.min.js"

    grunt.loadNpmTasks "grunt-contrib-coffee"
    grunt.loadNpmTasks "grunt-contrib-uglify"

    # Default task(s).
    grunt.registerTask "default", ["coffee", "uglify"]