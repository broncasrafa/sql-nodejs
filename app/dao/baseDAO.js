var _tedious = require('tedious')
var Connection = _tedious.Connection
var Request = _tedious.Request
var TYPES = _tedious.TYPES
var Promise = require('bluebird');




function getConnection() {
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
            port: 1433,
            rowCollectionOnRequestCompletion: true
        }
    }

    var connection = new Connection(config)

    return connection
}



function getDataType(type) {
    var dataType = TYPES.Null

    switch(type) {
        case "Bit": dataType = TYPES.Bit; break;
        case "TinyInt": dataType = TYPES.TinyInt; break;
        case "SmallInt": dataType = TYPES.SmallInt; break;
        case "Int": dataType = TYPES.Int; break;
        case "BigInt": dataType = TYPES.BigInt; break;
        case "Numeric": dataType = TYPES.Numeric; break;
        case "Decimal": dataType = TYPES.Decimal; break;
        case "SmallMoney": dataType = TYPES.SmallMoney; break;
        case "Money": dataType = TYPES.Money; break;
        case "Float": dataType = TYPES.Float; break;
        case "Real": dataType = TYPES.Real; break;
        case "SmallDateTime": dataType = TYPES.SmallDateTime; break;
        case "DateTime": dataType = TYPES.DateTime; break;
        case "DateTime2": dataType = TYPES.DateTime2; break;
        case "DateTimeOffset": dataType = TYPES.DateTimeOffset; break;
        case "Time": dataType = TYPES.Time; break;
        case "Date": dataType = TYPES.Date; break;
        case "Char": dataType = TYPES.Char; break;
        case "VarChar": dataType = TYPES.VarChar; break;
        case "Text": dataType = TYPES.Text; break;
        case "NChar": dataType = TYPES.NChar; break;
        case "NVarChar": dataType = TYPES.NVarChar; break;
        case "NText": dataType = TYPES.NText; break;
        case "Binary": dataType = TYPES.Binary; break;
        case "VarBinary": dataType = TYPES.VarBinary; break;
        case "Image": dataType = TYPES.Image; break;
        case "Null": dataType = TYPES.Null; break;
        case "TVP": dataType = TYPES.TVP; break;
        case "UDT": dataType = TYPES.UDT; break;
        case "UniqueIdentifier": dataType = TYPES.UniqueIdentifier; break;
        case "Variant": dataType = TYPES.Variant; break;
        case "xml": dataType = TYPES.xml; break;
    }
    console.log(dataType)
    return dataType
}

function getObjectReturn(status, message, rowCount, results){
    return {
        status: status, message: message, rowCount: rowCount, results: results
    }
}





module.exports.Select = function(query, objParams) {

    return new Promise(function(resolve, reject) {
        if(!query) {
            return reject(new Error('Argument "query" must be specified'));
        }

        try {                        

            var connection = getConnection()
    
            connection.on('connect', function(err) {
                if(err) {                    
                    throw new Error('Connection failed')
                } else {
                    console.log('Connected')
                                
                    var jsonArray = []
    
                    Request = new Request(query, (err, rowCount, rows) => {
                        if(err) {                                                        
                            var objReturn = getObjectReturn('ERROR', `Query completed with errors. ${err.message}`, 0, null)
                            reject(new Error(JSON.stringify(objReturn)));
                        } else {                            
                            var objReturn = getObjectReturn('OK',`Query executed successfully. (${rowCount} row(s) affected)`, rowCount, jsonArray)
                            return resolve(objReturn)                                         
                        }
                    }) 
    
                    if(objParams != null && objParams != undefined && objParams.length > 0) {

                        objParams.forEach(function(param) {
                            Request.addParameter(param.name, (param.value == null || param.value == undefined) ? TYPES.Null : `TYPES.${getDataType(param.type).name}`, param.value)
                        });
                    }    
                    
                    Request.on('row', function(columns) {
                        var rowObj = {}
                        columns.forEach(function(column) {
                            rowObj[column.metadata.colName] = column.value                                                
                        });
                        
                        jsonArray.push(rowObj)                 
                    }); 
                    
                    connection.execSql(Request);
                }
            })        
        } catch(ex) {
            throw ex
        }


    })



    
}

module.exports.Update = function(query){

}

module.exports.Delete = function(query){

}

module.exports.Insert = function(query){

}