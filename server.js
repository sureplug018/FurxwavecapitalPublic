const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: 'config.env' });
const app = require('./app');
const cronJob = require('./cronJob');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

mongoose
  .connect(DB, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
  })
  .then(() => {
    console.log('successfully connected to database');
  })
  .catch((err) => {
    console.log(err);
  });

// Run the cron job
cronJob();

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`app is listen on port ${port}...`);
});
