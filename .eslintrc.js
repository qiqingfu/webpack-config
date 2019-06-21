module.exports = {
    "env": {
        "browser": true,
        "commonjs": true,
        "es6": true,
        "node": true
    },
    "extends": [
        "plugin:vue/recommended"
    ],
    "parserOptions": {
        "parser": "babel-eslint",
        "ecmaVersion": 2015,
        "sourceType": "module"
    },
    plugins: [
        "vue"
    ],
    "rules": {
        "indent": [
            "error",
            4
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "error",
            "single"
        ],
        "semi": [
            "error",
            "never"
        ]
    }
};