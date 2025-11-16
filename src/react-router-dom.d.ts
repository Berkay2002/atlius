import 'react-router-dom';

declare module 'react-router-dom' {
  export interface LinkProps {
    unstable_viewTransition?: boolean;
    prefetch?: 'intent' | 'render' | 'none';
  }
}
