////////////////////////////////////////
// alerts
const hideAlert = () => {
  const el = document.querySelector('.alert');
  if (el) el.parentElement.removeChild(el);
};

const showAlert = (type, msg) => {
  hideAlert();
  const markup = `<div class="alert alert--${type}">${msg}</div>`;
  document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
  window.setTimeout(hideAlert, 5000);
};

const login = async (email, password) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/login',
      data: {
        email,
        password,
      },
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Logged in successfully!');
      window.setTimeout(() => {
        location.assign('/user-dashboard');
      }, 3000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

const adminLogin = async (email, password) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/login/admin',
      data: {
        email,
        password,
      },
    });
    if (res.data.status === 'success') {
      showAlert('success', 'Logged in successfully!');
      window.setTimeout(() => {
        location.assign('/admin-dashboard');
      }, 3000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

const signup = async (
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
) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/signup',
      data: {
        firstName,
        lastName,
        email,
        username,
        phoneNumber,
        gender,
        occupation,
        homeTown,
        address,
        password,
        passwordConfirm,
      },
    });
    if (res.data.status === 'success') {
      showAlert('success', 'Signed up successfully');
      window.setTimeout(() => {
        location.assign('/signup-success');
      }, 3000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

const forgotPassword = async (email) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/forgotPassword',
      data: {
        email,
      },
    });
    if (res.data.status === 'success') {
      showAlert('success', 'Reset link sent successfully');
      window.setTimeout(() => {
        location.assign('/sent-reset-link');
      }, 3000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

const resetPassword = async (password, passwordConfirm, resetToken) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: `/api/v1/users/resetPassword/${resetToken}`,
      data: {
        password,
        passwordConfirm,
      },
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Successfully resetted password!');

      // Redirect to the login page after a delay
      window.setTimeout(() => {
        location.assign('/login');
      }, 3000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

const updatePasswordAdmin = async (
  passwordCurrent,
  password,
  passwordConfirm,
) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: '/api/v1/users/updateMyPassword',
      data: {
        passwordCurrent,
        password,
        passwordConfirm,
      },
    });
    if (res.data.status === 'success') {
      showAlert('success', 'Password updated successfully!');
      // Redirect to the login page after a delay
      window.setTimeout(() => {
        location.assign('/admin-profile');
      }, 3000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

const updatePasswordUser = async (
  passwordCurrent,
  password,
  passwordConfirm,
) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: '/api/v1/users/updateMyPassword',
      data: {
        passwordCurrent,
        password,
        passwordConfirm,
      },
    });
    if (res.data.status === 'success') {
      showAlert('success', 'Password updated successfully!');
      // Redirect to the login page after a delay
      window.setTimeout(() => {
        location.assign('/user-profile');
      }, 3000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

const updateAdminData = async (firstName, lastName, username) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: '/api/v1/users/update',
      data: {
        firstName,
        lastName,
        username,
      },
    });
    if (res.data.status === 'success') {
      showAlert('success', 'Profile updated successfully!');
      // Redirect to the login page after a delay
      window.setTimeout(() => {
        location.assign('/admin-profile');
      }, 3000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

const updateUserData = async (firstName, lastName, username) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: '/api/v1/users/update',
      data: {
        firstName,
        lastName,
        username,
      },
    });
    if (res.data.status === 'success') {
      showAlert('success', 'Profile updated successfully!');
      // Redirect to the login page after a delay
      window.setTimeout(() => {
        location.assign('/user-profile');
      }, 3000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: '/api/v1/users/logout',
    });
    if (res.data.status === 'success') {
      window.location.href = '/';
    }
  } catch (err) {
    showAlert('error', 'error trying to log out! try again');
  }
};

const logoutUser = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: '/api/v1/users/logout',
    });
    if (res.data.status === 'success') {
      window.location.href = '/';
    }
  } catch (err) {
    showAlert('error', 'error trying to log out! try again');
  }
};

const logoutAdmin = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: '/api/v1/users/logout',
    });
    if (res.data.status === 'success') {
      window.location.href = '/admin-login';
    }
  } catch (err) {
    showAlert('error', 'error trying to log out! try again');
  }
};

