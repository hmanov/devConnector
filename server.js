const express = require('express');
const connectDB = require('./db');
const app = express();
const cors = require('cors');

app.use(cors());
connectDB();
app.use(express.json({ extended: false }));

//routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/posts', require('./routes/api/posts'));

if ((process.env.NODE_ENV = 'production')) {
  app.use(express.static('../client/build'));

  app.get('*', (req, res) => {
    res.sendFile('../client/build/index.html');
  });
}
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on ${PORT} `));