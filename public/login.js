var user = null

function login() {
    const username = document.getElementById('username').value
    const password = document.getElementById('password').value
    loginFetch(username, password)
        .then(res => {
            if (res === true) {
                window.location.replace('http://localhost:3000/?user=' + user.adi + ' ' + user.soyadi)
                // window.location.href = 'http://localhost:3000/?user=' + user.kullanici_id
                console.log(res)
                console.log(user.kullanici_id)
            } else {
                alert(res)
            }
        })
}

const loginFetch = (username, password) => {
    return fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mail: username, password: password })
    })
        .then(res => res.json())
        .then(res => {
            if (res.message) {
                console.log(res.message)
                return res.message
            } else {
                console.log(res)
                user = res
                localStorage.setItem('user', JSON.stringify(res))
                return true
            }
        })
}