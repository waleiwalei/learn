let a = new Proxy({}, {
    i: 1,
    get: function() {
        return this.i++
    }
})
console.log((a.i==1)&&(a.i==2)&&(a.i==3));