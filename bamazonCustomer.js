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

let promptOne = {
  name: "product",
  type: "list",
  message: "What would you like to buy?",
  choices: products
}

let promptTwo = {
  name: "purchase",
  type: "input",
  message: "how many would you like to buy??"
}

let allProducts = "SELECT * FROM products";
let findProduct = "SELECT * FROM products WHERE product_name = ?"
let updateQuantity = "UPDATE products SET stock_quantity = stock_quantity - ? WHERE product_name = ?"
let updateTotalSales = "UPDATE products SET product_sales = product_sales + ? WHERE product_name = ?"


const returnQuery = function(query, callback) {
  pool.query(query, function(err, results){
      if (err) throw err; // If query fails
      return callback(results);
  });
};

const updateSales = function(receipt) {
  pool.getConnection(function(err, conn) {
    if (err) throw err;
    conn.query(updateTotalSales, [receipt.totalCost, receipt.product], function(err, results){
      if(err) throw err;
      console.log("Total product sales has been updated.");
      process.exit();
    })
  })
}

const printInvoice = function(receipt) {
  pool.getConnection(function(err, conn) {
    if (err) throw err;
    conn.query(findProduct, receipt.product, function(err, results) {
      if (err) throw err;
      receipt.inStock = results[0].stock_quantity;
      receipt.totalCost = (results[0].price * receipt.purchaseAmount)
      console.log(
        "Thank you for your purchase! Here is your receipt." +
        "\n-------------------------------------------------" +
        "\nItem: " + receipt.product +
        "\nRetail Price: " + results[0].price + 
        "\nTotal Purchased: " + receipt.purchaseAmount + 
        "\nTotal Cost: " + receipt.totalCost +
        "\nCurrently Left In Stock: " + results[0].stock_quantity
      );
      updateSales(receipt);
    });
    pool.releaseConnection(conn);
  });
}

const buyProduct = function(receipt){
  pool.getConnection(function(err, conn) {
    if (err) throw err;
    conn.query(updateQuantity, [receipt.purchaseAmount, receipt.product], function(err, results){
      if (err) throw err;
      printInvoice(receipt);
    });
    pool.releaseConnection(conn);
  });
};

const checkStock = function(product) {
  var receipt = {
    product: product,
  };
  inquirer.prompt(promptTwo).then(function(answer) {
    pool.getConnection(function(err, conn) {
      conn.query(findProduct, product, function(err, results){
        if (err) throw err;
        let inStock = results[0].stock_quantity;

        if(answer.purchase <= inStock ){
          console.log("We have enough! I'll ring you up.");
          receipt.purchaseAmount = answer.purchase;
          buyProduct(receipt);
        } else {
          console.log("Insufficient quantity, we have " + inStock + " left in stock.");
          process.exit();
        }
      });
      pool.releaseConnection(conn);
    });
  })
}

returnQuery(allProducts, function(results){
  for (let i = 0; i < results.length; i++) {
    products.push(results[i].product_name);
  }

  inquirer.prompt(promptOne).then(function(answer) {
    checkStock(answer.product);
  })
});
