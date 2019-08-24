
module.exports = {
    mysql: {
        user: 'cs602pquser',
        password: 'cs602pqpassword',
        database: 'cs602termpq',
        host: 'localhost',
        port: 3306,
        "connector": "mysql",
        "socketPath": "/Applications/MAMP/tmp/mysql/mysql.sock"
        //jdbc:mysql://localhost:3306/cs602db
    },
    app: {
        title: 'Phuoc Quang\'s Nail Shop',
        tempFilePath: './temp/img/items',
        imageUploadPath: './public/img',
        localImageUrl: '/img'
    }
};