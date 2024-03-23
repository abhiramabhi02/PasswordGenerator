const bcrypt = require('bcrypt')

const encrypt = async(password)=>{
    try {
        const hash = await bcrypt.hash(password,10)
        return hash
    } catch (error) {
        console.log(error);
    }
}

const decrypt = async(password, oPassword)=>{
    try {
        return bcrypt.compare(password,oPassword)
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    encrypt,
    decrypt
}