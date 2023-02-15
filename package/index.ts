import {
  animationFrameScheduler,
  fromEvent,
  map,
  Observable,
  OperatorFunction,
  pluck,
  scan,
  startWith,
  switchMap,
} from "rxjs";

export type HTMLDestroyElement = HTMLElement & { destroy: Function };

// Typescript complains when React is undefined while working with JSX,
// even if you're not using it
declare global {
  const React: any;
}

// Critical JSX replacement

(window as any).rxjsx = (tag, props, ...children) => {
  if (typeof tag === "function") return tag(props, ...children);
  const element = document.createElement(tag);

  Object.entries(props || {}).forEach(([name, value]: [string, any]) => {
    if (name.startsWith("on") && name.toLowerCase() in window) {
      element.addEventListener(name.toLowerCase().substr(2), value);
    } else if (name === "single$") {
      const observable = value.pipe(
        scan((acc, current) => {
          if (acc) {
            element.removeChild(acc);
          }
          if (current) {
            element.appendChild(current);
          }
          return current;
        }, undefined)
      );
      observable.subscribe({ complete: () => element.remove() });
    } else if (name === "multi$") {
      const observable = value.pipe(
        map((current) => {
          if (current) {
            element.appendChild(current);
          }
          return current;
        })
      );
      observable.subscribe({ complete: () => element.remove() });
    } else {
      element.setAttribute(name, value.toString());
    }
  });

  children.forEach((child) => {
    appendChild(element, child);
  });

  return element;
};

(window as any).jsx = (window as any).rxjsx;

const appendChild = (parent, child) => {
  if (Array.isArray(child))
    child.forEach((nestedChild) => appendChild(parent, nestedChild));
  else
    parent.appendChild(child.nodeType ? child : document.createTextNode(child));
};

// Helper functions

export const withAnimationFrame: OperatorFunction<any, any> = switchMap(
  async (value) => {
    return await new Promise((resolve) => {
      animationFrameScheduler.schedule(() => {
        resolve(value);
      });
    });
  }
);

export function fromEventElement$(
  target$: Observable<Element>,
  eventName: string
) {
  return target$.pipe(switchMap((target) => fromEvent(target, eventName)));
}

export function fromValueElementKeyup$(
  target$: Observable<Element>,
  defaultValue?: string
): Observable<string> {
  return target$.pipe(
    switchMap<Element, Observable<string>>((target) =>
      fromEvent<any>(target, "keyup").pipe(pluck("target", "value"))
    ),
    startWith(defaultValue || "")
  );
}

export function classSync(
  target: Element,
  classToSync: string,
  shouldHaveClass: boolean
): void {
  if (shouldHaveClass) {
    target.classList.add(classToSync);
  } else {
    target.classList.remove(classToSync);
  }
}
