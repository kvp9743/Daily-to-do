const add_btn = document.querySelector(".btn-add");
const modal_cont= document.querySelector(".modal-cont");
const mainticketcont = document.querySelector(".main-ticket-cont");
const ticketTextarea = document.querySelector(".textarea-cont");
const modalColorCont = modal_cont.querySelector(".priority-colors-cont");
const delete_btn = document.querySelector(".btn-delete");
const toolbox_colors=document.querySelectorAll(".color");
const search_btn = document.querySelector("#search-icon");
const search_bar = document.querySelector(".search");
//new ticket structure
let modalflag= false;
let priorityColorSelected="lightpink";

let ticketArr = [];
if(localStorage.getItem("tasks"))
ticketArr = JSON.parse(localStorage.getItem("tasks"));

//re-creating the stored tickets
if(ticketArr!=null)
ticketArr.forEach((ticket)=>{
    createTicket(ticket.ticketContent,ticket.ticketColor,ticket.ticketId);

});


//cleaning modal color for selecting diff color
function modalColorCleanup(){
    modal_cont.querySelectorAll(".priority-color").forEach((item)=>{
        item.classList.remove("active-color");
    });
}

function generateId(){
    const id=Math.round(Math.random()*100000000);
    return id;
}

function createTicket(ticketContent,ticketColor,ticketId){
    
    if(ticketId===""){
        //if ticket is new then only add to array and update storage
        ticketId=generateId();
        ticketContent=ticketContent.trim();
        ticketArr.push({ticketContent,ticketColor,ticketId});
        localStorage.setItem("tasks",JSON.stringify(ticketArr));
    }
    
    const ticket = document.createElement("div");
        ticket.innerHTML=`<div class="ticket-color ${ticketColor}"></div>
        <div class="ticket-id">${ticketId}</div>
        <div class="task-area"> ${ticketContent} </div>
        <div class="ticket-lock">
            <i class="fa-solid fa-lock"></i>
        </div>`;
        ticket.classList.add("ticket-cont")
        mainticketcont.appendChild(ticket);  

        handleLock(ticket);//adding listeners for locking feature
        handleStatus(ticket);//adding listeners for status change feature

}

//making ticket editable using lock******************
function handleLock(ticket){

    const lock = ticket.querySelector(".fa-solid");
    const textarea= ticket.querySelector(".task-area");
    lock.addEventListener("click",()=>{
        if(lock.classList[1]==="fa-lock"){
            lock.classList.remove("fa-lock");
            lock.classList.add("fa-lock-open");
            ticket.classList.add("ticketForEdit");
            textarea.setAttribute("contenteditable","true");
        }
        else if(lock.classList[1]==="fa-lock-open"){
            lock.classList.remove("fa-lock-open");
            lock.classList.add("fa-lock");
            ticket.classList.remove("ticketForEdit");
            textarea.setAttribute("contenteditable","false");
            //when edited and locked update array and storage
            const ticketIdforUpdate =ticket.querySelector(".ticket-id").innerHTML;
            const indexTobeUpdated = ticketArr.findIndex((t) => t.ticketId == ticketIdforUpdate);

            ticketArr[indexTobeUpdated].ticketContent=textarea.innerText.trim();
            localStorage.setItem("tasks",JSON.stringify(ticketArr));
        }
    });
}

//changing ticket statuc color****************
const allticketColors=["lightpink","lightgreen","lightblue","black"];
function handleStatus(ticket){
    const colorband = ticket.querySelector(".ticket-color");
    colorband.addEventListener("click",()=>{
        const currCol = colorband.classList[1];
        const index= allticketColors.indexOf(currCol);
        const newColor=allticketColors[(index+1)%4];

        colorband.classList.remove(currCol);
        colorband.classList.add(newColor);
        //updating the ticket array and the storage
        const ticketIdforUpdate =ticket.querySelector(".ticket-id").innerHTML;
        const indexTobeUpdated = ticketArr.findIndex((t) => t.ticketId == ticketIdforUpdate);
        ticketArr[indexTobeUpdated].ticketColor=newColor;
        localStorage.setItem("tasks",JSON.stringify(ticketArr));
    });
}

