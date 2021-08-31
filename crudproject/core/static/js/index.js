window.addEventListener('load', function() {

  const userTableBody = this.document.getElementById('userTableBody')

  function createTableBody(response) {
    const tableBodyTR = `
      <tr id="${response.id}">
        <th scope='row'>${response.id}</th>
        <td>${response.username}</td>
        <td>${response.email}</td>
        <td>${response.first_name}</td>
        <td>${response.last_name}</td>
      </tr>
    `
    userTableBody.insertAdjacentHTML('beforebegin', tableBodyTR)
  }

  function updateTableBody(response) {
    const thisTRElement = document.getElementById(response.id)
    console.log(thisTRElement)
    const tableBodyTR = `
      <tr id="${response.id}">
        <th scope='row'>${response.id}</th>
        <td>${response.username}</td>
        <td>${response.email}</td>
        <td>${response.first_name}</td>
        <td>${response.last_name}</td>
      </tr>
    `
    thisTRElement.innerHTML = tableBodyTR
  }

  function deleteTableBody(tableID) {
    const thisTRElement = document.getElementById(tableID)
    console.log(thisTRElement)
    thisTRElement.remove()
  }

  function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
  }
  const csrftoken = getCookie('csrftoken');

  // field display elements
  const reqGET = this.document.getElementById("reqGET")
  const reqPOST = this.document.getElementById("reqPOST")
  const reqPUT = this.document.getElementById("reqPUT")
  const reqDELETE = this.document.getElementById("reqDELETE")

  // Button elements
  const reqGETButton = this.document.getElementById("reqGETButton")
  const reqPOSTButton = this.document.getElementById("reqPOSTButton")
  const reqPUTButton = this.document.getElementById("reqPUTButton")
  const reqDELETEButton = this.document.getElementById("reqDELETEButton")
  const reqSENDButton = this.document.getElementById("reqSENDButton")

  function loadUserTable(endpoint) {
    userTableBody.innerHTML = ""

    this.fetch(endpoint)
    .then(res => res.json().then(response => {

      if (response.next !== null) {
        nextPaginationLink.setAttribute("href", response.next)
      }
      if (response.previous !== null) {
        previousPaginationLink.setAttribute("href", response.previous)
      }

      response.results.forEach(element => {
        const tableBodyTR = `
          <tr id="${element.id}">
            <th scope='row'>${element.id}</th>
            <td>${element.username}</td>
            <td>${element.email}</td>
            <td>${element.first_name}</td>
            <td>${element.last_name}</td>
          </tr>
        `
        userTableBody.insertAdjacentHTML('beforeend', tableBodyTR)
      });
    }))
  }

  // Onload list all of the users with pagination
  previousPaginationLink = this.document.getElementById("previousPaginationLink")
  nextPaginationLink = this.document.getElementById("nextPaginationLink")

  loadUserTable("http://localhost:8000/users/")

  nextPaginationLink.addEventListener("click", function(event) {
    const href = nextPaginationLink.getAttribute("href")
    console.log(href)
    if (href) {
      loadUserTable(href)
    }
  })

  previousPaginationLink.addEventListener("click", function(event) {
    const href = previousPaginationLink.getAttribute("href")
    if (href) {
      loadUserTable(href)
    }
  })

  // handle the req and res button
  reqGETButton.addEventListener("click", function(event) {
    reqGET.style.display = 'block'
    reqPOST.style.display = 'none'
    reqPUT.style.display = 'none'
    reqDELETE.style.display = 'none'
  })

  reqPOSTButton.addEventListener("click", function(event) {
    reqGET.style.display = 'none'
    reqPOST.style.display = 'block'
    reqPUT.style.display = 'none'
    reqDELETE.style.display = 'none'
  })

  reqPUTButton.addEventListener("click", function(event) {
    reqGET.style.display = 'none'
    reqPOST.style.display = 'none'
    reqPUT.style.display = 'block'
    reqDELETE.style.display = 'none'
  })

  reqDELETEButton.addEventListener("click", function(event) {
    reqGET.style.display = 'none'
    reqPOST.style.display = 'none'
    reqPUT.style.display = 'none'
    reqDELETE.style.display = 'block'
  })

  reqSENDButton.addEventListener("click", function(event) {
    if (reqGET.style.display === 'block') {
      return makeGETRequest()
    }
    if (reqPOST.style.display === 'block') {
      return makePOSTRequest()
    }
    if (reqPUT.style.display === 'block') {
      return makePUTRequest()
    }
    if (reqDELETE.style.display === 'block') {
      return makeDELETERequest()
    }
    return makeGETRequest()
  })

  const responseBody = this.document.getElementById("responseBody")

  function makeGETRequest() {
    const inputGETID = this.document.getElementById("inputGETID").value
    console.log("making get request", inputGETID)
    fetch(`http://localhost:8000/users/${inputGETID}/`)
      .then(res => res.json().then(response => {
        responseBody.innerHTML = `<code>${JSON.stringify(response)}</code>`
      }))
  }

  function makePOSTRequest() {
    const inputPOSTEmail = this.document.getElementById("inputPOSTEmail").value
    const inputPOSTUsername = this.document.getElementById("inputPOSTUsername").value
    const inputPOSTFirstName = this.document.getElementById("inputPOSTFirstName").value
    const inputPOSTLastName = this.document.getElementById("inputPOSTLastName").value
    fetch(`http://localhost:8000/users/`, {
      method: "POST",
      headers: {"Content-Type": "application/json", "X-CSRFToken": csrftoken},
      body: JSON.stringify({
        username: inputPOSTUsername,
        email: inputPOSTEmail,
        first_name: inputPOSTFirstName, 
        last_name: inputPOSTLastName
      })
    })
      .then(res => res.json().then(response => {
        responseBody.innerHTML = `<code>${JSON.stringify(response)}</code>`
        createTableBody(response)
      }))
  }

  function makePUTRequest() {
    console.log("making put request")
    const inputPUTID = this.document.getElementById("inputPUTID").value
    let inputPUTEmail = this.document.getElementById("inputPUTEmail").value
    let inputPUTUsername = this.document.getElementById("inputPUTUsername").value
    let inputPUTFirstName = this.document.getElementById("inputPUTFirstName").value
    let inputPUTLastName = this.document.getElementById("inputPUTLastName").value

    fetch(`http://localhost:8000/users/${inputPUTID}/`, {
      method: "PUT",
      headers: {"Content-Type": "application/json", "X-CSRFToken": csrftoken},
      body: JSON.stringify({
        username: inputPUTUsername,
        email: inputPUTEmail,
        first_name: inputPUTFirstName, 
        last_name: inputPUTLastName
      })
    })
      .then(res => res.json().then(response => {
        responseBody.innerHTML = `<code>${JSON.stringify(response)}</code>`
        updateTableBody(response)
      }))
  }

  function makeDELETERequest() {
    console.log("making delete request")
    const inputDELETEID = this.document.getElementById("inputDELETEID").value
    console.log(inputDELETEID)
    fetch(`http://localhost:8000/users/${inputDELETEID}/`, {
      method: "DELETE",
      headers: {"Content-Type": "application/json", "X-CSRFToken": csrftoken},
    })
      .then(res => res.text().then(response => {
        responseBody.innerHTML = ""
        deleteTableBody(inputDELETEID)
      }))
  }
})

