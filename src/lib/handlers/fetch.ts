import { RequestError } from "../errors";

interface FetchOptions extends RequestInit {
  timeout?: number;
}

function isError(error: unknown): error is Error {
  return error instanceof Error;
}

export async function fetchHandler<T>(
  url: string,
  options: FetchOptions = {}
): Promise<ActionResponse<T>> {
  const {
    timeout = 5000,
    headers: customHeaders = {},
    ...restOptions
  } = options;

  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  const defaultHeaders: HeadersInit = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  const headers: HeadersInit = { ...defaultHeaders, ...customHeaders };

  const config: RequestInit = {
    ...restOptions,
    headers,
    signal: controller.signal,
  };

  let status: number | undefined;

  try {
    const response = await fetch(url, config);

    // 若在 timeout 時間內完成請求，則清除定時器。
    clearTimeout(id);

    status = response.status;

    if (!response.ok) {
      throw new RequestError(response.status, `HTTP error: ${response.status}`);
    }

    return await response.json();
  } catch (err) {
    const error = isError(err) ? err : new Error("Unknown error");

    if (error.name === "AbortError") {
      console.error(`Request to ${url} time out`);
    } else {
      console.error(`Error fetching ${url}: ${error.message}`);
    }

    return {
      success: false,
      error: { message: error.message },
      status: status,
    };
  }
}
