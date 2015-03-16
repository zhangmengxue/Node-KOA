module.exports = {

  index: function *() {
    this.body = 'index';
  },

  create: function *(id) {
    this.body = id ? 'update:'+id : 'create';
  },

  secure: function *() {
    this.body = 'secret';
  }

};
