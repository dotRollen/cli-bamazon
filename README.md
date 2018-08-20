# CLI bAmazon

This contains three scripts to simulate shopping, managing and supervising an online store.


### How to setup 

All data are stored in one database with two tables. Use the `./db/schema.sql` to setup the database and `./db/seeds.sql` to insert dummy data.

### How to use

There are multiple choices prompted when running each script.

`node bamazonCustomer` allows the user to simulate purchasing as a customer. Data values are pulled and updated from the database. 

`node bamazonManager` allows the user to simulate checking stock, adding stock and see which stocks are currently low.

`node bamazonSuperivsor` allows the user to simulate viewing product sales by department and creating new departments. 

### Technologies Used
* Node.js [Documentation](https://nodejs.org/en/)
* Mysql2 [Documentation](https://www.npmjs.com/package/mysql2)
* Inquirer [Documentation](https://www.npmjs.com/package/inquirer)
* table [Documentation](https://www.npmjs.com/package/table)