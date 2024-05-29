import { screen, render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import RepositoriesListItem from './RepositoriesListItem';

//using a mock to solve the 'act' issue
//we can use it to pretend to be content of some other file - aka "Don't ever import the file was added as a mock, if anyone tried to import that item, use our mock instead."
//usefull when you don't really care what's happening in the other component at all in context to the one you're testing.

// jest.mock('../tree/FileIcon', () => {
//     //content of FileIcon.js
//     return () => {
//         return 'File Icon Component'
//     }
// });

function renderComponent() {
    const repository = {
        full_name: 'facebook/react',
        language: 'Javascript',
        description: 'A JS Library',
        owner: {
            login: 'facebook'
        },
        name: 'react',
        html_url: 'https://github.com/facebook/react'
    };

    render(
        //we are providing a router context to our RepositoriesListItem to prevent "useHref() may be used only in the context of a <Router> component."
        <MemoryRouter>
            <RepositoriesListItem repository={repository} />
        </MemoryRouter>
    );

    return { repository }
}

const pause = () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, 100);
    });
} 

test('shows a link to the github homepage for this repository', async () => {
    const { repository } = renderComponent();

    // screen.debug();
    // await pause();
    // screen.debug();

    //this does a pause for us automatically. And is the best way to solve this
    await screen.findByRole('img', { name: 'Javascript' });

    const link = screen.getByRole('link', {
        name: /github repository/i
    });

    expect(link).toHaveAttribute('href', repository.html_url);
});

test('shows a fileicon with the appropriate icon', async() => {
    renderComponent();

    const icon = await screen.findByRole('img', { name: 'Javascript' });
    expect(icon).toHaveClass('js-icon');
});

test('shows a link to the code editor page', async() => {
    const { repository } = renderComponent();

    await screen.findByRole('img', { name: 'Javascript' });

    const link = await screen.findByRole('link', {
        name: new RegExp(repository.owner.login)
    });

    expect(link).toHaveAttribute('href', `/repositories/${repository.full_name}`);
});
