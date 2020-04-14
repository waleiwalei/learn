// 简单
// 合并二叉树


// 给定两个二叉树，想象当你将它们中的一个覆盖到另一个上时，两个二叉树的一些节点便会重叠。

// 你需要将他们合并为一个新的二叉树。合并的规则是如果两个节点重叠，那么将他们的值相加作为节点合并后的新值，否则不为 NULL 的节点将直接作为新二叉树的节点。

// 示例 1:

// 输入: 
// 	Tree 1                     Tree 2                  
//           1                         2                             
//          / \                       / \                            
//         3   2                     1   3                        
//        /                           \   \                      
//       5                             4   7                  
// 输出: 
// 合并后的树:
// 	     3
// 	    / \
// 	   4   5
// 	  / \   \ 
// 	 5   4   7

/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */
/**
 * @param {TreeNode} t1
 * @param {TreeNode} t2
 * @return {TreeNode}
 */
/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */
/**
 * @param {TreeNode} t1
 * @param {TreeNode} t2
 * @return {TreeNode}
 */
// 递归
var mergeTrees = function(t1, t2) {
    if(!t1&&!t2)return null;
    t1 = t1 || {};
    t2 = t2 || {};
    let TN = new TreeNode((t1.val || 0) + (t2.val || 0));
    if(t1.left || t2.left) {
        TN.left = mergeTrees(t1.left, t2.left);
    }
    if(t1.right || t2.right) {
        TN.right = mergeTrees(t1.right, t2.right);
    }
    return TN;
};

// 非递归要把t2合并到t1,如果某时刻!t1&&t2则要创建一个新节点顶上去 哭撩