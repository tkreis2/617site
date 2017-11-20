/**
 * GET /
 * Home page.
 */
exports.getsuccessstories = (req, res) => {
  res.render('successstories', {
    title: 'Success Stories'
  });
};


