/* importar o módulo do framework express */
const express = require('express');

/* importar o módulo do consign */
const consign = require('consign');

/* importar o módulo do body-parser */
const bodyParser = require('body-parser');

/* importar o módulo do express-validator */
const expressValidator = require('express-validator');

/*Importando modulo morgan*/
const morgan = require('morgan');

/* iniciar o objeto do express */
const app = express();

/* Variaveis de ambiente. */
const env = require('dotenv');

/* Importando o módulo do mongoose. */
const mongoose = require('mongoose');

/* Importando o módulo express-session. */
//  Importando o módulo do path.
const path = require('path');

const compression = require('compression');

const expressSession = require('express-session');

const MongoDBStore = require('connect-mongodb-session')(expressSession);

/* setar as variáveis 'view engine' e 'views' do express */

app.set('view engine', 'ejs');
app.set('views', './src/views');

app.use(compression());

/* configurar o middleware express.static */
app.use(express.static('./public'));

/* configurar o middleware body-parser */
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

/* configurar o middleware express-validator */
app.use(expressValidator());

/* Setando morgan */
app.use(morgan('dev'));

const store = new MongoDBStore({
    uri: process.env.DATABASE,
    collection: 'sessions'
});

store.on('connected', function() {
    store.client; // The underlying MongoClient object from the MongoDB driver
});

// Catch errors
store.on('error', function(error) {
    assert.ifError(error);
    assert.ok(false);
});

/* Configurar o middleware express-session */
app.use(expressSession({
    secret: '80d499cac5e64c17620654587ec37dc5',
    resave: true,
    saveUninitialized: true,
    cookie: {expires: new Date(253402300000000)},
    store: store
}));

/* efetua o autoload das rotas, dos models e dos controllers para o objeto app */
consign().include('src/models')
	.then('src/routes').into(app);

/* Extraindo variaveis de ambiente. */
env.config({ path: './env/dev.env' });



/* Conecta com o banco de dados e lida com problemas de conexão */
mongoose.connect(process.env.DATABASE, { useNewUrlParser: true });
mongoose.Promise = global.Promise; // → Queremos que o mongoose utilize promises ES6
mongoose.connection.on('error',err => {
	console.log(`🙅 🚫 → ${err.message}`);
});

/* exportar o objeto app */
module.exports = app;
