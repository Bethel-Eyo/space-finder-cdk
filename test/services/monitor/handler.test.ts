import { handler } from "../../../src/services/monitor/handler";

const headers = new Headers({
  "Content-Type": "application/json",
});

describe("Monitor handler tests", () => {
  const fetchSpy = jest.spyOn(global, "fetch");
  fetchSpy.mockImplementation(() => Promise.resolve({} as any));

  afterEach(() => {
    jest.clearAllMocks();
  })

  test("makes requests for records in SnsEvents", async () => {
    await handler(
      {
        Records: [
          {
            Sns: {
              Message: "Test Message",
            },
          },
        ],
      } as any,
      {}
    );
    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(fetchSpy).toHaveBeenCalledWith(expect.any(String), {
      method: "POST",
      body: expect.anything(),
      headers: headers,
    });
  });

  test("No sns records, no requests", async () => {
    await handler(
      {
        Records: [],
      },
      {}
    );
    expect(fetchSpy).not.toHaveBeenCalled();
  });
});
