export default () => {
    const rewrites = () => {
        return [
            {
                source: "/api/user/signup",
                destination: "http://localhost:5000/api/user/signup",
            },
            {
                source: "/api/user/login",
                destination: "http://localhost:5000/api/user/login",
            },
            {
                source: "/api/user/registerface",
                destination: "http://localhost:5000/api/user/registerface",
            },
            {
                source: "/api/user/confirmaadharfront",
                destination: "http://localhost:5000/api/user/confirmaadharfront",
            },
            {
                source: "/api/user/confirmaadharback",
                destination: "http://localhost:5000/api/user/confirmaadharback",
            },
            {
                source: "/api/user/getpdf",
                destination: "http://localhost:5000/api/user/getpdf",
            },
            {
                source: "/api/user/compareinsurance",
                destination: "http://localhost:5000/api/user/compareinsurance",
            },
            {
                source: "/api/askme/:question",
                destination: "http://localhost:6000/api/askme/:question",
            }
        ];
    };
    return {
        rewrites,
        reactStrictMode: false
    };
};