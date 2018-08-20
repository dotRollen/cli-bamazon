const mysql = require("mysql2");
const inquirer = require("inquirer");
const pool = mysql.createPool({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'root',
  socketPath: '/Applications/MAMP/tmp/mysql/mysql.sock',
  database: 'bamazon',
  connectionLimit: 10,
  queueLimit: 0
});

let products = [];
let departments = [];
let columns = [
    'product_name',
    'department_name',
    'price',
    'stock_quantity'
];

let choicesPrompt = {
  name: "choice",
  type: "list",
  message: "What would you like to do?",
  choices: [
      "View Products for Sale",
      "View Low Inventory",
      "Add to Inventory",
      "Add New Product"
  ]
};

let restockPrompt = {
    name: "product",
    type: "list",
    message: "What would you like to add more to?",
    choices: products
};

let addMorePrompt = {
    name: "restock",
    type: "input",
    message: "How much would you like to add?"
};

let newItemPrompt = [
    {
        name: "department",
        type: "list",
        message: "What department is this product for?",
        choices: departments
    },
    {
        name: "name",
        type: "input",
        message: "What is the name of the new product?"
    },
    {
        name: "price",
        type: "input",
        message: "What is the price of the new product?"
    },
    {
        name: "stock",
        type: "input",
        message: "How much would you like to have in stock?"
    }
];

let allProducts = "SELECT * FROM products;";
let allDepartments = "SELECT * FROM departments;";
let addQuantity = "UPDATE products SET stock_quantity = stock_quantity + ? WHERE product_name = ?;";
let newProduct = "INSERT INTO products (" + columns.join(", ") + ") VALUES (?, ?, ?, ?);";


const returnQuery = function(query, callback) {
    pool.query(query, function(err, results){
        if (err) throw err; // If query fails
        return callback(results);
    });
};  

const addNewProduct = function () {
    returnQuery(allDepartments, function(results){
        for (let i = 0; i < results.length; i++) {
            departments.push(results[i].department_name);
        }

        inquirer.prompt(newItemPrompt).then(function(answer) {
            pool.query(
                newProduct, 
                [
                    answer.name,
                    answer.department,
                    parseFloat(answer.price),
                    parseFloat(answer.stock)
                ], 
                function(err, results) {
                    if (err) throw err;
                    console.log(answer.name + " has been added to the store!");
                    process.exit();
            });
            
        });
    });
};

const addToInventory = function(product) {
    inquirer.prompt(addMorePrompt).then(function(answer) {
        let amount = answer.restock;
        pool.query(addQuantity, [amount, product], function(err, results) {
            if (err) throw err;
            console.log("We have added " + amount + " more " + product);
            process.exit();
        });
    });
};

const viewLowInventory = function(){
    pool.query(allProducts, function(err, results){
        if (err) throw err;
        console.log(
            "Current low stocked items" +
            "\n-----------------------------------------"
        );
        for ( let i = 0; i < results.length; i++){
            if(results[i].stock_quantity <= 5) {
                console.log(
                    "\nProduct: " + results[i].product_name +
                    "\nDepartment: " + results[i].department_name +
                    "\nPrice: " + results[i].price +
                    "\nIn Stock: " + results[i].stock_quantity +
                    "\n-----------------------------------------"
                )
            }
        }
        process.exit();
    });
};

const viewProductsForSale = function() {
    pool.query(allProducts, function(err, results){
        if (err) throw err;
        console.log(
            "All products for sale" +
            "\n-----------------------------------------"
        );
        for ( let i = 0; i < results.length; i++){
            console.log(
                "\nProduct: " + results[i].product_name +
                "\nDepartment: " + results[i].department_name +
                "\nPrice: " + results[i].price +
                "\nIn Stock: " + results[i].stock_quantity +
                "\n-----------------------------------------"
            )
        }
        process.exit();
    });
};

(function(){
  inquirer.prompt(choicesPrompt).then(function(answer) {
    let choice = answer.choice;

    switch(choice) {
        case "View Products for Sale":
            viewProductsForSale();
            break;
        case "View Low Inventory":
            viewLowInventory();
            break;
        case "Add to Inventory":
            returnQuery(allProducts, function(results){
                for (let i = 0; i < results.length; i++) {
                products.push(results[i].product_name);
                }
            
                inquirer.prompt(restockPrompt).then(function(answer) {
                addToInventory(answer.product);
                })
            });
            break;
        case "Add New Product":
            addNewProduct();
            break;
        default:
            console.log("Nothing to do...");
    };
  });
})();