const addContact = async (number) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/contacts/create-contact',
      data: {
        number,
      },
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Contact added successfully!');
      // Redirect to the login page after a delay
      window.setTimeout(() => {
        location.assign('/add-contact');
      }, 3000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

const addWallet = async (name, address) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/wallets/create-wallet',
      data: {
        name,
        address,
      },
    });
    if (res.data.status === 'success') {
      showAlert('success', 'Wallet added successfully!');
      // Redirect to the login page after a delay
      window.setTimeout(() => {
        location.assign('/add-wallet');
      }, 3000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

const directDeposit = async (email, amount) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/transactions/direct-deposit',
      data: {
        email,
        amount,
      },
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Amount added successfully!');
      // Redirect to the login page after a delay
      window.setTimeout(() => {
        location.assign('/direct-deposit');
      }, 3000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

const createPlan = async (name, min, max, roi, duration) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/plans/create-plan',
      data: {
        name,
        min,
        max,
        roi,
        duration,
      },
    });
    if (res.data.status === 'success') {
      showAlert('success', 'Created plan successfully!');
      // Redirect to the login page after a delay
      window.setTimeout(() => {
        location.assign('/add-plans');
      }, 3000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

const withdraw = async (amount, wallet, address) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/transactions/withdraw',
      data: {
        amount,
        wallet,
        address,
      },
    });
    if (res.data.status === 'success') {
      showAlert('success', 'Withdrawal is being processed!');
      // Redirect to the login page after a delay
      window.setTimeout(() => {
        location.assign('/withdrawal');
      }, 3000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

const withdrawBank = async (amount, wallet, address) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/transactions/withdraw',
      data: {
        amount,
        wallet,
        address,
      },
    });
    if (res.data.status === 'success') {
      showAlert('success', 'Withdrawal is being processed!');
      // Redirect to the login page after a delay
      window.setTimeout(() => {
        location.assign('/withdrawal');
      }, 3000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

const sendSupport = async (name, email, subject, message) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/supports/user',
      data: {
        name,
        email,
        subject,
        message,
      },
    });
    if (res.data.status === 'success') {
      showAlert('success', 'Support sent successfully!');
      // Redirect to the login page after a delay
      window.setTimeout(() => {
        location.assign('/support');
      }, 3000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

const sendMail = async (email, subject, message) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/supports/sendMail/user',
      data: {
        email,
        subject,
        message,
      },
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Support sent successfully!');
      // Redirect to the login page after a delay
      window.setTimeout(() => {
        location.assign('/sent-mails');
      }, 3000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

const loginForm = document.querySelector('.form-login');
const adminLoginform = document.querySelector('.form-login-admin');
const signupForm = document.querySelector('.signup-form');
const forgortPasswordForm = document.querySelector('.forgotPassword-form');
const resetPasswordForm = document.querySelector('.resetPassword-form');
const passwordUpdateForm = document.querySelector('.update-admin-password');
const passwordUpdateFormUser = document.querySelector('.update-user-password');
const updateAdminDataForm = document.querySelector('.admin-profile-update');
const updateUserDataForm = document.querySelector('.user-profile-update');
const logoutButton = document.querySelector('.logout-btn');
const logoutUserBtn = document.querySelector('.logout-btn-user');
const logoutAdminBtn = document.querySelector('.logout-btn-admin');
const addWalletForm = document.querySelector('.add-wallet-form');
const directDepositForm = document.querySelector('.direct-deposit-form');
const createPlanForm = document.querySelector('.add-plan-form');
const withdrawalForm = document.querySelector('.make-withdrawal');
const supportForm = document.querySelector('.support-form');
const messageForm = document.querySelector('.support-mail');
const addContactForm = document.querySelector('.add-contact-form');
const withdrawBankForm = document.querySelector('.make-withdrawal-bank');

if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    document.querySelector('.login-btn').style.opacity = '0.5';
    document.querySelector('.login-btn').textContent = 'Logging in...';
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    await login(email, password);
    document.querySelector('.login-btn').style.opacity = '1';
    document.querySelector('.login-btn').textContent = 'Log in';
  });
}
if (adminLoginform) {
  adminLoginform.addEventListener('submit', async (e) => {
    e.preventDefault();
    document.querySelector('.login-btn-admin').style.opacity = '0.5';
    document.querySelector('.login-btn-admin').textContent = 'Logging in...';
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    await adminLogin(email, password);
    document.querySelector('.login-btn-admin').style.opacity = '1';
    document.querySelector('.login-btn-admin').textContent = 'Log in';
  });
}
if (signupForm) {
  signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    document.querySelector('.signup-btn').style.opacity = '0.5';
    document.querySelector('.signup-btn').textContent = 'Processing...';
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('email').value;
    const username = document.getElementById('username').value;
    const phoneNumber = document.getElementById('phoneNumber').value;
    const gender = document.getElementById('gender').value;
    const occupation = document.getElementById('occupation').value;
    const homeTown = document.getElementById('homeTown').value;
    const country = document.getElementById('country').value;
    const address = document.getElementById('address').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('passwordConfirm').value;
    await signup(
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
    );
    document.querySelector('.signup-btn').style.opacity = '1';
    document.querySelector('.signup-btn').textContent = 'Sign up';
  });
}

