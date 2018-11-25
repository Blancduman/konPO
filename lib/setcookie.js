module.exports = (res, data) => {
  res.cookie('usertoken', JSON.stringify(data), {
    expires: new Date(Date.now() + 2 * 604800000),
    path: '/'
  });
}