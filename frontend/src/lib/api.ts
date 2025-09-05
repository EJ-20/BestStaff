export const api = {
  async get<T>(url: string): Promise<T> {
    const res = await fetch(`http://localhost:8080${url}`);
    if (!res.ok) throw new Error(await res.text());
    return res.json(); // 💥 this line fails if backend doesn't send JSON
  },
  async post<T>(url: string, body: any): Promise<T> {
    const res = await fetch(`http://localhost:8080${url}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json(); // same here
  },
};
