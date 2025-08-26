export const ENDPOINT = '/api';

async function get(url: string) {
    const headers: Record<string, string> = {
        "Accept": "application/json"
    }
    const response = await fetch(`${ENDPOINT}/${url}`, {
        headers: headers
    });
    if (response.status == 204) return null;
    if (!response.ok) {
        let respJson = await response.json();
        throw {
            status: response.status,
            message: respJson.message
        };
    }

    return response.json();
}


async function post(url: string, data?: object) {
    const headers: Record<string, string> = {
        "Accept": "application/json",
        "Content-Type": "application/json"
    }
    const response = await fetch(`${ENDPOINT}/${url}`, {
        method: "POST",
        headers: headers,
        body: data ? JSON.stringify(data) : undefined
    })
    if (response.status == 204) return null;
    if (!response.ok) {
        let responseText = await response.json();
        throw responseText;
    }
    return response.json();
}

async function put(url: string, data?: object) {
    const headers: Record<string, string> = {
        "Accept": "application/json",
        "Content-Type": "application/json"
    }
    const response = await fetch(`${ENDPOINT}/${url}`, {
        method: "PUT",
        headers: headers,
        body: data ? JSON.stringify(data) : undefined
    })
    if (response.status == 204) return null;
    if (!response.ok) {
        let responseText = await response.json();
        throw responseText;
    }
    return response.json();
}

async function delete_req(url: string, data?: object) {
    const headers: Record<string, string> = {
        "Accept": "application/json",
        "Content-Type": "application/json"
    }
    const response = await fetch(`${ENDPOINT}/${url}`, {
        method: "DELETE",
        headers: headers,
        body: data ? JSON.stringify(data) : undefined
    })
    if (response.status == 204) return null;
    if (!response.ok) {
        let responseText = await response.json();
        throw responseText;
    }
    return response.json();
}

export default { get, post, put, delete: delete_req }
