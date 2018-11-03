# Bamazon

### Welcome to Bamazon

This homework combines Node and Javascript with MySQL and the database.

To experience this (_for-entertainment-purposes-only, no-animals-were-harmed-in-the-making, any-resemblance-to-reality-is-purely-coincidencidental_) virtual store, you will need to have node installed, and a database connection using MySQL. After you copy the code to your computer, open your Terminal/Bash and run __npm install__ to make sure you have the necessary packages, and start your MySQL connection. You'll need to run the bamazon.sql file to set up the database, and import the data from the included .csv file into the database to have something to work with. You can then run __node bamazonCustomer.js__ or __node bamazonManager.js__.

#### Here's what the commands do:
1. __node bamazonCustomer.js__ <br>
    This command opens the customer menu, allowing you to 'shop' in the Bamazon virtual store if you imported the data, you should see something like this:
    pic<br>
    Use the arrows to scroll, and press enter to select a type from the menu. Once you have selected a type, you will go through to the next menu to choose an item for purchase. This is the menu of Ingredients:
    pic<br>
    Once you choose an item, you will be asked how many you would like to purchase, like so:
    pic<br>
    If you try to purchase more than are available, you will get a message like so:
    pic<br>
    If you choose a number less than or equal to what is in stock, you will be asked to confirm, like this: 
    pic<br>
    If you choose not to buy the item, the transaction will be cancelled, and you will be asked if you would like to purchase another item, like this:
    pic<br>
    Yes will take you back to the first menu, and no will exit the program. 
    If you choose to buy the item, the transaction will be updated in the database.
    
2. __node bamazonManager.js__
    This command opens the manager menu, allowing you to check on and update the stock in the Bamazon virtual store. It will look something like this: 
    pic<br>
    After finishing any item on the menu, you will be asked if you would like to do something more. Choosing __No__ will exit the program, while choosing __Yes__ will take you back to the menu.<br>
    __Menu Items:__<br>
    a. "View Products for Sale"<br>
      This command will generate a table with information for all products in the database like so:
      pic<br>
    b. "View Low Inventory"<br>
      This command will generate a smaller table with only products with quantities less than 5, like so:
      pic<br>
    c. "Add to Inventory"<br>
      This command allows you to choose an item in the database and add more stock for that product.
      pic<br>
      After you enter your choices, you will receive a message with the new total in stock.
      pic<br>
    d. "Add New Product"<br>
      This command allows you to add a product that doesn't currently exist in the database. It will prompt you to choose a department from the list, and provide a name, price and quantity for the item. If you have entered the name of an item that already exists, you will be notified the item already exists, and it will not update in the database. If the item name is unique, the information you have entered will be updated in the database. After either outcome, you will have the option to quit or to return to the menu as usual.
