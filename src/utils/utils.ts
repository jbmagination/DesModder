interface FuncAny {
  (): any;
}

function _pollForValue<T>(func: () => T) {
  return new Promise<T>((resolve) => {
    const interval = setInterval(() => {
      const val = func();
      if (val !== null && val !== undefined) {
        clearInterval(interval);
        resolve(val);
      }
    }, 50);
  });
}

export async function pollForValue(func: FuncAny) {
  return await _pollForValue(func);
}

interface ClassDict {
  [key: string]: boolean;
}

export type MaybeClassDict = string | ClassDict | undefined | null;

function updateClass(out: ClassDict, c: MaybeClassDict) {
  // mutates `out`, returns nothing
  if (c == null) {
    // no change
  } else if (typeof c === "string") {
    for (const cls of c.split(" ")) {
      out[cls] = true;
    }
  } else {
    Object.assign(out, c);
  }
}

export function mergeClass(c1: MaybeClassDict, c2: MaybeClassDict) {
  const out: ClassDict = {};
  updateClass(out, c1);
  updateClass(out, c2);
  return out;
}

// https://dev.to/_gdelgado/implement-a-type-safe-version-of-node-s-promisify-in-7-lines-of-code-in-typescript-2j34
export const promisify =
  <T, A>(
    fn: (args: T, cb: (args: A) => void) => void
  ): ((args: T) => Promise<A>) =>
  (args: T) =>
    new Promise((resolve) => {
      fn(args, (callbackArgs) => {
        resolve(callbackArgs);
      });
    });

export type OptionalProperties<T> = {
  [K in keyof T]?: T[K];
};

export function arraysEqual(arr1: unknown[], arr2: unknown[]) {
  return (
    arr1.length === arr2.length &&
    arr1.every((value, index) => arr2[index] === value)
  );
}
