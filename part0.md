```mermaid
sequenceDiagram
    participant browser
    participant server

    browser->>server: Save button clicked (POST new_note)
    server-->>browser: Redirect to /notes
    browser->>server: Reload notes page
```
