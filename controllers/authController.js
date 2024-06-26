const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('./../models/userModel');
const Email = require('./../utilities/email');
const validator = require('validator');

// jwt token generator
const signAccessToken = (id) => {
  return jwt.sign({ id: id }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN,
  });
};

// jwt token generator
const signRefreshToken = (id) => {
  return jwt.sign({ id: id }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN,
  });
};

exports.signup = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      username,
      phoneNumber,
      gender,
      occupation,
      address,
      country,
      homeTown,
      password,
      passwordConfirm,
    } = req.body;

    // check if user with the given email and unconfirmed status exits
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      // Check if the existing user is unconfirmed, then delete
      if (existingUser.confirmed === false) {
        return res.status(400).json({
          status: 'fail',
          message: 'Go to your email and click the confirmation link',
        });
      } else {
        return res.status(400).json({
          status: 'fail',
          message: 'User with this email already exists',
        });
      }
    }

    //  create a new user
    const newUser = await User.create({
      firstName,
      lastName,
      email,
      username,
      phoneNumber,
      gender,
      occupation,
      homeTown,
      country,
      address,
      password,
      passwordConfirm,
    });

    // Set confirmationToken and confirmationTokenExpires after user creation
    newUser.confirmationToken = crypto.randomBytes(32).toString('hex');
    newUser.confirmationTokenExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

    // Save the user with the updated confirmation fields
    await newUser.save();

    const url = `${req.protocol}://${req.get('host')}/email-confirmed/${
      newUser.confirmationToken
    }`;
    await new Email(newUser, url).sendConfirmEmail();

    res.status(201).json({
      status: 'success',
      data: {
        user: newUser,
      },
    });
  } catch (err) {
    return res.status(404).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.confirmEmailBE = async (req, res) => {
  try {
    const { token } = req.params;

    // Find the user by the confirmation token
    const user = await User.findOne({ confirmationToken: token });

    // check if the token exists
    if (!user || user.confirmationTokenExpires < Date.now()) {
      return res.status(400).json({
        status: 'fail',
        message: 'Invalid or expired confirmation token.',
      });
    }

    // else Update the user's status to confirmed
    user.confirmed = true;
    user.confirmationToken = undefined;
    user.confirmationTokenExpires = undefined;
    await user.save();

    // Send welcome email
    const url = `${req.protocol}://${req.get('host')}/user-dashboard`;
    await new Email(user, url).sendWelcome();

    // Redirect or respond with a success message
    res.status(200).json({
      status: 'success',
      message: 'Email confirmed successfully.',
    });
  } catch (err) {
    return res.status(500).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.confirmEmailFE = async (req, res, next) => {
  try {
    const { token } = req.params;

    // Find the user by the confirmation token
    const user = await User.findOne({ confirmationToken: token });

    // check if the token exists
    if (!user || user.confirmationTokenExpires < Date.now()) {
      return res.status(500).render('error', {
        title: 'Error',
        user,
        message: 'Invalid or expired verification link! try signing up again',
      });
    }

    // else Update the user's status to confirmed
    user.confirmed = true;
    user.confirmationToken = undefined;
    user.confirmationTokenExpires = undefined;
    await user.save();

    // Send welcome email
    const url = `${req.protocol}://${req.get('host')}/user-dashboard`;
    await new Email(user, url).sendWelcome();
    next();
  } catch (err) {
    return res.status(500).render('error', {
      title: 'Error',
      message: 'Something went wrong',
    });
  }
};

exports.login = async (req, res) => {
  try {
    // get the details entered

    const { email, password } = req.body;

    const sanitizedEmail = email ? validator.escape(email) : undefined;
    // const sanitizedPassword = password ? validator.escape(password) : undefined;

    // check if they entered anything
    if (!sanitizedEmail || !password) {
      res.status(401).json({
        status: 'fail',
        message: 'Please provide email and password!',
      });
      return;
    }

    // fetching data from database
    const user = await User.findOne({ email: sanitizedEmail }).select(
      '+password',
    );

    // comparing the input data and the saved data
    if (!user) {
      res.status(401).json({
        status: 'fail',
        message: 'incorrect password or email',
      });
      return;
    }

    if (user.role !== 'user') {
      return res.status(401).json({
        status: 'fail',
        message: 'This user is an admin',
      });
    }

    if (user.confirmed === false) {
      return res.status(403).json({
        status: 'fail',
        message:
          'Go to your mail and click the confirmation link to confirm your email before login',
      });
    }

    // comparing the input data and the saved data
    if (!(await user.correctPassword(password, user.password))) {
      res.status(401).json({
        status: 'fail',
        message: 'incorrect password or email',
      });
      return;
    }

    // generating token for login
    const accessToken = signAccessToken(user._id);
    const refreshToken = signRefreshToken(user._id);

    // Set cookies
    const accessCookieOptions = {
      expiresIn: new Date(Date.now() + process.env.ACCESS_TOKEN_EXPIRES_IN),
      secure: false,
      httpOnly: false,
      path: '/',
      sameSite: 'none',
      maxAge: 15 * 60 * 1000, //15 mins
    };

    const refreshCookieOptions = {
      expiresIn: new Date(Date.now() + process.env.REFRESH_TOKEN_EXPIRES_IN),
      secure: false,
      httpOnly: false,
      path: '/',
      sameSite: 'none',
      maxAge: 30 * 24 * 60 * 60 * 1000, //30 days
    };

    if (process.env.NODE_ENV === 'production') {
      accessCookieOptions.secure = true;
      accessCookieOptions.httpOnly = true;
      refreshCookieOptions.secure = true;
      refreshCookieOptions.httpOnly = true;
    }

    res.cookie('access-token', accessToken, accessCookieOptions);
    res.cookie('refresh-token', refreshToken, refreshCookieOptions);
    // sending response
    res.status(200).json({
      status: 'success',
      accessToken,
      refreshToken,
    });
  } catch (err) {
    res.status(401).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.loginAdmin = async (req, res) => {
  try {
    // get the details entered

    const { email, password } = req.body;

    const sanitizedEmail = email ? validator.escape(email) : undefined;
    // const sanitizedPassword = password ? validator.escape(password) : undefined;

    // check if they entered anything
    if (!sanitizedEmail || !password) {
      res.status(401).json({
        status: 'fail',
        message: 'Please provide email and password!',
      });
      return;
    }

    // fetching data from database
    const user = await User.findOne({ email: sanitizedEmail }).select(
      '+password',
    );

    if (user.role !== 'admin') {
      return res.status(401).json({
        status: 'fail',
        message: 'This user is not an admin',
      });
    }

    // comparing the input data and the saved data
    if (!user) {
      res.status(401).json({
        status: 'fail',
        message: 'incorrect password or email',
      });
      return;
    }

    if (user.confirmed === false) {
      return res.status(403).json({
        status: 'fail',
        message:
          'Go to your mail and click the confirmation link to confirm your email before login',
      });
    }

    // comparing the input data and the saved data
    if (!(await user.correctPassword(password, user.password))) {
      res.status(401).json({
        status: 'fail',
        message: 'incorrect password or email',
      });
      return;
    }

    // generating token for login
    const accessToken = signAccessToken(user._id);
    const refreshToken = signRefreshToken(user._id);

    // Set cookies
    const accessCookieOptions = {
      expiresIn: new Date(Date.now() + process.env.ACCESS_TOKEN_EXPIRES_IN),
      secure: false,
      httpOnly: false,
      path: '/',
      sameSite: 'none',
      maxAge: 15 * 60 * 1000, //15 mins
    };

    const refreshCookieOptions = {
      expiresIn: new Date(Date.now() + process.env.REFRESH_TOKEN_EXPIRES_IN),
      secure: false,
      httpOnly: false,
      path: '/',
      sameSite: 'none',
      maxAge: 30 * 24 * 60 * 60 * 1000, //30 days
    };

    if (process.env.NODE_ENV === 'production') {
      accessCookieOptions.secure = true;
      accessCookieOptions.httpOnly = true;
      refreshCookieOptions.secure = true;
      refreshCookieOptions.httpOnly = true;
    }

    res.cookie('access-token', accessToken, accessCookieOptions);
    res.cookie('refresh-token', refreshToken, refreshCookieOptions);
    // sending response
    res.status(200).json({
      status: 'success',
      accessToken,
      refreshToken,
    });
  } catch (err) {
    res.status(401).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.protect = async (req, res, next) => {
  let refreshToken;
  try {
    // step 1: get the jwt tken and check if its true
    // if (
    //   req.headers.authorization &&
    //   req.headers.authorization.startsWith('Bearer')
    // ) {
    //   token = req.headers.authorization.split(' ')[1];
    const accessToken = req.cookies['access-token'];
    refreshToken = req.cookies['refresh-token'];

    //  check if refresh token exists
    if (!refreshToken) {
      return res.status(403).json({
        status: 'fail',
        message: 'Unauthorized',
      });
    }

    // step 2: verification of token
    const decodedAccessToken = await promisify(jwt.verify)(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET,
    );

    // step 3: check if user still exists
    const currentUser = await User.findById(decodedAccessToken.id);

    if (!currentUser) {
      return res.status(401).json({
        status: 'fail',
        message: 'the user belonging to this token does no longer exists',
      });
    }

    // step 4: check if the user changed password after the token was issued
    if (currentUser.changedPasswordAfter(decodedAccessToken.iat)) {
      return res.status(401).json({
        status: 'fail',
        message: 'user recently changed password! please login again',
      });
    }

    // step 5: grant access to protected route
    req.user = currentUser;
    res.locals.user = currentUser;
    next();
  } catch (err) {
    if (
      err.name === 'TokenExpiredError' ||
      (err.name === 'JsonWebTokenError' && refreshToken)
    ) {
      // Access token expired or invalid
      try {
        if (!refreshToken) {
          throw new Error('Unauthorized - Refresh token missing');
        }
        // Verify the refresh token
        const decodedRefreshToken = jwt.verify(
          refreshToken,
          process.env.REFRESH_TOKEN_SECRET,
        );
        // Check if refresh token is still valid
        // If refresh token is valid, generate a new access token
        // and continue to next middleware
        // If refresh token is not valid, throw an error
        // Here, you would typically check if the refresh token is stored in a database
        // and compare it with the stored refresh tokens for the user
        // For simplicity, I'm assuming the refresh token is a JWT and directly checking its validity

        // Retrieve the current user
        const currentUser = await User.findById(decodedRefreshToken.id);
        if (!currentUser) {
          throw new Error('Unauthorized - User not found');
        }

        const newAccessToken = jwt.sign(
          { id: decodedRefreshToken.id },
          process.env.ACCESS_TOKEN_SECRET,
          {
            expiresIn: '15m',
          },
        );

        const cookieOptions = {
          httpOnly: false,
          secure: false,
          path: '/',
          sameSite: 'none',
          maxAge: 15 * 60 * 1000, //15 mins
        };

        if (process.env.NODE_ENV === 'production') {
          (cookieOptions.httpOnly = true), (cookieOptions.secure = true);
        }

        res.cookie('access-token', newAccessToken, cookieOptions); // Set new access token in cookie
        req.user = currentUser; // Set user in request object
        res.locals.user = currentUser; // Set user in response locals
        next(); // Continue to next middleware
      } catch (refreshTokenError) {
        return res.status(401).json({
          status: 'fail',
          message: refreshTokenError.message,
        });
      }
    } else {
      // Access token not provided
      return res.status(401).json({
        status: 'fail',
        message: 'Unauthorized - Access token must be provided',
      });
    }
  }
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(404).render('error', {
        title: 'Error',
      });
    }
    next();
  };
};

exports.forgortPassword = async (req, res, next) => {
  // step 1: get user based on posted email
  try {
    const email = req.body.email;

    const sanitizedEmail = email ? validator.escape(email) : undefined;
    const user = await User.findOne({ email: sanitizedEmail });

    // step 2: check if the user exists
    if (!user) {
      res.status(404).json({
        status: 'fail',
        message: 'There is no user with email address',
      });
      return;
    }

    // step 3: generate random reset token
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    // step 5: sending the email
    try {
      const resetUrl = `${req.protocol}://${req.get(
        'host',
      )}/resetPassword/${resetToken}`;

      await new Email(user, resetUrl).sendPasswordReset();

      res.status(200).json({
        status: 'success',
        message: 'Token sent to email!',
      });
    } catch (err) {
      (user.passwordResetToken = undefined),
        (user.passwordResetExpires = undefined),
        await user.save({ validateBeforeSave: false });

      return next(
        res.status(500).json({
          status: 'fail',
          message: 'there was an error sending the email, try again',
        }),
      );
    }
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.resetPassword = async (req, res, next) => {
  // step 1: get user based on the token
  try {
    const hashedToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    // step 2: if the token has not expired and there is user set the new password
    if (!user) {
      res
        .status(400)
        .json({ status: 'fail', message: 'Token is invalid or has expired' });
      return;
    }

    const password = req.body.password;
    const passwordConfirm = req.body.passwordConfirm;

    const sanitisedPassword = password ? validator.escape(password) : undefined;
    const sanitizedPasswordConfirm = passwordConfirm
      ? validator.escape(passwordConfirm)
      : undefined;

    user.password = sanitisedPassword;
    user.passwordConfirm = sanitizedPasswordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    // step 3: generate JWT and login the user
    const accessToken = signAccessToken(user._id);
    const refreshToken = signRefreshToken(user._id);

    // Set cookies
    const accessCookieOptions = {
      expiresIn: new Date(Date.now() + process.env.ACCESS_TOKEN_EXPIRES_IN),
      secure: false,
      httpOnly: false,
      path: '/',
      sameSite: 'none',
      maxAge: 15 * 60 * 1000, //15 mins
    };

    const refreshCookieOptions = {
      expiresIn: new Date(Date.now() + process.env.REFRESH_TOKEN_EXPIRES_IN),
      secure: false,
      httpOnly: false,
      path: '/',
      sameSite: 'none',
      maxAge: 30 * 24 * 60 * 60 * 1000, //30 days
    };

    if (process.env.NODE_ENV === 'production') {
      accessCookieOptions.secure = true;
      accessCookieOptions.httpOnly = true;
      refreshCookieOptions.secure = true;
      refreshCookieOptions.httpOnly = true;
    }

    res.cookie('access-token', accessToken, accessCookieOptions);
    res.cookie('refresh-token', refreshToken, refreshCookieOptions);
    // sending response
    res.status(200).json({
      status: 'success',
      accessToken,
      refreshToken,
    });
    next();
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.updatePassword = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('+password');

    const passwordCurrent = req.body.passwordCurrent;
    // const sanitizedPasswordCurrent = passwordCurrent
    //   ? validator.escape(passwordCurrent)
    //   : undefined;

    // The rest of your code for password validation...

    // comparing the input data and the saved data
    if (!(await user.correctPassword(passwordCurrent, user.password))) {
      res.status(401).json({
        status: 'fail',
        message: 'your current password is wrong.',
      });
      return;
    }

    // Check if the request body contains password and passwordConfirm
    if (!req.body.password || !req.body.passwordConfirm) {
      return res.status(400).json({
        status: 'fail',
        message: 'Password and password confirmation are required',
      });
    }

    if (req.body.password !== req.body.passwordConfirm) {
      return res.status(400).json({
        status: 'fail',
        message: 'newpassword and passwod confirm does not match',
      });
    }

    const password = req.body.password;
    const passwordConfirm = req.body.passwordConfirm;

    // const sanitizedPassword = validator.escape(password);
    // const sanitizedPasswordConfirm = validator.escape(passwordConfirm);

    // Update user password and passwordConfirm
    user.password = password;
    user.passwordConfirm = passwordConfirm;
    await user.save();

    // Generate a new JWT token
    const accessToken = signAccessToken(user._id);
    const refreshToken = signRefreshToken(user._id);

    // Set cookies
    const accessCookieOptions = {
      expiresIn: new Date(Date.now() + process.env.ACCESS_TOKEN_EXPIRES_IN),
      secure: false,
      httpOnly: false,
      path: '/',
      sameSite: 'none',
      maxAge: 15 * 60 * 1000, //15 mins
    };

    const refreshCookieOptions = {
      expiresIn: new Date(Date.now() + process.env.REFRESH_TOKEN_EXPIRES_IN),
      secure: false,
      httpOnly: false,
      path: '/',
      sameSite: 'none',
      maxAge: 30 * 24 * 60 * 60 * 1000, //30 days
    };

    if (process.env.NODE_ENV === 'production') {
      accessCookieOptions.secure = true;
      accessCookieOptions.httpOnly = true;
      refreshCookieOptions.secure = true;
      refreshCookieOptions.httpOnly = true;
    }

    res.cookie('access-token', accessToken, accessCookieOptions);
    res.cookie('refresh-token', refreshToken, refreshCookieOptions);
    // sending response
    res.status(200).json({
      status: 'success',
      accessToken,
      refreshToken,
    });
  } catch (err) {
    return res.status(400).json({
      status: 'error',
      message: err.message,
    });
  }
};

exports.logout = (req, res) => {
  res.cookie('jwt', 'loggedOut', {
    expiresIn: new Date(0),
    httpOnly: true,
  });
  res.status(200).json({
    status: 'success',
  });
};

// Function to update user data
exports.updateUserData = async (req, res) => {
  try {
    // Step 1: Authentication - Verify JWT token
    const decoded = await promisify(jwt.verify)(
      req.cookies.jwt, // Assuming the JWT is stored in a cookie
      process.env.JWT_SECRET,
    );

    // Step 2: Fetch the user from the database
    const currentUser = await User.findById(decoded.id);

    const { firstName, lastName, username } = req.body;

    // Step 3: Update user data based on the request body
    if (req.body.firstName) {
      currentUser.firstName = firstName;
    }

    if (req.body.lastName) {
      currentUser.lastName = lastName;
    }

    if (req.body.username) {
      currentUser.username = username;
    }

    if (req.file) {
      currentUser.photo = req.file.filename;
    }

    // Step 4: Save the updated user data
    await currentUser.save();

    // Step 5: Respond with success message and updated user data
    res.status(200).json({
      status: 'success',
      data: {
        user: currentUser,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.isLoggedIn = async (req, res, next) => {
  try {
    if (req.cookies['access-token']) {
      // step 2: verification of token
      const decoded = await promisify(jwt.verify)(
        req.cookies['access-token'],
        process.env.ACCESS_TOKEN_SECRET,
      );

      // step 3: check if user still exists
      const currentUser = await User.findById(decoded.id);

      if (!currentUser) {
        return next();
      }

      // step 4: check if the user changed password after the token was issued
      if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next();
      }

      // step 5: grant access to protected route
      res.locals.user = currentUser;
      req.user = currentUser;
      return next();
    }
    next();
  } catch (err) {
    return next();
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const users = await User.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: 'success',
      data: {
        users,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};
