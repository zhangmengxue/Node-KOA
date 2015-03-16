module.exports = {

  basic: function*(next) {
    if (this.get('authorization') == 'Basic base64') {
      yield next;
    } else {
      this.body = 'Unauthorized access';
      this.status = 401;
    }
  }

};
