const packageJson = {
    
};

const skipPromptOpts = {
    'skip-name': false,
    'skip-version': false,
    'skip-description': false,
    'skip-main': false,
    'skip-test': false,
    'skip-repo': true,
    'skip-keywords': false,
    'skip-author': false,
    'skip-license': false
};

const promptDefaults = {
    name: 'SampleNodeApp',
    version: '0.0.1',
    //description: '',
    main: 'index.js',
    test: 'mocha --opts ./test/mocha.opts ./test',
    //repo: '',
    keywords: 'node',
    //author: '',
    license: 'MIT'
}

const getPromptDefault = (name, override =  {}) => {
    return override[name] ? override[name] : promptDefaults[name];
}

const createPrompt = (name, message, store = false, type = 'input', defaultOverride = {}) => {
    const prompt = {
        name: name,
        type: type,
        message: message ? message : name + ":",
        store: store
    };
    const defaultVal = getPromptDefault(name, defaultOverride);
    if (defaultVal !== '' && defaultVal !== undefined) prompt.default = defaultVal;
    if (!skipPromptOpts['skip-' + name])
        return prompt;
}

const getPackageJsonPrompts = (defaultOverrides = {}, skipPromptOptions = skipPromptOpts) => {
    let prompts = []

    prompts.push(createPrompt('name'));
    prompts.push(createPrompt('version'));
    prompts.push(createPrompt('description'));
    prompts.push(createPrompt('main'));
    prompts.push(createPrompt('test', 'npm test command'));
    prompts.push(createPrompt('repo', 'git repository'));
    prompts.push(createPrompt('keywords'));
    prompts.push(createPrompt('author', '', true));
    prompts.push(createPrompt('license'));
    console.log(prompts.length);

    prompts = prompts.filter((x) => { 
        if (x) return true;
    });
    console.log(prompts.length);
    return prompts;
}

packageJson.getPackageJsonPrompts = getPackageJsonPrompts;

module.exports = packageJson;
