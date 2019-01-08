const mongoose = require('mongoose');
const Usuario = mongoose.model('Usuario');
const validatorCadastro = require('../../validators/publico/cadastrarUsuario');
const variables = require('../../../config/variables');
const crypto = require('crypto');

exports.realizarCadastro = async (req, res) => {
    const erros = validatorCadastro.errosCadastro(req);
    
    if(erros) return res.render('public/cadastro',{erros:erros});
    
    const buscaUsuario = await Usuario.findOne({email: req.body.email});

    if(buscaUsuario) return res.render('public/cadastro',{erros:[{msg:"E-mail já cadastrado."}]});

    req.body.senha = crypto.createHmac('sha256', variables.secret).update(req.body.senha).digest('hex');
    const permissoes = ["publico"];
    
    req.body.permissoes = ["publico"];
    
    const novoUsuario = new Usuario(req.body);

    try{
        await novoUsuario.save();
        req.session.permissoes = req.body.permissoes;
        req.session.email = req.body.email;
        req.session.nome  = req.body.nome;
        req.session.autenticado = true;
        return res.redirect('/publico/login');
    }catch(err){
        console.log(err)
        return res.render('public/cadastro',{erros:[{msg:"(500) Erro de processamento no sistema."}]});
    }

};