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

const ChangeToSlug = (path) => {
    const slug = path
        .trim()
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a')
        .replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e')
        .replace(/ì|í|ị|ỉ|ĩ/g, 'i')
        .replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o')
        .replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u')
        .replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y')
        .replace(/đ/g, 'd')
        .replace(/\`|\~|\!|\@|\#|\||\$|\%|\^|\&|\*|\(|\)|\+|\=|\,|\.|\/|\?|\>|\<|\'|\"|\:|\;|_/gi, '')
        .replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, '') // Huyền sắc hỏi ngã nặng
        .replace(/\u02C6|\u0306|\u031B/g, '') // Â, Ê, Ă, Ơ, Ư
        .replace(/\-+/gi, '-')
        .replace(/[^\w\s-]/g, '')
        .replace(/^-+|-+$/g, '');
    return slug;
};
module.exports = { handlerCopyFile, handlerDeleteFile, handelrCreateFolder, handelrDeleteFolder, ChangeToSlug };
