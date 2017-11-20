/**
 * GET /
 * How It Works page.
 */
exports.gethowitworks = (req, res) => {
  res.render('howitworks', {
    title: 'How It Works'
  });
};