if (forgortPasswordForm) {
  forgortPasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    document.querySelector('.forgotPassword-btn').style.opacity = '0.5';
    document.querySelector('.forgotPassword-btn').textContent =
      'Sending reset link...';
    const email = document.getElementById('email').value;
    await forgotPassword(email);
    document.querySelector('.forgotPassword-btn').style.opacity = '1';
    document.querySelector('.forgotPassword-btn').textContent =
      'Send password reset link';
  });
}

if (resetPasswordForm) {
  resetPasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    document.querySelector('.resetPassword-btn').style.opacity = '0.5';
    document.querySelector('.resetPassword-btn').textContent =
      'Resetting password...';
    const passwod = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('passwordConfirm').value;
    const urlParams = window.location.pathname.split('/').pop();
    await resetPassword(passwod, passwordConfirm, urlParams);
    document.querySelector('.resetPassword-btn').style.opacity = '1';
    document.querySelector('.resetPassword-btn').textContent = 'Reset password';
  });
}

if (passwordUpdateForm) {
  passwordUpdateForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    document.querySelector('.admin-password-update-btn').style.opacity = '0.5';
    document.querySelector('.admin-password-update-btn').textContent =
      'Updating...';
    const passwordCurrent = document.getElementById('passwordCurrent').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('passwordConfirm').value;
    await updatePasswordAdmin(passwordCurrent, password, passwordConfirm);
    document.querySelector('.admin-password-update-btn').style.opacity = '1';
    document.querySelector('.admin-password-update-btn').textContent =
      'Update password';
  });
}

if (passwordUpdateFormUser) {
  passwordUpdateFormUser.addEventListener('submit', async (e) => {
    e.preventDefault();
    document.querySelector('.user-password-update-btn').style.opacity = '0.5';
    document.querySelector('.user-password-update-btn').textContent =
      'Updating...';
    const passwordCurrent = document.getElementById('passwordCurrent').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('passwordConfirm').value;
    await updatePasswordUser(passwordCurrent, password, passwordConfirm);
    document.querySelector('.user-password-update-btn').style.opacity = '1';
    document.querySelector('.user-password-update-btn').textContent =
      'Update password';
  });
}

if (updateAdminDataForm) {
  updateAdminDataForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    document.querySelector('.admin-data-update-btn').style.opacity = '0.5';
    document.querySelector('.admin-data-update-btn').textContent =
      'Updating...';
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const username = document.getElementById('username').value;
    await updateAdminData(firstName, lastName, username);
    document.querySelector('.admin-data-update-btn').style.opacity = '1';
    document.querySelector('.admin-data-update-btn').textContent = 'Submit ';
  });
}

if (updateUserDataForm) {
  updateUserDataForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    document.querySelector('.user-data-update-btn').style.opacity = '0.5';
    document.querySelector('.user-data-update-btn').textContent = 'Updating...';
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const username = document.getElementById('username').value;
    await updateUserData(firstName, lastName, username);
    document.querySelector('.user-data-update-btn').style.opacity = '1';
    document.querySelector('.user-data-update-btn').textContent = 'Submit';
  });
}

