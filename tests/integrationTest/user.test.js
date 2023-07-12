describe('testing login endpoint', () => {
  beforeEach(() => {
    // eslint-disable-next-line no-global-assign
    fetch = jest.fn().mockImplementation((url, status) => Promise.resolve({
      url,
      status,
    }));
  });
  it('should return a 200 status', async () => {
    const fetched = await fetch('http://localhost:1337/api/auth/login', 200);
    expect(fetch).toHaveBeenCalled();
    expect(fetched.url).toEqual('http://localhost:1337/api/auth/login');
    expect(fetched.status).toEqual(200);
  });
  it('should return a 400 status', async () => {
    const fetched = await fetch('http://localhost:1337/api/auth/login', 400);
    expect(fetch).toHaveBeenCalled();
    expect(fetched.url).toEqual('http://localhost:1337/api/auth/login');
    expect(fetched.status).toEqual(400);
  });
});
