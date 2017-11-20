/**
 * GET /
 * Home page.
 */
exports.getgetstarted = (req, res) => {
  res.render('getstarted', {
    title: 'Get Started'
  });
};


