//引入bcrypt模块
var bcrypt = require('bcrypt');

//随机生成salt值
let salt = bcrypt.genSaltSync(10);

//获取hash值
const encryptedPassword = bcrypt.hashSync("swordfish", salt);   //10是saltRound
console.log(encryptedPassword);
const otherPass = bcrypt.hashSync("i", 10);
console.log(otherPass);

//比较hash值
console.log(bcrypt.compareSync("blach", encryptedPassword));
console.log(bcrypt.compareSync("i", otherPass));

// POST /sign up
//-----------------------------------------------------------




// POST/ sign in