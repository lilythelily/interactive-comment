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
const card3 = document.querySelector('.thread-container1');
const card4 = document.querySelector('.thread-container2');
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
<div class="threaded__card card3">
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
        </div></div>
`

card4.innerHTML = `
<div class="threaded__card threaded__card-self card4">
      <div class="comment__controller comment__controller-self">
          <div class="plus"></div><p class="controller-number">${comments[1].replies[1].score}</p><div class="minus"></div>
        </div>


          <div class="pic-name">
        <div class="comment__pic" style = "background-image: url('${comments[1].replies[1].user.image.webp}')"></div>
        <p class="comment__name">${comments[1].replies[1].user.username}</p>
        <div class="self">you</div>
        <p class="comment__time">${comments[1].replies[1].createdAt}</p></div>

        <div class="action-btns">
        <div class="trash-btn2">
          <div class="comment__arrow comment__trash"></div>
          <p class="comment__reply comment__delete">Delete</p>
        </div>
        
        <div class="edit-btn2">
          <div class="comment__arrow comment__pen"></div>
<p class="comment__reply">Edit</p>
        </div></div>

        <div class="comment__text"><span class="mention-span">@${comments[1].replies[0].user.username}</span>
          ${comments[1].replies[1].content}
        </div>

        <button class="update-btn hide">Update</button></div>
`

// --- self card update ---

const deleteModal = document.querySelector('.delete-modal');
const overlay = document.querySelector('.overlay');
const yesDelete = document.querySelector('.yes-delete');
const noCancel = document.querySelector('.no-cancel');
let isDeleted = false;
let isEdited = false;

card4.addEventListener('click', (e)=>{
   const deleteBtn = card4.querySelector(".trash-btn2");
   const editBtn = card4.querySelector('.edit-btn2');
   const updateBtn = card4.querySelector('.update-btn');
   deleteBtn.addEventListener('click', ()=>{
    show(deleteModal);
       show(overlay);
   })
   yesDelete.addEventListener('click',()=>{
    hide(card4);
           isDeleted=true;
           hide(updateBtn);
           hide(overlay);
           hide(deleteModal);
})

noCancel.addEventListener('click', ()=>{
          hide(overlay);
           hide(deleteModal);
})
editBtn.addEventListener('click', ()=>{
    show(updateBtn);
    const textField = card4.querySelector('.comment__text');
const currentText = textField.innerText.trim();
textField.innerHTML = `
<textarea class="edit-textarea">${currentText}</textarea>
`
        isEdited = true;

updateBtn.addEventListener('click', (e)=>{

if(isEdited){
    const textArea = card4.querySelector('.edit-textarea');
    const updatedText = textArea.value;
    textField.innerHTML = `
                ${updatedText}
    `
    isEdited = false;
    hide(updateBtn);
   
}})})})

// --- add new comment ---

const inputComment = document.querySelector('.input-comment');
const field = document.querySelector("#new-comment");

inputComment.addEventListener('click', (e)=>{
    if (e.target && (e.target.classList.contains('send-btn') || e.target.id === 'commentBtn')) {

    const newComment = field.value.trim();
    if(newComment === '') return;

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
                <div class="comment__icon-reply trash-btn" id="delete-main">
                    <div class="comment__arrow comment__trash"></div>
                    <p class="comment__reply comment__delete">Delete</p>
                </div>
                <div class="comment__icon-reply edit-btn" id="edit-main">
                    <div class="comment__arrow comment__pen"></div>
                    <p class="comment__reply">Edit</p>
                </div>
            </div>

            <div class="comment__text">
                ${newComment}
            </div>

            <button class="update-btn hide" id="update-btn4">Update</button>
    `;

    inputComment.insertAdjacentElement('beforebegin', submittedNewComment);
    field.value="";
    
    const deleteBtn = submittedNewComment.querySelector("#delete-main");
   const editBtn = submittedNewComment.querySelector('#edit-main');
   const updateBtn =submittedNewComment.querySelector('.update-btn');
   deleteBtn.addEventListener('click', ()=>{
    show(deleteModal);
       show(overlay);
   })
   yesDelete.addEventListener('click',()=>{
    hide(submittedNewComment);
           isDeleted=true;
           hide(updateBtn);
           hide(overlay);
           hide(deleteModal);
})

