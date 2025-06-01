import { useMemo } from 'react';

export function useSkeletonArray<T>(
  count: number,
  template: T,
  keyExtractor?: (item: T, index: number) => string
): T[] {
  return useMemo(() => {
    return Array.from({ length: count }).map((_, index) => {
      if (keyExtractor) {
        return { ...template, key: keyExtractor(template, index) };
      }
      return { ...template, key: `skeleton-${index}` };
    });
  }, [count, template, keyExtractor]);
}
