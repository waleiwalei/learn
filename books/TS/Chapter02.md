#### Chapter02 类型与函数
- 类型断言
    > 当开发者更清楚变量具体类型
    ```js
    function func(args: number | string) : void {
        // 当不确定具体类型时，只能访问共有属性
        if(args.length) {
            // xxx 会报错 number.length
        }
    }
    =>
    function func(args: number | string) : void {
        if((<string>args).length) {
            // xxx
        }
    }
    ```
    + 尖括号[JSX中不允许使用-->"<>"在JSX中表达泛型]
    ```js
    let oneString: any = "string";
    let stringLength: number = (<string>oneString).length;
    ```
    + as
    ```js
    let oneString: any = "string";
    let stringLength: number = (oneString as string).length;
    ```

- 泛型
    > 指在定义函数、接口或类的时候，不预先指定具体的类型，而在使用的时候再指定类型的一种特性
    + 泛型函数(多个类型参数)
    ```js
        function func<T>(args: T) : T {
            // args.length
        }

        // 根据木桶原理=>只能使用公共属性才不报错
        function func<T>(args: Array<T>) : Array<T> {
            // args.length
        } 
        // 等同于
        function func<T>(args: T[]) : T[] {
            // args.length
        }
    ```
    + 尖括号表达
    ```js
    let output = func<string>("hello");
    ```
    + 类型推断
    ```js
        func("hello"); // 自动根据传入参数类型推断T
    ```

- 枚举
    + 数字枚举[反向映射、初始值默认0、可自递增]
    + 字符串枚举


