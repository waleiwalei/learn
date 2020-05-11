/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */
/**
 * @param {TreeNode} root
 * @return {boolean}
 */
var isSymmetric = function(root) {
    if(root === null) return true;
    let queue = [], res = [];
    queue.push(root);
    while(queue.length) {
        let size = queue.length;
        let list = [];
        while(size--) {
            let cur = queue.shift();
            list.push(cur ? cur.val : null);
            if(cur) {
                let {left, right} = cur;
                queue.push(left);
                queue.push(right);
            }
        }
        res.push(list);
    }
    for(let i = 0; i < res.length; i++) {
        let index = 0;
        let cur = res[i];
        if(i>0 && (cur.length % 2 != 0)) return false;
        while(index< Math.ceil(cur.length/2)) {
            if(cur[index]!= cur[cur.length - 1 - index]) {
                return false;
            }
            index++;
        }
    }
    return true;
};