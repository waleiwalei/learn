// 给定一棵二叉树，想象自己站在它的右侧，按照从顶部到底部的顺序，返回从右侧所能看到的节点值。

// 示例:

// 输入: [1,2,3,null,5,null,4]
// 输出: [1, 3, 4]
// 解释:

//    1            <---
//  /   \
// 2     3         <---
//  \     \
//   5     4       <---

/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */
/**
 * @param {TreeNode} root
 * @return {number[]}
 */
var rightSideView = function(root) {
    if(!root) return [];
    let queue = [], res = [];
    queue.push(root);
    while(queue.length) {
        let size = queue.length;
        while(size) {
            let cur = queue.shift();
            if(size == 1) res.push(cur.val);
            let {left, right} = cur;
            left && queue.push(left);
            right && queue.push(right);
            size --;
        }
    }

    return res;
};


// var rightSideView = function(root) {
//     if(!root) return []
//     let arr = []
//     dfs(root, 0, arr)
//     return arr
//   };
//   function dfs (root, step, res) {
//     if(root){
//       if(res.length === step){
//         res.push(root.val)           // 当数组长度等于当前 深度 时, 把当前的值加入数组
//       }
//       // console.log(step, '-------', res)
//       dfs(root.right, step + 1, res) // 先从右边开始, 当右边没了, 再轮到左边
//       dfs(root.left, step + 1, res)
//     }
//   }



function rightSideView(root) {
    if(!root) return [];
    let res = [];

    function dfs(root, num, res) {
        if(root) {
            if(res.length === num) {
                res.push(root.val);
            }
            dfs(root.right, num + 1, res);
            dfs(root.left, num + 1, res);
        }
    }

    dfs(root, 0, res);
    return res;

}