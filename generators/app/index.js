var Generator = require('yeoman-generator');

module.exports = class extends Generator {
    constructor(args, opts) {
        super(args, opts);

        this.argument('subprojectExecution', { type: String, required: false });
    }

    main() {
        this.log('method 1 just ran: ' + this.options.subprojectExecution);
        if (!this.options.subprojectExecution) {
            this._fullProject();
        }
    }

    _fullProject() {
        this.log('running whole project flow');
    }
};