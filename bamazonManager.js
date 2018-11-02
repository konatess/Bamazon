var inquirer = require("inquirer")
var mysql = require("mysql");

var connection = mysql.createConnection({
  host: "localhost",

  port: 3306,

  user: "root",

  password: "",

  database: "bamazonDB"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId + "\n");
  promptMenu();
});
// VARIABLES: 
var lowLimit = 5;
// FUNCTIONS:
// Database Functions:
function readItems() {
    // get all product info for display
    connection.query("SELECT * FROM items", function(err, res) {
        if (err) throw err
        console.table(res)
        promptAgain();
    });
}
function readLow() {
    // get low items for display
    connection.query("SELECT product_name, stock_quantity FROM items WHERE stock_quantity < " + lowLimit, function(err, res) {
        if (err) throw err
        console.table(res)
        promptAgain();
    });
}
function readItemsList() {
    // get product names for prompt list
    connection.query("SELECT product_name FROM items ", function(err, res) {
      if (err) throw err;
      var itemsList = [];
      for (i = 0; i < res.length; i++) {
        itemsList.push(res[i]['product_name']);
      }
      // feed list into prompt function
      promptAddInv(itemsList);
    });
}
function updateQuantity(item, addQuantity) {
    var baseQuantity = 0
    connection.query("SELECT stock_quantity FROM items WHERE product_name = " + item, function(err, res) {
        if (err) throw err
        baseQuantity = res[i]['stock_quantity'];
    });
    var newQuantity = baseQuantity + addQuantity;
    connection.query('UPDATE bamazonDB.items SET stock_quantity = "' + newQuantity + '" WHERE product_name = "' + item + '"', function(err, res) {
        if (err) throw err;
    });
}
function addProduct() {

}


// Prompt Functions:
function promptMenu() {
    inquirer.prompt([
        {
            type: 'list',
            name: 'menu',
            message: 'What would you like to do? ', 
            choices: [
                "View Products for Sale",
                "View Low Inventory",
                "Add to Inventory",
                "Add New Product"
            ]
        }
      ]).then(function(input) {
        var choice = input.menu;
        console.log(choice);
        if (choice === "View Products for Sale") {
            readItems();
        } else if (choice === "View Low Inventory") {
            readLow();
        } else if (choice === "Add to Inventory") {
            readItemsList();
        } else if (choice === "Add New Product") {
            promptAddProd();
        }
      })
}
function promptAddInv(list) {
    inquirer.prompt([
        {
            type: 'list',
            name: 'item',
            message: 'Please select the item you would like to purchase for stock: ', 
            choices: list
        },
        {
            type: 'input',
            name: 'quantity',
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
    ]).then(function(input) {
        itemName = input.item
        addQuantity = input.quantity
        console.log("item: ", itemName, " quantity ", addQuantity)
        updateQuantity(itemName, addQuantity);
    })
};
function promptAddProd() {};
function promptAgain() {};