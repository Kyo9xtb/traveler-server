const pool = require('../config/dbConfig');
const {
    handelrCreateFolder,
    handlerCopyFile,
    handelrDeleteFolder,
    handlerDeleteFile,
    ChangeToSlug,
} = require('./handlerModel');

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
        let news = {
            news_id: item.NewsId,
            title: item.Title,
            slug: item.Title ? ChangeToSlug(item.Title) : null,
            meta_title: item.Title,
            gender: item.Gender,
            description: item.Description,
            content: item.Content,
            author: item.Author,
            image: item.Image ? listImage : 'default_thumbnail.png',
            thumbnail: item.Thumbnail ? `news/${item.NewsId}/${item.Thumbnail}` : 'default_thumbnail.png',
            create_at: item.CreateAt,
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
// News.getNewsById = async (id, callback) => {
//     try {
//         // let [result] = await pool.query(
//         //     `
//         //         SELECT * FROM \`tb_news\`
//         //         WHERE NewsId = ?
//         //     `,
//         //     [id],
//         // );
//         let [results] = await pool.query(
//             `
//                 SELECT * FROM \`tb_news\`
//             `,
//         );
//         // console.log(DataFormat(results));

//         const result = DataFormat(results).find(({ slug }) => slug === id);
//         console.log(result);

//         if (result) {
//             callback(true, `Get news id information ${id} successfully`, result);
//         } else {
//             callback(false, `Get news id information ${id} does not exist`);
//         }
//     } catch (error) {
//         callback(false, `Get news id information ${id} failed`, error);
//     }
// };

News.createNews = async (req, callback) => {
    let { thumbnail, detailed_image } = req.files;
    let { Title, Description, Content, Author } = req.body;
    let Thumbnail = thumbnail ? thumbnail[0].filename : null;
    let Image = detailed_image ? detailed_image.map((image) => image.filename).toString() : null;
    Title = Title ? Title.trim() : null;
    Description = Description ? Description.trim() : null;
    Content = Content ? Content.trim() : null;
    Author = Author ? Author.trim() : null;
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
                        Thumbnail
                    ) 
                VALUES
                (?,?,?,?,?,?)
            `,
            [Title, Description, Content, Author, Image, Thumbnail],
        );
        const folderName = `./src/public/images/news/${result.insertId}`;
        // Create Folder
        handelrCreateFolder(folderName);
        // Copy file
        if (thumbnail) {
            handlerCopyFile(thumbnail[0].path, `${folderName}/${thumbnail[0].filename}`);
        }
        if (detailed_image) {
            detailed_image.forEach((image) => {
                handlerCopyFile(image.path, `${folderName}/${image.filename}`);
            });
        }
        // Callback
        callback(true, `Create news information successfully`);
    } catch (error) {
        callback(false, `Create news information failed`, error);
    }
};

News.updateNews = async (req, callback) => {
    let { id } = req.params;
    let { thumbnail, detailed_image } = req.files;
    let { Title, Description, Content, Author } = req.body;
    let Thumbnail = thumbnail ? thumbnail[0].filename : null;
    let Image = detailed_image ? detailed_image.map((image) => image.filename).toString() : null;
    Title = Title ? Title.trim() : null;
    Description = Description ? Description.trim() : null;
    Content = Content ? Content.trim() : null;
    Author = Author ? Author.trim() : null;
    let [result] = await pool.query(
        `
        SELECT * FROM \`tb_news\`
        WHERE NewsId =?
        `,
        [id],
    );
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
                        Image = ?,
                        Thumbnail =?
                    WHERE NewsId = ?
                    `,
                    [Title, Description, Content, Author, Image, Thumbnail, id],
                );
                const folderName = `./src/public/images/news/${id}`;
                // Create Folder
                handelrCreateFolder(folderName);
                // Copy file
                if (thumbnail) {
                    handlerCopyFile(thumbnail[0].path, `${folderName}/${thumbnail[0].filename}`);
                }
                if (detailed_image) {
                    detailed_image.forEach((image) => {
                        handlerCopyFile(image.path, `${folderName}/${image.filename}`);
                    });
                }
            } else {
                await pool.query(
                    `
                    UPDATE \`tb_news\` SET 
                        Title = ?,
                        Description = ?,
                        Content = ?,
                        Author = ?
                    WHERE NewsId = ?
                    `,
                    [Title, Description, Content, Author, id],
                );
            }
            callback(true, `Update news information id ${id} successfully`);
        } catch (error) {
            callback(true, `Update news information id ${id} failed`, error);
        }
    } else {
        if (thumbnail) {
            handlerDeleteFile(thumbnail[0].path);
        }
        if (detailed_image) {
            detailed_image.forEach((image) => {
                handlerCopyFile(image.path);
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
        handelrDeleteFolder(`./src/public/images/news/${id}`);
        callback(true, `Delete news id ${id} successfully`);
    } catch (error) {
        callback(false, `Delete news id ${id} failed`, error);
    }
};
module.exports = News;
