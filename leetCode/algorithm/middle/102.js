// 遍历二叉树所有层 每次为一个数组 返回二维数组
// 两层循环取size的方式可以用于取二叉树的层级
function getTree(treeNode) {
    let res = [];
    if(!treeNode) return [];
    let queue = [];
    queue.push(treeNode);
    while(queue.length) {
        let size = queue.length;
        let list = [];
        while(size) {
            let cur = queue.shift();
            if(cur.left) queue.push(cur.left);
            if(cur.right) queue.push(cur.right);
            list.push(cur.value);
            size--;
        }
        res.push(list);
    }
    return res;
}
console.log(getTree(t1));