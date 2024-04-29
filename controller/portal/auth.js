const banner = require("../../model/banner");
const categories = require("../../model/categories");
const product = require("../../model/product");
const subcategories = require("../../model/subcategories");

// methods for category

function create_category(req, res) {
  var req_body = req.body;

  categories
    .aggregate([{ $group: { _id: null, max_index: { $max: "$index" } } }])
    .then((data1) => {
      var new_index = 1;
      if (data1.length == 0) {
        new_index = 1;
      } else {
        new_index = data1[0].max_index + 1;
      }
      const obj = categories({
        name: req_body.name,
        index: new_index,
      });
      obj
        .save()
        .then(() => {
          res.status(200).json({ message: "Success" });
        })
        .catch((error) => {
          res.status(500).json({
            error: error,
          });
        });
    })
    .catch((error) => {
      res.status(500).json({
        error: error,
      });
    });
}

function update_category(req, res) {
  var req_body = req.body;

  categories
    .findOneAndUpdate(
      { name: req_body.name },
      { $set: { name: req_body.new_name } }
    )
    .then((data) => {
      if (data == null) {
        res.status(404).json({ message: "Category does not exists" });
      } else {
        res.status(200).json({ message: "Success" });
      }
    })
    .catch((error) => {
      res.status(500).json({
        error: error,
      });
    });
}

function delete_category(req, res) {
  categories
    .findOneAndDelete({ _id: req.query.category_id })
    .then((data) => {
      if (data == null) {
        res.status(404).json({ message: "Category does not exists" });
      } else {
        res.status(200).json({ message: "Success" });
      }
    })
    .catch((error) => {
      res.status(500).json({
        error: error,
      });
    });
}

function fetch_category(req, res) {
  categories
    .find({})
    .then((data) => {
      res.status(200).json({ message: "Success", categories: data });
    })
    .catch((error) => {
      res.status(500).json({
        error: error,
      });
    });
}

//   method for sub-category

function create_sub_category(req, res) {
  var req_body = req.body;

  subcategories
    .aggregate([{ $group: { _id: null, max_index: { $max: "$index" } } }])
    .then((data1) => {
      var new_index = 1;
      if (data1.length == 0) {
        new_index = 1;
      } else {
        new_index = data1[0].max_index + 1;
      }
      const obj = subcategories({
        name: req_body.name,
        category: req_body.category,
        index: new_index,
      });
      obj
        .save()
        .then(() => {
          res.status(200).json({ message: "Success" });
        })
        .catch((error) => {
          res.status(500).json({
            error: error,
          });
        });
    })
    .catch((error) => {
      res.status(500).json({
        error: error,
      });
    });
}

function update_sub_category(req, res) {
  var req_body = req.body;

  subcategories
    .findOneAndUpdate(
      { _id: req_body.sub_category_id },
      { $set: { name: req_body.name } }
    )
    .then((data) => {
      if (data == null) {
        res.status(404).json({ message: "Sub-Category does not exists" });
      } else {
        res.status(200).json({ message: "Success" });
      }
    })
    .catch((error) => {
      res.status(500).json({
        error: error,
      });
    });
}

function delete_sub_category(req, res) {
  console.log(req.query.sub_category_id);
  subcategories
    .findOneAndDelete({ _id: req.query.sub_category_id })
    .then((data) => {
      if (data == null) {
        res.status(404).json({ message: "Sub-Category does not exists" });
      } else {
        res.status(200).json({ message: "Success" });
      }
    })
    .catch((error) => {
      res.status(500).json({
        error: error,
      });
    });
}

function fetch_sub_category(req, res) {
  console.log(req.query.category);
  subcategories
    .find({ category: req.query.category })
    .then((data) => {
      console.log(data);
      res.status(200).json({ message: "Success", sub_categories: data });
    })
    .catch((error) => {
      res.status(500).json({
        error: error,
      });
    });
}

// method for product

