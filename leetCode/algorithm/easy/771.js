
// 简单
// 宝石与石头

/* 给定字符串J 代表石头中宝石的类型，和字符串 S代表你拥有的石头。 S 中每个字符代表了一种你拥有的石头的类型，你想知道你拥有的石头中有多少是宝石。
J 中的字母不重复，J 和 S中的所有字符都是字母。字母区分大小写，因此"a"和"A"是不同类型的石头。

示例 1:
输入: J = "aA", S = "aAAbbbb"
输出: 3

示例 2:
输入: J = "z", S = "ZZ"
输出: 0
注意:
S 和 J 最多含有50个字母。 J 中的字符不重复。 */

/**
 * @param {string} J
 * @param {string} S
 * @return {number}
 */
// var numJewelsInStones = function(J, S) {
//     let numRet = 0;
//     J = J.split('');
//     S = S.split('');
//     let numObj = {};
//     S.forEach((item, i) => {
//         numObj[item] ? numObj[item] ++ : numObj[item] = 1
//     });
//     J.forEach((item ,i) => {
//         numRet += (numObj[item] ? numObj[item] : 0)
//     });
//     return numRet;
// };

// 这里将字符串转成数组就很慢,没有直接使用for循环来得快,换成split+forEach大概要慢30ms
var numJewelsInStones = function(J, S) {
    let numRet = 0;
    let JObj = {};
    for(let i = 0; i < J.length; i ++) {
        JObj[J[i]] = 1;
    }
    for(let i = 0; i < S.length; i ++) {
        JObj[S[i]] && numRet ++
    }
    return numRet;
}

// 正则方式,没法直接把字符串当做正则中[xxx]里的值匹配列表,用for循环代替了
// var numJewelsInStones = function (J, S) {
//     let newS = S;
//     for(let i = 0; i < J.length; i ++) {
//         let regExp = new RegExp(J[i], 'g');
//         newS = S.replace(regExp, '');
//     }
//     return S.length - newS.length;
// }

// 两层循环,用filter+includes
// var numJewelsInStones = function(J, S) {
//     let jarr = J.split("");
//     let sarr = S.split("");
//     return sarr.filter(item=>jarr.includes(item)).length
// };

let J = "aA", S = "aAAbbbb";
console.log(numJewelsInStones(J, S));