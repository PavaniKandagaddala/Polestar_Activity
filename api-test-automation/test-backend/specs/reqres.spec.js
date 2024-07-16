describe('Reqres API', function() {
    let expect;
    let fetch;
    let baseUrl;
    
    before(async function() {
        // Dynamically import the modules
        const fetchModule = await import('node-fetch');
        const chaiModule = await import('chai');
        
        fetch = fetchModule.default;
        expect = chaiModule.expect;
        
        baseUrl = 'https://reqres.in/api';
    });

    it('should successfully fetch a list of users', async function() {
        const response = await fetch(`${baseUrl}/users`);
        const data = await response.json();
        expect(response.status).to.equal(200);
        expect(data).to.have.property('data');
    });

    it('should GET users', async function() {
        const response = await fetch(`${baseUrl}/users/1`);
        const data = await response.json();
        expect(response.status).to.equal(200);
        expect(data).to.have.property('data');
    });

    it('should POST a new user', async function() {
        const response = await fetch(`${baseUrl}/users`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: 'John Doe', job: 'Developer' }),
        });
        const data = await response.json();
        expect(response.status).to.equal(201);
        expect(data).to.have.property('name', 'John Doe');
    });

    it('should PUT update a user', async function() {
        const response = await fetch(`${baseUrl}/users/1`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: 'Jane Doe', job: 'Manager' }),
        });
        const data = await response.json();
        expect(response.status).to.equal(200);
        expect(data).to.have.property('name', 'Jane Doe');
    });

    it('should DELETE a user', async function() {
        const response = await fetch(`${baseUrl}/users/1`, { method: 'DELETE' });
        expect(response.status).to.equal(204);
    });
});