if (logoutButton) {
  logoutButton.addEventListener('click', logoutUser);
}

if (logoutUserBtn) {
  logoutUserBtn.addEventListener('click', logoutUser);
}

if (logoutAdminBtn) {
  logoutAdminBtn.addEventListener('click', logoutAdmin);
}

if (addWalletForm) {
  addWalletForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    document.querySelector('.add-wallet-btn').style.opacity = '0.5';
    document.querySelector('.add-wallet-btn').textContent = 'Processing...';
    const name = document.getElementById('wallet-name').value;
    const address = document.getElementById('wallet-address').value;
    await addWallet(name, address);
    document.querySelector('.add-wallet-btn').style.opacity = '1';
    document.querySelector('.add-wallet-btn').textContent = 'Add';
  });
}

if (directDepositForm) {
  directDepositForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    document.querySelector('.direct-deposit-btn').style.opacity = '0.5';
    document.querySelector('.direct-deposit-btn').textContent = 'Processing...';
    const email = document.getElementById('email').value;
    const amount = document.getElementById('amount').value;
    await directDeposit(email, amount);
    document.querySelector('.direct-deposit-btn').style.opacity = '1';
    document.querySelector('.direct-deposit-btn').textContent = 'Deposit';
  });
}

if (createPlanForm) {
  createPlanForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    document.querySelector('.add-plan-btn').style.opacity = '0.5';
    document.querySelector('.add-plan-btn').textContent = 'Processing...';
    const name = document.getElementById('plan-name').value;
    const min = document.getElementById('min').value;
    const max = document.getElementById('max').value;
    const roi = document.getElementById('roi').value;
    const duration = document.getElementById('duration').value;

    await createPlan(name, min, max, roi, duration);
    document.querySelector('.add-plan-btn').style.opacity = '1';
    document.querySelector('.add-plan-btn').textContent = 'Add';
  });
}

if (withdrawalForm) {
  withdrawalForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    document.querySelector('.withdrawal-btn').style.opacity = '0.5';
    document.querySelector('.withdrawal-btn').textContent = 'Processing...';
    const amount = document.getElementById('amount').value;
    const wallet = document.getElementById('wallet').value;
    const walletAddress = document.getElementById('wallet-address').value;

    await withdraw(amount, wallet, walletAddress);
    document.querySelector('.withdrawal-btn').style.opacity = '1';
    document.querySelector('.withdrawal-btn').textContent = 'Submit';
  });
}

if (supportForm) {
  supportForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    document.querySelector('.send-support-btn').style.opacity = '0.5';
    document.querySelector('.send-support-btn').textContent = 'Sending...';
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;
    await sendSupport(name, email, subject, message);
    document.querySelector('.send-support-btn').style.opacity = '1';
    document.querySelector('.send-support-btn').textContent = 'Send';
  });
}

if (messageForm) {
  messageForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    document.querySelector('.send-message-btn').style.opacity = '0.5';
    document.querySelector('.send-message-btn').textContent = 'Sending...';
    const email = document.getElementById('receiver').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;
    await sendMail(email, subject, message);
    document.querySelector('.send-message-btn').style.opacity = '1';
    document.querySelector('.send-message-btn').textContent = 'Send';
  });
}

if (addContactForm) {
  addContactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    document.querySelector('.add-contact-btn').style.opacity = '0.5';
    document.querySelector('.add-contact-btn').textContent = 'Submitting...';
    const number = document.getElementById('number').value;
    await addContact(number);
    document.querySelector('.add-contact-btn').style.opacity = '1';
    document.querySelector('.add-contact-btn').textContent = 'Add';
  });
}

