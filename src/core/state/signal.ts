/* ============================================================
   NESSA AI — Motor de Signals (equivalente a Angular Signals)
   Reatividade fina com useSyncExternalStore.
   ============================================================ */
import { useSyncExternalStore } from "react";

export type Updater<T> = T | ((prev: T) => T);

export type Listener<T> = (value: T) => void;

export interface Signal<T> {
  get(): T;
  set(next: Updater<T>): void;
  subscribe(listener: Listener<T>): () => void;
}

export interface ReadonlySignal<T> {
  get(): T;
  subscribe(listener: Listener<T>): () => void;
}

export function createSignal<T>(initial: T): Signal<T> {
  let value = initial;
  const listeners = new Set<Listener<T>>();

  const subscribe = (listener: Listener<T>) => {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  };

  return {
    get: () => value,
    set: (next) => {
      const resolved = typeof next === "function" ? (next as (prev: T) => T)(value) : next;
      if (Object.is(resolved, value)) return;
      value = resolved;
      listeners.forEach((listener) => listener(value));
    },
    subscribe,
  };
}

/** Signal derivado — recalcula quando as dependências emitem. */
export function computed<T>(fn: () => T, deps: ReadonlySignal<unknown>[]): ReadonlySignal<T> {
  const inner = createSignal<T>(fn());
  deps.forEach((dep) => dep.subscribe(() => inner.set(fn())));
  return inner;
}

/** Hook de leitura reativa em componentes React. */
export function useSignal<T>(signal: ReadonlySignal<T>): T {
  return useSyncExternalStore(signal.subscribe, signal.get, signal.get);
}