//ticket Filter on status/colors**************
toolbox_colors.forEach((color)=>{

    color.addEventListener("click",(event)=>{
        
        const chosenCol= event.target.classList[0];
        let alltickets=mainticketcont.querySelectorAll(".ticket-cont");
            alltickets.forEach((ticket)=>{
            let currCol = ticket.querySelector(".ticket-color").classList[1];
            
            if(chosenCol==="white") //will display all tickets 
                ticket.style.display="block";
            else if(chosenCol===currCol)//only display tickets with chosen color
                ticket.style.display="block";
            else  // rest will 
                ticket.style.display="none";
        });
    });
});


//popping the modal for the ticket creation 
add_btn.addEventListener("click",()=>{
    modalflag=!modalflag
    if(modalflag){
        modalColorCleanup();
        priorityColorSelected="lightpink";
        modal_cont.querySelector(".priority-color").classList.add("active-color");
        ticketTextarea.value="";
        modal_cont.style.display = "flex";
        add_btn.style.color="red";
    }
    else{
    modal_cont.style.display = "none";
    add_btn.style.color="white";}
});

//new ticket creation*********
modal_cont.addEventListener("keydown",(event)=>{
    if(event.key==="Alt"){
        let ticketContent= ticketTextarea.value;
        let ticketColor=priorityColorSelected;
        let ticketId = "";
        createTicket(ticketContent,ticketColor,ticketId);
        ticketTextarea.value="";
        modal_cont.style.display="none";modalflag=!modalflag;
        add_btn.style.color="white";
    }
});

//slecting color during ticket creation
modalColorCont.addEventListener("click",(event)=>{
   
    if(event.target.classList[0]!="priority-colors-cont"){
        modalColorCleanup();
        event.target.classList.add("active-color");
        priorityColorSelected= event.target.classList[0];
    }
});

//Listening delete btn for delete**************
let deleteActive=false;
delete_btn.addEventListener("click",()=>{
    deleteActive=!deleteActive;
    const allticket =mainticketcont.querySelectorAll(".ticket-cont");
    if(deleteActive){
        delete_btn.style.color= "red";
        alert("Warning! Clicking a ticket will delete it permanently");
        allticket.forEach((ticket)=>{
            ticket.classList.add("ticket-during-delete")
        });
    }else{
        //alert("Delete button is De-activated!");
        delete_btn.style.color= "antiquewhite";
        allticket.forEach((ticket)=>{
            ticket.classList.remove("ticket-during-delete")
        });
     }
});

//deleting the tickets clicked
mainticketcont.addEventListener("click",(event)=>{
    if(deleteActive){
        elemClicked = event.target.classList[0];
        let ticketToBeDeleted;
        let ticketChilds=[
            "ticket-color","ticket-id",
            "task-area","ticket-Lock"  ];
        if(ticketChilds.includes(elemClicked))
        ticketToBeDeleted = event.target.parentElement;
        else if(elemClicked==="fa-solid")
        ticketToBeDeleted = event.target.parentElement.parentElement;
        else if(elemClicked==="ticket-cont")
        ticketToBeDeleted = event.target; 
        
        const ticketIdforUpdate =ticketToBeDeleted.querySelector(".ticket-id").innerHTML;
        const indexTobeUpdated = ticketArr.findIndex((t) => 
            t.ticketId == ticketIdforUpdate );
        ticketToBeDeleted.remove();
        ticketArr.splice(indexTobeUpdated,1);
        localStorage.setItem("tasks",JSON.stringify(ticketArr));

    }    
});

//search feature************
search_bar.addEventListener("keyup",(event)=>{

    
    const textToFind= search_bar.value.toLowerCase();

    const allticket = mainticketcont.querySelectorAll(".ticket-cont");
    allticket.forEach((ticket)=>{

        const ticketText = ticket.querySelector(".task-area").innerText.toLowerCase();

        if(ticketText.includes(textToFind))
        ticket.style.display="block";
        else
        ticket.style.display="none";

    });
});

