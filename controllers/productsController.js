// Zaruratli modellar va utilitalarni import qilish
const Products = require("../models/Products");
const SaledProducts = require("../models/saledProducts");
const Party = require("../models/Party");
const Client = require("../models/Client");
const Users = require("../models/User");
const Dept = require("../models/Debt");
const pagination = require("../utils/pagination");
const generateId = require("../utils/generateId");
const bot = require("../bot");

// Barcha mahsulotlarni olish uchun nazorat funksiyasi
exports.getAll = async (req, res) => {
  try {
    req.query.filter = { saled: false, ...req.query.filter };
    const data = await pagination(Products, req.query, "products", "parties");
    return res.json(data);
  } catch (err) {
    // Xatolarni qaytarish
    return res.json(err);
  }
};

// Barcha unikal mahsulotlarni olish uchun nazorat funksiyasi
exports.getUniqueProducts = async (req, res) => {
  try {
    const data = await pagination(Products, req.query, "products", "parties");
    // Mahsulotlarni sanab, tartiblash
    data.data = data.data.sort((a, b) => a.createdAt - b.createdAt);
    // Unikal mahsulotlarni aniqlash
    data.data = [...new Set(data.data.map((p) => p.name))].map((name) =>
      data.data.find((p) => p.name === name)
    );
    // Ma'lumotlarni JSON ko'rinishida qaytarish
    res.json(data);
  } catch (err) {
    // Xatolarni qaytarish
    return res.json(err);
  }
};

// Mahsulotni ID boyicha topish uchun nazorat funksiyasi
exports.findById = async (req, res) => {
  try {
    // So'rov parametrlarini ajratib olish
    const { id } = req.params;
    // Mahsulotni topish
    const findProduct = await Products.findById(id).populate("parties");
    // Agar mahsulot topilmasa
    if (!findProduct) {
      return res.status(404).json({
        message: "Mahsulot topilmadi",
      });
    }
    // Ma'lumotlarni JSON ko'rinishida qaytarish
    return res.json({
      data: findProduct,
    });
  } catch (err) {
    // Xatolarni qaytarish
    return res.json(err);
  }
};

// Mahsulotlarni sotib olish uchun nazorat funksiyasi
exports.SaleProduct = async (req, res) => {
  try {
    // So'rovdan mahsulotlarni olish
    const { products } = req.body;
    const errors = [];
    const updatedProducts = [];
    const findClient = await Client.findById(req.body.client);

    // Har bir mahsulot uchun sotib olishni amalga oshirish
    for (let product of products) {
      const findProduct = await Products.findById(product.id);
      // Agar mahsulot topilmasa
      if (!findProduct) {
        errors.push(`ID si ${product.id} bo'lgan mahsulot topilmadi`);
        continue;
      }
      // Mahsulot miqdorini va narxini yangilash
      if (findProduct.amount > product.amount) {
        findProduct.saledAmount = product.amount;
        findProduct.amount = findProduct.amount - product.amount;
        findProduct.saledPrice = product.saledPrice;
        updatedProducts.push(findProduct);
      } else if (findProduct.amount == product.amount) {
        findProduct.saledAmount = product.amount;
        findProduct.amount = 0;
        findProduct.saledPrice = product.saledPrice;
        findProduct.saled = true;
        updatedProducts.push(findProduct);
      } else if (findProduct.amount < product.amount) {
        findProduct.saledAmount = product.amount;
        let amount = product.amount - findProduct.amount;
        findProduct.amount = 0;
        findProduct.saled = true;
        findProduct.saledPrice = product.saledPrice;
        updatedProducts.push(findProduct);
        for (let i = 0; i < products.length; i++) {
          let newProducts = await Products.find({ _id: { $nin: ids } });
          newProducts = [...new Set(newProducts.map((p) => p.name))].map(
            (name) => newProducts.find((p) => p.name === name)
          );
          const newFindProduct = newProducts.find(
            (e) => e.name === findProduct.name
          );
          if (newFindProduct) {
            if (newFindProduct.amount > amount) {
              newFindProduct.saledAmount = amount;
              newFindProduct.amount = newFindProduct.amount - amount;
              amount = 0;
              newFindProduct.saledPrice = product.saledPrice;
              updatedProducts.push(newFindProduct);
            } else if (newFindProduct.amount == amount) {
              newFindProduct.saledAmount = amount;
              newFindProduct.amount = 0;
              findProduct.saled = true;
              amount = 0;
              newFindProduct.saledPrice = product.saledPrice;
              updatedProducts.push(newFindProduct);
            } else if (newFindProduct.amount < amount) {
              newFindProduct.saledAmount = newFindProduct.amount;
              amount = amount - newFindProduct.amount;
              newFindProduct.amount = 0;
              newFindProduct.saled = true;
              amount = amount - newFindProduct.amount;
              ids.push(newFindProduct._id);
              newFindProduct.saledPrice = product.saledPrice;
              updatedProducts.push(newFindProduct);
            }
          } else {
            break;
          }
        }
      } else {
        errors.push(`Mahsulot ID si ${product.id} uchun yetarli miqdor yo'q`);
      }
    }

    // Agar xatolar bo'lsa
    if (errors.length > 0) {
      return res.status(500).json({
        message: "So'rovni bajarishda xatolik yuz berdi",
        errors: errors,
      });
    }

    // Sotib olingan mahsulotlar uchun yangilangan mahsulotlarni olish
    const saledProducts = await SaledProducts.find();
    const saledProduct = await SaledProducts.create({
      id: req.body.id ? req.body.id : generateId(saledProducts),
      client: req.body.client,
      warehouse: req.body.warehouse,
      invoiceDate: req.body.invoiceDate,
      comment: req.body.comment,
      user: req.headers.userId,
      products: updatedProducts,
    });

    // Agar borc mavjud bo'lsa
    if (req.body.dept) {
      if (findClient.balance >= req.body.totalSum) {
        findClient.balance = findClient.balance - req.body.totalSum;
        await findClient.save();
      } else if (findClient.balance < req.body.totalSum) {
        findClient.balance = 0;
        req.body.totalSum = req.body.totalSum - findClient.balance;
        await findClient.save();
        req.body.totalSum = req.body.paid
          ? req.body.totalSum - req.body.paid
          : req.body.totalSum;
        await Dept.create({
          sum: req.body.totalSum,
          saleds: saledProduct._id,
          clients: req.body.client,
        });
      }
    } else {
      // Agar yetarli mablag' bo'lmagan bo'lsa
      if (findClient.balance < req.body.totalSum) {
        return res.json({
          message: "Mijoz balansida yetarli mablag' yo'q",
        });
      }
      findClient.balance = findClient.balance - req.body.totalSum;
      await findClient.save();
    }

    // Yangilangan mahsulotlar uchun saqlash
    for (let updated of updatedProducts) {
      await updated.save();
    }

    // Partiyalarni olish va tekshirish
    const parties = await Party.find({ deleted: false, saled: false }).populate(
      {
        path: "products",
        match: { saled: false },
      }
    );

    for (let party of parties) {
      if (party.products.length === 0) {
        party.saled = true;
        await party.save();
      }
    }

    // Foydalanuvchi haqida ma'lumotlarni olish
    // const findUser = await Users.findById(req.headers.userId);
    // // Aktiv va o'chirilgan bot foydalanuvchilarni olish
    // const users = await Users.find({ bot: true, deleted: false, active: true });

    // // Barcha bot foydalanuvchilarga xabar yuborish
    // users.forEach((user) => {
    //   const messageText = `Sotib olingan mahsulotlar.\n id: ${saledProduct.id}\n foydalanuvchi: ${findUser.name} ${findUser.lastName}`;
    //   if (user.chatId) {
    //     bot.sendMessage(parseInt(user.chatId), messageText).catch((err) => {
    //     });
    //   }
    // });

    // Ma'lumotlarni JSON ko'rinishida qaytarish
    return res.status(200).json({
      message: "Mahsulotlar muvaffaqiyatli sotildi",
    });
  } catch (err) {
    // Xatolarni qaytarish
    return res.status(500).json({
      message: "Ichki server xatosi",
      error: err.message,
    });
  }
};

