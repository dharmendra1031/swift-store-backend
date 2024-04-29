require("dotenv/config");
var path = require("path");
const banner = require("../../model/banner");
const subcategories = require("../../model/subcategories");
const product = require("../../model/product");
var jwt = require("jsonwebtoken");
const user = require("../../model/user");
var fs = require("fs");
var path = require("path");
const private_key = fs.readFileSync(
  path.join(__dirname, "../../keys/private.key"),
  "utf8"
);

async function generate_token(user_id) {
  return new Promise((resolve, reject) => {
    var payload = {
      user_id: user_id,
    };

    var sign_options = {
      issuer: process.env.ISSUER,
      subject: process.env.SUBJECT,
      audience: process.env.AUDIENCE,
      expiresIn: process.env.EXPIRESIN,
      algorithm: process.env.ALGORITHM,
    };

    jwt.sign(payload, private_key, sign_options, function (err, token) {
      if (err)
        reject({ status: 403, response: { error: "Failed generating token" } });
      else resolve(token);
    });
  });
}

async function create_users(input){
    return new Promise((resolve, reject)=>{
        print("Creating users...");
        const obj = new user(input);
       reject({
            status: 200,
            response: {
             token: "token"
            },
          });
    });
}

async function create_user(input) {
  console.log("Create user first line");
  return new Promise((resolve, reject) => {
    const obj = new user(input);
    console.log("Create user second line line");
    obj
      .save()
      .then((data2) => {
        generate_token(data2._id)
          .then((token) => {
            resolve({
              status: 200,
              response: {
                token: token,
                user_id: data2._id,
              },
            });
          })
          .catch((error) => {
            console.log("reject");
            reject({
              status: 500,
              response: { error: error },
            });
          });
      })
      .catch((error) => {
        console.log("reject");
        reject({
          status: 500,
          response: { error: error },
        });
      });
  });
}

function signup(req, res) {
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  var req_body = req.body;

  if (req_body.email != null) {
    user
      .findOne({ email: req_body.email })
      .then((data1) => {
        if (data1 == null) {
          if (req_body.thirdparty == "FACEBOOK") {
            console.log("yha tak chal rha"+req_body.thirdparty);
            create_user({
              country_code: null,
              phone_number: null,
              email: req_body.email,
              email_verified: true,
              phone_number_verified: false,
              thirdparty_verificaton: true,
              thirdparty: req_body.thirdparty,
            //   referrer: refer_obj.user_id,
            //   referral_code: referral_code,
              referral_points: 0,
              first_name: req_body.first_name,
              last_name: req_body.last_name,
              cash_on_delivery: true,
              password: null,
              country: req_body.country,
            })
              .then((data) => {
                console.log(data);
                res.status(200).json(data.response);
              })
              .catch((error) => {
                console.log("mai `" + error.message);
                res.status(error.status).json(error.response);
              });
              console.log("Success");
          } else {

            create_user({
              country_code: null,
              phone_number: null,
              email: req_body.email,
              email_verified: false,
              phone_number_verified: false,
              thirdparty_verificaton: false,
              thirdparty: null,
            //   referrer: refer_obj.user_id,
            //   referral_code: referral_code,
              referral_points: 0,
              first_name: req_body.first_name,
              last_name: req_body.last_name,
              password: req_body.password,
              country: req_body.country,
            })
              .then((data) => {
                res.status(200).json(data.response);
              })
              .catch((error) => {
                res.status(error.status).json(error.response);
              });
          }
        } else {
          res.status(400).json({
            message: "Email already registered",
          });
        }
      })
      .catch((error) => {
        res.status(500).json({
          error: error,
        });
      });
  } else {
    if (req_body.country_code == null || req_body.phone_number == null) {
      res.status(400).json({
        message: "Email and Phone Number both cannot be null",
      });
    } else {
      user
        .findOne({
          country_code: req_body.country_code,
          phone_number: req_body.phone_number,
        })
        .then((data1) => {
          if (data1 == null) {
            create_user({
              country_code: req_body.country_code,
              phone_number: req_body.phone_number,
              email: null,
              email_verified: false,
              phone_number_verified: true,
            //   referrer: refer_obj.user_id,
            //   referral_code: referral_code,
              referral_points: 0,
              first_name: req_body.first_name,
              last_name: req_body.last_name,
              password: null,
              country: req_body.country,
            })
              .then((data) => {
                res.status(200).json(data.response);
              })
              .catch((error) => {
                console.log(error);
                res.status(error.status).json(error.response);
              });
          } else {
            res.status(400).json({
              message: "Phone Number already registered",
            });
          }
        })
        .catch((error) => {
          res.status(500).json({
            error: error,
          });
        });
    }
  }
}

