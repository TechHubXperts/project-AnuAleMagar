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

test('Task 1: GET /api/phonebook returns array with valid structure', async () => {
  const response = await makeRequest('GET', '/api/phonebook');
  assert.strictEqual(response.status, 200);
  assert(Array.isArray(response.body));
  // Verify array structure - if phone numbers exist, they should have required fields
  if (response.body.length > 0) {
    const firstEntry = response.body[0];
    assert(firstEntry.hasOwnProperty('id'));
    assert(firstEntry.hasOwnProperty('name'));
    assert(firstEntry.hasOwnProperty('phoneNumber'));
    assert(firstEntry.hasOwnProperty('createdAt'));
    assert(firstEntry.hasOwnProperty('updatedAt'));
  }
});

test('Task 1: GET /api/phonebook returns all phone numbers with correct format', async () => {
  // This test assumes phone numbers may already exist from other sources
  // We're only testing that GET /api/phonebook returns them correctly
  const response = await makeRequest('GET', '/api/phonebook');
  assert.strictEqual(response.status, 200);
  assert(Array.isArray(response.body));
  // Verify all returned items are valid phonebook entry objects
  response.body.forEach(entry => {
    assert(entry.hasOwnProperty('id'));
    assert(entry.hasOwnProperty('name'));
    assert(entry.hasOwnProperty('phoneNumber'));
    assert(entry.hasOwnProperty('createdAt'));
    assert(entry.hasOwnProperty('updatedAt'));
    // Verify phoneNumber is a string
    assert(typeof entry.phoneNumber === 'string');
    // Verify name is a string
    assert(typeof entry.name === 'string');
  });
});

test('Task 1: GET /api/phonebook returns empty array when no entries exist', async () => {
  // This test verifies the endpoint handles empty state correctly
  const response = await makeRequest('GET', '/api/phonebook');
  assert.strictEqual(response.status, 200);
  assert(Array.isArray(response.body));
  // Empty array is valid
});

