router.get('/protected-data', authenticateToken, (req, res) => {
  res.json({ 
    data: 'Sensitive data',
    user: req.user 
  });
});