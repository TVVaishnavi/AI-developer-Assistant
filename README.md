# AI-developer-Assistant

## Description

CodeMuse AI is an AI-powered developer assistant that allows users to generate complete websites by simply providing detailed natural language prompts. The more specific the prompt, the better the resulting website.

CodeMuse supports both authenticated users and guest users. However, only logged-in users can access their chat and project history.

The interface features a split-screen layout:

* On the left: a continuous GPT-style conversation showing user prompts and AI-generated responses, including code presented in a file-like format, along with a search bar.
* On the right: a live preview of the generated website, updating in real time as the conversation progresses.

## Features

* Instant website generation from natural prompts
* Real-time split-screen preview with editable prompts
* Continuous GPT-style conversation interface
* Project history with rename, share, and delete support
* Secure Google Authentication

## Installation

To install and run this project locally:
 

* Clone the repository: bash

  ```
  git clone https://github.com/TVVaishnavi/AI-developer-Assistant.git 
  cd AI-developer-Assistant
  ```
* Install dependencies

  ```
  npm install
  ```
* Set up environment variables

  ```
  cp.env.example .env
  # Update .env with your database credentials and other settings
  ```
* Start the application

  ```
  npm run dev
  ```

## RoadMap

Phase 1: Inital Setup

* Set up "Express.js" for backend
* set up "React.js" for frontend
* Configure "MongoDB" for data storage
* Implement "User Authentication with Google" (signup/login)
* Implement "Socket.io" for real-time

Phase 2: Core Features

* Can prompt for only creating websites
* User can share , rename and delete their specific chat history.
* User can have continuous chat like GPT

Phase 3: Enchancements & Testing
    

* Till website is building there will be a spinner spinning.
* Write unit test with jest and cypress and visual test with percy.

## Usage

To run the application:


* Ensure MongoDB is running.
* User Postman or Bruno
* Server is running

## Support

For support, you can reach out via: 

* Issue tracker: GitHub Issues
* Email: vaishnavitvenkatesh@gmail.com

## Contribution

We welcome contributions ! To get started:

```
1. Fork the repository.
2. Create a new branch: `git checkout -b feature-name`.
3. Make your changes.
4. Commit your changes: `git commit -m 'Add some feature'`.
5. Push to the branch: `git push origin feature-name`.
6. Open a pull request.
```

## Author & Acknowledgement

Vaishnavi - Inital Work - [Github](https://github.com/TVVaishnavi)
