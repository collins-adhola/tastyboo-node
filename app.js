const express = require('express');
const fs = require('fs');
const app = express();

//middleware
app.use(express.json()); // enables json data to be added to req object

app.use((req, res, next) => {
  console.log('Hello from the middleware');
  next()
});
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString(); // Create own middleware
  next();
});
// app.get('/', (req, res) => {
//   res.status(200).json({message:'Hello from server side', app:'Tastyboo'});
// });

// app.post('/', (req, res) => {
// res.send('You can send to this end point')
// });
const products = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/products-simple.json`)
);

// Rout handlers
// ********Route handlers********************
const getAllProducts = (req, res) => {
  console.log(req.requestTime);
  res.status(200).json({
    status: 'success',
    results: products.length,
    data: {
      products: products, // 2nd is end point
    },
  });
};

const getProduct = (req, res) => {
  console.log(req.params);
  const id = req.params.id * 1; // turn id into number

  //is id less than number
  // if (id > products.length) {
  if (!products) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  const product = products.find((el) => el.id == id);
  res.status(200).json({
    status: 'success',
    data: {
      product: product,
    },
  });
};

const createProduct = (req, res) => {
  console.log(req.body);
  res.send('DONE');

  const newId = products[products.length - 1].id + 1;
  const newProduct = Object.assign({ id: newId }, req.body);

  products.push(newProduct);

  fs.writeFile(
    `${__dirname}/dev-data/products-simple.json`,
    JSON.stringify(products),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: {
          product: newProduct,
        },
      });
    }
  );
};

const updateProducts = (req, res) => {
  if (req.params.id * 1 > products.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }
  res.status(200).json({
    status: 'success',
    data: {
      product: '<Update tour here...>',
    },
  });
};

const deleteProduct = (req, res) => {
  if (req.params.id * 1 > products.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }
  res.status(204).json({
    status: 'success',
    data: null,
  });
};

// ***************routes***********************
// app.get('/api/v1/products', getAllProducts);
// app.post('/api/v1/products', createProduct); //both turned to one route
// app.get('/api/v1/products/:id', getProduct);
// app.patch('/api/v1/products/:id', updateProducts); These 3 turned to one route
// app.delete('/api/v1/products/:id', deleteProduct);
//.................................................
app.route('/api/v1/products').get(getAllProducts).post(createProduct);
app
  .route('/api/v1/products/:id')
  .get(getProduct)
  .patch(updateProducts)
  .delete(deleteProduct);
// ************Server************************
const port = 3000;
app.listen(port, () => {
  console.log(`HELLO FROM TASTYBOO SERVER ON PORT ${port}...`);
});
