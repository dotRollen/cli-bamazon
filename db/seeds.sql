USE bamazon;

INSERT INTO products (
    product_name, department_name, price, stock_quantity, product_sales
    ) 
    VALUES 
        ('Glasses', 'accessories', 100, 37, 0),
        ('Black t-shirt', 'clothing', 15, 100, 0),
        ('iPhone X', 'electronics', 799, 20, 0),
        ('Addidas SupertStars', 'clothing', 80, 33, 0),
        ('Guitar', 'instruments', 299, 10, 0),
        ('Gloves', 'accessories', 10, 200, 0),
        ('watch', 'accessories', 88, 312, 0),
        ('hat', 'accessories', 20, 133, 0),
        ('ipad', 'electronics', 499, 28, 0),
        ('horn', 'instruments', 21, 77, 0);

INSERT INTO departments (
    department_name, over_head_costs
    ) 
    VALUES 
        ('accessories', 500),
        ('clothing', 1500),
        ('electronics', 5000),
        ('instruments', 800)