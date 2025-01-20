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
        const [results] = await pool.query(
            `
                SELECT * FROM \`tb_news\`
            `,
        );
        if (slugIn) {
            const result = DataFormat(results).find(({ slug }) => slug === slugIn);
            if (result) {
                return callback(true, `Get news information ${slugIn} successfully`, result);
            } else {
                return callback(false, `Get news information ${slugIn} does not exist`);
            }
        } else {
            return callback(true, 'Get news information successfully', DataFormat(results));
        }
    } catch (error) {
        console.error('Error getting news in news model:', error);
        return callback(
            false,
            `Get news information failed. A server-side problem occurred. Please come back later.`,
            error,
        );
    }
};
News.getNewsById = async (id, callback) => {
    try {
        const [result] = await pool.query(
            `
                SELECT * FROM \`tb_news\`
                WHERE NewsId = ?
            `,
            [id],
        );
        if (result.length > 0) {
            return callback(true, `Get news id information ${id} successfully`, DataFormat(result)[0]);
        } else {
            return callback(false, `Get news id information ${id} does not exist`);
        }
    } catch (error) {
        console.error('Error getting news bt id in news model:', error);
        return callback(
            false,
            `Get news id information ${id} failed. A server-side problem occurred. Please come back later.`,
            error,
        );
    }
};

News.createNews = async (req, callback) => {
    let Thumbnail;
    let Image;
    if (req.files) {
        const { thumbnail, detailed_image } = req.files;
        Thumbnail = thumbnail ? thumbnail[0].filename : null;
        Image = detailed_image ? detailed_image.map((image) => image.filename).toString() : null;
    }
    let { title, description, content, author, status } = req.body;
    title = title ? title.trim() : null;
    description = description ? description.trim() : null;
    content = content ? content.trim() : null;
    author = author ? author.trim() : null;
    status = status ? status.trim() : null;
    try {
        const [result] = await pool.query(
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
            [title, description, content, author, Image, Thumbnail, status],
        );
        if (result.affectedRows > 0) {
            const folderName = `./src/public/images/news/${result.insertId}`;
            // Create Folder
            handleCreateFolder(folderName);
            // Copy file
            if (req.files) {
                const { thumbnail, detailed_image } = req.files;
                if (thumbnail) {
                    handleCopyFile(thumbnail[0].path, `${folderName}/${thumbnail[0].filename}`);
                }
                if (detailed_image) {
                    detailed_image.forEach((image) => {
                        handleCopyFile(image.path, `${folderName}/${image.filename}`);
                    });
                }
            }
            // Callback
            return callback(true, `Create news information successfully`);
        } else {
            return callback(false, `Create news information failed`);
        }
    } catch (error) {
        console.error('Error creating news in news model:', error);
        return callback(
            false,
            `Create news information failed. A server-side problem occurred. Please come back later.`,
            error,
        );
    }
};

News.updateNews = async (req, callback) => {
    const { id } = req.params;

    try {
        const [result] = await pool.query('SELECT * FROM `tb_news` WHERE NewsId = ?', [id]);

        if (result.length === 0) {
            if (req.files && req.files.thumbnail) {
                handleDeleteFile(req.files.thumbnail[0].path);
            }
            if (req.files && req.files.detailed_image) {
                req.files.detailed_image.forEach((image) => {
                    handleDeleteFile(image.path);
                });
            }
            return callback(false, `Update news information id ${id} does not exist`);
        }

        let { Title, Description, Content, Author, Status, Thumbnail, Image } = result[0];
        if (req.files) {
            const { thumbnail, detailed_image } = req.files;
            Thumbnail = thumbnail ? thumbnail[0].filename : Thumbnail;
            Image = detailed_image ? detailed_image.map((image) => image.filename).join(',') : Image;

            if (detailed_image && result[0].Image) {
                result[0].Image.split(',').forEach((image) => {
                    handleDeleteFile(`./src/public/images/news/${id}/${image}`);
                });
            }
            if (thumbnail && result[0].Thumbnail) {
                handleDeleteFile(`./src/public/images/news/${id}/${result[0].Thumbnail}`);
            }
        }

        let { title, description, content, author, status } = req.body;
        title = title ? title.trim() : Title;
        description = description ? description.trim() : Description;
        content = content ? content.trim() : Content;
        author = author ? author.trim() : Author;
        status = status ? status.trim() : Status;

        const [resultUpdate] = await pool.query(
            `
            UPDATE \`tb_news\` SET 
                Title = ?,
                Description = ?,
                Content = ?,
                Author = ?,
                Status = ?,
                Image = ?,
                Thumbnail = ?
            WHERE NewsId = ?
            `,
            [title, description, content, author, status, Image, Thumbnail, id],
        );
        if (resultUpdate.affectedRows > 0) {
            const folderName = `./src/public/images/news/${id}`;
            handleCreateFolder(folderName);

            if (req.files) {
                const { thumbnail, detailed_image } = req.files;
                if (thumbnail) {
                    handleCopyFile(thumbnail[0].path, `${folderName}/${thumbnail[0].filename}`);
                }
                if (detailed_image) {
                    detailed_image.forEach((image) => {
                        handleCopyFile(image.path, `${folderName}/${image.filename}`);
                    });
                }
            }
            return callback(true, `Update news information id ${id} successfully`);
        } else {
            return callback(false, `Update news information id ${id} failed`);
        }
    } catch (error) {
        console.error('Error updating news in news model:', error);
        return callback(
            false,
            `Update news information id ${id} failed. A server-side problem occurred. Please come back later.`,
            error,
        );
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
        return callback(true, `Delete news id ${id} successfully`);
    } catch (error) {
        console.error('Error deleting news in news model:', error);
        return callback(
            false,
            `Delete news id ${id} failed. A server-side problem occurred. Please come back later.`,
            error,
        );
    }
};
module.exports = News;
