module.exports = {

  '/': { to: '/users' },
  'get /users': { to: 'controller#index' },
  'post|put /users/:id?': { to: 'controller#create' },
  'delete /delete': { to: function *() { this.body = 'delete'; }},
  'get /secure': { to: 'controller#secure', constraint: 'constraint#basic' }

};
