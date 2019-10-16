/** 
 * 深度优先遍历二叉树
*/
function Treen(val) {
    this.val = val;
    this.left = this.right = null;
}
/**
 *  递归调用
 */
// function DFS(root) {
//     let nodeList = [];
//     function traverse(root) {
//         if(root) {
//             nodeList.push(root.val);
//             traverse(root.left);
//             traverse(root.right);
//         } else {
//             nodeList.push(null);
//         }
//     }
//     traverse(root);
//     // 去掉末尾null值
//     if(nodeList.length) {
//         for(let i = nodeList.length - 1; i >= 0 && !nodeList[i]; i --) {
//             nodeList.pop(nodeList[i]);
//         }
//     }
//     return nodeList;
// }

/** 
 * 非递归调用
 * 数组模拟堆栈
 */
// TODO:
function DFS(root) {
    let stack = [];
    function traverse(root) {
        if(!root) {
            return null;
        }
        stack.push(root.left, root.right, root.val);
        let popData = stack.pop();
        if(typeof popData != 'number' || popData != undefined) {
            traverse(popData);
        }
    }
    if(root) {
        traverse(root);
    }
    return stack;
}

// test
let n1 = new Treen(1);
let n2 = new Treen(2);
let n3 = new Treen(3);
// n1.left = n2;
n1.left = null;
n1.right = n3;
console.log(DFS(n1));