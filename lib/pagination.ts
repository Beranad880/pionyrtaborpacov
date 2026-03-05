export function parsePagination(searchParams: URLSearchParams, defaultLimit = 10) {
  const page = Math.max(1, parseInt(searchParams.get('page') || '1') || 1);
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || String(defaultLimit)) || defaultLimit));
  return { page, limit, skip: (page - 1) * limit };
}

export function paginationMeta(page: number, limit: number, total: number) {
  return { page, limit, total, pages: Math.ceil(total / limit) };
}
