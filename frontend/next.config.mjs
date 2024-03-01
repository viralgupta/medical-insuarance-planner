export default () => {
    const rewrites = () => {
        return [
            {
                source: "/api/user/signup",
                destination: "https://j2l1xdlz-5000.inc1.devtunnels.ms/api/user/signup",
            },
            {
                source: "/api/user/login",
                destination: "https://j2l1xdlz-5000.inc1.devtunnels.ms/api/user/login",
            },
            {
                source: "/api/user/registerface",
                destination: "https://j2l1xdlz-5000.inc1.devtunnels.ms/api/user/registerface",
            },
            {
                source: "/api/user/confirmaadharfront",
                destination: "https://j2l1xdlz-5000.inc1.devtunnels.ms/api/user/confirmaadharfront",
            },
            {
                source: "/api/user/confirmaadharback",
                destination: "https://j2l1xdlz-5000.inc1.devtunnels.ms/api/user/confirmaadharback",
            },
            {
                source: "/api/user/getpdf",
                destination: "https://j2l1xdlz-5000.inc1.devtunnels.ms/api/user/getpdf",
            },
            {
                source: "/api/user/compareinsurance",
                destination: "https://j2l1xdlz-5000.inc1.devtunnels.ms/api/user/compareinsurance",
            },
            {
                source: "/api/askme/:question",
                destination: "https://j2l1xdlz-6000.inc1.devtunnels.ms/api/askme/:question",
            }
        ];
    };
    return {
        rewrites,
        reactStrictMode: false
    };
};