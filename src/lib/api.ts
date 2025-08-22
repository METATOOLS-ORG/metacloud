export const ENDPOINT = '/api';

export async function get(url: string) {
    const headers: Record<string, string> = {
        "Accept": "application/json"
    }
    const response = await fetch(`${ENDPOINT}/${url}`, {
        headers: headers
    });

    if (!response.ok) {
        let respJson = await response.json();
        throw {
            status: response.status,
            message: respJson.message
        };
    }

    return response.json();
}


export async function post(url: string, data: object) {
    const headers: Record<string, string> = {
        "Accept": "application/json",
        "Content-Type": "application/json"
    }
    const response = await fetch(`${ENDPOINT}/${url}`, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(data)
    })
    if (!response.ok) {
        let responseText = await response.json();
        throw responseText;
    }
    return response.json();
}
