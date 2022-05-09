## Introduction

Welcome to the COVID in New Zealand API, an easy access source for COVID-19 data and statistics in the land of the Long White Cloud!

The API is designed to be simple to use without the need for any authorisation, just make a basic request to any endpoint and receive the data in a JSON format.

## Rate Limiting

You are allowed up to 60 requests every minute, anymore and you will start receiving statuses of 429.

## Base Response

```js
{
    "success": boolean, // Whether the request was successful
    "data": { // Exists only if the request was a success
        "fromCache": boolean, // Whether this data was from the servers cache, data is cached often to prevent making too many requests to the source
        "checkedAt": string, // The last time the server checked the source for an update (format: YYYY-MM-DDThh:mm:ss.sTZD)
        "updatedAt": string, // The last time the source updated its data (format: YYYY-MM-DDThh:mm:ss.sTZD)
        ... // The rest of the payload will appear here
    },
    "error": { // Exists only if the request failed
        "status": number, // The HTTP status of this response, for example: 400, 404, 418, etc
        "message": string, // The HTTP message for the status, for example; 'Bad Request', 'Not Found', etc
        "details": string, // The specific reason this request failed, human readable
    }
}
```
