import { getGlobal } from 'reactn';
import axios from 'axios';

const Net = {
    
    get: async function(url){
    	url = (window.location.hostname === "localhost" ? process.env.REACT_APP_API_URL_DEV : process.env.REACT_APP_API_URL_PROD) + url;
        
        // si la url no es login o recuperar contraseña
        // adjuntar como parametro el token
        if(url.indexOf('login') === -1 && url.indexOf('recover-password') === -1){
        	url = this.addParameterToURL(url, 'token', getGlobal().apiToken);
        }
        
        console.log('\n--------------------------------------------------------------------------------\n');
        console.log('🦊 GET:');
        console.log(url);

        try{
            const response = await axios.get(url);
            return response.data;
        }catch(error){
            return this.handleErrors(error.response);
        }

    },

    post: async function(url, body, is_multipart = false){
    	url = (window.location.hostname === "localhost" ? process.env.REACT_APP_API_URL_DEV : process.env.REACT_APP_API_URL_PROD) + url;

    	// si la url no es login o recuperar contraseña
        // adjuntar como parametro el token
        if(url.indexOf('login') === -1 && url.indexOf('recuperar-clave') === -1){
        	url = this.addParameterToURL(url, 'token', getGlobal().apiToken);
        }

        
        console.log('\n--------------------------------------------------------------------------------\n');
        console.log('🌴 POST:')
        console.log(url);
        if(body)
            console.log(JSON.stringify(body));
        var config = null;
        if(is_multipart){
            config = { headers: { 'content-type': 'multipart/form-data' }};
        }
        try{
            const response = await axios.post(url, body, config);
            return response.data;
        }catch(error){
            return this.handleErrors(error.response);
        }
        
    },


    handleErrors: async function(error){
    	if(!error){
    		// error === null, network error
    		return false;
    	}
        console.log('error code:' + error.status);
        
        // Unauthorized, redirecicona al login si no está haciendo login
        if(error.status === 401 && error.config.url.indexOf('login') === -1 && error.config.url.indexOf('logout') === -1){
            global.logout();
            return false;
        }

        if(error.status === 400 && (error.data[0] === 'token_invalid' || error.data.error === 'invalid_credentials' || error.data.message === 'token not authenticated')){
            global.logout();
            return false;
        }

        
        if(error.status === 500){
            console.log('error 500');
            if(error.data){
            	console.log(JSON.stringify(error.data));
            }
            return false;
        }

        if(error.status === 404){
            console.log('Error 404');
            return false;
        }

        return error.data;
    },


    addParameterToURL: function(url,key,value){
		if(value !== undefined){
			value = encodeURI(value);
		}
		var hashIndex = url.indexOf("#")|0;
		if (hashIndex === -1) hashIndex = url.length|0;
		var urls = url.substring(0, hashIndex).split('?');
		var baseUrl = urls[0];
		var parameters = '';
		var outPara = {};
		if(urls.length>1){
			parameters = urls[1];
		}
		if(parameters !== ''){
			parameters = parameters.split('&');
			for(var k in parameters){
				var keyVal = parameters[k];
			  	keyVal = keyVal.split('=');
			  	var ekey = keyVal[0];
			  	var evalue = '';
			  	if(keyVal.length>1){
			    	evalue = keyVal[1];
			  	}
			  	outPara[ekey] = evalue;
			}
		}
		if(value !== undefined){
			outPara[key] = value;
		}else{
			delete outPara[key];
		}
		parameters = [];
		for(var p in outPara){
			parameters.push(p + '=' + outPara[k]);
		}
		var finalUrl = baseUrl;
		if(parameters.length>0){
			finalUrl += '?' + parameters.join('&'); 
		}
		return finalUrl + url.substring(hashIndex); 
	}

}

export default Net;