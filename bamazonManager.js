var inquirer = require("inquirer")
var mysql = require("mysql");
var Table = require("cli-table3");
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
  promptMenu();
});
// VARIABLES: 
var lowLimit = 5;
// FUNCTIONS:
// Database Functions:
function readItems() {
    // get all product info for display
    connection.query("SELECT * FROM items", function(err, res) {
        if (err) throw err;
        var table = new Table({head:[colors.green('ID'), colors.green('Product'), colors.green('Department'), colors.green('Price'), colors.green('Quantity')]})
        for (i = 0; i < res.length; i++) {
            var row  = [];
            row.push(colors.blue(res[i]['id']));
            row.push(res[i]['product_name']);
            row.push(res[i]['department_name']);
            row.push(colors.magenta(res[i]['price']));
            row.push(colors.yellow(res[i]['stock_quantity']));
            table.push(row);
        }
        console.log(table.toString());
        promptAgain();
    });
}
function readLow() {
    // get low items for display
    connection.query("SELECT product_name, stock_quantity FROM items WHERE stock_quantity < " + lowLimit, function(err, res) {
        if (err) throw err;
        var table = new Table({head:[colors.green('Product'), colors.green('Quantity')], style:{head:[]}})
        for (i = 0; i < res.length; i++) {
            var row  = [];
            row.push(res[i]['product_name']);
            row.push(colors.yellow(res[i]['stock_quantity']));
            table.push(row);
        }
        console.log(table.toString());
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
function readDep() {
    // get department list for prompt list
    connection.query("SELECT DISTINCT department_name FROM items ", function(err, res) {
        var departments = []
        if (err) throw err;
        for (i = 0; i < res.length; i++) {
          departments.push(res[i]['department_name'])
        }
        // feed departments list into prompt function
        promptAddProd(departments);
      });
}
function readBaseQ(item, addQuantity) {
    // read the the stock quantity of the item being increased
    connection.query('SELECT stock_quantity FROM items WHERE product_name = "' + item + '"', function(err, res) {
        if (err) throw err;
        var baseQuantity = res[0]['stock_quantity'];
        // new quantity is the old stock quantity, plus the quantity to be added
        var newQuantity = parseInt(baseQuantity) + parseInt(addQuantity);
        // call update quantity and feed in item name and new quantity
        updateQuantity(item, newQuantity)
    });
}
function updateQuantity(item, newQuantity) {
    // update quantity of item in the database
    connection.query('UPDATE bamazonDB.items SET stock_quantity = "' + newQuantity + '" WHERE product_name = "' + item + '"', function(err, res) {
        if (err) throw err
        else {
            console.log("You now have ", newQuantity, " of ", item, " in stock.")
        }
        promptAgain();
    });
}
function checkProduct(name, department, price, quantity){
    connection.query('SELECT * FROM bamazonDB.items WHERE product_name = "' + name + '"', function(err, res) {
        if (err) throw err
        if (res[0] == undefined) {
            addProduct(name, department, price, quantity);
        }
        else {
            console.log(colors.red('\nItem already exists'));
            promptAgain();
        }
    })
}
function addProduct(name, department, price, quantity) {
    // add completely new product to the inventory
    connection.query('INSERT INTO bamazonDB.items (product_name, department_name, price, stock_quantity) VALUES ("' + name + '", "' + department + '", "' +  price + '", "' + quantity + '")', function(err, res) {
        if (err) throw err;
        else {
            console.log("The item has been added. ")
        }
        promptAgain();
    });
}


// Prompt Functions:
function promptMenu() {
    // prompt base menu of actions
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
        if (choice === "View Products for Sale") {
            readItems();
        } else if (choice === "View Low Inventory") {
            readLow();
        } else if (choice === "Add to Inventory") {
            readItemsList();
        } else if (choice === "Add New Product") {
            readDep();
        }
      })
}
function promptAddInv(list) {
    // gather info for adding inventory to a known product
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
        addQuantity = parseInt(input.quantity)
        readBaseQ(itemName, addQuantity);
    })
};
function promptAddProd(dep) {
    // gather info for adding a completely new product
    inquirer.prompt([
        {
            type: 'list',
            name: 'department',
            message: 'Please select department of the item you would like to add: ', 
            choices: dep
        },
        {
            type: 'input',
            name: 'name',
            message: 'Please enter the name of the item: ',
            validate: function (input) {
                if (input.length < 5) {
                    console.log("\nItem name must be at least 5 characters")
                    return false
                }
                else {
                    return true
                }
            }
        },
        {
            type: 'input',
            name: 'price',
            message: 'Please enter the customer price for this item : ',
            validate: function (input) {
                if (!isNaN(parseFloat(input))) {
                    return true
                }
                else {
                    console.log('\nThat is not a valid number. Please try again. ')
                    return false
                }
            }
        },
        {
            type: 'input',
            name: 'quantity',
            message: 'Please enter the number of items you would like to add to your stock: ',
            validate: function (input) {
                if (!isNaN(parseInt(input))) {
                    return true
                }
                else {
                    console.log('\nThat is not a valid number. Please try again. ')
                    return false
                }
            }
        }
    ]).then(function(input) {
        itemName = input.name.trim();
        addQuantity = input.quantity;
        var depart = input.department;
        var price = input.price;
        // pass info to add product database function
        checkProduct(itemName, depart, price, addQuantity);
    })
};
function promptAgain() {
    // confirm if go to menu or exit
    inquirer.prompt([
        {
          type: 'confirm',
          name: 'again',
          message: 'Would you like to do something more? ', 
          default: false
        }
      ]).then(function(input) {
        if (input.again) {
          promptMenu();
        }
        else {
        console.log(colors.rainbow('Have a nice day!'));
        connection.end();
        }
      });
};