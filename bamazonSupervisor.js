const mysql = require("mysql2");
const inquirer = require("inquirer");
const table = require("table").table;

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

let columnsDepartmentsTbl = [
    'department_name',
    'over_head_costs'
];

let choicesPrompt = {
  name: "choice",
  type: "list",
  message: "What would you like to do?",
  choices: [
      "View Products Sales by Department",
      "Create New Department"
  ]
};

let addDepartmentPrompt = [
    {
        name: "department",
        type: "input",
        message: "What is the name of the new department?"
    },
    {
        name: "cost",
        type: "input",
        message: "What is the over head cost?"
    },
];

let tableData = [
    ['Department Name', 'Overhead Costs', 'Product Sales', 'Total Profit'],
];
 
let tableConfig = {
    columns: {
        0: {
            alignment: 'left',
            minWidth: 10
        },
        1: {
            alignment: 'left',
            minWidth: 10
        },
        2: {
            alignment: 'left',
            minWidth: 10
        },
        3: {
            alignment: 'left',
            minWidth: 10
        },
        4: {
            alignment: 'left',
            minWidth: 10
        }
    }
};
 
let newDepartment = "INSERT INTO departments (" + columnsDepartmentsTbl.join(", ") + ") VALUES (?, ?);";
let totalProfit = 
    `
    SELECT 
        products.department_name, 
        SUM (product_sales) AS sales_total,
        departments.department_name, 
        departments.over_head_costs
    FROM products INNER JOIN departments 
    ON products.department_name = departments.department_name
    GROUP BY 
        products.department_name,
        departments.over_head_costs;
    `;

const returnQuery = function(query, callback) {
    pool.query(query, function(err, results){
        if (err) throw err; // If query fails
        return callback(results);
    });
};

const createNewDepartment = function() {
    console.log(newDepartment);
    inquirer.prompt(addDepartmentPrompt).then(function(answer) {
        pool.query(newDepartment, [answer.department, parseFloat(answer.cost)], function(err, results){
            if (err) throw err;
            console.log(answer.department + " department has been added to the store.");
            
            process.exit();
        });
    });
};

const viewProductSales = function() {
    pool.query(totalProfit, function(err, results){
        if (err) throw err;
        var rows = Object.values(JSON.parse(JSON.stringify(results)));

        for(let i = 0; i < rows.length; i++) {
            var list  = [];
            list.push(rows[i].department_name);
            list.push(rows[i].over_head_costs);
            list.push(rows[i].sales_total);
            list.push(rows[i].sales_total - rows[i].over_head_costs);

            tableData.push(list);
        }

        console.log(table(tableData, tableConfig));

        process.exit();
    });
};

(function(){
  inquirer.prompt(choicesPrompt).then(function(answer) {
    let choice = answer.choice;
    switch(choice) {
        case "View Products Sales by Department":
            viewProductSales();
            break;
        case "Create New Department":
            createNewDepartment();
            break;
        default:
            console.log("Nothing to do...");
    };
  });
})();