if (withdrawBankForm) {
  withdrawBankForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    document.querySelector('.bank-withdrawal-btn').style.opacity = '0.5';
    document.querySelector('.bank-withdrawal-btn').textContent =
      'Processing...';
    const amount = document.getElementById('amount').value;
    const bank = document.getElementById('bank').value;
    const number = document.getElementById('account-number').value;
    await withdrawBank(amount, bank, number);
    document.querySelector('.bank-withdrawal-btn').style.opacity = '1';
    document.querySelector('.bank-withdrawal-btn').textContent = 'Submit';
  });
}

document.querySelectorAll('.edit-wallet-btn').forEach((button) => {
  button.addEventListener('click', function () {
    const walletId = this.dataset.walletId;

    const modal = document.getElementById('edit-modal');
    const submitBtn = document.querySelector('.submit-wallet-edit-btn');

    submitBtn.addEventListener('click', async () => {
      const updateWallet = {
        name: document.getElementById('walletName').value,
        address: document.getElementById('address').value,
      };

      const response = await axios.patch(
        `/api/v1/wallets/edit-wallet/${walletId}`,
        updateWallet,
      );
      showAlert('success', 'Wallet updated successfully!');
      // Redirect to the login page after a delay
      window.setTimeout(() => {
        location.assign('/wallets');
      }, 3000);
    });
  });
});

document.querySelectorAll('.wallet-delete-btn').forEach((button) => {
  button.addEventListener('click', async function () {
    const walletId = this.dataset.walletId;

    try {
      button.style.opacity = '0.5';
      button.textContent = 'Deleting...';
      // Send a DELETE request to the backend to delete the wallet
      const response = await axios.delete(
        `/api/v1/wallets/delete-wallet/${walletId}`,
      );

      // Handle success message or any further actions after successful deletion
      showAlert('success', 'Wallet deleted successfully!');

      // Redirect to the delete wallet page after a delay
      window.setTimeout(() => {
        location.assign('/delete-wallet');
      }, 3000);
    } catch (error) {
      // Handle errors// Log the error for debugging
      showAlert('error', error.response.data.message);
    }
  });
});

document.querySelectorAll('.decline-deposit-btn').forEach((button) => {
  button.addEventListener('click', async function () {
    const depositId = this.dataset.depositId;

    try {
      button.style.opacity = '0.5';
      button.textContent = 'Declining...';
      // Send a PUT request to the backend to decline the transaction
      const response = await axios.patch(
        `/api/v1/transactions/decline-transaction/${depositId}`,
      );

      // Handle success message or any further actions after successful decline
      showAlert('success', 'Deposit declined successfully!');

      // Redirect to the appropriate page after a delay
      window.setTimeout(() => {
        location.assign('/deposits');
      }, 3000);
    } catch (error) {
      // Log the error for debugging
      showAlert('error', error.response.data.message);
    }
  });
});

document.querySelectorAll('.confirm-deposit-btn').forEach((button) => {
  button.addEventListener('click', async function () {
    const depositId = this.dataset.depositId;

    try {
      button.style.opacity = '0.5';
      button.textContent = 'Approving...';
      // Send a PUT request to the backend to approve the transaction
      const response = await axios.patch(
        `/api/v1/transactions/confirm-transaction/${depositId}`,
      );

      // Handle success message or any further actions after successful approval
      showAlert('success', 'Deposit approved successfully!');

      // Redirect to the appropriate page after a delay
      window.setTimeout(() => {
        location.assign('/deposits');
      }, 3000);
    } catch (error) {
      // Handle errors// Log the error for debugging
      showAlert('error', error.response.data.message);
    }
  });
});

document.querySelectorAll('.decline-withdrawal-btn').forEach((button) => {
  button.addEventListener('click', async function () {
    const withdrawalId = this.dataset.withdrawalId;

    try {
      button.style.opacity = '0.5';
      button.textContent = 'Declining...';
      // Send a PUT request to the backend to decline the transaction
      const response = await axios.patch(
        `/api/v1/transactions/decline-transaction/${withdrawalId}`,
      );

      // Handle success message or any further actions after successful decline
      showAlert('success', 'Withdrawal declined successfully!');

      // Redirect to the appropriate page after a delay
      window.setTimeout(() => {
        location.assign('/withdrawals');
      }, 3000);
    } catch (error) {
      // Handle errors// Log the error for debugging
      showAlert('error', error.response.data.message);
    }
  });
});

