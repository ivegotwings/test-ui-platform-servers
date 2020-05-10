var typeDomainJson = require('./typedomain.json').response.entityModels
var fs = require('fs')
var entityTypeDomainMap = {}

for (entry in typeDomainJson) {
    if (!entityTypeDomainMap[typeDomainJson[entry].id]) {
        //console.log
        entityTypeDomainMap[typeDomainJson[entry].id] = typeDomainJson[entry].domain
    }
}

fs.writeFileSync("entityTypeDomainMap.json", JSON.stringify(entityTypeDomainMap, null, 2))