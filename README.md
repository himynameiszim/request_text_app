# request_text_app
Simple AI Interlocutor

## Setting

### Note : Adding 2 .env files
Add one .env file including the API Key on the outside folder.
```[code]
OPENAI_API_KEY=<YOUR-API-KEY-HERE>
```
Add one .env file inside the davinci folder to point to the endpoint of backend. (I am using the default port)
```[code]
VITE_BASE_URL=http://127.0.0.1:8000
```

### Frontend
Run this on one terminal window to keep the frontend server running.
```[bash]
cd davinci
npm install
npm run dev
```

### Backend
Create an environment with Python 3.9 (Stable Version), I use Anaconda (but I think Miniconda works perfectly fine for the scope of this project).
```[bash]
conda create -n <environment-name> python=3.9
conda activate <environment-name>
pip3 install -r requirements.txt
```

After installing all dependencies, run this on another terminal window to run the application.
```[bash]
python3 server.py
```

The default server port running will be
```[bash]
http://127.0.0.1:5173/
```

