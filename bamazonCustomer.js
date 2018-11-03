var inquirer = require("inquirer")
var mysql = require("mysql");
var colors = require("colors");

var connection = mysql.createConnection({
  host: "localhost",

  port: 3306,

  user: "root",

  password: "",

  database: "bamazonDB"
});

connection.connect(function(err) {
  if (err) throw err;
  readDepartments();
});

// VARIABLES: 
var itemName = "";
var purchaseQuantity = 0;
var stockQuantity = 0;
var price = 0;
// FUNCTIONS: 
// Database Functions:
function readDepartments() {
  connection.query("SELECT DISTINCT department_name FROM items ", function(err, res) {
    var departments = ["Search All Departments"]
    if (err) throw err;
    for (i = 0; i < res.length; i++) {
      departments.push(res[i]['department_name']);
    }
    promptDepartments(departments);
  });
}
function readItems(whereclause) {
  // get product names for prompt list
  connection.query("SELECT product_name FROM items " + whereclause, function(err, res) {
    if (err) throw err;
    var itemsList = [];
    for (i = 0; i < res.length; i++) {
      itemsList.push(res[i]['product_name']);
    }
    // feed list into prompt function
    promptItem(itemsList);
  });
}
function readPriceQuantity(name) {
  connection.query('SELECT stock_quantity, price FROM bamazonDB.items WHERE product_name = "' + name + '"', function(err, res) {
    if (err) throw err;
    stockQuantity = res[0]['stock_quantity'];
    price = res[0]['price'];
  });
  promptNumber();
}
function updateQuantity(item, quantity) {
  var newquantity = stockQuantity - quantity
  connection.query('UPDATE bamazonDB.items SET stock_quantity = "' + newquantity + '" WHERE product_name = "' + item + '"', function(err, res) {
    if (err) throw err;
  });
}

// Prompt Functions
function promptDepartments(depArr) {
  inquirer.prompt([
    {
      type: 'list',
      name: 'departments',
      message: 'What type of item are you looking for? ', 
      choices: depArr
    }
  ]).then(function(input) {
    depart = input.departments
    if (depart === "Search All Departments") {
      var where = ""
      readItems(where);
    }
    else {
      var where = "WHERE department_name = '" + depart + "' AND stock_quantity > 0"
      readItems(where);
    }
  })
}
function promptItem(list) {
  inquirer.prompt([
    {
      type: 'list',
      name: 'item',
      message: 'Please select the item you would like to purchase: ', 
      choices: list
    }
  ]).then(function(input) {
    itemName = input.item
    readPriceQuantity(itemName);
  })
}
function promptNumber() {
  inquirer.prompt([
    {
      type: 'input',
      name: 'pquantity',
      message: 'How many would you like to purchase? ',
      validate: function (input) {
        if (!isNaN(parseInt(input))) {
          return true
        }
        else {
          return false
        }
      }
    }
  ]).then(function(res) {
    purchaseQuantity = parseInt(res.pquantity);
    if (purchaseQuantity > stockQuantity) {
      console.log("Insufficient quantity, only ", stockQuantity, " in stock.")
      promptNumber();
    }
    else {
      promptConfirmPurchase(purchaseQuantity, itemName);
    }
  })
}
function promptConfirmPurchase(pquantity, item) {
  inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirmPurchase',
      message: 'Please confirm your choice -- item: ' + colors.green(item) + ' quantity: ' + colors.green(pquantity) + "\n This will cost " + colors.yellow(price * pquantity) + " magic beans. ", 
      default: true
    }
  ]).then(function(input) {
    if (input.confirmPurchase) {
      console.log(colors.rainbow("Thank you for your purchase! "));
      updateQuantity(item, pquantity);
    }
    else {
      console.log("I'm sorry. ")
    }
    promptConfirmStartOver();
  });
}
function promptConfirmStartOver() {
  inquirer.prompt([
    {
      type: 'confirm',
      name: 'startOver',
      message: 'Would you like to purchase another item? ', 
      default: false
    }
  ]).then(function(input) {
    if (input.startOver) {
      readDepartments();
    }
    else {
    console.log(colors.rainbow('Have a wonderful day!'));
    connection.end();
    }
  });
}
