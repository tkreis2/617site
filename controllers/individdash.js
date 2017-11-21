/**
 * GET /
 * Individ Dash page.
 */
exports.index = (req, res) => {
  res.render('individdash', {
    title: 'My Dashboard - HealthWe'
  });
};


