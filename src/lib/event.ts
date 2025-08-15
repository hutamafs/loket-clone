export function createSearchParamsString(
  params: Record<string, string | string[]>
): string {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((v) => {
        if (v) searchParams.append(key, v);
      });
    } else {
      searchParams.append(key, value);
    }
  });

  return searchParams.toString();
}
