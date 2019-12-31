```js
{
    "compilerOptions": {
        "types": ["node"],
        "baseUrl": ".",
        "outDir": "dist",
        "module": "esnext", // 指定生成哪个模块系统代码： "None"， "CommonJS"， "AMD"， "System"， "UMD"， "ES6"或 "ES2015"
        "target": "es6",    // 目标格式
        "sourceMap": true,  // 生成相应.map文件
        "allowJs": true,    // 允许编译js文件
        "jsx": "react",     // js文件支持jsx
        "moduleResolution": "node", // 决定如何处理模块 【node对于nodejs、ios.js】
        // "rootDir": "src",
        "forceConsistentCasingInFileNames": true,   
        "noImplicitReturns": true,  // 非函数有return报错
        "noImplicitThis": true, // this表达式为any时报错
        "noImplicitAny": true,  //为 false 时，如果编译器无法根据变量的使用来判断类型时，将用 any 类型代替。为 true 时，进行强类型检查，会报错
        "importHelpers": true, // 从tslib导入辅助工具函数（比如__extends，__rest等）
        "strictNullChecks": true, // 在严格的 null检查模式下， null和 undefined值不包含在任何类型里，只允许用它们自己和 any来赋值（有个例外， undefined可以赋值到 void
        "suppressImplicitAnyIndexErrors": true,
        "noUnusedLocals": true, // 若有未使用的局部变量则抛错。
        "allowSyntheticDefaultImports": true
    },
    // 干啥的？
    "paths": {
        "common": ["./src/common"],
        "common/*": ["./src/common/*"],
        "@components": ["./src/components"],
        "@components/*": ["./src/components/*"]
    },
    "exclude": [
        "node_modules",
        "prd",
        "dev",
        "dist",
        "ver",
        "prd_sourcemap",
        "ykit.js"
    ]
}
```