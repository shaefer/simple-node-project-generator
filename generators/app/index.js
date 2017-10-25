var Generator = require('yeoman-generator');
var PackageJson = require('./packageJsonPrompts');

module.exports = class extends Generator {

    prompting() {
        this.log('prompting step');
    
        const prompts = PackageJson.getPackageJsonPrompts();
        this.log('promptCount', prompts.length);

        return this.prompt(prompts).then((answers) => {
            this.log('Prompting Promise Returned');
            this.promptAnswers = answers;
            const packageJson = this._buildPackageJson(answers);
            this.packageJson = packageJson
        });
    }

    writing() {
        this.log("writing step");
        this.fs.writeJSON(this.destinationPath('package.json'), this.packageJson);
        this.fs.copyTpl(
            this.templatePath('exampleSource.js'),
            this.destinationPath('source/' + this.packageJson.main),
            {
                awsCallExample: "console.log(\'some example aws calls here.\')"
            }
        );
        this.fs.copyTpl(
            this.templatePath('mocha.opts'),
            this.destinationPath('test/mocha.opts')
        );
        this.fs.copyTpl(
            this.templatePath('.gitignore'),
            this.destinationPath('.gitignore')
        );
        this.fs.copyTpl(
            this.templatePath('README.md'),
            this.destinationPath('README.md'),
            {
                projectName: this.promptAnswers.name,
                npmTestCommand: this.promptAnswers.test
            }
        );
        this.fs.copyTpl(
            this.templatePath('.babelrc'),
            this.destinationPath('.babelrc')
        );
    }

    install() {
        this.log('Npm Installs');
        const devDependencies = ["mocha", "babel-core", "babel-preset-es2015", "babel-preset-stage-2"];
        this.log("npm install: " + devDependencies);
        this.npmInstall(devDependencies, { 'save-dev': true });
        this.npmInstall();
    }

    _buildPackageJson(res) {
        const packageJson = { 
            dependencies: [],
            scripts: {}
        };
        if (res.name) {
            packageJson.name = res.name
        }
        if (res.version) {
            packageJson.version = res.version
        }
        if (res.description) {
            packageJson.description = res.description
        }
        if (res.main) {
            packageJson.main = res.main;
            packageJson.scripts.start = "node ./source/" + res.main;
        }
        if (res.test) {
            packageJson.scripts.test = res.test;
        }
        if (res.keywords && !res.keywords.match(/^\w?$/)) {
            packageJson.keywords = res.keywords.split(' ')
        }
        if (res.repo) {
            packageJson.repository = res.repo
        }
        if (res.author) {
            packageJson.author = res.author
        }
        if (res.license) {
            packageJson.license = res.license
        }
        if (res.awssdk) {
            packageJson.dependencies = packageJson.dependencies.concat(["aws-sdk"]);
        }
        return packageJson;
    }
};