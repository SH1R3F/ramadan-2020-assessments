import { generateVideoRequestHTML, loadAllReqs, votingFunctionality, debounce } from './helpers.js';
import { validateForm, validateAuth } from './validation.js';
import { filterReqs } from './admin.js';

const HOST = 'http://localhost:7777';
export const state = {
    sortBy: '',
    filter: '',
    search: '',
    userId: null,
    isAdmin: false
};
const ADMIN_ID = '999223';

document.addEventListener('DOMContentLoaded', () => {
    const authForm = document.getElementById('authForm');
    const logedSec = document.getElementById('videoRequestsSection');
    
    /**
     * Check authentication
     */
    const urlQueryString = window.location.search;
    if (urlQueryString) {
        const urlParams = new URLSearchParams(urlQueryString);
        // Logged in
        state.userId = urlParams.get('id');
        authForm.classList.add('d-none');
        logedSec.classList.remove('d-none');

        // If admin
        if (state.userId == ADMIN_ID) {
            state.isAdmin = true;

            // Hide normal user stuff
            const userContent = document.getElementById('normalUserStuff');
            userContent.classList.add('d-none');

            // Show admin filtering
            const filteringGroup = document.querySelector('.filtering-group');
            filteringGroup.classList.remove('d-none');

            /**
             * Filtering
             */
            filterReqs();
        }

    }

    /**
     * Authenticating
     */
    authForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Validation
        const name    = document.querySelector('[name=author_name]');
        const email   = document.querySelector('[name=author_email]');
        if (!validateAuth(name, email)) {
            return;
        }
        const body = new FormData(authForm);
        fetch (`${HOST}/users/login`, {
            method: 'POST',
            body,
        })
        .then((response) => {
            if (response.redirected) {
                window.location.href = response.url;
            }
        })
        .catch(err => console.log(err));
    });

    
    /**
     * Fetching video requests
     */
    const videoReqsContainer = document.getElementById('listOfRequests');

    loadAllReqs(state);


    /**
     * Posting a video request
     */
    const vidReqForm = document.getElementById('videoRequestForm');
    // On form submission
    vidReqForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Validation
        const topic   = document.querySelector('[name=topic_title]');
        const details = document.querySelector('[name=topic_details]');
        
        if ( !validateForm(topic, details) ) {
            return;
        }

        
        // Collect Data: We can use manual collection or formdata. lets use formData
        const allData = new FormData(vidReqForm);
        allData.append('author_id', state.userId);

        fetch (`${HOST}/video-request`, {
            method: 'POST',
            body: allData
        }).then (data => data.json()).then (data => {
            const html =  generateVideoRequestHTML(data);
            videoReqsContainer.prepend(html);
            votingFunctionality(state.userId);

            // Empty field inputs
            vidReqForm.querySelectorAll('input,textarea').forEach(elm => elm.value = '');
            
        }).catch (error => console.log('ERR: ', error));
    });


    /**
     * Sorting
     */
    const sortBtns = document.querySelectorAll('.sort-btn');
    sortBtns.forEach( btn => {

        btn.addEventListener('click', e => {
            e.preventDefault();
            sortBtns.forEach(btn => btn.classList.remove('active'));
            btn.classList.add('active');

            state.sortBy = btn.dataset.sortby; 
            // Fetch with sorting
            loadAllReqs(state);
            
        });
    });


    /**
     * Searching
     */
    const searchInput = document.getElementById('SearchTerm');
    searchInput.addEventListener('input', debounce(e => {
        state.search = e.target.value;
        loadAllReqs(state);
    }, 500));


});