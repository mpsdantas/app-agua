const controllerCadastroUsuario = require('../controllers/publico/cadastrarUsuario');
module.exports = (application) => {
    
    application.get('/publico/login', (req, res) => {res.render('public/login')});

    application.get('/publico/cadastro', (req, res) => {res.render('public/cadastro', {erros:[]})});

    application.post('/publico/cadastro', (req, res) => {controllerCadastroUsuario.realizarCadastro(req, res)});

};