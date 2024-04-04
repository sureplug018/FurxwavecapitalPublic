const express = require('express');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');
const path = require('path');
const crypto = require('crypto');
const cookieParser = require('cookie-parser');
const userRoutes = require('./routes/userRoutes');
const planRoutes = require('./routes/planRoutes');
const walletRoutes = require('./routes/walletRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const investmentRoutes = require('./routes/investmentRoutes');
const supportRoutes = require('./routes/supportRoutes');
const viewsRoutes = require('./routes/viewsRoutes');
const contactRoutes = require('./routes/contactRoutes');

const app = express();
app.set('view engine', 'ejs');

function generateNonce() {
  // Generate a random string as nonce
  const nonce =
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15);
  return nonce;
}

const nonce = generateNonce();
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: [
        "'self'",
        // "'nonce-randomnoncevaluehere'",
        // "'unsafe-inline'",
        `nonce-${nonce}`,
        'https://translate.google.com',
        'https://translate.googleapis.com',
        'https://maps.googleapis.com',
        'https://cdnjs.cloudflare.com',
        // 'https://translate.google.com https://translate.googleapis.com https://maps.googleapis.com',
        // "'nonce-fBgZXVb6cC+YfXaIyoZKpw=='",
        // "'nonce-8svElj3JM+cpYqL4w5kSBw=='",
      ],
      imgSrc: [
        "'self'",
        'https://www.google.com/images/cleardot.gif',
        'https://translate.googleapis.com/translate_static/img/te_ctrl3.gif',
        'https://www.gstatic.com/images/branding/googlelogo/1x/googlelogo_color_42x16dp.png',
      ],
      frameSrc: ["'self'", 'https://www.tradingview-widget.com/'],
      connectSrc: ["'self'", 'https://maps.googleapis.com'],
    },
  }),
);

if (process.env.NODE_ENV === 'development') {
  console.log(process.env.NODE_ENV);
}

app.set('views', path.join(__dirname, 'views'));

// limiting the amount of requests from an IP
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 100,
  message: 'Too many requests from this Ip, please try again in an hour!',
});

app.use('/api', limiter);

// limiting the amount of data that is parsed in body-parser by adding size in kb
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());

// DATA SANITIZATION
app.use(mongoSanitize());

app.use(express.static('./public'));

// routes
app.use('/', viewsRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/plans', planRoutes);
app.use('/api/v1/wallets', walletRoutes);
app.use('/api/v1/transactions', transactionRoutes);
app.use('/api/v1/investments', investmentRoutes);
app.use('/api/v1/supports', supportRoutes);
app.use('/api/v1/contacts', contactRoutes);

module.exports = app;
