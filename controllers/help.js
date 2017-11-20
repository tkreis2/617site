/**
 * GET /
 * Home page.
 */
exports.gethelp = (req, res) => {
  res.render('help', {
    title: 'Help'
  });
};


