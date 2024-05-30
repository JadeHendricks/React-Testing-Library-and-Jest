import { screen, render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { SWRConfig } from 'swr';
import { createServer } from '../../test/server';
import AuthButtons from './AuthButtons';

async function renderComponent() {
    render(
        //this allows us to reset Cache between test cases, so that our 2nd test case doesn't recieve the same data as the first
        <SWRConfig value={{ provider: () => new Map() }}>
            <MemoryRouter>
                <AuthButtons />
            </MemoryRouter>
        </SWRConfig>
    )

    await screen.findAllByRole('link');
}

// creatServer() ---> GET '/api/user' ---> { user: null }
describe('when a user is not signed in', () => {

    createServer([
        {
            path: '/api/user',
            res: () => {
                return { user: null }
            }
        }
    ]);

    test('sign in and sign up buttons are visible', async() => {
        await renderComponent();

        const signInButton = screen.getByRole('link', {
            name: /sign in/i
        });

        const signUpButton = screen.getByRole('link', {
            name: /sign up/i
        });

        expect(signInButton).toBeInTheDocument();
        expect(signInButton).toHaveAttribute('href', '/signin');

        expect(signUpButton).toBeInTheDocument();
        expect(signUpButton).toHaveAttribute('href', '/signup');
    });
    
    test('sign out is not visible', async() => {
        await renderComponent();
        //query retusn null if no element found
        const signOutButton = screen.queryByRole('link', {
           name: /sign out/i 
        });

        expect(signOutButton).not.toBeInTheDocument();
    });
});

// creatServer() ---> GET '/api/user' ---> { user: { id: 1, email: 'asdad@dadsa' } }
describe('when a user is signed in', () => {
    createServer([
        {
            path: '/api/user',
            res: () => {
                return { user: { id: 3, email: 'asdf@asdf.com'} }
            }
        }
    ]);

    test('sign in and sign up buttons are not visible', async() => {
        await renderComponent();

        const signInButton = screen.queryByRole('link', {
            name: /sign in/i
        });

        const signUpButton = screen.queryByRole('link', {
            name: /sign up/i
        });

        expect(signInButton).not.toBeInTheDocument();
        expect(signUpButton).not.toBeInTheDocument();
    });
    
    test('sign out is visible', async() => {
        await renderComponent();

        const signOutButton = screen.getByRole('link', {
            name: /sign out/i
        });

        expect(signOutButton).toBeInTheDocument();
        expect(signOutButton).toHaveAttribute('href', '/signout');
    });
    
});
