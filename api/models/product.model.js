const sql = require("./db.js");

const Product = function (product) {
  this.title = product.title;
  this.id_category = product.id_category;
  this.description = product.description;
  this.img = product.img;
  this.price = product.price;
  this.createdat = product.createdat;
};

Product.create = (newProduct, result) => {
  sql.query("INSERT INTO products SET ?", newProduct, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created product", { ...newProduct });
    result(null, { ...newProduct });
  });
};

Product.findById = (id, result) => {
  sql.query("SELECT * FROM products WHERE id_product = ?", id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found product", res[0]);
      result(null, res[0]);
      return;
    }

    result({ kind: "not_found" }, null);
  });
};

Product.findAllCategories = (result) => {
  sql.query("SELECT * FROM categories", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log(`found products categories`, res);
      result(null, res);
      return;
    }

    result({ kind: "not_found" }, null);
  });
};

Product.findAllByCategory = (category, result) => {
  console.log(category);
  const mainCondition = category.main_category
    ? `categories.main_category = '${category.main_category}'`
    : "";
  const subCondition = category.submain_category
    ? ` AND categories.submain_category = '${category.submain_category}'`
    : "";
  sql.query(
    `SELECT products.* from products, categories WHERE products.id_category = categories.id_category AND ${mainCondition} ${subCondition}`,
    (err, res) => {
      if (err) {
        console.log("Error: ", err);
        result(err, null);
        return;
      }

      if (res.length) {
        console.log(`found products by category `, res);
        result(null, res);
        return;
      }

      result({ kind: "not_found" }, null);
    }
  );
};

Product.getAll = (result) => {
  sql.query("SELECT * FROM products", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("products: ", res);
    result(null, res);
  });
};

Product.updateById = (id, product, result) => {
  sql.query(
    "UPDATE products SET title = ? , description = ? ,  img = ? , size = ? , price = ? WHERE id_product = ?",
    [
      product.title,
      product.description,
      product.img,
      product.size,
      product.price,
      id,
    ],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }

      if (res.affectedRows === 0) {
        result({ kind: "not_found" }, null);
        return;
      }

      console.log("updated product: ", { id, ...product });
      result(null, { id, ...product });
    }
  );
};

Product.remove = (id, result) => {
  sql.query("DELETE FROM products WHERE id_product = ?", id, (err, res) => {
    if (err) {
      console.log("error; ", err);
      return;
    }

    if (res.affectedRows === 0) {
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("deleted product with id", id);
    result(null, res);
  });
};

Product.removeAll = (result) => {
  sql.query("DELETE FROM products", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log(`deleted ${res.affectedRrows} products`);
    result(null, res);
  });
};

module.exports = Product;