function login(req, res) {
  var req_body = req.body;

  if (req_body.email != null) {
    user
      .findOne({ email: req_body.email })
      .then((data1) => {
        if (data1 == null) {
          res.status(400).json({
            message: "Email is not registered",
          });
        } else {
          if (req_body.thirdparty == "FACEBOOK") {
            if (data1.thirdparty != null) {
              generate_token(data1._id)
                .then((token) => {
                  res.status(200).json({
                    token: token,
                    user_id: data1._id,
                  });
                })
                .catch((error) => {
                  res.status(error.status).json(error.response);
                });
            } else {
              res.status(400).json({
                message: "Please login with email and password.",
              });
            }
          } else {
            if (data1.password == req_body.password) {
              generate_token(data1._id)
                .then((token) => {
                  res.status(200).json({
                    token: token,
                    user_id: data1._id,
                  });
                })
                .catch((error) => {
                  res.status(error.status).json(error.response);
                });
            } else {
              res.status(400).json({
                message: "Entered password is incorrect",
              });
            }
          }
        }
      })
      .catch((error) => {
        res.status(500).json({
          error: error,
        });
      });
  } else {
    if (req_body.country_code == null || req_body.phone_number == null) {
      res.status(400).json({
        message: "Email and Phone Number both cannot be null",
      });
    } else {
      user
        .findOne({
          country_code: req_body.country_code,
          phone_number: req_body.phone_number,
        })
        .then((data1) => {
          if (data1 == null) {
            res.status(400).json({
              message: "Phone Number is not registered",
            });
          } else {
            generate_token(data1._id)
              .then((token) => {
                res.status(200).json({
                  token: token,
                  user_id: data1._id,
                });
              })
              .catch((error) => {
                res.status(error.status).json(error.response);
              });
          }
        })
        .catch((error) => {
          res.status(500).json({
            error: error,
          });
        });
    }
  }
}

function fetch_file(req, res) {
  console.log(
    "Fetching file " +
      path.join(
        __dirname + process.env.READ_STORAGE_PATH + "/" + req.params.file
      )
  );
  res.sendFile(
    path.join(__dirname + process.env.READ_STORAGE_PATH + "/" + req.params.file)
  );
}

function fetch_banner(req, res) {
  banner
    .find({})
    .then((data) => {
      res.status(200).json({ message: "Success", banner: data });
    })
    .catch((error) => {
      res.status(500).json({
        error: error,
      });
    });
}

function fetch_products(req, res) {
  console.log("Fetching products " + req.query.category);
  product
    .find({ category: req.query.category })
    .then((data) => {
      res.status(200).json({ message: "Success", products: data });
    })
    .catch((error) => {
      res.status(500).json({
        error: error,
      });
    });
}

function fetch_sub_category(req, res) {
  subcategories
    .find({ category: req.query.category })
    .then((data) => {
      res.status(200).json({ message: "Success", sub_categories: data });
    })
    .catch((error) => {
      res.status(500).json({
        error: error,
      });
    });
}

module.exports = {
  signup,
  login,
  fetch_file,
  fetch_banner,
  fetch_products,
  fetch_sub_category,
};
