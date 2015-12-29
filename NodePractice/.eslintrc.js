module.exports = {
    "rules": {
        "indent": [
            2,
            "tab"
        ],
        "quotes": [
            2,
            "single"
        ],
        "linebreak-style": [
            2,
            "unix"
        ],
        "semi": [
            2,
            "always"
        ],
        // http://eslint.org/docs/rules/no-native-reassign
        // 不允许 native 变量被重置
        "no-native-reassign": 1,
        // http://eslint.org/docs/rules/no-return-assign
        // 是否允许 return 返回表达式
        "no-return-assign": 1,
        // http://eslint.org/docs/rules/no-constant-condition
        "no-constant-condition": 1,
    },
    "globals": {
        "KISSY": true,
        "$": true,
        "require": true,
        "module": true
    },
    "env": {
        "es6": true,
        "browser": true
    },
    "extends": "eslint:recommended",
    "ecmaFeatures": {
        "jsx": true,
        "experimentalObjectRestSpread": true
    },
    "plugins": [
        "react"
    ]
};