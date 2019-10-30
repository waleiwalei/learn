// 简单
// 分隔平衡字符串
// 在一个「平衡字符串」中，'L' 和 'R' 字符的数量是相同的。

// 给出一个平衡字符串 s，请你将它分割成尽可能多的平衡字符串。

// 返回可以通过分割得到的平衡字符串的最大数量。

// 示例 1：

// 输入：s = "RLRRLLRLRL"
// 输出：4
// 解释：s 可以分割为 "RL", "RRLL", "RL", "RL", 每个子字符串中都包含相同数量的 'L' 和 'R'。
// 示例 2：

// 输入：s = "RLLLLRRRLR"
// 输出：3
// 解释：s 可以分割为 "RL", "LLLRRR", "LR", 每个子字符串中都包含相同数量的 'L' 和 'R'。
// 示例 3：
// 输入：s = "LLLLRRRR"
// 输出：1
// 解释：s 只能保持原样 "LLLLRRRR".

/**
 * @param {string} s
 * @return {number}
 */
var balancedStringSplit = function(s) {
    let num = 0;
    let lenObj = {
        L: 0,
        R: 0
    }
    for(let index in s) {
        lenObj[s[index]] ++;
        if(lenObj.L && lenObj.L === lenObj.R) {
            num ++;
            lenObj.L = 0;
            lenObj.R = 0;
        } 
    }  
    return num;
};