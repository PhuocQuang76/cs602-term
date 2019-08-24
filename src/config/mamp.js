
module.exports = {
    mysql: {
        user: 'cs602user',
        password: 'cs602password',
        database: 'cs602_term',
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