noCancel.addEventListener('click', ()=>{
          hide(overlay);
           hide(deleteModal);
})
editBtn.addEventListener('click', ()=>{
    show(updateBtn);
    const textField = submittedNewComment.querySelector('.comment__text');
const currentText = textField.innerText.trim();
textField.innerHTML = `
<textarea class="edit-textarea">${currentText}</textarea>
`
        isEdited = true;

updateBtn.addEventListener('click', (e)=>{

if(isEdited){
    const textArea = submittedNewComment.querySelector('.edit-textarea');
    const updatedText = textArea.value;
    textField.innerHTML = `
                ${updatedText}
    `
    isEdited = false;
    hide(updateBtn);
}})
})} 
})


// === inline replies ===

const replyBtns = document.querySelectorAll('.comment__icon-reply');
const newReply = document.createElement('div');


function show(item){
    item.classList.remove('hide');
}

function hide(item){
    item.classList.add('hide');
}

newReply.innerHTML = `
<div class="reply__card">
        <div class="input__avatar reply__avatar"></div>
        <input type="text" class="comment-field reply-comment" id="reply-comment">
        <button class="send-btn reply-btn" id="reply1-btn">Reply</button>
</div>
`

replyBtns.forEach((btn)=>{
            btn.addEventListener('click',(e)=>{
               const cardParent = e.target.closest('.comment__card, .threaded__card'); 

               const userNameEl = cardParent.querySelector('.comment__name');
               const targetUserName = userNameEl ? userNameEl.textContent.trim():comments[0].user.username;

               cardParent.insertAdjacentElement('afterend', newReply);
               newReply.dataset.replyingTo = targetUserName;
            })


newReply.addEventListener('click',(e)=>{
if(e.target){
 const inputField = newReply.querySelector('.reply-comment');
               const replyText = inputField.value.trim();
               if(replyText === '') return;

const replyingToUser = newReply.dataset.replyingTo || comments[0].user.username;
    const submittedReply=document.createElement('div');

    submittedReply.classList.add('threaded__card', "threaded__card-self");
submittedReply.innerHTML = `
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
                <div class="comment__icon-reply trash-btn"">
                    <div class="comment__arrow comment__trash"></div>
                    <p class="comment__reply comment__delete" >Delete</p>
                </div>
                <div class="comment__icon-reply edit-btn"">
                    <div class="comment__arrow comment__pen"></div>
                    <p class="comment__reply">Edit</p>
                </div>
            </div>

            <div class="comment__text" id="comment__text0">
            <span class="mention-span">@${replyingToUser}</span>
                ${replyText}
            </div>

             <button class="update-btn hide" id="update-btn0">Update</button>
`;


newReply.insertAdjacentElement('afterend', submittedReply);
newReply.remove();
inputField.value='';


// === update reply ===

let isDeleted = false;
let isEdited = false;


submittedReply.addEventListener('click', (e)=>{
    const updateBtn = submittedReply.querySelector('.update-btn');
    const deleteBtn = submittedReply.querySelector('.trash-btn');
    const editBtn = submittedReply.querySelector('.edit-btn');


deleteBtn.addEventListener('click', (e)=>{
       show(deleteModal);
       show(overlay);
});



yesDelete.addEventListener('click',()=>{
    hide(submittedReply);
    inputField.value='';
           isDeleted=true;
           hide(updateBtn);
           hide(overlay);
           hide(deleteModal);
})

noCancel.addEventListener('click', ()=>{
          hide(overlay);
           hide(deleteModal);
})
    
editBtn.addEventListener('click', (e)=>{
    show(updateBtn);
const textField = submittedReply.querySelector('.comment__text');
const currentText = textField.innerText.trim();
textField.innerHTML = `
<textarea class="edit-textarea">${currentText}</textarea>
`
        isEdited = true;
        
updateBtn.addEventListener('click', (e)=>{

if(isEdited){

    const textArea = submittedReply.querySelector('.edit-textarea');
    const updatedText = textArea.value;
    textField.innerHTML = `
                ${updatedText}
    `
    isEdited = false;
    hide(updateBtn);
}


});
})});

}});    })




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


  