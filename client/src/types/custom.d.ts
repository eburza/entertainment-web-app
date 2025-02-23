declare module '*.svg' {
  import * as React from 'react';

  const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;

  export const ReactComponent;
  export default ReactComponent;
}
