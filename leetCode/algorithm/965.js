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
var isUnivalTree = function(root) {
    function checkUnivalTree(root) {
        // true递归出口
        if(!root || root && !root.left && !root.right) {
            return true;
        }
        // false递归出口:非单值二叉树
        if(root.left && root.val != root.left.val || root.right && root.val != root.right.val) {
            return false;
        } else {
            return checkUnivalTree(root && root.left) && checkUnivalTree(root && root.right);
        }
    }
    return checkUnivalTree(root);
};

// 深度优先遍历
var isUnivalTree = function(root) {}
// 广度优先遍历
var isUnivalTree = function(root) {}