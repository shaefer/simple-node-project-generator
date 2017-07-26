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
    }

    install() {
        this.log('do our npm install here');
        this.npmInstall(['mocha'], { 'save-dev': true });
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