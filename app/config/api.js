'use strict';

module.exports = {

    checkStatus: function(response) {
        if (response.status >= 200 && response.status < 300) {
            return response;
        } else {
            let error = new Error(response.statusText);
            error.response = response;
            throw error;
        }
    },

    fetchData: function(url, formData, screenProps) {
        if(screenProps && screenProps.lang_latin){
            formData.append('lat', 1);
        }

        return fetch(url, {method: "POST", body: formData})
            .then(this.checkStatus)
            .then(response => response.json())
            .then((responseText) => {
                return responseText;
            })
            .catch((e) => {
                console.log('Error fetch: ' + e.message);
                if(e.message == "Network request failed") return "No connection";
            })
        //formData.append('lat', 1);

    },

    getJson: function( url, screenProps ) {
        return fetch( url )
            .then(this.checkStatus)
            .then((response) => response.json())
            .then((responseJson) => {
                return responseJson;
            })
            .catch((e) => {
                console.log('Error fetch: ' + e.message);
                if(e.message == "Network request failed") return "No connection";
            })
    },


}
