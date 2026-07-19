/** Build a listing detail path with query params (web-safe for image URLs with ?/&). */
export function listingDetailHref(params: Record<string, string | number | boolean | undefined | null>): string {
  const query: Record<string, string> = {};
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;
    if (key === 'posterVerified') {
      query[key] = value === true || value === '1' || value === 'true' ? '1' : '0';
      return;
    }
    query[key] = String(value);
  });
  return `/listings/detail?${new URLSearchParams(query).toString()}`;
}
