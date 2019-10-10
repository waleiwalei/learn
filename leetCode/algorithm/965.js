/* 简单 */
// 965 单值二叉树
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

 // 递归
// var isUnivalTree = function(root) {
//     function checkUnivalTree(root) {
//         // true递归出口
//         if(!root || root && !root.left && !root.right) {
//             return true;
//         }
//         // false递归出口:非单值二叉树
//         if(root.left && root.val != root.left.val || root.right && root.val != root.right.val) {
//             return false;
//         } else {
//             return checkUnivalTree(root && root.left) && checkUnivalTree(root && root.right);
//         }
//     }
//     return checkUnivalTree(root);
// };

// 简化 直接用根节点的值作为比较
function isUnivalTree(root) {
    var rootVal = root && root.val;
    function checkUnivalTree(root) {
        if(!root) return true;
        if(root.val != rootVal) return false;
        else return checkUnivalTree(root && root.left) && checkUnivalTree(root && root.right);
    }
    return checkUnivalTree(root);
}


// function TreeNode(val) {
//     this.val = val;
//     this.left = this.right = null;
// }

// let t1 = new TreeNode(2);
// let t2 = new TreeNode(2);
// let t3 = new TreeNode(5);
// t1.left = t2;
// t1.right = t3;
// console.log(isUnivalTree(t1));