// Omborlardan omborga mahsulotlarni ko'chirish uchun nazorat funksiyasi
exports.transfer = async (req, res) => {
  try {
    // Mahsulotlar uchun bo'sh array
    const newProducts = [];
    // Har bir mahsulot uchun ko'chirishni amalga oshirish
    for (product of req.body.products) {
      const findProduct = await Products.findById(product.id);
      if (findProduct.amount == product.amount) {
        findProduct.warehouse = product.warehouse;
        const history = {
          warehouse: product.warehouse,
          createdAt: new Date(),
        };
        findProduct.history.push(history);
        findProduct.amount = 0;
        findProduct.transfer = product.amount;
        newProducts.push(findProduct);
      } else if (findProduct.amount > product.amount) {
        const history = {
          warehouse: product.warehouse,
          createdAt: new Date(),
        };
        findProduct.transfer = product.amount;
        findProduct.amount = findProduct.amount - product.amount;
        findProduct.history.push(history);
        findProduct.warehouse = product.warehouse;
        newProducts.push(findProduct);
      } else {
        // Agar mahsulot miqdori yetarli bo'lmasa
        return res.status(500).json({
          message: "Ko'chirish miqdori mahsulot miqdoridan ko'p",
        });
      }
    }

    // Yangi mahsulotlar uchun saqlash
    for (product of newProducts) {
      await product.save();
      const products = await Products.find();
      const { _id, ...productData } = product._doc;
      productData.id = generateId(products);
      productData.amount = product.transfer;
      await Products.create(productData);
    }

    // Ma'lumotlarni JSON ko'rinishida qaytarish
    return res.json({
      message: "Mahsulotlar muvaffaqiyatli ko'chirildi.",
    });
  } catch (err) {
    // Xatolarni qaytarish
    return res.json(err);
  }
};

// Mahsulotlarni o'chirish uchun nazorat funksiyasi
exports.destruction = async (req, res) => {
  try {
    // Mahsulotni topish
    const findProduct = await Products.findById(req.body.id);
    // Agar mahsulot topilmasa
    if (findProduct.amount == req.body.amount) {
      findProduct.deleted = true;
      findProduct.deletedAt = new Date();
      await findProduct.save();
    } else if (findProduct.amount > req.body.amount) {
      findProduct.amount -= req.body.amount;
      await findProduct.save();
    } else {
      // Agar mahsulot miqdori yetarli bo'lmasa
      return res.status(500).json({
        message: "Ko'chirish miqdori mahsulot miqdoridan ko'p",
      });
    }
    // Ma'lumotlarni JSON ko'rinishida qaytarish
    return res.json({
      message: "Mahsulotlar muvaffaqiyatli o'chirildi",
    });
  } catch (err) {
    // Xatolarni qaytarish
    return res.json(err);
  }
};
