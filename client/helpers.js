import { adminDom, adminFunctionality } from './admin.js';
import { state } from './app.js';

const HOST = 'http://localhost:7777';

export function generateVideoRequestHTML({ _id, topic_title, topic_details, expected_result, author_name, submit_date, target_level, votes: { ups, downs } , status, video_ref: { link }}) {
    const node = document.createElement('div'),
          template = `<div class="card mb-3 ${status == 'new' ? 'border-default' : (status == 'done' ? 'border-success': 'border-info')}">
                        ${state.isAdmin ? adminDom(_id, status, link) : ''}
                        <div class="card-body d-flex justify-content-between flex-row">
                        <div class="d-flex flex-column">
                            <h3>${topic_title}</h3>
                            <p class="text-muted mb-2">${topic_details}</p>
                            <p class="mb-0 text-muted">
                                <strong>Expected results:</strong> ${expected_result}
                            </p>
                        </div>
                        <div class="d-flex flex-column text-center">
                            <a class="btn btn-link vote-btn" data-vote_type="ups" data-id="${_id}" ${state.isAdmin && `style='opacity: 0.5'`}>🔺</a>
                            <h3 id="votes_${_id}">${ups.length - downs.length}</h3>
                            <a class="btn btn-link vote-btn" data-vote_type="downs" data-id="${_id}" ${state.isAdmin && `style='opacity: 0.5'`}>🔻</a>
                        </div>
                        </div>
                        <div class="card-footer d-flex flex-row justify-content-between ${status == 'new' ? 'border-default' : (status == 'done' ? 'border-success': 'border-info')}">
                        <div class="${status == 'new' ? 'text-default' : (status == 'done' ? 'text-success': 'text-info')}">
                            <span class="text-uppercase">${status}</span>
                            &bullet; added by <strong>${author_name}</strong> on
                            <strong>${new Date(submit_date).toLocaleDateString()}</strong>
                        </div>
                        <div
                            class="d-flex justify-content-center flex-column 408ml-auto mr-2">
                            <div class="badge  ${status == 'new' ? 'badge-primary' : (status == 'done' ? 'badge-success': 'badge-info')}">
                            ${target_level}
                            </div>
                        </div>
                        </div>
                    </div>`;

    node.innerHTML = template;
    return node;
}


export function votingFunctionality(userId) {
    
    // On click vote up and down
    const voteBtns = document.querySelectorAll('.vote-btn');
    voteBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const {id, vote_type} = btn.dataset;
            
            // Send a vote request
            fetch (`${HOST}/video-request/vote`, {
                method: 'PUT',
                body: JSON.stringify({
                    id,
                    vote_type,
                    userId
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(data => data.json())
            .then(({ votes: { ups, downs } }) => {
                // Update votes
                document.getElementById(`votes_${id}`).innerText = (ups.length - downs.length)
                // Styling the voting buttons
                stylingVoteBtns (id, userId, { ups, downs });
            }).catch(err => console.log(err))
        })
    });
}

export function loadAllReqs({ sortBy = 'newFirst', filter, search = '', userId = null }, isAppended = true) {
    const videoReqsContainer = document.getElementById('listOfRequests');

    fetch (`${HOST}/video-request?sortBy=${sortBy}&filter=${filter}&search=${search}`)
        .then ( data => data.json() )
        .then ( data => {
            videoReqsContainer.innerHTML = '';
            data.forEach (req => {
                const html = generateVideoRequestHTML(req);
                if (isAppended) {
                    videoReqsContainer.appendChild(html);
                } else {
                    videoReqsContainer.prepend(html);
                }
                state.isAdmin || stylingVoteBtns (req._id, userId, req.votes);
                state.isAdmin && adminFunctionality(req._id, req.status);
            });
        })
        .then ( _ => {
            state.isAdmin || votingFunctionality(userId);
        })
        .catch (error => console.log('ERR: ', error));

}

export const debounce = (fn, delay) => {
    let timeout;
    
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(_ => fn(...args), delay);
    }

};

export const stylingVoteBtns = (vidReqId, userId, { ups, downs }) => {
    const upVoteBtn   = document.querySelector(`[data-vote_type='ups'][data-id='${vidReqId}']`);
    const downVoteBtn = document.querySelector(`[data-vote_type='downs'][data-id='${vidReqId}']`);
    ups.includes(userId) ? (downVoteBtn.style.opacity = '0.5') : (downVoteBtn.style.opacity = '1');
    downs.includes(userId) ? (upVoteBtn.style.opacity = '0.5') : (upVoteBtn.style.opacity = '1');
}
