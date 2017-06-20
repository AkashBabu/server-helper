module.exports = {
    options: {
        collName: 'users',
        connStr: 'cookie_test',
        secret: 'cookie',
        login: {
            successRedirect: "/portal/index",
            failureRedirect: "/portal/login",
            failureFlash: false
        },
        register: {
            successRedirect: "/portal/index",
            failureRedirect: "/portal/login",
            failureFlash: false
        },
        cookie: {
            maxAge: 1000 * 60 * 60 * 24,
            sameSite: true,
        },
        redisStore: {
            ttl: 1000 * 60 * 60 * 24,
            host: "localhost",
            port: 6379,
            prefix: "sess:"
        }
    }
}