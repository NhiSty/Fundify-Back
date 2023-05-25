const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.signup = (req, res) => {
  switch (true) {
    case !req.body.email:
      return res.status(400).json({ error: 'Email is missing' });
    case req.body.email === '':
      return res.status(400).json({ error: 'Email is empty' });
    case !/^[a-z0-9._-]+@[a-z0-9._-]{2,}\.[a-z]{2,4}$/.test(req.body.email):
      return res.status(400).json({ error: 'Email is not valid, please enter a valid email' });
    case !req.body.password:
      return res.status(400).json({ error: 'Password is missing' });
    case req.body.password === '':
      return res.status(400).json({ error: 'Password is empty' });
    case !/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/.test(req.body.password):
      return res.status(400).json({ error: 'Password must contain at least 8 characters, 1 uppercase letter, 1 lowercase letter and 1 number' });
  }

  bcrypt.hash(req.body.password, 10)
    .then((hash) => {
      const user = new User({
        email: req.body.email,
        password: hash
      });
      user.save()
        .then(() => res.status(201).json({
          message: 'User created successfully!',
          data : {
            email: user.email,
            userId: user._id
          }
        }) )
        .catch((error) => res.status(400).json({ error }))
    })
    .catch((error) => res.status(500).json({ error }));
};

exports.login = (req, res) => {
  User.findOne({ email: req.body.email.toString() })
      .then((user) => {
          if (!user) {
              return res.status(401).json({ error: 'Paire login/mot de passe incorrecte'})
          }
          bcrypt.compare(req.body.password, user.password)
              .then((valid) => {
                  if (!valid) {
                      return res.status(401).json({ error: 'Paire login/mot de passe incorrecte' })
                  }
                  res.status(200).json({
                      userId: user._id,
                      token: jwt.sign(
                        { userId: user._id },
                        `${process.env.JWT_SECRET}`,
                        { expiresIn: '24h' }
                    )
                  })
              })
              .catch((error) => res.status(500).json({ error }));
      })
      .catch((error) => res.status(500).json({ error }));
};
