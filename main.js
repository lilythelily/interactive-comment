'use strict';

// --- fetch data ---

async function fetchData(url){
    try{
        const response = await fetch(url);
        if (!response.ok){
            throw new Error (`http error`);
        }

        const data = await response.json();
        console.log('success', data);
        renderComments(data);
        return data;

    }catch (error){
        console.error('fetch failed', error.message)
    }
}

fetchData('./data.json');

// --- populate data ---

function renderComments(data){

const card1 = document.querySelector('.card1');
const card2 = document.querySelector('.card2');
const card3 = document.querySelector('.card3');
const card4 = document.querySelector('.card4');
const comments = data.comments;
const current = data.currentUser;


card1.innerHTML = `
 <div class="comment__card">
        <div class="comment__controller">
          <div class="plus"></div><p class="controller-number">${comments[0].score}</p><div class="minus"></div>
        </div>
          <div class="pic-name">
        <div class="comment__pic" style="background-image:url('${comments[0].user.image.webp}') "></div>
        <p class="comment__name">${comments[0].user.username}</p>
        <p class="comment__time">${comments[0].createdAt}</p></div>
        <div class="comment__icon-reply reply-btn1">
          <div class="comment__arrow"></div>
<p class="comment__reply">Reply</p>
        </div>
        <div class="comment__text">
          ${comments[0].content}
        </div>

      </div>
`;

card2.innerHTML = `
<div class="comment__card">
        <div class="comment__controller">
          <div class="plus"></div><p class="controller-number">${comments[1].score}</p><div class="minus"></div>
        </div>
          <div class="pic-name">
        <div class="comment__pic" style="background-image: url('${comments[1].user.image.webp}')"></div>
        <p class="comment__name">${comments[1].user.username}</p>
        <p class="comment__time">${comments[1].createdAt}</p></div>

        <div class="comment__icon-reply">
          <div class="comment__arrow"></div>
<p class="comment__reply">Reply</p>
        </div>

        <div class="comment__text">
         ${comments[1].content}
        </div>
        </div>
`;

card3.innerHTML = `
 <div class="comment__controller">
          <div class="plus"></div><p class="controller-number">${comments[1].replies[0].score}</p><div class="minus"></div>
        </div>


          <div class="pic-name">
        <div class="comment__pic" style="background-image: url('${comments[1].replies[0].user.image.webp}')"></div>
        <p class="comment__name">${comments[1].replies[0].user.username}</p>

        <p class="comment__time">${comments[1].replies[0].createdAt}</p></div>

        <div class="action-btns">
        <div class="comment__icon-reply reply-btn2">
          <div class="comment__arrow"></div>
          <p class="comment__reply">Reply</p>
        </div>
        
     </div>

        <div class="comment__text"><span class="mention-span">@${comments[1].user.username}</span>
          ${comments[1].replies[0].content}
        </div>
`

card4.innerHTML = `
      <div class="comment__controller comment__controller-self">
          <div class="plus"></div><p class="controller-number">${comments[1].replies[1].score}</p><div class="minus"></div>
        </div>


          <div class="pic-name">
        <div class="comment__pic" style = "background-image: url('${comments[1].replies[1].user.image.webp}')"></div>
        <p class="comment__name">${comments[1].replies[1].user.username}</p>
        <div class="self">you</div>
        <p class="comment__time">${comments[1].replies[1].createdAt}</p></div>

        <div class="action-btns">
        <div class="comment__icon-reply trash-btn">
          <div class="comment__arrow comment__trash"></div>
          <p class="comment__reply comment__delete">Delete</p>
        </div>
        
        <div class="comment__icon-reply edit-btn">
          <div class="comment__arrow comment__pen"></div>
<p class="comment__reply">Edit</p>
        </div></div>

        <div class="comment__text"><span class="mention-span">@${comments[1].replies[0].user.username}</span>
          ${comments[1].replies[1].content}
        </div>

        <button class="update-btn hide">Update</button>
`

  // === reply ===

    const replyBtn1 = document.querySelector('.reply-btn1');
    const replyBtn2 = document.querySelector('.reply-btn2');
    const deleteBtn = document.querySelector('.trash-btn');
    const editBtn = document.querySelector('.edit-btn');
    const updateBtn = document.querySelector('.update-btn');
    const commentText = card4.querySelector('.comment__text');
    const newReply = document.createElement('div');

    // --- new reply ---

    newReply.innerHTML = `
    <div class="reply__card reply01">
        <div class="input__avatar reply__avatar"></div>
        <input type="text" class="comment-field reply-comment" id="reply-comment1">
        <button class="send-btn reply-btn" id="reply1-btn">Reply</button>
</div>
    `

    function cardToggle(item){
        item.classList.remove('hide');
        item.classList.add('grid');
    }

    let isDeleted = false;
    let isEdited = false;

    replyBtn1.addEventListener('click',()=>{
        card1.appendChild(newReply);
        })
 
newReply.addEventListener('click', (e)=>{
    if(e.target && e.target.id === "reply1-btn"){
        const inputField = newReply.querySelector('#reply-comment1');
        const replyText = inputField.value.trim();
        if(replyText === '') return;

        const submittedReplyCard = document.createElement('div');
        submittedReplyCard.classList.add('threaded__card', "threaded__card-self");
        submittedReplyCard.innerHTML = `
        <div class="comment__controller comment__controller-self">
                <div class="plus"></div>
                <p class="controller-number">0</p>
                <div class="minus"></div>
            </div>

            <div class="pic-name">
                <div class="comment__pic" style="background-image: url('${current.image.webp}')"></div>
                <p class="comment__name">${current.username}</p>
                <div class="self">you</div>
                <p class="comment__time">Just now</p>
            </div>

            <div class="action-btns">
                <div class="comment__icon-reply trash-btn" id="delete-btn0">
                    <div class="comment__arrow comment__trash"></div>
                    <p class="comment__reply comment__delete" >Delete</p>
                </div>
                <div class="comment__icon-reply edit-btn" id="edit-btn0">
                    <div class="comment__arrow comment__pen"></div>
                    <p class="comment__reply">Edit</p>
                </div>
            </div>

            <div class="comment__text">
            <span class="mention-span">@${comments[0].user.username}</span>
                ${replyText}
            </div>

             <button class="update-btn hide" id="update-btn0">Update</button>
        `;

        newReply.remove();
        card1.appendChild(submittedReplyCard);
            
        const updateBtn0 = document.querySelector('#update-btn0');
const deleteBtn0 = document.querySelector('#delete-btn0');
const editBtn0 = document.querySelector('#edit-btn0');

let isDeleted = false;
let isEdited = false;
    deleteBtn0.addEventListener('click',()=>{
        cardToggle(updateBtn0);
        isDeleted = true;
    })
editBtn0.addEventListener('click',()=>{
    cardToggle(updateBtn0);
    isEdited = true;
})

    updateBtn0.addEventListener('click', ()=>{
if(isDeleted){
    submittedReplyCard.classList.add('hide');
}
    })

    }
})


// --- thread reply ---
 const newThreadReply = document.createElement('div');

 newThreadReply.innerHTML = `
 <div class="reply__card thread-reply__card">

        <div class="input__avatar reply__avatar"></div>
        <input type="text" class="comment-field reply-comment" id="reply-comment2">
        <button class="send-btn reply-btn" id="reply3-btn">Reply</button>

</div>
 `


    replyBtn2.addEventListener('click',()=>{
        card3.insertAdjacentElement('afterend', newThreadReply);
    })


    newThreadReply.addEventListener('click', (e)=>{
    if(e.target && e.target.id === "reply3-btn"){
        const inputField2 = newThreadReply.querySelector('#reply-comment2');
        const replyText2 = inputField2.value.trim();
        if(replyText2 === '') return;

        const submittedReplyCard2 = document.createElement('div');
        submittedReplyCard2.classList.add('threaded__card', "threaded__card-self");
        submittedReplyCard2.innerHTML = `
        <div class="comment__controller comment__controller-self">
                <div class="plus"></div>
                <p class="controller-number">0</p>
                <div class="minus"></div>
            </div>

            <div class="pic-name">
                <div class="comment__pic" style="background-image: url('${current.image.webp}')"></div>
                <p class="comment__name">${current.username}</p>
                <div class="self">you</div>
                <p class="comment__time">Just now</p>
            </div>

            <div class="action-btns">
                <div class="comment__icon-reply trash-btn" id="delete-btn1">
                    <div class="comment__arrow comment__trash"></div>
                    <p class="comment__reply comment__delete" >Delete</p>
                </div>
                <div class="comment__icon-reply edit-btn" id="edit-btn1">
                    <div class="comment__arrow comment__pen"></div>
                    <p class="comment__reply">Edit</p>
                </div>
            </div>

            <div class="comment__text">
               <span class="mention-span">@${comments[1].replies[0].user.username}</span>
                ${replyText2}
            </div>

             <button class="update-btn hide" id="update-btn1">Update</button>
        `;

        newThreadReply.remove();
         card3.insertAdjacentElement('afterend',submittedReplyCard2);

        const updateBtn1 = document.querySelector('#update-btn1');
    const deleteBtn1 = document.querySelector('#delete-btn1');
    const editBtn1 = document.querySelector('#edit-btn1');

    let isDeleted = false;
let isEdited = false;

    deleteBtn1.addEventListener('click',()=>{
        cardToggle(updateBtn1);
        isDeleted = true;
    })
editBtn1.addEventListener('click',()=>{
    cardToggle(updateBtn1);
    isEdited = true;
})

    updateBtn1.addEventListener('click', ()=>{
if(isDeleted){
    submittedReplyCard2.classList.add('hide');
}
    })
}

    });


    deleteBtn.addEventListener('click',()=>{
        cardToggle(updateBtn);
        isDeleted = true;
    })

    // -- make it an editable textarea ---

    editBtn.addEventListener('click', ()=>{
        cardToggle(updateBtn);

 if(!isEdited){
    const currentText = commentText.innerText.trim();
    commentText.innerHTML = `
    <textarea class="edit-textarea">${currentText}</textarea>
    `;

    isEdited= true;
 }       

    });

    // --- update content ---


    // --- second reply ---

    updateBtn.addEventListener('click', ()=>{
        if(isDeleted){
            card4.classList.add('hide');
        }
        if(isEdited){
            const textarea = commentText.querySelector('.edit-textarea');
            const updatedText = textarea.value;
            commentText.innerHTML = `
          ${updatedText}
            `;

            updateBtn.classList.add('hide');
            updateBtn.classList.remove('grid');
            isEdited = false;
        }
    })


// --- add new comment ---

const inputContainer = document.querySelector('.input-comment');

inputContainer.addEventListener('click', (e)=>{
    if(e.target && (e.target.classList.contains('send-btn') || e.target.id === 'commentBtn')){

const inputField3 = document.querySelector('#add-comment');
        const newText = inputField3.value.trim();
        

        if (newText === '') return;

        const submittedNewComment = document.createElement('div');
        submittedNewComment.classList.add('comment__card'); 
        
        submittedNewComment.innerHTML = `
            <div class="comment__controller">
                <div class="plus"></div>
                <p class="controller-number">0</p>
                <div class="minus"></div>
            </div>

            <div class="pic-name">
                <div class="comment__pic" style="background-image: url('${current.image.webp}')"></div>
                <p class="comment__name">${current.username}</p>
                <div class="self">you</div>
                <p class="comment__time">Just now</p>
            </div>

            <div class="action-btns">
                <div class="comment__icon-reply trash-btn" id="delete-btn4">
                    <div class="comment__arrow comment__trash"></div>
                    <p class="comment__reply comment__delete">Delete</p>
                </div>
                <div class="comment__icon-reply edit-btn" id="edit-btn4">
                    <div class="comment__arrow comment__pen"></div>
                    <p class="comment__reply">Edit</p>
                </div>
            </div>

            <div class="comment__text">
                ${newText}
            </div>

            <button class="update-btn hide" id="update-btn4">Update</button>
        `;

        inputContainer.insertAdjacentElement('beforebegin', submittedNewComment);

        inputField3.value = '';

        vote();

        const updateBtn4 = document.querySelector('#update-btn4');
    const deleteBtn4 = document.querySelector('#delete-btn4');
    const editBtn4 = document.querySelector('#edit-btn4');

    let isDeleted = false;
let isEdited = false;

    deleteBtn4.addEventListener('click',()=>{
        cardToggle(updateBtn4);
        isDeleted = true;
    })
editBtn4.addEventListener('click',()=>{
    cardToggle(updateBtn4);
    isEdited = true;
})


    updateBtn4.addEventListener('click', ()=>{
if(isDeleted){
    submittedNewComment.classList.add('hide');
}
 updateBtn4.classList.add('hide');
            updateBtn.classList.remove('grid');
    })
    }
});

// --- vote ---


document.addEventListener('click', (e) => {
    if (e.target.classList.contains('plus')) {
        const numbers = document.querySelectorAll('.controller-number');
        const plusButtons = document.querySelectorAll('.plus');
        const index = Array.from(plusButtons).indexOf(e.target);
        
        if (index !== -1) {
            let score = parseInt(numbers[index].textContent, 10);
            numbers[index].textContent = score + 1;
        }
    }

    if (e.target.classList.contains('minus')) {
        const numbers = document.querySelectorAll('.controller-number');
        const minusButtons = document.querySelectorAll('.minus');
        const index = Array.from(minusButtons).indexOf(e.target);
        
        if (index !== -1) {
            let score = parseInt(numbers[index].textContent, 10);
            if (score > 0) {
                numbers[index].textContent = score - 1;
            }
        }
    }
});

}


  