import axios from '@/libs/axios';
import common from './constants';


let openApi = common.interfacePath.openApi;

export const upload = {
	base64Url: `${openApi}/basicdata/uploadbybase64`,
	url: `${openApi}/file/uploadFile`,
	regBussLicenseOcr: `${openApi}/ocrapi/ocr/regBussLicense`,
	regIdCardOcr: `${openApi}/ocrapi/ocr/regIdCardData`,
	file: params => { return axios.post(`${openApi}/basicdata/uploadbymultipart`, params); },
	getImgUrl: params => { return axios.get(`${openApi}/file/getSignedUrl`, {params}); },
}