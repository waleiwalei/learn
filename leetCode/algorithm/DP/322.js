// 给定不同面额的硬币 coins 和一个总金额 amount。编写一个函数来计算可以凑成总金额所需的最少的硬币个数。如果没有任何一种硬币组合能组成总金额，返回 -1。

//  

// 示例 1:

// 输入: coins = [1, 2, 5], amount = 11
// 输出: 3 
// 解释: 11 = 5 + 5 + 1
// 示例 2:

// 输入: coins = [2], amount = 3
// 输出: -1
//  

// 说明:
// 你可以认为每种硬币的数量是无限的。


/**
 * @param {number[]} coins
 * @param {number} amount
 * @return {number}
 */

var coinChange = function(coins, amount) {
    let res = [0];
    function _coinChange(amount) {
        if(!amount) return 0;
        if(amount < 0) return Infinity;
        if(res[amount]) return res[amount];
        for(let i = 1; i <= amount; i ++) {
            let arr = [];
            for(let j = 0; j < coins.length; j++) {
                arr.push(_coinChange(i-coins[j]) + 1);
            }
            res[i] = Math.min(...arr);
        }
    }
    _coinChange(amount);
    return res[amount] == Infinity ? -1 : res[amount];
};
// 优化 节省空间时间
// --->
/**
 * @param {number[]} coins
 * @param {number} amount
 * @return {number}
 */
var coinChange = function(coins, amount) {
    let dp = new Array(amount + 1);
    dp[0] = 0;
    for(let j = 1; j <= amount; j ++) {
        dp[j] = Infinity;
        for(let i = 0; i < coins.length; i ++) {
            // 注意减去后下标要大于等于0 && js中好像没问题 其他语言可能有Infinity+1越界的问题
            if(j - coins[i] >= 0 && dp[j - coins[i]] !== Infinity) {
                dp[j] = Math.min(dp[j - coins[i]] + 1, dp[j]);
            }
        }
    }
    return dp[amount] === Infinity ? -1 : dp[amount];
};



