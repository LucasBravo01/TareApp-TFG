"use strict"

class DAOCategory {
    // Constructor
    constructor(pool) {
        this.pool = pool;

        // SELECTs
        this.readAllCategories = this.readAllCategories.bind(this);
        this.readCategoryByName = this.readCategoryByName.bind(this);
    }

    // SELECTs
    // Leer todas las categorías
    readAllCategories(callback) {
        this.pool.getConnection((error, connection) => {
            if (error) {
                callback(-1);
            }
            else {
                let querySQL = "SELECT * FROM category;";
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
                                category_icon: row.category_icon,
                                category_photo: row.category_photo
                            }
                            categories.push(category);
                        });
                        callback(null, categories);
                    }
                });
            }
        });
    }

    // Leer categoria dado un nombre
    readCategoryByName(nameCategory, callback) {
        this.pool.getConnection((error, connection) => {
            if (error) {
                callback(-1);
            }
            else {
                let querySQL = "SELECT COUNT(*) AS count FROM category WHERE name = ?;";
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