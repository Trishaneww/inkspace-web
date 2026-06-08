"use client";

// Next.js
import { useEffect, useRef, useState } from "react";

export function useDraftState<T extends Record<string, unknown>>(source: T) {
  const [draft, setDraft] = useState<T>(source);
  const sourceRef = useRef(source);
  useEffect(() => {
    sourceRef.current = source;
  });

  const update = (patch: Partial<T>) => setDraft((d) => ({ ...d, ...patch }));
  const reset = () => setDraft(sourceRef.current);

  return { draft, update, reset };
}
