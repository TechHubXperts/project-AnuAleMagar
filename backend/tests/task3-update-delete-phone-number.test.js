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

test('Task 3: PUT /api/phonebook/:id updates phone number entry successfully', async () => {
  // Setup: Create a phone number entry first
  const uniqueId = Date.now();
  const setupEntry = {
    name: `User to Update ${uniqueId}`,
    phoneNumber: `+1-555-${uniqueId.toString().slice(-4)}`,
    email: `original${uniqueId}@example.com`,
  };
  const createResponse = await makeRequest('POST', '/api/phonebook', setupEntry);
  assert.strictEqual(createResponse.status, 200);
  const createdEntry = createResponse.body;
  assert(createdEntry.id);
  const entryId = createdEntry.id;

  // Test: PUT /api/phonebook/:id - This is what we're actually testing
  const updatedData = {
    name: `Updated User ${uniqueId}`,
    phoneNumber: `+1-555-9999`,
    email: `updated${uniqueId}@example.com`,
  };
  const updateResponse = await makeRequest('PUT', `/api/phonebook/${entryId}`, updatedData);
  assert.strictEqual(updateResponse.status, 200);
  assert.strictEqual(updateResponse.body.id, entryId);
  assert.strictEqual(updateResponse.body.name, `Updated User ${uniqueId}`);
  assert.strictEqual(updateResponse.body.phoneNumber, `+1-555-9999`);
  assert.strictEqual(updateResponse.body.email, `updated${uniqueId}@example.com`);
  assert(updateResponse.body.updatedAt);
  // Verify updatedAt is different from createdAt (or at least exists)
  assert(updateResponse.body.createdAt);
});

test('Task 3: PUT /api/phonebook/:id returns 404 when entry not found', async () => {
  const updatedData = {
    name: 'Updated Name',
    phoneNumber: '+1-555-1234',
  };
  const response = await makeRequest('PUT', '/api/phonebook/nonexistent-id-12345', updatedData);
  assert.strictEqual(response.status, 404);
});

test('Task 3: PUT /api/phonebook/:id returns 400 when required fields are missing', async () => {
  // Setup: Create a phone number entry first
  const uniqueId = Date.now();
  const setupEntry = {
    name: `User for Invalid Update ${uniqueId}`,
    phoneNumber: `+1-555-${uniqueId.toString().slice(-4)}`,
  };
  const createResponse = await makeRequest('POST', '/api/phonebook', setupEntry);
  assert.strictEqual(createResponse.status, 200);
  const createdEntry = createResponse.body;
  const entryId = createdEntry.id;

  // Test: PUT with missing required fields
  const invalidData = {
    email: 'only-email@example.com',
  };
  const response = await makeRequest('PUT', `/api/phonebook/${entryId}`, invalidData);
  assert.strictEqual(response.status, 400);
});

test('Task 3: DELETE /api/phonebook/:id deletes phone number entry successfully', async () => {
  // Setup: Create a phone number entry first
  const uniqueId = Date.now();
  const setupEntry = {
    name: `User to Delete ${uniqueId}`,
    phoneNumber: `+1-555-${uniqueId.toString().slice(-4)}`,
    email: `delete${uniqueId}@example.com`,
  };
  const createResponse = await makeRequest('POST', '/api/phonebook', setupEntry);
  assert.strictEqual(createResponse.status, 200);
  const createdEntry = createResponse.body;
  assert(createdEntry.id);
  const entryId = createdEntry.id;

  // Verify entry exists before deletion
  const getBeforeDelete = await makeRequest('GET', `/api/phonebook/${entryId}`);
  assert.strictEqual(getBeforeDelete.status, 200);

  // Test: DELETE /api/phonebook/:id - This is what we're actually testing
  const deleteResponse = await makeRequest('DELETE', `/api/phonebook/${entryId}`);
  assert.strictEqual(deleteResponse.status, 200);
  assert(deleteResponse.body.message);

  // Verify entry is deleted
  const getAfterDelete = await makeRequest('GET', `/api/phonebook/${entryId}`);
  assert.strictEqual(getAfterDelete.status, 404);
});

test('Task 3: DELETE /api/phonebook/:id returns 404 when entry not found', async () => {
  const response = await makeRequest('DELETE', '/api/phonebook/nonexistent-id-12345');
  assert.strictEqual(response.status, 404);
});

test('Task 3: GET /api/phonebook/:id returns individual phone number entry', async () => {
  // Setup: Create a phone number entry first
  const uniqueId = Date.now();
  const setupEntry = {
    name: `Individual Test User ${uniqueId}`,
    phoneNumber: `+1-555-${uniqueId.toString().slice(-4)}`,
    email: `individual${uniqueId}@example.com`,
  };
  const createResponse = await makeRequest('POST', '/api/phonebook', setupEntry);
  assert.strictEqual(createResponse.status, 200);
  const createdEntry = createResponse.body;
  assert(createdEntry.id);

  // Test: GET /api/phonebook/:id - This is what we're actually testing
  const response = await makeRequest('GET', `/api/phonebook/${createdEntry.id}`);
  assert.strictEqual(response.status, 200);
  assert.strictEqual(response.body.id, createdEntry.id);
  assert.strictEqual(response.body.name, `Individual Test User ${uniqueId}`);
  assert.strictEqual(response.body.phoneNumber, `+1-555-${uniqueId.toString().slice(-4)}`);
  assert.strictEqual(response.body.email, `individual${uniqueId}@example.com`);
  assert(response.body.createdAt);
  assert(response.body.updatedAt);
});

test('Task 3: GET /api/phonebook/:id returns 404 when entry not found', async () => {
  const response = await makeRequest('GET', '/api/phonebook/nonexistent-id-12345');
  assert.strictEqual(response.status, 404);
});

