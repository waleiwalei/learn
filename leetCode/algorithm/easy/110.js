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
function getHeight(root) {
    let queue = [];
    if(!root) return 0;
    let height = 0;
    queue.push(root);
    while(queue.length) {
        let size = queue.length;
        while(size--) {
            let curr = queue.shift();
            let {left, right} = curr;
            left && queue.push(left);
            right && queue.push(right);
        }
        height ++;
    }
    return height;
}
var isBalanced = function(root) {
    if(!root) return true;
    return isBalanced(root.left) && isBalanced(root.right) && 
        Math.abs(getHeight(root.left) - getHeight(root.right)) < 2; 
};

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
var getHeight = function(root) {
    if(!root) return 0;
    return Math.max(getHeight(root.left), getHeight(root.right)) + 1;
}
var isBalanced = function(root) {
    return isBalanced(root.left) && isBalanced(root.right) && 
        Math.abs(getHeight(root.left) - getHeight(root.right)) <= 1
};