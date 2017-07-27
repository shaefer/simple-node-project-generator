var Generator = require('yeoman-generator');
var PackageJson = require('./packageJsonPrompts');

module.exports = class extends Generator {

    prompting() {
        this.log('prompting step');
    
        const prompts = PackageJson.getPackageJsonPrompts();
        this.log('promptCount', prompts.length);

        return this.prompt(prompts).then((answers) => {
            this.log('Prompting Promise Returned');
            const packageJson = this._buildPackageJson(answers);
            this.log(packageJson);
            this.packageJson = packageJson
        });
    }

    writing() {
        this.log("writing step");
        this.fs.writeJSON(this.destinationPath('package.json'), this.packageJson);
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
            this.destinationPath('README.md')
        );
        this.fs.copyTpl(
            this.templatePath('.babelrc'),
            this.destinationPath('.babelrc')
        );
    }

    install() {
        this.log('npm install mocha --save-dev');
        this.npmInstall(['mocha'], { 'save-dev': true });
        this.log('npm install babel-core --save-dev');
        this.npmInstall(['babel-core'], { 'save-dev': true}); //necessary for babel and mocha.opts babel-core/register
        this.log('npm install babel-preset-es2015 --save-dev');
        this.npmInstall(['babel-preset-es2015'], { 'save-dev': true}); //used for .babelrc to provide es2015 support //maybe consider "env" preset
        this.log('npm install babel-preset-stage-2 --save-dev');
        this.npmInstall(['babel-preset-stage-2'], { 'save-dev': true}); // used for .babelrc to provide support for spread operator.
    }

    _buildPackageJson(res) {
        this.log(res);
        const packageJson = {};
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
            packageJson.main = res.main
        }
        if (res.test) {
            packageJson.scripts = { test: res.test }
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
        return packageJson;
    }
};