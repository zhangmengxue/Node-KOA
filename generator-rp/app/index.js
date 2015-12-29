var generators = require('yeoman-generator');

module.exports = generators.Base.extend({
  method:function(){
    console.log('this is a method');
  },
  writing:function(){
    this.fs.copyTpl(
      this.templatePath('index.html'),
      this.destinationPath('public/index.html')
    );
  }
});