document.querySelectorAll('.confirm-withdrawal-btn').forEach((button) => {
  button.addEventListener('click', async function () {
    const withdrawalId = this.dataset.withdrawalId;

    try {
      button.style.opacity = '0.5';
      button.textContent = 'Approving...';
      // Send a PUT request to the backend to approve the transaction
      const response = await axios.patch(
        `/api/v1/transactions/confirm-transaction/${withdrawalId}`,
      );

      // Handle success message or any further actions after successful approval
      showAlert('success', 'Withdrawal approved successfully!');

      // Redirect to the appropriate page after a delay
      window.setTimeout(() => {
        location.assign('/withdrawals');
      }, 3000);
    } catch (error) {
      // Handle errors // Log the error for debugging
      showAlert('error', error.response.data.message);
    }
  });
});

document.querySelectorAll('.delete-user-btn').forEach((button) => {
  button.addEventListener('click', async function () {
    const userId = this.dataset.userId;

    try {
      button.style.opacity = '0.5';
      button.textContent = 'Deleting...';
      // Send a PUT request to the backend to decline the transaction
      const response = await axios.delete(`/api/v1/users/deleteUser/${userId}`);

      // Handle success message or any further actions after successful decline
      showAlert('success', 'User deleted successfully!');

      // Redirect to the appropriate page after a delay
      window.setTimeout(() => {
        location.assign('/users');
      }, 3000);
    } catch (error) {
      // Handle errors
      // Log the error for debugging
      showAlert('error', error.response.data.message);
    }
  });
});

document.querySelectorAll('.edit-plan-btn').forEach((button) => {
  button.addEventListener('click', function () {
    const planId = this.dataset.planId;

    const modal = document.getElementById('edit-plan');
    const submitBtn = document.querySelector('.submit-plan-edit-btn');

    submitBtn.addEventListener('click', async () => {
      const updatePlan = {
        name: document.getElementById('name').value,
        min: document.getElementById('min').value,
        max: document.getElementById('max').value,
        roi: document.getElementById('roi').value,
        duration: document.getElementById('duration').value,
      };

      try {
        const response = await axios.patch(
          `/api/v1/plans/edit-plan/${planId}`,
          updatePlan,
        );
        showAlert('success', 'Plan updated successfully!');
        // Redirect to the plans page after a delay
        window.setTimeout(() => {
          location.assign('/plans');
        }, 3000);
      } catch (error) {
        showAlert(
          'error',
          error.response.data.message ||
            'An error occurred while updating the plan',
        );
        console.error(error); // Log the error for debugging
      }
    });
  });
});

document.querySelectorAll('.plan-delete-btn').forEach((button) => {
  button.addEventListener('click', async function () {
    const planId = this.dataset.planId;

    try {
      button.style.opacity = '0.5';
      button.textContent = 'Deleting...';
      // Send a PUT request to the backend to decline the transaction
      const response = await axios.delete(
        `/api/v1/plans/delete-plan/${planId}`,
      );

      // Handle success message or any further actions after successful decline
      showAlert('success', 'Plan deleted successfully!');

      // Redirect to the appropriate page after a delay
      window.setTimeout(() => {
        location.assign('/delete-plan');
      }, 3000);
    } catch (error) {
      // Handle errors
      // Log the error for debugging
      showAlert('error', error.response.data.message);
    }
  });
});

document.querySelectorAll('.plan-btn').forEach((button) => {
  button.addEventListener('click', function () {
    const planId = this.dataset.planId;

    const modal = document.getElementById('edit-plan');
    const submitBtn = document.querySelector('.invest-btn');

    submitBtn.addEventListener('click', async () => {
      const updatePlan = {
        amount: document.getElementById('amount').value,
      };

      try {
        const response = await axios.post(
          `/api/v1/investments/invest/${planId}`,
          updatePlan,
        );
        showAlert('success', 'Plan activated successfully!');
        // Redirect to the login page after a delay
        window.setTimeout(() => {
          location.assign('/user-investments');
        }, 3000);
      } catch (error) {
        showAlert(
          'error',
          error.response.data.message ||
            'An error occurred while updating the plan',
        );
      }
    });
  });
});

