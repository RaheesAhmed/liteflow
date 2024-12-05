import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import {
  LiteRouter,
  useNavigate,
  RouteComponent,
  matchPath,
  Outlet,
} from '../index';
import { z } from 'zod';

describe('Router', () => {
  describe('Path Matching', () => {
    it('should match exact paths', () => {
      const params = matchPath('/users', '/users');
      expect(params).toEqual({});
    });

    it('should match paths with parameters', () => {
      const params = matchPath('/users/:id', '/users/123');
      expect(params).toEqual({ id: '123' });
    });

    it('should handle multiple parameters', () => {
      const params = matchPath(
        '/users/:userId/posts/:postId',
        '/users/123/posts/456'
      );
      expect(params).toEqual({ userId: '123', postId: '456' });
    });

    it('should handle encoded parameters', () => {
      const params = matchPath('/users/:name', '/users/John%20Doe');
      expect(params).toEqual({ name: 'John Doe' });
    });

    it('should return null for non-matching paths', () => {
      const params = matchPath('/users/:id', '/posts/123');
      expect(params).toBeNull();
    });
  });

  describe('Navigation', () => {
    it('should handle navigation with useNavigate', () => {
      const TestComponent = () => {
        const navigate = useNavigate();
        return <button onClick={() => navigate('/test')}>Navigate</button>;
      };

      render(
        <LiteRouter
          routes={[
            { path: '/', component: TestComponent },
            { path: '/test', component: () => <div>Test Page</div> },
          ]}
        />
      );

      fireEvent.click(screen.getByText('Navigate'));
      expect(window.location.pathname).toBe('/test');
    });
  });

  describe('Route Component', () => {
    it('should render route component with params', () => {
      const UserComponent = ({ params }: { params: { id: string } }) => (
        <div>User {params.id}</div>
      );

      render(
        <RouteComponent
          route={{ path: '/users/:id', component: UserComponent }}
          params={{ id: '123' }}
        />
      );

      expect(screen.getByText('User 123')).toBeInTheDocument();
    });

    it('should handle route validation', async () => {
      const userSchema = z.object({
        id: z.string().min(3),
      });

      const UserComponent = ({ params }: { params: { id: string } }) => (
        <div>User {params.id}</div>
      );

      const { container } = render(
        <RouteComponent
          route={{
            path: '/users/:id',
            component: UserComponent,
            validate: userSchema,
          }}
          params={{ id: '12' }}
        />
      );

      await waitFor(() => {
        expect(container.innerHTML).toContain('validation failed');
      });
    });

    it('should handle middleware', async () => {
      const authMiddleware = jest.fn().mockResolvedValue(true);
      const UserComponent = () => <div>Protected Content</div>;

      render(
        <RouteComponent
          route={{
            path: '/protected',
            component: UserComponent,
            middleware: [authMiddleware],
          }}
          params={{}}
        />
      );

      await waitFor(() => {
        expect(authMiddleware).toHaveBeenCalled();
        expect(screen.getByText('Protected Content')).toBeInTheDocument();
      });
    });
  });

  describe('Error Handling', () => {
    it('should render error boundary on component error', () => {
      const ErrorComponent = () => {
        throw new Error('Test Error');
      };

      render(
        <RouteComponent
          route={{ path: '/error', component: ErrorComponent }}
          params={{}}
        />
      );

      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    });

    it('should handle 404 routes', () => {
      render(
        <LiteRouter
          routes={[{ path: '/test', component: () => <div>Test</div> }]}
        />
      );

      expect(screen.getByText('404 - Page Not Found')).toBeInTheDocument();
    });
  });

  describe('Route Configuration', () => {
    it('should handle nested routes', () => {
      const routes = [
        {
          path: '/users',
          component: () => (
            <div>
              Users <Outlet />
            </div>
          ),
          children: [
            {
              path: '/users/:id',
              component: ({ params }: { params: { id: string } }) => (
                <div>User {params.id}</div>
              ),
            },
          ],
        },
      ];

      const { container } = render(<LiteRouter routes={routes} />);
      expect(container).toMatchSnapshot();
    });

    it('should support route guards', async () => {
      const guard = jest.fn().mockResolvedValue(true);
      const ProtectedComponent = () => <div>Protected</div>;

      render(
        <RouteComponent
          route={{
            path: '/protected',
            component: ProtectedComponent,
            middleware: [guard],
          }}
          params={{}}
        />
      );

      await waitFor(() => {
        expect(guard).toHaveBeenCalled();
        expect(screen.getByText('Protected')).toBeInTheDocument();
      });
    });
  });
});
