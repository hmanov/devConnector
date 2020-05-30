const express = require('express');
const connectDB = require('./db');
const app = express();
const cors = require('cors');
const path = require('path');

app.use(cors());
connectDB();
app.use(express.json({ extended: false }));
//routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/posts', require('./routes/api/posts'));

app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'client/build/index.html'), function (err) {
    if (err) {
      res.status(500).send(err);
    }
  });
});
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on ${PORT} `));
