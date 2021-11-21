var Generator = require("yeoman-generator");

module.exports = class extends Generator {
  // The name `constructor` is important here
  constructor(args, opts) {
    // Calling the super constructor is important so our generator is correctly set up
    super(args, opts);

    // // Next, add your custom code
    // this.option('babel'); // This method adds support for a `--babel` flag
  }
  async initPackage() {
    const answer = await this.prompt([
      {
        type: "input",
        name: "name",
        message: "Your project name",
        default: this.appname, // Default to current folder name
      },
      {
        type: "confirm",
        name: "cool",
        message: "Would you like to enable the Cool feature?",
      },
    ]);
    const pkgJson = {
      name: answer.name,
      version: "1.0.0",
      description: "",
      main: "index.js",
      scripts: {
        build: "webpack",
        test: "mocha --require @babel/register",
        coverage: "nyc mocha --require @babel/register",
      },
      author: "",
      license: "ISC",
      devDependencies: {
        webpack: "5.64.2",
        "vue-loader": "15.9.8",
        "vue-template-compiler": "2.6.14",
        "vue-style-loader": "4.1.3",
        "css-loader": "6.5.1",
        "copy-webpack-plugin": "10.0.0",
        "@babel/plugin-transform-react-jsx": "^7.14.9",
        "babel-loader": "^8.2.3",
        "webpack-cli": "^4.9.1",
        "webpack-dev-server": "^4.4.0",
        "@babel/core": "^7.16.0",
        "@babel/preset-env": "^7.16.4",
        "@babel/register": "^7.16.0",
        "@istanbuljs/nyc-config-babel": "^3.0.0",
        "babel-plugin-istanbul": "^6.1.1",
        mocha: "^9.1.3",
        nyc: "^15.1.0",
      },
      dependencies: {
        vue: "2.6.14",
      },
    };

    // Extend or create package.json file in destination path
    this.fs.extendJSON(this.destinationPath("package.json"), pkgJson);
  }

  copyFiles() {
    this.fs.copyTpl(
      this.templatePath("hello-world.vue"),
      this.destinationPath("src/hello-world.vue"),
      {}
    );
    this.fs.copyTpl(
      this.templatePath("webpack.config.js"),
      this.destinationPath("webpack.config.js")
    );
    this.fs.copyTpl(
      this.templatePath("main.js"),
      this.destinationPath("src/main.js")
    );
    this.fs.copyTpl(
      this.templatePath("index.html"),
      this.destinationPath("src/index.html"),
      { title: "HelloWorld" }
    );
    this.fs.copyTpl(
      this.templatePath(".babelrc"),
      this.destinationPath(".babelrc"),
      {}
    );
    this.fs.copyTpl(
      this.templatePath(".nycrc"),
      this.destinationPath(".nycrc"),
      {}
    );
    this.fs.copyTpl(
      this.templatePath("sample-test.js"),
      this.destinationPath("test/sample-test.js"),
      {}
    );
  }
};
