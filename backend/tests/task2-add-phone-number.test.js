import { test } from 'node:test';
import assert from 'node:assert';
import http from 'node:http';

const BASE_URL = 'http://localhost:3000';

function makeRequest(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const req = http.request(url, options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          const parsed = data ? JSON.parse(data) : null;
          resolve({ status: res.statusCode, body: parsed, headers: res.headers });
        } catch (e) {
          resolve({ status: res.statusCode, body: data, headers: res.headers });
        }
      });
    });

    req.on('error', reject);

    if (body) {
      req.write(JSON.stringify(body));
    }

    req.end();
  });
}

test('Task 2: POST /api/phonebook creates phone number entry with all fields', async () => {
  // Use unique identifier to avoid conflicts with other tests
  const uniqueId = Date.now();
  const newEntry = {
    name: `Test User ${uniqueId}`,
    phoneNumber: `+1-555-${uniqueId.toString().slice(-4)}`,
    email: `test${uniqueId}@example.com`,
  };

  const response = await makeRequest('POST', '/api/phonebook', newEntry);
  assert.strictEqual(response.status, 200);
  assert(response.body.id);
  assert.strictEqual(response.body.name, `Test User ${uniqueId}`);
  assert.strictEqual(response.body.phoneNumber, `+1-555-${uniqueId.toString().slice(-4)}`);
  assert.strictEqual(response.body.email, `test${uniqueId}@example.com`);
  assert(response.body.createdAt);
  assert(response.body.updatedAt);
});

test('Task 2: POST /api/phonebook creates phone number entry with minimal required fields', async () => {
  // Use unique identifier to avoid conflicts with other tests
  const uniqueId = Date.now();
  const newEntry = {
    name: `Minimal User ${uniqueId}`,
    phoneNumber: `+1-555-${uniqueId.toString().slice(-4)}`,
  };

  const response = await makeRequest('POST', '/api/phonebook', newEntry);
  assert.strictEqual(response.status, 200);
  assert(response.body.id);
  assert.strictEqual(response.body.name, `Minimal User ${uniqueId}`);
  assert.strictEqual(response.body.phoneNumber, `+1-555-${uniqueId.toString().slice(-4)}`);
  assert(response.body.createdAt);
  assert(response.body.updatedAt);
});

test('Task 2: POST /api/phonebook returns 400 when name is missing', async () => {
  const newEntry = {
    phoneNumber: '+1-555-1234',
  };

  const response = await makeRequest('POST', '/api/phonebook', newEntry);
  assert.strictEqual(response.status, 400);
});

test('Task 2: POST /api/phonebook returns 400 when phoneNumber is missing', async () => {
  const newEntry = {
    name: 'Test User',
  };

  const response = await makeRequest('POST', '/api/phonebook', newEntry);
  assert.strictEqual(response.status, 400);
});

test('Task 2: POST /api/phonebook returns 400 when both name and phoneNumber are missing', async () => {
  const newEntry = {
    email: 'test@example.com',
  };

  const response = await makeRequest('POST', '/api/phonebook', newEntry);
  assert.strictEqual(response.status, 400);
});

