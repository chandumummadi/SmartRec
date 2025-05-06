module.exports = {
    parserOptions: {
        ecmaFeatures: {
            jsx: true
        },
        ecmaVersion: 2020,
        sourceType: 'module'
    },
    settings: {
        react: {
            version: 'detect',
            pragma: 'React',
            fragment: 'Fragment',
            // enable the new JSX transform:
            jsxRuntime: 'automatic'
        }
    },
    // your other rules...
};
