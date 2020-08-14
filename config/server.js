/* importar o módulo do framework express */
var express = require('express');

/* importar o módulo do body-parser */
var bodyParser = require('body-parser');

/* importar o módulo do express-validator */
// var expressValidator = require('express-validator');

/* iniciar o objeto do express */
var app = express();


/* configurar o middleware body-parser */
app.use(bodyParser.urlencoded({extended: true}));

/* configurar o middleware express-validator */
// app.use(expressValidator());


// const sql = require('mssql')
// async () => {
// 	try {
// 		await new sql.connect({
// 			user : 'sa',
// 			password : ' ',
// 			server : 'localhost',
// 			database : 'Users'
// 		});
// 	} catch (err) {

// 	}
// }

//var connection = require('./dbConnection')
var DataType = require('../app/models/dataType.js')
var Parameters = require('../app/models/parameters.js')
var params = []
var p = new Parameters('Id', 4, DataType.Int)
params.push(p)

var query = `SELECT contato.* FROM Contato contato WHERE Id = @Id`
var teste = require('../app/dao/baseDAO')

teste.Select(query, params).then(function(response) {
    console.log(JSON.stringify(response))
}).catch((err) => { 
    console.log('ERRROOOOOUUUUU: ', err.message)
})

/* exportar o objeto app */
module.exports = app;