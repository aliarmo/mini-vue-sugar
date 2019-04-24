let fs = require('fs')
module.exports = {
    exit() {
        process.exit(-1)
    },
    fileExistsSync(path) {
        try {
            fs.accessSync(path, fs.F_OK);
        } catch (e) {
            return false;
        }
        return true;
    }
}
