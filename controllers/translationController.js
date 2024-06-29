const Translations = require("../models/Translation.js");

exports.getAll = async (req, res) => {
  try {
    const translations = await Translations.find();
    return res.json({
      data: translations.map((translation) => ({
        id: translation._id,
        message: translation.message,
        uz: translation.uz ? translation.uz : null,
        ru: translation.ru ? translation.ru : null,
        en: translation.en ? translation.en : null,
        kr: translation.kr ? translation.kr : null,
      })),
    });
  } catch (err) {
    return res.json(err);
  }
};

exports.findByLang = async (req, res) => {
  try {
    const { lang } = req.params;
    const translations = await Translations.find();
    const obj = {};
    const result = [];
    translations.forEach((translation) => {
      obj[translation.message] = translation[lang] || null;
    });
    result.push(obj);
    return res.json(result[0]);
  } catch (err) {
    return res.json(err);
  }
};

exports.search = async (req, res) => {
  try {
    const { message } = req.params;
    const regex = new RegExp(message, "i");

    const translations = await Translations.find({
      $or: [
        { uz: { $regex: regex } },
        { ru: { $regex: regex } },
        { en: { $regex: regex } },
        { kr: { $regex: regex } }
      ]
    });

    return res.json({
      data: translations.map((translation) => ({
        id: translation._id,
        message: translation.message,
        uz: translation.uz ? translation.uz : null,
        ru: translation.ru ? translation.ru : null,
        en: translation.en ? translation.en : null,
        kr: translation.kr ? translation.kr : null,
      }))
    });
  } catch (err) {
    return res.json(err);
  }
};

exports.create = async (req, res) => {
  try {
    const { lang } = req.params;
    const message = Object.values(req.body)[0];
    const text = Object.values(req.body)[1];
    const findMessage = await Translations.findOne({
      message: message,
    });
    if (!findMessage) {
      const createdTranslation = new Translations({
        message: message,
      });
      createdTranslation[lang] = text;
      await createdTranslation.save();
      return res.json(createdTranslation);
    } else {
      if(!findMessage[lang]) {
        findMessage[lang] = text;
      }
      await findMessage.save();
      return res.json(findMessage);
    }
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { lang, translation } = req.body;
    const { id } = req.params;
    const findTranslation = await Translations.findById(id);
    if (!findTranslation) {
      return res.json("Translation not found");
    }
    findTranslation[lang] = translation;
    await findTranslation.save();
    res.json(findTranslation);
  } catch (err) {
    console.log(err);
    return res.json(err);
  }
};