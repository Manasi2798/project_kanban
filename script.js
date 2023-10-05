// ..............add-button..................................
let addButton = document.querySelector(".add-btn");
let modalCont = document.querySelector(".modal-cont");
let displaymodal= true;
addButton.addEventListener("click",function(){
    if(displaymodal){
        modalCont.style.display="flex";
    }else{
        modalCont.style.display="none";
    }
    displaymodal=!displaymodal;
})

// ......................delete-button.................................
let dltBtn = document.querySelector(".dlt-btn");
let dltflag = false;
dltBtn.addEventListener("click",function(){
    if(dltflag){
        dltBtn.style.color="black";
    }else{
        dltBtn.style.color="red";
    }
    dltflag=!dltflag;
})

// ................changing ticket color...............................
let mod_color = document.querySelectorAll(".mod-color");
let ticket_color="blue";

for(let i=0;i<mod_color.length;i++){
    mod_color[i].addEventListener("click",function(){
        for(let j=0;j<mod_color.length;j++){
            if(mod_color[j].classList.contains("active")){
                mod_color[j].classList.remove("active");
            }
        }
        mod_color[i].classList.add("active");
        ticket_color=mod_color[i].classList[1];
    })
}

// ............adding ticket on the board......................
let textarea = document.querySelector(".text-cont");
let bigCont = document.querySelector(".big-cont");
let colorArray = ["red","yellow","blue","green"];

textarea.addEventListener("keydown",function(e){
    if(e.key=="Enter"){
        let task=textarea.value;
        console.log(task);
        createTicket(task,ticket_color);
        textarea.value="";
        modalCont.style.display="none";
        displaymodal=!displaymodal;
    }
})

// create ticket...
    var uid = new ShortUniqueId();
function createTicket(task,ticket_color,ticket_id){
    if(task==""){
        return;
    }

    let id;
    if(ticket_id==undefined){
        id = uid;
    }else{
        id = ticket_id;
    }

    let ticket = document.createElement("div");
    ticket.setAttribute("class","ticket");
    ticket.innerHTML=`<div class="ticket-color ${ticket_color}"></div>
                    <div class="ticket-id">#${id}</div>
                    <div class="text">${task}</div>
                    <div class="lock-unlock"><i class="fa-solid fa-lock"></i></div>`
    bigCont.appendChild(ticket);

    //Delete ticket after clicking on it
    ticket.addEventListener("click",function(){
        if(dltflag){
            ticket.remove();
            let ind = getTicketIndx(id);
            ticketArr.splice(ind,1);
            UpdateLocalStorage();
        }
    })

    // lock-unlock button pressing
    let lockUnlock = ticket.querySelector(".lock-unlock i");
    let textfiled = ticket.querySelector(".text");
    lockUnlock.addEventListener("click",function(){
        if(lockUnlock.classList.contains("fa-lock")){
            lockUnlock.classList.remove("fa-lock");
            lockUnlock.classList.add("fa-lock-open");
            textfiled.setAttribute("contenteditable","true");
        }else{
            lockUnlock.classList.remove("fa-lock-open");
            lockUnlock.classList.add("fa-lock");
            textfiled.setAttribute("contenteditable","false");
        }
        let ticketIndx = getTicketIndx(id);
        ticketArr[ticketIndx].text = textfiled.textContent;
        UpdateLocalStorage();
    })

    // ticket color change on clicking
    let ticketColor = ticket.querySelector(".ticket-color");
    ticketColor.addEventListener("click",function(){
        let currentcolor = ticketColor.classList[1];
        let currentcolorInd = colorArray.findIndex(function(col){
            return currentcolor==col;
        })
        let nextcolorInd = (currentcolorInd+1)%colorArray.length;
        let nextcolor = colorArray[nextcolorInd];

        ticketColor.classList.remove(currentcolor);
        ticketColor.classList.add(nextcolor);

        let ticketIndx = getTicketIndx(id);
        ticketArr[ticketIndx].color=nextcolor;
        UpdateLocalStorage();
    })

    // saving ticket in local storage
    if(ticket_id==undefined){
    ticketArr.push({color:ticket_color,id:id,text:task});
    UpdateLocalStorage();
    }
}

// ...............filtering ticket acc. to priority........................

//Single click
let filtercolors = document.querySelectorAll(".color");

for(let i=0;i<filtercolors.length;i++){
    // Single click
    filtercolors[i].addEventListener("click",function(){
        let clikedColor = filtercolors[i].classList[1];
        let allticketColor = document.querySelectorAll(".ticket-color");
        for(let j=0;j<allticketColor.length;j++){
            if(clikedColor==allticketColor[j].classList[1]){
                allticketColor[j].parentElement.style.display="block";
            }else{
                allticketColor[j].parentElement.style.display="none";
            }
        }
    })

    // Double click
    filtercolors[i].addEventListener("dblclick",function(){    
        let allticketColor = document.querySelectorAll(".ticket-color"); 
        for(let j=0;j<allticketColor.length;j++){
            allticketColor[j].parentElement.style.display="block";
        }
})
}

// ................local storage...........................................

let ticketArr = [];
// function to get index value 
function getTicketIndx(id){
    for(let i=0;i<ticketArr.length;i++){
        if(ticketArr[i].id==id){
            return i;
        }
    }
}
// function to update local storage
function UpdateLocalStorage(){
    let stringifyArr = JSON.stringify(ticketArr);
    localStorage.setItem("tickets",stringifyArr);
}

// get things from local storage
if(localStorage.getItem("tickets")){
    let str = localStorage.getItem("tickets");
    let arr=JSON.parse(str);
    ticketArr = arr;
    for(let i=0;i<ticketArr.length;i++){
        let ticket=ticketArr[i];
        createTicket(ticket.text,ticket.color,ticket.id);
    }
}