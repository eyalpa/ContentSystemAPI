# Content System API

This project is a RESTful API for a content management system, built using Node.js and Express. It supports functionalities for managing users, posts, and communities.

## Quick Start

1. **Clone the Repository**
   ```bash
   git clone https://github.com/eyalpa/ContentSystemAPI.git
   ```
2. Navigate to the Project Directory
    bash
    ```cd ContentSystemAPI```
3. Use Docker Compose to Deploy
    bash
    ```docker-compose up --build```

## Modules: 
#  Backend
This is the backend service for our platform.
You can run the backend only  
    ```npm run start```
*** before run please check you config .env file to mongo db + and check that mongo is runing , you have additional help with vscode (runner)

# runing mongo in container 
    ```docker run --name mongo \  -e MONGO_INITDB_ROOT_USERNAME=root \  -e MONGO_INITDB_ROOT_PASSWORD=123456 \  -p 27017:27017 \  -v db:/data/db  \  mongo:5.0.2```
    ** please change the .env file to go to localhost. 


## PostMan collection Add.

# License
This project is licensed under the MIT License. For full details, please see the LICENSE file.

Feedback and contributions are always welcome!





