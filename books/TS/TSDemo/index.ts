function foo(arg: string) : number;
function foo(arg: number) : number;
function foo(arg: string | number) : number {
    if((<string>arg).length) {
        return (<string>arg).length;
    } else {
        return <number>arg;
    }
}

// console.log(foo({name: 'test'}))
