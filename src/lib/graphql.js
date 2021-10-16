
const token = 'e0348a04794c27c1d6d4e63ee7cc1f';
const api_url = 'https://graphql.datocms.com';

export async function graphql(query){
    
    var res = await fetch(api_url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
            query: query
        }),
    });
    res = await res.json();
    return res.data;

}

export async function uploadImage(file){

    var fd = new FormData();
    fd.append('fileUpload', file);
    
    var res = await fetch(api_url + '/upload', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
        body: fd,
    });

    res = await res.json();

    return res;

}