## New note in Single page app diagram

&nbsp;

```mermaid

sequenceDiagram
    participant user
    participant browser
    participant server
    participant database

    user->>browser: goes on https://studies.cs.helsinki.fi/exampleapp/spa
    activate browser

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/spa
    activate server
    server-->>browser: HTML document
    deactivate server

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/main.js
    activate server
    server-->>browser: the JavaScript file
    deactivate server

    Note right of browser: The browser starts executing the JavaScript code that fetches the JSON from the server

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/data.json
    activate server
    server-->>browser: [{ "content": "Some note", "date": "2023-04-17T11:32:03.167Z" }, ... ]
    deactivate server

    Note right of browser: After clicking form submit button the browser starts executing the JavaScript code that sends a POST request to create a new note <br> with entered in the input field data and auto generated date: { "content": "Some note", date: "2023-04-17T11:32:03.167Z" }
    browser->>server: POST https://studies.cs.helsinki.fi/exampleapp/new_note_spa

    Note over server: server adds new note to database

    activate server
    server->>database: INSERT INTO notes
    activate database
    database-->>server: INSERT was successful
    deactivate database

    server-->>browser: Receives Status 201 Created
    deactivate server

    Note right of browser: The browser executes the callback function that renders the notes in the UI

```