const submitPayment = document.querySelector('.submit-payment');

if (submitPayment) {
  submitPayment.addEventListener('click', function () {
    // Process the deposit with the entered amount and selected wallet
    const amount = document.getElementById('amount').value;
    const walletSelect = document.getElementById('wallet');
    const walletAddress = walletSelect.value.split(' ')[0];
    const walletName = walletSelect.value.split(' ').pop();

    document.getElementById('depositAmount').value = amount;
    document.getElementById('contentToCopy').value = walletAddress;

    $('#deposit-modal').modal('show');

    document.getElementById('copy-btn').addEventListener('click', function () {
      const inputElement = document.getElementById('contentToCopy');
      const contentToCopy = inputElement.value;

      // Use the Clipboard API to copy text to the clipboard
      navigator.clipboard
        .writeText(contentToCopy)
        .then(() => {
          // Success callback
          alert('Copied to clipboard: ' + contentToCopy);
        })
        .catch((err) => {
          // Error callback
          console.error('Failed to copy: ', err);
        });
    });

    // Prepare the data to send to the server
    const data = {
      amount: amount,
      wallet: walletName,
    };

    document
      .querySelector('.made-payment-btn')
      .addEventListener('click', async function () {
        try {
          // Make the API call using Axios
          const response = await axios.post(
            '/api/v1/transactions/deposit',
            data,
          );

          // Handle the response from the server
          showAlert('success', 'Deposit is being processed!');
          // Redirect to the login page after a delay
          window.setTimeout(() => {
            location.assign('/deposit');
          }, 3000);
          // You can perform further actions based on the response, such as showing a success message or redirecting the user
        } catch (error) {
          // Handle errors
          showAlert('error', error.response.data.message);
          // You can show an error message to the user or perform other error handling logic
        }
      });
  });
}

document.querySelectorAll('.edit-wallet-btn').forEach((button) => {
  button.addEventListener('click', function () {
    const walletId = this.dataset.walletId;

    const modal = document.getElementById('edit-modal');
    const submitBtn = document.querySelector('.submit-wallet-edit-btn');

    submitBtn.addEventListener('click', async () => {
      const updateWallet = {
        name: document.getElementById('walletName').value,
        address: document.getElementById('address').value,
      };

      const response = await axios.patch(
        `/api/v1/wallets/edit-wallet/${walletId}`,
        updateWallet,
      );
      showAlert('success', 'Wallet updated successfully!');
      // Redirect to the login page after a delay
      window.setTimeout(() => {
        location.assign('/wallets');
      }, 3000);
    });
  });
});

document.querySelectorAll('.edit-contact-btn').forEach((button) => {
  button.addEventListener('click', function () {
    const contactId = this.dataset.contactId;

    const submitBtn = document.querySelector('.submit-contact-btn');

    submitBtn.addEventListener('click', async () => {
      const updateContact = {
        number: document.getElementById('contact').value,
      };

      const response = await axios.patch(
        `/api/v1/contacts/edit-contact/${contactId}`,
        updateContact,
      );
      showAlert('success', 'Contact updated successfully!');
      // Redirect to the login page after a delay
      window.setTimeout(() => {
        location.assign('/contacts');
      }, 3000);
    });
  });
});

document.querySelectorAll('.contact-delete-btn').forEach((button) => {
  button.addEventListener('click', async function () {
    const contactId = this.dataset.contactId;

    try {
      button.style.opacity = '0.5';
      button.textContent = 'Deleting...';
      // Send a PUT request to the backend to decline the transaction
      const response = await axios.delete(
        `/api/v1/contacts/delete-contact/${contactId}`,
      );

      // Handle success message or any further actions after successful decline
      showAlert('success', 'Contact deleted successfully!');

      // Redirect to the appropriate page after a delay
      window.setTimeout(() => {
        location.assign('/delete-contact');
      }, 3000);
    } catch (error) {
      // Handle errors
      // Log the error for debugging
      showAlert('error', error.response.data.message);
    }
  });
});
