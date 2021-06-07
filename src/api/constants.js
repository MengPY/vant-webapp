let common = {
    interfacePath: function () {
        let server = '/';
        switch (location.hostname) {
            // 测试环境
            case '119.3.27.90':
                server = 'http://119.3.27.90/api';
                break;
            // 正式环境
            case '122.9.81.224':
                server = 'http://122.9.81.224/api';
                break;
            case 'itg.e-raising.cn':
                server = 'https://itg.e-raising.cn';
                break;
            case 'scc.itg.com.cn':
                server = 'https://scc.itg.com.cn/api';
                break;
            case '172.20.13.3':
                server = 'http://172.20.13.3/api';
                break;
            case '172.20.13.131':
                server = 'http://172.20.13.131/api';
                break;
            default:
                server = 'http://119.3.27.90/api';
        }


        return {
            server: server,
            basic: server + "/basic",
            member: server + '/member',
            openApi: server + '/openapi',
            fileServer: server + '/openapi/n/file/',
            fileServerDownload: server + '/openapi/n/file/downloadFile/',
        }
    }(),

};
window.common = common;
export default common