const fs = require('fs');

const handlerCopyFile = (source, destination) => {
    fs.copyFile(source, destination, (err) => {
        if (err) {
            console.log('Error Found:', err);
        } else {
            handlerDeleteFile(source);
        }
    });
};
const handlerDeleteFile = (source) => {
    if (fs.existsSync(source)) {
        fs.unlinkSync(source);
    }
};
const handelrCreateFolder = (folderName) => {
    if (!fs.existsSync(folderName)) {
        fs.mkdirSync(folderName, { recursive: true });
    }
};
const handelrDeleteFolder = (folderName) => {
    if (fs.existsSync(folderName)) {
        fs.rmSync(folderName, { recursive: true, force: true });
    }
};
module.exports = { handlerCopyFile, handlerDeleteFile, handelrCreateFolder, handelrDeleteFolder };
