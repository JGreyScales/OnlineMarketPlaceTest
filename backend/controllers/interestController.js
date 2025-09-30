const connection = require("../models/db")


class Interest {
    MAX_INTEREST_LENGTH = 20
    #tag = ""
    #tagID = 0

    constructor(tag = "", tagID = 0){
        this.#tag = tag
        this.#tagID = tagID
    }

    delinkTag(tagID, targetID, targetColumn) {
        return new Promise((resolve, reject) => {
            let query = `DELETE FROM Interest_bridge WHERE tagID = ? AND  ${targetColumn} = ?`
            connection.query(query, [tagID, targetID], (err, results) => {
                if (err) return reject({statusCode: 400, message: `Database query error:${err.sqlMessage}`});
                resolve({statusCode: 202, message: 'link removed'})
            })
        })
    }

    linkTag(valueDict) {
        return new Promise((resolve, reject) => {
            let query = "INSERT INTO Interest_bridge (";
            const columnNameList = [];
            const valuesList = [];
    
            for (let field in valueDict) {
                columnNameList.push(field);
                valuesList.push(valueDict[field]);
            }
    
            query += columnNameList.join(', ') + ") VALUES (";
            query += valuesList.map(() => '?').join(', ') + ")";
    


            connection.query(query, valuesList, (err, results) => {
                if (err) return reject({statusCode: 400, message: `Database query error:${err.sqlMessage}`});
                resolve({statusCode: 202, message: 'Object linked'});
            });
        });
    }
    

    autocompleteInterest(value){
        return new Promise((resolve, reject) => {
            let query = 'SELECT tag, tagID FROM Interest WHERE tag LIKE ? LIMIT 5'
            let queryTag = `%${value.toLowerCase()}%`
            connection.query(query, [queryTag], (err, results) => {
                if (err) return reject({statusCode: 400, message: `Database query error:${err.sqlMessage}`});
                if (results.length === 0) return resolve({statusCode: 404, data: []});

                resolve({statusCode: 200, data: results})
            })
        })
    }

    getXValues(maxLimit, column){
        return new Promise((resolve, reject) => {
            let query = `SELECT ${column} FROM Interest_bridge WHERE tagID = ? ORDER BY RAND() LIMIT ?`
            connection.query(query, [this.#tagID, maxLimit], (err, results) => {
                if (err) return reject({statusCode: 400, message: `Database query error:${err.sqlMessage}`});
                if (results.length === 0) return resolve({statusCode: 404, data: []});

                resolve(results.map({statusCode: 200, data: row => row[column]}))
            })
        })
    }

    getTag(){
        return this.#tag
    }

    getTagID(){
        return this.#tagID
    }
}


module.exports = {Interest}