const fs = require('fs');

const handleCopyFile = (source, destination) => {
    if (fs.existsSync(source)) {
        fs.copyFile(source, destination, (err) => {
            if (err) {
                console.log('Error Found:', err);
            } else {
                handleDeleteFile(source);
            }
        });
    }
};
const handleDeleteFile = (source) => {
    if (fs.existsSync(source)) {
        fs.unlinkSync(source);
    }
};
const handleCreateFolder = (folderName) => {
    if (!fs.existsSync(folderName)) {
        fs.mkdirSync(folderName, { recursive: true });
    }
};
const handleDeleteFolder = (folderName) => {
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
function formatDatetime(date) {
    let dateOut = new Date(date);
    return dateOut.toISOString().slice(0, 19).replace('T', ' ');
}

module.exports = {
    handleCopyFile,
    handleDeleteFile,
    handleCreateFolder,
    handleDeleteFolder,
    ChangeToSlug,
    formatDatetime,
};
