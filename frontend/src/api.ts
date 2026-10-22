function getData<T>(payload: any): T {
  if (payload && Object.prototype.hasOwnProperty.call(payload, "data"))
    return payload.data as T;
  return payload as T;
}

export async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = localStorage.getItem("campusly-token");
  const response = await fetch(`/api${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  const payload = await response.json().catch(() => null);
  if (!response.ok || payload?.success === false) {
    throw new Error(
      payload?.message ||
        payload?.error ||
        `Request failed (${response.status})`,
    );
  }
  return getData<T>(payload);
}
