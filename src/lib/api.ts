export const ENDPOINT = '/api';

export async function api_GET(url: string) {
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


export async function api_POST(url: string, data?: object) {
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

export async function api_PUT(url: string, data?: object) {
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

export async function api_DELETE(url: string, data?: object) {
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

