# CLI bAmazon

This contains three scripts to simulate shopping, managing and supervising an online store.


### How to setup 

All data are stored in one database with two tables. Use the `./db/schema.sql` to setup the database and `./db/seeds.sql` to insert dummy data.

### How to use

There are multiple choices prompted when running each script.

`node bamazonCustomer` allows the user to simulate purchasing as a customer. Data values are pulled and updated from the database. 
<img width="866" alt="screen shot 2018-08-19 at 10 43 37 pm" src="https://user-images.githubusercontent.com/17300742/44318069-581d3880-a402-11e8-9dee-5daa52942c5f.png">

`node bamazonManager` allows the user to simulate checking stock, adding stock and see which stocks are currently low.
<img width="866" alt="screen shot 2018-08-19 at 10 44 00 pm" src="https://user-images.githubusercontent.com/17300742/44318051-4045b480-a402-11e8-8f65-bd53039c795d.png">

<img width="866" alt="screen shot 2018-08-19 at 10 44 41 pm" src="https://user-images.githubusercontent.com/17300742/44318066-505d9400-a402-11e8-9bd5-e012049c9a78.png">

`node bamazonSuperivsor` allows the user to simulate viewing product sales by department and creating new departments. 
<img width="866" alt="screen shot 2018-08-19 at 10 42 59 pm" src="https://user-images.githubusercontent.com/17300742/44318040-315f0200-a402-11e8-80bb-1de75f303ad9.png">


### Technologies Used
* Node.js [Documentation](https://nodejs.org/en/)
* Mysql2 [Documentation](https://www.npmjs.com/package/mysql2)
* Inquirer [Documentation](https://www.npmjs.com/package/inquirer)
* table [Documentation](https://www.npmjs.com/package/table)
