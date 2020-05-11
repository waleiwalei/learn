// 给定一个二叉树，返回其节点值自底向上的层次遍历。 （即按从叶子节点所在层到根节点所在的层，逐层从左向右遍历）

// 例如：
// 给定二叉树 [3,9,20,null,null,15,7],

//     3
//    / \
//   9  20
//     /  \
//    15   7
// 返回其自底向上的层次遍历为：

// [
//   [15,7],
//   [9,20],
//   [3]
// ]
/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */
/**
 * @param {TreeNode} root
 * @return {number[][]}
 */
function Tree(value, left, right) {
    this.value = value;
    this.left = left;
    this.right = right;
}
let t4 = new Tree(4);
let t5 = new Tree(8);
let t6 = new Tree(3);
let t7 = new Tree(5);
let t2 = new Tree(2, t4, t5);
// let t2 = new Tree(2, null, null);
let t3 = new Tree(7, t6, t7);

let t1 = new Tree(1, t2, t3);

var levelOrderBottom = function(root) {
    let res = [];
    function deepGo(root, level) {
        if(!root) return;
        res[level] ? res[level].push(root.value) : res[level] = [root.value];
        level ++;
        let {left, right} = root;
        deepGo(left, level);
        deepGo(right, level);
    }
    deepGo(root, 0);
    return res.reverse();
};

var levelOrderBottom2 = function(root) {
    if(!root) return [];
    let res = [];
    let queue = [];
    queue.push(root);
    while (queue.length) {
        let size = queue.length;
        let list = [];
        while(size--) {
            let cur = queue.shift();
            let {left, right} = cur;
            list.push(cur.value);
            left && queue.push(left);
            right && queue.push(right);
        }
        res.push(list);
    }
    return res.reverse();
}

var level = function (treeNode) {
    if(!root) return [];
    let queue = [];
    let maxWidth = 0;
    let ret = [];
    queue.push(treeNode);
    while (queue.length) {
        let size = queue.length;
        let list = [];
        while (size -- ) {
            let cur = queue.shift();
            list.push(cur.value);
            let {left, right} = cur;
            left && queue.push(left);
            right && queue.push(right);
        }
        if(list.length > maxWidth) {
            maxWidth = list.length;
        }
        ret.push(list);
    }
}

console.log(levelOrderBottom2(t1))
  