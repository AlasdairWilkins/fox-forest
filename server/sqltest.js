const sqlite3 = require('sqlite3').verbose()
//
let db = new sqlite3.Database('./db/sample.db', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the chinook database.');
});

db.run('CREATE TABLE langs(name text)');

db.close();

// db.serialize(() => {
//     db.each(`SELECT PlaylistId as id,
//      Name as name
//      FROM playlists`, (err, row) => {
//     if (err) {
//         console.error(err.message)
//     }
//     console.log(row.id + "\t" + row.name);
// })
// })
//
// let sql = `SELECT FirstName firstName,
//                   LastName lastName,
//                   Email email
//             FROM customers
//             WHERE Country = ?
//             ORDER BY FirstName`;
//
// db.each(sql, ['USA'],(err, row) => {
//     if (err) {
//         throw err
//     }
//     console.log(`${row.firstName} ${row.lastName} - ${row.email}`);
// })
//
// db.close((err) => {
//     if (err) {
//         return console.error(err.message);
//     }
//     console.log('Close the database connection.')
// })