// 翻转一棵二叉树。

// 示例：

// 输入：

//      4
//    /   \
//   2     7
//  / \   / \
// 1   3 6   9
// 输出：

//      4
//    /   \
//   7     2
//  / \   / \
// 9   6 3   1
// 备注:
// 这个问题是受到 Max Howell 的 原问题 启发的 ：

// 谷歌：我们90％的工程师使用您编写的软件(Homebrew)，但是您却无法在面试时在白板上写出翻转二叉树这道题，这太糟糕了。


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
function Tree(val, left, right) {
    this.val = val;
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
/**
 * @param {TreeNode} root
 * @return {TreeNode}
 */
var invertTree = function(root) {
    if(!root) return null;
    let temp = root.left;
    root.left = root.right;
    root.right = temp;
    invertTree(root.left);
    invertTree(root.right);
    return root;
};
console.log(invertTree());