const pool = require('../config/dbConfig');
const {
    handleCreateFolder,
    handleCopyFile,
    handleDeleteFolder,
    handleDeleteFile,
    ChangeToSlug,
} = require('./handleModel');

const News = {};
function DataFormat(data) {
    let results = [];
    data.forEach((item) => {
        let listImage = [];
        let listImageUrl = [];
        item.Image
            ? item.Image.split(',').forEach((image) => {
                  const fullPath = `news/${item.NewsId}/${image}`;
                  const fullPathUrl = `${process.env.HOSTNAME}/images/${fullPath}`;
                  listImage.push(fullPath);
                  listImageUrl.push(fullPathUrl);
              })
            : 'default_thumbnail.png';
        let createSlug = item.Title + ' ' + item.NewsId;
        let news = {
            news_id: item.NewsId,
            title: item.Title,
            slug: item.Title ? ChangeToSlug(createSlug) : null,
            meta_title: item.Title,
            description: item.Description,
            content: item.Content,
            author: item.Author,
            status: item.Status,
            image: item.Image ? listImage : 'default_thumbnail.png',
            thumbnail: item.Thumbnail ? `news/${item.NewsId}/${item.Thumbnail}` : 'default_thumbnail.png',
            created_at: item.CreatedAt,
            update_at: item.UpdateAt,
        };
        news.thumbnail_url = `${process.env.HOSTNAME}/images/${news.thumbnail}`;
        news.image_url = listImageUrl.length ? listImageUrl : `${process.env.HOSTNAME}/images/${news.image}`;
        results.push(news);
    });
    return results;
}
News.getNews = async (slugIn, callback) => {
    try {
        let [results] = await pool.query(
            `
                SELECT * FROM \`tb_news\`
            `,
        );
        if (slugIn) {
            const result = DataFormat(results).find(({ slug }) => slug === slugIn);
            if (result) {
                callback(true, `Get news information ${slugIn} successfully`, result);
            } else {
                callback(false, `Get news information ${slugIn} does not exist`);
            }
        } else {
            callback(true, 'Get news information successfully', DataFormat(results));
        }
    } catch (error) {
        console.log(error);
        callback(false, 'Get news information failed', error);
    }
};
News.getNewsById = async (id, callback) => {
    try {
        let [result] = await pool.query(
            `
                SELECT * FROM \`tb_news\`
                WHERE NewsId = ?
            `,
            [id],
        );

        if (result.length > 0) {
            callback(true, `Get news id information ${id} successfully`, DataFormat(result)[0]);
        } else {
            callback(false, `Get news id information ${id} does not exist`);
        }
    } catch (error) {
        callback(false, `Get news id information ${id} failed`, error);
    }
};

News.createNews = async (req, callback) => {
    let { thumbnail, detailed_image } = req.files;
    let { Title, Description, Content, Author, Status } = req.body;
    let Thumbnail = thumbnail ? thumbnail[0].filename : null;
    let Image = detailed_image ? detailed_image.map((image) => image.filename).toString() : null;
    Title = Title ? Title.trim() : null;
    Description = Description ? Description.trim() : null;
    Content = Content ? Content.trim() : null;
    Author = Author ? Author.trim() : null;
    Status = Status ? Status.trim() : null;
    try {
        let [result] = await pool.query(
            `
                INSERT INTO \`tb_news\` 
                    (
                        Title,
                        Description,
                        Content,
                        Author,
                        Image,
                        Thumbnail,
                        Status
                    ) 
                VALUES
                (?,?,?,?,?,?,?)
            `,
            [Title, Description, Content, Author, Image, Thumbnail, Status],
        );
        const folderName = `./src/public/images/news/${result.insertId}`;
        // Create Folder
        handleCreateFolder(folderName);
        // Copy file
        if (thumbnail) {
            handleCopyFile(thumbnail[0].path, `${folderName}/${thumbnail[0].filename}`);
        }
        // if (detailed_image) {
        //     detailed_image.forEach((image) => {
        //         handlerCopyFile(image.path, `${folderName}/${image.filename}`);
        //     });
        // }
        // Callback
        callback(true, `Create news information successfully`);
    } catch (error) {
        callback(false, `Create news information failed`, error);
    }
};

News.updateNews = async (req, callback) => {
    let { id } = req.params;
    let [result] = await pool.query(
        `
        SELECT * FROM \`tb_news\`
        WHERE NewsId =?
        `,
        [id],
    );
    let { thumbnail, detailed_image } = req.files;
    let { Title, Description, Content, Author, Status } = req.body;
    let Thumbnail = thumbnail ? thumbnail[0].filename : result[0].Thumbnail;
    let Image = detailed_image ? detailed_image.map((image) => image.filename).toString() : result[0].Image;
    Title = Title ? Title.trim() : null;
    Description = Description ? Description.trim() : null;
    Content = Content ? Content.trim() : null;
    Author = Author ? Author.trim() : null;
    Status = Status ? Status.trim() : null;
    if (detailed_image && result[0].Image) {
        result[0].Image.split(',').forEach((image) => {
            handlerDeleteFile(`./src/public/images/news/${id}/${image}`);
        });
    }
    if (thumbnail && result[0].Thumbnail) {
        handleDeleteFile(`./src/public/images/news/${id}/${result[0].Thumbnail}`);
    }
    if (result.length) {
        try {
            if (Thumbnail || Image) {
                await pool.query(
                    `
                    UPDATE \`tb_news\` SET 
                        Title = ?,
                        Description = ?,
                        Content = ?,
                        Author = ?,
                        Status = ?,
                        Image = ?,
                        Thumbnail =?
                    WHERE NewsId = ?
                    `,
                    [Title, Description, Content, Author, Status, Image, Thumbnail, id],
                );
                const folderName = `./src/public/images/news/${id}`;
                // Create Folder
                handleCreateFolder(folderName);
                // Copy file
                if (thumbnail) {
                    handleCopyFile(thumbnail[0].path, `${folderName}/${thumbnail[0].filename}`);
                }
                if (detailed_image) {
                    detailed_image.forEach((image) => {
                        handleCopyFile(image.path, `${folderName}/${image.filename}`);
                    });
                }
            } else {
                await pool.query(
                    `
                    UPDATE \`tb_news\` SET 
                        Title = ?,
                        Description = ?,
                        Content = ?,
                        Author = ?,
                        Status =?
                    WHERE NewsId = ?
                    `,
                    [Title, Description, Content, Author, Status, id],
                );
            }
            callback(true, `Update news information id ${id} successfully`);
        } catch (error) {
            callback(true, `Update news information id ${id} failed`, error);
        }
    } else {
        if (thumbnail) {
            handleDeleteFile(thumbnail[0].path);
        }
        if (detailed_image) {
            detailed_image.forEach((image) => {
                handleCopyFile(image.path);
            });
        }
        callback(false, `Update news information id ${id} does not exist`);
    }
};

News.deleteNews = async (id, callback) => {
    try {
        await pool.query(
            `
            DELETE FROM \`tb_news\`
            where NewsId = ?
            `,
            [id],
        );
        handleDeleteFolder(`./src/public/images/news/${id}`);
        callback(true, `Delete news id ${id} successfully`);
    } catch (error) {
        callback(false, `Delete news id ${id} failed`, error);
    }
};
module.exports = News;
