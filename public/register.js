
function registerfetch(name,surname,mail,tel_no,password){
    fetch("http://localhost:3000/api/register",{
        method:"POST",
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify({
            name:name,
            surname:surname,
            mail:mail,
            tel_no:tel_no,
            password:password
        })
    }).then(res=>res.json())
    .then(data=>{
        if(data.message){
            alert(data.message)
        }else{
            alert(data)
        }
    })
}

function register(){
    const name=document.getElementById("name").value
    const surname=document.getElementById("surname").value
    const mail=document.getElementById("registermail").value
    const tel_no=document.getElementById("tel_no").value
    const password=document.getElementById("registerPassword").value
    registerfetch(name,surname,mail,tel_no,password)
}

$(document).keypress(
    function(event){
      if (event.which == '13') {
        event.preventDefault();
      }
  });