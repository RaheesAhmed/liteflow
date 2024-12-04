import React, { useEffect, useState, useRef } from 'react';

interface RenderOptions {
  ssr?: boolean;
  hydrate?: boolean;
  suspense?: boolean;
}

interface RenderState {
  isClient: boolean;
  isMounted: boolean;
  isHydrated: boolean;
}

export function useLiteRender(options: RenderOptions = {}): RenderState {
  const [state, setState] = useState<RenderState>({
    isClient: typeof window !== 'undefined',
    isMounted: false,
    isHydrated: false,
  });

  const mounted = useRef(false);

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      setState(prev => ({
        ...prev,
        isMounted: true,
        isHydrated: options.hydrate || false,
      }));
    }
  }, [options.hydrate]);

  return state;
}

export function withLiteRender<P extends object>(
  Component: React.ComponentType<P>,
  options: RenderOptions = {}
): React.ComponentType<P> {
  return function WrappedComponent(props: P) {
    const renderState = useLiteRender(options);

    if (!renderState.isClient && options.ssr === false) {
      return null;
    }

    if (!renderState.isMounted && options.suspense) {
      return <div>Loading...</div>;
    }

    return <Component {...props} />;
  };
}

export function createRenderer(options: RenderOptions = {}) {
  return {
    render: function <P extends object>(
      Component: React.ComponentType<P>,
      props: P
    ) {
      const WrappedComponent = withLiteRender(Component, options);
      return <WrappedComponent {...props} />;
    },
  };
}