function create_product(req, res) {
  var req_body = req.body;

  product
    .aggregate([{ $group: { _id: null, max_index: { $max: "$index" } } }])
    .then((data1) => {
      var new_index = 1;
      if (data1.length == 0) {
        new_index = 1;
      } else {
        new_index = data1[0].max_index + 1;
      }
      const obj = product({
        name: req_body.name,
        sub_category: req_body.sub_category, 
        category: req_body.category,
        image: req_body.image,
        description: req_body.description,
        rating: req_body.rating,
        price: req_body.price,
        out_of_stock: req_body.out_of_stock,
        featured: req_body.featured,
        index: new_index,
      });
      obj
        .save()
        .then(() => {
          res.status(200).json({ message: "Success" });
        })
        .catch((error) => {
          res.status(500).json({
            error: error,
          });
        });
    })
    .catch((error) => {
      res.status(500).json({
        error: error,
      });
    });
}

function update_product(req, res) {
  var req_body = req.body;

  product
    .findOneAndUpdate(
      { _id: req_body.product_id },
      {
        $set: {
          name: req_body.name,
          sub_category: req_body.sub_category,
          category: req_body.category,
          image: req_body.image,
          description: req_body.description,
          rating: req_body.rating,
          out_of_stock: req_body.out_of_stock,
          featured: req_body.featured,
          price: req_body.price,
        },
      }
    )
    .then((data) => {
      if (data == null) {
        res.status(404).json({ message: "Product does not exists" });
      } else {
        res.status(200).json({ message: "Success" });
      }
    })
    .catch((error) => {
      res.status(500).json({
        error: error,
      });
    });
}

function delete_product(req, res) {
  console.log("delete product" + req.query.product_id);
  product
    .findOneAndDelete({ _id: req.query.product_id })
    .then((data) => {
      if (data == null) {
        res.status(404).json({ message: "Product does not exists" });
      } else {
        res.status(200).json({ message: "Success" });
      }
    })
    .catch((error) => {
      res.status(500).json({
        error: error,
      });
    });
}

function fetch_product(req, res) {
  product
    .find({ sub_category: req.query.subcategory })
    .then((data) => {
      res.status(200).json({ message: "Success", products: data });
    })
    .catch((error) => {
      res.status(500).json({
        error: error,
      });
    });
}

// methods for banners

function delete_banner(req, res) {
  {
    banner
      .findOneAndDelete({ _id: req.query.banner_id })
      .then((data1) => {
        res.status(200).json({ message: "Success" });
      })
      .catch((error) => {
        res.status(500).json({
          error: error,
        });
      });
  }
}

function create_banner(req, res) {
  var req_body = req.body;

  banner
    .aggregate([{ $group: { _id: null, max_index: { $max: "$index" } } }])
    .then((data1) => {
      var new_index = 1;
      if (data1.length == 0) {
        new_index = 1;
      } else {
        new_index = data1[0].max_index + 1;
      }
      const obj = banner({
        image: req_body.image,
        index: new_index,
      });
      obj
        .save()
        .then(() => {
          res.status(200).json({ message: "Success" });
        })
        .catch((error) => {
          res.status(500).json({
            error: error,
          });
        });
    })
    .catch((error) => {
      res.status(500).json({
        error: error,
      });
    });
}

function update_banner(req, res) {
  var req_body = req.body;

  banner
    .findOneAndUpdate(
      { _id: req_body.banner_id },
      { $set: { image: req_body.banner_image } }
    )
    .then((data) => {
      if (data == null) {
        res.status(404).json({ message: "Banner not found" });
      } else {
        res.status(200).json({ message: "Success" });
      }
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
}

function fetch_banner(req, res) {
  banner
    .find({})
    .then((data) => {
      res.status(200).json({ message: "Success", banners: data });
    })
    .catch((error) => {
      res.status(500).json({
        error: error,
      });
    });
}

module.exports = {
  delete_category,
  create_category,
  update_category,
  fetch_category,
  //
  delete_sub_category,
  create_sub_category,
  update_sub_category,
  fetch_sub_category,
  //
  delete_product,
  create_product,
  update_product,
  fetch_product,
  //
  delete_banner,
  create_banner,
  update_banner,
  fetch_banner,
};
