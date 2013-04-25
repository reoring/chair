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
                    "build/table.js": ["src/port/table.coffee"]
                    "build/datasource.js": ["src/infrastructure/*.coffee"]
                    "build/chair.all.js": ["src/*.coffee",
                                           "src/domain/model/*.coffee",
                                           "src/port/*.coffee",
                                           "src/infrastructure/*.coffee"]
 
            application:
                options:
                    join: true
                    bare: true
                files:
                    "build/chair.application.js": ["src/application/*.coffee"]

            domain:
                options:
                    join: true
                    bare: true
                files:
                    "build/chair.domain.js": ["src/domain/model/*.coffee"]

            infrastructure:
                options:
                    join: true
                    bare: true
                files:
                    "build/chair.infrastructure.js": ["src/infrastructure/*.coffee"]

        uglify:
            options:
                banner: "/*! <%= pkg.name %> <%= grunt.template.today(\"yyyy-mm-dd\") %> */\n"

            build:
                src: "build/<%= pkg.name %>.all.js"
                dest: "build/<%= pkg.name %>.all.min.js"

    grunt.loadNpmTasks "grunt-contrib-coffee"
    grunt.loadNpmTasks "grunt-contrib-uglify"

    # Default task(s).
    grunt.registerTask "default", ["coffee", "uglify"]