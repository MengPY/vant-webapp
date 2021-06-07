import plupload from "plupload";
import util from "@/libs/util.js";
import vm from "../main";

export const getPluploader = param => {
    var reqData = param.reqData

    //上传图片
    var uploader = new plupload.Uploader({ //实例化一个plupload上传对象
        browse_button: param.browse_button,//上传ID
        url: param.url,
        // chunk_size: param.chunk_size || '512kb',    //后台分布式问题，先不用分段上传
        max_retries: 3,
        flash_swf_url: '../../../../base/js/core/Moxie.swf',
        silverlight_xap_url: '../../../../base/js/core/Moxie.xap',
        filters: {
            // mime_types : [ //只允许上传图片和zip文件
            //     { title : "Image files", extensions : "jpg,gif,png" },
            //     { title : "Zip files", extensions : "zip,rar" },
            //     { title : "Document files", extensions : "doc,pdf,docx,xls,xlsx" }
            // ],
            // mime_types: param.mine_types,
            max_file_size: param.max_file_size || '10485760' //最大只能上传5120kb的文件
        }
    });
    uploader.init(); //初始化

    uploader.bind('BeforeUpload', function (uploader, files) { //传入表单参数
        let token = JSON.parse(window.localStorage.getItem("userAppInfo")).token;
        uploader.setOption("headers", {
            'Authorization': token
        });
        if (!reqData) { return; }
        uploader.setOption("multipart_params", {
            reqData: JSON.stringify(reqData)
        });
    });

    uploader.bind('FilesAdded', function (uploader, files) {
        if (param.FilesAdded && !param.FilesAdded(files)) { return; }
        param.FileStartUpload && param.FileStartUpload()
        uploader.start();
    });

    uploader.bind('Error', function (uploader, errObject) {
        if (errObject.code == -602) {
            vm.$Message.warning('不能选择相同文件！');
        }
        if (errObject.code == -601) {
            vm.$Message.warning('不支持该文件类型上传，请重新选择！');
        }

        if (errObject.code == -600) {
            vm.$Message.warning('单个文件不能超过10M，请压缩后上传！');
        }
    });
    uploader.bind('FileUploaded', function (uploader, files, res) {
        var response = res.response.replace("<pre>", "").replace("</pre>", "").replace("<PRE>", "").replace("</PRE>", "").replace(/<[^>]+>/g, "")
        var data = JSON.parse(response);
        util.parseReponse(data)
        param.FileUploaded && param.FileUploaded(data, files);
    });

    return uploader;
}
