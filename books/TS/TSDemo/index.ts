(()=>{
    interface Counter {
        (name: string) : string;
        interval : number;
        reset() : void;
    }
    <Counter>function (name: string): void{
        // return 's';
    };
    function foo(): Counter {
        // 这里和接口里不一致 怎么没有报错
        let counter = <Counter>function (name: string): void{};
        counter.interval = 10;
        counter.reset = function() {};
        return counter;
    }
    let myFoo = foo();
    myFoo('str');
    myFoo.interval = 20;
    myFoo.reset();
    // function createArray<T = string>(length: number, value: T): Array<T> {
    //     let result: T[] = [];
    //     for (let i = 0; i < length; i++) {
    //         result[i] = value;
    //     }
    //     return result;
    // }

    // console.log(createArray<number>(3, 222))
})()