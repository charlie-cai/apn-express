import http2 from 'node:http2';

export function post(url, headers, payload) {
    console.debug('payload', payload);
    return new Promise((resolve, reject) => {
        const client = http2.connect(url);
        const buffer = Buffer.from(JSON.stringify(payload));

        headers[http2.constants.HTTP2_HEADER_SCHEME] = "https";
        headers[http2.constants.HTTP2_HEADER_METHOD] = http2.constants.HTTP2_METHOD_POST;
        headers['Content-Type'] = 'application/json';
        headers['Content-Length'] = buffer.length;

        console.debug(headers);

        client.on('error', (err) => {
            console.error(err)
            reject(err);
        });
        const req = client.request(headers);
        req.on('response', (headers, flags) => {
            for (const name in headers) {
                console.log(`${name}: ${headers[name]}`);
            }
        });

        req.setEncoding('utf8');
        let data = '';
        req.on('data', (chunk) => {
            data += chunk;
        });
        req.write(buffer);
        req.on('end', () => {
            client.close();
            resolve({ data });
        });
        req.end();
    });
}