const multer = require('multer');
const path = require('path');
const sharp = require('sharp')
const fs = require('fs')
const { v4: uuidv4 } = require('uuid');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, uuidv4() + path.extname(file.originalname));
  }
});

const uploadMiddleware = multer({ storage: storage }).array('image', 5);
const outputPath = `${process.cwd()}/uploads/`

const uploadFile = (req, res, next) => {
  uploadMiddleware(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      console.log(req.files);
      console.log(err);
      return res.status(400).json({ message: 'File upload error' });
    } else if (err) {
      return res.status(500).json({ message: 'Internal server error' });
    }
    const { format = 'webp' } = req.query;
    const files = []
    const image = {}
    let convertedImageBuffer;
    switch (format.toLowerCase()) {
      case 'jpg':
      case 'jpeg':
        for(let i = 0; i < req.files.length; i++) {
          const filename = `${Date.now()}_${i}.jpeg`;
          convertedImageBuffer = await sharp(req.files[i].path).jpeg().toBuffer();
          fs.writeFileSync(`${outputPath}${filename}`, convertedImageBuffer);
          image.large = `${process.env.URL}${filename}`
          const medium = `${Date.now()}_${i}.jpeg`;
          convertedImageBuffer = await sharp(req.files[i].path).resize(600, 600, { fit: sharp.fit.inside, withoutEnlargement: true }).jpeg().toBuffer()
          fs.writeFileSync(`${outputPath}${medium}`, convertedImageBuffer);
          image.medium = `${process.env.URL}${medium}`
          const small = `${Date.now()}_${i}.jpeg`;
          convertedImageBuffer = await sharp(req.files[i].path).resize(300, 300, { fit: sharp.fit.inside, withoutEnlargement: true }).jpeg().toBuffer()
          fs.writeFileSync(`${outputPath}${small}`, convertedImageBuffer);
          image.small = `${process.env.URL}${small}`
          files.push(image)
          req.images = files;
          fs.unlinkSync(`${process.cwd()}/${req.files[i].path}`);
        }
        break;
      case 'png':
        for(let i = 0; i < req.files.length; i++) {
          const filename = `${Date.now()}_${i}.png`;
          convertedImageBuffer = await sharp(req.files[i].path).png().toBuffer();
          fs.writeFileSync(`${outputPath}${filename}`, convertedImageBuffer);
          image.large = `${process.env.URL}${filename}`
          const medium = `${Date.now()}_${i}.png`;
          convertedImageBuffer = await sharp(req.files[i].path).resize(600, 600, { fit: sharp.fit.inside, withoutEnlargement: true }).png().toBuffer()
          fs.writeFileSync(`${outputPath}${medium}`, convertedImageBuffer);
          image.medium = `${process.env.URL}${medium}`
          const small = `${Date.now()}_${i}.png`;
          convertedImageBuffer = await sharp(req.files[i].path).resize(300, 300, { fit: sharp.fit.inside, withoutEnlargement: true }).png().toBuffer()
          fs.writeFileSync(`${outputPath}${small}`, convertedImageBuffer);
          image.small = `${process.env.URL}${small}`
          files.push(image)
          req.images = files;
          fs.unlinkSync(`${process.cwd()}/${req.files[i].path}`);
        }
        break;
      case 'webp':
        for(let i = 0; i < req.files.length; i++) {
          const filename = `${Date.now()}_${i}.webp`;
          convertedImageBuffer = await sharp(req.files[i].path).webp().toBuffer();
          fs.writeFileSync(`${outputPath}${filename}`, convertedImageBuffer);
          image.large = `${process.env.URL}${filename}`
          const medium = `${Date.now()}_${i}.webp`;
          convertedImageBuffer = await sharp(req.files[i].path).resize(600, 600, { fit: sharp.fit.inside, withoutEnlargement: true }).webp().toBuffer()
          fs.writeFileSync(`${outputPath}${medium}`, convertedImageBuffer);
          image.medium = `${process.env.URL}${medium}`
          const small = `${Date.now()}_${i}.webp`;
          convertedImageBuffer = await sharp(req.files[i].path).resize(300, 300, { fit: sharp.fit.inside, withoutEnlargement: true }).webp().toBuffer()
          fs.writeFileSync(`${outputPath}${small}`, convertedImageBuffer);
          image.small = `${process.env.URL}${small}`
          files.push(image)
          req.images = files;
          fs.unlinkSync(`${process.cwd()}/${req.files[i].path}`);
        }
        break;
      default:
        return res.status(400).json({ error: 'Unsupported format' });
    }
    next();
  });
};

module.exports = uploadFile;
