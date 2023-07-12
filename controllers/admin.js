const db = require('../db/index');
const validator = require('../validator/UserValidator');

exports.validate = async (req, res) => {
  if (!validator.validateEmail(req.body.email)) {
    return res.status(422).json();
  }

  try {
    const user = await db.Merchand.findOne({ where: { email: req.body.email } });
    if (!user) {
      return res.status(404).json();
    }

    const updated = await user.update({ confirmation: true });

    if (updated) {
      return res.status(200).json({
        confirmation: updated.confirmation,
      });
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
  }
  return res.status(500).json();
};
exports.invalidate = async (req, res) => {
  if (!validator.validateEmail(req.body.email)) {
    return res.status(422).json();
  }

  try {
    const user = await db.Merchand.findOne({ where: { email: req.body.email } });
    if (!user) {
      return res.status(404).json();
    }

    const updated = await user.update({ confirmation: false });

    if (updated) {
      return res.status(200).json({
        confirmation: updated.confirmation,
      });
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
  }
  return res.status(500).json();
};
