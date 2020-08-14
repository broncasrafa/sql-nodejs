var _tedious = require('tedious')
var Connection = _tedious.Connection
var Request = _tedious.Request
var TYPES = _tedious.TYPES

// criando a conexão com a base de dados
var config = {
    server: 'localhost',
    authentication: {
        type: 'default',
        options: {
            userName: 'sa',
            password: ''
        }
    },
    options: {
        database: 'ContatosAngularWebAPI',
        port: 1433
    }
}

var connection = new Connection(config)

connection.on('connect', function(err) {
    if(err) {
        console.log('ERROR:', err)
    } else {
        console.log('Connected')

        Select(connection)
    }

})

function Select(connection) {
    Request = new Request(`
           SELECT c.Id
                , c.Nome
                , c.Sobrenome
                , em.Descricao
                , e.Logradouro
                , e.Numero
                , e.Bairro
                , e.Complemento
                , e.CEP
                , e.Cidade
                , e.Estado
                , p.Link
                , t.Numero
             FROM Contato c
       INNER JOIN Email em ON em.ContatoId = c.Id
       INNER JOIN Endereco e ON e.ContatoId = c.Id
       INNER JOIN Perfil p ON p.ContatoId = c.Id
       INNER JOIN Telefone t ON t.ContatoId = c.Id
            WHERE c.Id = 1`, (err, rowCount, rows) => {
        if(err) {
            console.log('erro:', err)
        } else {
            console.log('linhas retornadas: ' + rowCount)
        }
    })
    
    var result = ''
    
    Request.on('row', function(columns) {
        columns.forEach(function(column) {
            if (column.value === null) {
                console.log('NULL');
            } else {
                result += column.value + " - ";
            }
        });
        console.log(result);
        result = "";
    });
    
    // Execute SQL statement
    connection.execSql(Request);
}
