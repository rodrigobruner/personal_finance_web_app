// Definition of the application configuration
const appConfig = {
    app: {
        name: 'Personal Finance',
        version: '1.0.0 beta 1',
        url: 'http://localhost:3000',
        description:'This is a personal finance application',
    },
    api: {
        url: 'http://localhost:8080',
        version: 'v1'
    },
    locales: ['en-us', 'en-ca', 'pt-br'],
    defaultLocale: 'en-ca',
};

export default appConfig;