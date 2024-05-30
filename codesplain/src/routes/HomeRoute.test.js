import { render, screen } from '@testing-library/react';
import { setupServer } from 'msw/node';
import { rest } from 'msw';
import { MemoryRouter } from 'react-router-dom';
import HomeRoute from './HomeRoute';
import { createServer } from '../test/server';

createServer([
    {
        //this will watch for any requests to "/api/repositories" for example and mock it in our test
        path: '/api/repositories',
        //request, response, context
        res: (req) => {
            const language = req.url.searchParams.get('q').split('language:')[1];
            return {
                items: [
                    { id: 1, full_name: `${language}_one` },
                    { id: 2, full_name: `${language}_two` }
                ]  
            }
        }
    }
]);

test('renders two links for each language', async() => {
    render(
        //we need this to sort out an error related to <Link> inside of the <RepositoriesTable /> component
        <MemoryRouter>
            <HomeRoute />
        </MemoryRouter>
    );

    //Loop over each language
    const languages = [
        'javascript',
        'typescript',
        'rust',
        'go',
        'python',
        'java'
    ];

    //for each language, make sure we see two links
    for (let language of languages) {
        //assert that the links have the appropriate full_name
        const links = await screen.findAllByRole('link', {
            name: new RegExp(`${language}_`) //match this pattern
        });
        
        expect(links).toHaveLength(2);

        //checking to make sure the text in the links are correct
        expect(links[0]).toHaveTextContent(`${language}_one`);
        expect(links[1]).toHaveTextContent(`${language}_two`);

        //checking to make sure the links are correct
        expect(links[0]).toHaveAttribute('href', `/repositories/${language}_one`);
        expect(links[1]).toHaveAttribute('href', `/repositories/${language}_two`);
    }
});