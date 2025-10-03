# AI Resume Screening Project

This is an **AI Resume Screening Project** using **Python** for the backend and **FastAPI** as the framework. FastAPI is chosen because it is modern, fast, and great for experimentation.  

---

## Prerequisites

Make sure you have **Python** installed on your machine. All required Python packages are listed in the `requirements.txt` file.

To install dependencies, run:

pip install -r requirements.txt 

It's recommended to use a virtual environment to avoid conflicts with your system packages.

## Creating and Activating a Virtual Environment

# On Windows:

## create virtual environment
```python -m venv venv ```

## activate environment
```venv\Scripts\activate ``` 

# On Mac/Linux:

```python -m venv venv```

## 3 activate environment
source venv/bin/activate  

After activation, (venv) will appear in your terminal. Then install the requirements:

``` pip install -r requirements.txt ```

## Database Setup

This project uses MySQL.

Create a .env file in the root directory.

Add your MySQL database URL for testing, for example:

DATABASE_URL=mysql+pymysql://username:password@localhost/db_name

Keep the .env file private; do not commit it to GitHub. and add all the necessary things to the .env like smpt and add app setting key to it for testing the email ok are else you will see some errors

Running the Backend

# Run the FastAPI app locally:

```uvicorn main:app --reload```


Open http://localhost:8000 in your browser to see the application running (version 1.0.0).

Open http://localhost:8000/docs to access Swagger UI and test all APIs.
