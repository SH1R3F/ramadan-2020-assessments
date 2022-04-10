import { loadAllReqs } from './helpers.js';
import { state } from './app.js';
const HOST = 'http://localhost:7777';

export const adminDom = (id, status, link) => {
    const tmpl = 
    `<div class="card-header d-flex justify-content-between">
        <select id="admin_change_status_${id}" class="text-center">
            <option value="new" ${status == 'new' && 'selected'}>new</option>
            <option value="planned" ${status == 'planned' && 'selected'}>planned</option>
            <option value="done" ${status == 'done' && 'selected'}>done</option>
        </select>
        <div class="input-group ml-2 mr-5 d-none" id="admin_video_res_container_${id}">
            <input type="text" class="form-control" id="admin_video_res_${id}"  placeholder="paste here youtube video id" value="${link}">
            <div class="input-group-append">
                <button class="btn btn-outline-secondary" id="admin_save_video_res_${id}" type="button">Save</button>
            </div>
        </div>
        <button id="admin_delete_video_req_${id}" class='btn btn-danger'>delete</button>
    </div>`;

    return tmpl;
}

export const adminFunctionality = (id, status) => {


    const statusSelector = document.getElementById(`admin_change_status_${id}`);
    const outputVideoCon = document.getElementById(`admin_video_res_container_${id}`);
    const saveVideoBtbn  = document.getElementById(`admin_save_video_res_${id}`);
    const deleteVideoBtn = document.getElementById(`admin_delete_video_req_${id}`);

    // If it's done show the video input
    if (status == 'done') {
        outputVideoCon.classList.remove('d-none');
    }

    statusSelector.addEventListener('change', (e) => {
        e.preventDefault();
        if ( e.target.value == 'done' ) {
            outputVideoCon.classList.remove('d-none');
            
            // Submit done with video
            saveVideoBtbn.addEventListener('click', _ => {
                e.preventDefault();

                const outputVideoVal  = document.getElementById(`admin_video_res_${id}`).value;

                fetch(`${HOST}/video-request`, {
                    method: 'PUT',
                    body: JSON.stringify({
                        id,
                        status: e.target.value,
                        resVideo: outputVideoVal
                    }),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then(res => console.log(res));

            });


        } else {
            outputVideoCon.classList.add('d-none');

            // Submit the status change
            fetch(`${HOST}/video-request`, {
                method: 'PUT',
                body: JSON.stringify({
                    id,
                    status: e.target.value,
                    resVideo: ''
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            }).catch(err => console.log(err));
        }
    });

    // Delete stuff
    deleteVideoBtn.addEventListener('click', (e) => {
        // Submit the status change
        fetch(`${HOST}/video-request`, {
            method: 'DELETE',
            body: JSON.stringify({ id }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(res => {
            loadAllReqs(state);
        })
        .catch(err => console.log(err));
    });

}
     

/**
 * Filtering
 */
 const filterBtns = document.querySelectorAll('.filter-btn');

export const filterReqs = _ => {
    filterBtns.forEach (btn => {
        btn.addEventListener('click', e => {
            e.preventDefault();

            if (state.filter == e.target.innerText.toLowerCase()) {
                btn.classList.remove('active');
                state.filter = ''; 
                return loadAllReqs(state);
            }


            filterBtns.forEach(btn => btn.classList.remove('active'));
            btn.classList.add('active');
    
            state.filter = btn.dataset.filter; 
            // Fetch with filtering
            loadAllReqs(state);
            
        });
    
    })
}