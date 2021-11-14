if (localStorage.getItem('accessToken') !== null) {

    let headers = new Headers();
    headers.append('Authorization', 'Bearer ' + localStorage.getItem('accessToken'));

    fetch(window.location.href, {
        method: 'GET',
        headers: headers,
    })
        .then(data => data.text())
        .then(html => {
            document.write(html);
        })
        .catch(err => console.error(err))
}
else {
    console.log("AccessToken not found")
}