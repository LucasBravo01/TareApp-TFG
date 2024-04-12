"use strict"

class DAOCategory {
    constructor(pool){
        this.pool = pool;//tener el pool conexion

        this.readAllCategories = this.readAllCategories.bind(this);
        this.checkCategoriaExists = this.checkCategoryExists.bind(this);
    }

    readAllCategories(callback) {
        this.pool.getConnection((error, connection) => {
            if (error) {
                callback(-1);
            }
            else {
                let querySQL = "SELECT * FROM category";
                connection.query(querySQL, (error, rows) => {
                    connection.release();
                    if (error) {
                        callback(-1);
                    }
                    else {
                        // Construir objeto
                        let categories = new Array();
                        rows.forEach(row => {
                            let category = {
                                name: row.name,
                                icon: row.icon
                            }
                            categories.push(category);
                        });
                        callback(null, categories);
                    }
                });
            }
        });
    }

    checkCategoryExists(nameCategory, callback) {
        this.pool.getConnection((error, connection) => {
            if (error) {
                callback(-1);
            }
            else {
                let querySQL = "SELECT COUNT(*) AS count FROM category WHERE name = ?";
                connection.query(querySQL, [nameCategory], (error, rows) => {
                    connection.release();
                    if (error) {
                        callback(-1);
                    }
                    else {
                        if (rows[0].count > 0) {
                            callback(null, true); // La categoría existe
                        }
                        else {
                            callback(null, false); // La categoría no existe
                        }
                    }
                });
            }
        });
    }
}

module.exports = DAOCategory;