import React from 'react'



export default function Post({id, title, body, up_votes, down_votes}) {
    let voteStatus = '';

    const get_vote_status = (post_id, up_votes, down_votes) => {
        const current_account_id = window.walletConnection.getAccountId();
        if (up_votes.includes(current_account_id)) {
            return 'upvote';
        }

        if (down_votes.includes(current_account_id)) {
            return 'downvote';
        }

        return '';
    }

    const upvote = (id, voteStatus) => {
        if (!window.walletConnection.isSignedIn()) {
            alert("Please login before up/down vote");
            return;
        }

        if (voteStatus === 'upvote') {
            window.contract.remove_upvote({post_id: id}).then(result => {
                voteStatus = 'upvote';
                alert('Remove upvote thanh cong');
            });
        } else {
            window.contract.up_vote({post_id: id}).then(result => {
                voteStatus = 'upvote';
                alert('Upvote thanh cong');
            });
        }
    }

    const downvote = (id, voteStatus) => {
        if (!window.walletConnection.isSignedIn()) {
            alert("Please login before up/down vote");
            return;
        }
       

        if (voteStatus === 'upvote') {
            window.contract.remove_downvote({post_id: id}).then(result => {
                voteStatus = 'downvote';
                alert('Remove downvote thanh cong');
            });
        } else {
            window.contract.down_vote({post_id: id}).then(result => {
                voteStatus = 'downvote';
                alert('Downvote thanh cong');
            });
        }
    }

   
    if (window.walletConnection.isSignedIn()) {
        voteStatus = get_vote_status(id, up_votes, down_votes);
    }

  return (
    <section className="text-gray-600 py-5 body-font">
        <div className="container px-5 mx-auto">
            <div className="xl:w-1/2 lg:w-3/4 w-full mx-auto text-center">
            <h1 className="text-gray-900 text-3xl title-font font-medium mb-1">{title}</h1>
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="inline-block w-8 h-8 text-gray-400 mb-4 mt-4" viewBox="0 0 975.036 975.036">
                <path d="M925.036 57.197h-304c-27.6 0-50 22.4-50 50v304c0 27.601 22.4 50 50 50h145.5c-1.9 79.601-20.4 143.3-55.4 191.2-27.6 37.8-69.399 69.1-125.3 93.8-25.7 11.3-36.8 41.7-24.8 67.101l36 76c11.6 24.399 40.3 35.1 65.1 24.399 66.2-28.6 122.101-64.8 167.7-108.8 55.601-53.7 93.7-114.3 114.3-181.9 20.601-67.6 30.9-159.8 30.9-276.8v-239c0-27.599-22.401-50-50-50zM106.036 913.497c65.4-28.5 121-64.699 166.9-108.6 56.1-53.7 94.4-114.1 115-181.2 20.6-67.1 30.899-159.6 30.899-277.5v-239c0-27.6-22.399-50-50-50h-304c-27.6 0-50 22.4-50 50v304c0 27.601 22.4 50 50 50h145.5c-1.9 79.601-20.4 143.3-55.4 191.2-27.6 37.8-69.4 69.1-125.3 93.8-25.7 11.3-36.8 41.7-24.8 67.101l35.9 75.8c11.601 24.399 40.501 35.2 65.301 24.399z"></path>
            </svg>
            <p className="leading-relaxed text-lg">{body}</p>
            <span className="inline-block h-1 w-10 rounded bg-indigo-500 mt-8 mb-6"></span>
            </div>
            <div className="flex justify-center">
                <button onClick={upvote.bind(this, id, voteStatus)} className={`inline-flex text-white border-0 py-2 px-6 focus:outline-none rounded text-lg transition ${
                    voteStatus === "upvote" ? "bg-green-500 hover:bg-green-600" : "bg-gray-400"
                  }`}>Yes</button>
                <button onClick={downvote.bind(this, id, voteStatus)} className={`ml-4 inline-flex text-white border-0 py-2 px-6 focus:outline-none rounded text-lg transition ${
                    voteStatus === "downvote" ? "bg-red-500 hover:bg-red-600" : "bg-gray-400"
                  }`}>No</button>
            </div>
        </div>
    </section>
  )
}
