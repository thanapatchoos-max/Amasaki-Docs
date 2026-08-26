import { router, usePage } from '@inertiajs/react';

export function useRouter() {
  return {
    push: (url) => router.visit(url),
    replace: (url) => router.visit(url, { replace: true }),
    back: () => window.history.back(),
    prefetch: () => {},
  };
}

export function usePathname() {
  const { url } = usePage();
  return url.split('?')[0];
}

export function useSearchParams() {
  const { url } = usePage();
  const searchParams = new URLSearchParams(url.split('?')[1] || '');
  return {
    get: (key) => searchParams.get(key),
  };
}

export function redirect(url) {
  router.visit(url);
}

export function useParams() {
  return {};
}
